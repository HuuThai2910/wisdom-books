package iuh.fit.edu.service.impl;

import iuh.fit.edu.dto.request.order.OrderItemRequest;
import iuh.fit.edu.dto.request.order.OrderRequest;
import iuh.fit.edu.dto.request.order.UpdateOrderRequest;
import iuh.fit.edu.dto.response.PaymentResponse;
import iuh.fit.edu.dto.response.order.OrderResponse;
import iuh.fit.edu.entity.*;
import iuh.fit.edu.entity.constant.OrderStatus;
import iuh.fit.edu.entity.constant.PaymentMethod;
import iuh.fit.edu.entity.constant.PaymentStatus;
import iuh.fit.edu.mapper.OrderMapper;
import iuh.fit.edu.repository.*;
import iuh.fit.edu.service.EmailService;
import iuh.fit.edu.service.OrderService;
import iuh.fit.edu.service.PaymentService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class OrderServiceImpl implements OrderService {

    private final OrderRepository orderRepository;
    private final UserRepository userRepository;
    private final BookRepository bookRepository;
    private final OrderMapper orderMapper;
    private final PaymentService paymentService;
    private final EmailService emailService;

    @Override
    @Transactional(rollbackFor = Exception.class)
    public Object createOrder(String email, OrderRequest request, HttpServletRequest httpServletRequest) {
        User user = userRepository.findByEmail(email);
        if (user == null) {
            throw new RuntimeException("User not found with email: " + email);
        }
        Order order = new Order();
        order.setOrderCode(generateOrderCode());
        order.setUser(user);
        order.setReceiverName(request.getReceiverName());
        order.setReceiverPhone(request.getReceiverPhone());
        order.setReceiverAddress(request.getReceiverAddress());
        order.setReceiverEmail(request.getReceiverEmail());
        order.setNote(request.getNote());
        order.setStatus(OrderStatus.PENDING);
        order.setPaymentMethod(request.getPaymentMethod());
        order.setPaymentStatus(PaymentStatus.UNPAID);
        order.setOrderDate(LocalDateTime.now());
        List<OrderItem> orderItems = new ArrayList<>();
        for (OrderItemRequest item : request.getItems()) {
            Book book = bookRepository.findById(item.getBookId())
                    .orElseThrow(() -> new RuntimeException("Book not found"));
            int rowsUpdated = this.bookRepository.reduceQuantity(book.getId(), item.getQuantity());
            if(rowsUpdated == 0){
                // Nếu = 0 nghĩa là WHERE stock >= qty trả về False -> HẾT HÀNG
                // Throw Exception để kích hoạt Rollback (hoàn lại các món đã trừ trước đó nếu có)
                throw new RuntimeException(book.getTitle() + " hiện đang không đủ số lượng");
            }
            OrderItem orderItem = new OrderItem();
            orderItem.setBook(book);
            orderItem.setQuantity(item.getQuantity());
            orderItem.setPrice(item.getPrice());
            orderItem.setOrder(order);
            orderItems.add(orderItem);
        }
        // Giá sau khi giảm được client tính và gửi lên
        order.setTotalPrice(request.getTotalPrice());
        order.setOrderItems(orderItems);
        if(request.getPaymentMethod() == PaymentMethod.COD){
            order.setExpiredAt(null);
            orderRepository.save(order);
            this.emailService.sendEmailFromTemplateSync(
                    order.getReceiverEmail(),
                    "Đặt hàng thành công #" + order.getOrderCode(),
                    "order-confirm.html",
                    order
            );
            return this.orderMapper.toOrderResponse(order);
        }else {
            order.setExpiredAt(LocalDateTime.now().plusMinutes(2));
            orderRepository.save(order);
            String paymentUrl = paymentService.createVNPayUrl(order, httpServletRequest);
            return PaymentResponse.builder()
                    .code("00")
                    .message("Vui lòng thanh toán đơn hàng")
                    .orderCode(order.getOrderCode())
                    .paymentUrl(paymentUrl)
                    .build();
        }
    }
    @Override
    public PaymentResponse retryPayment(String oderCode, HttpServletRequest request) {
        Order order = this.orderRepository.findByOrderCode(oderCode)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy đơn hàng"));
        if (order.getStatus() != OrderStatus.PENDING || order.getPaymentStatus() != PaymentStatus.UNPAID || order.getPaymentMethod() != PaymentMethod.VNPAY) {
            throw new RuntimeException("Đơn hàng không ở trạng thái thanh toán");
        }
        if (order.getExpiredAt().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("Đơn hàng đã hết hạn thanh toán");
        }
        return PaymentResponse.builder()
                .code("00")
                .message("Vui lòng thanh toán đơn hàng")
                .orderCode(order.getOrderCode())
                .paymentUrl(this.paymentService.createVNPayUrl(order, request))
                .build();
    }
    @Override
    @Transactional
    public PaymentResponse confirmOrder(Map<String, String> params) {
        if(!paymentService.validateCallBack(params)){
            throw new RuntimeException("Chữ ký không hợp lệ");
        }
        String responseCode = params.get("vnp_ResponseCode");
        String txnRef = params.get("vnp_TxnRef");
        String orderCode = txnRef.substring(0, txnRef.lastIndexOf("_"));
        Order order = orderRepository.findByOrderCode(orderCode)
                .orElseThrow(() -> new RuntimeException("Order not found with orderCode: " + orderCode));
        if("00".equals(responseCode)){
            order.setExpiredAt(null);
            order.setPaymentStatus(PaymentStatus.PAID);
            order.setTxnRef(txnRef);
            orderRepository.save(order);
            this.emailService.sendEmailFromTemplateSync(
                    order.getReceiverEmail(),
                    "Đặt hàng thành công #" + order.getOrderCode(),
                    "order-confirm.html",
                    order
            );
            log.info("Đơn hàng #{} thanh toán thành công", order.getId());
            return PaymentResponse.builder()
                    .code(responseCode)
                    .message("Thanh toán thành công")
                    .orderCode(order.getOrderCode())
                    .totalPrice(order.getTotalPrice())
                    .orderDate(order.getOrderDate())
                    .build();
        }else {
                return PaymentResponse.builder()
                        .code(responseCode)
                        .message("Thanh toán thất bại hoặc bị hủy")
                        .orderCode(order.getOrderCode())
                        .build();
        }
    }
    @Transactional
    @Override
    public List<Order> getExpiredOrders(){
        return this.orderRepository.findAllByPaymentMethodAndPaymentStatusAndExpiredAtBefore(PaymentMethod.VNPAY, PaymentStatus.UNPAID, LocalDateTime.now());
    }
    @Override
    @Transactional
    public void cancelOrder(String orderCode) {
        Order order = orderRepository.findByOrderCode(orderCode)
                .orElseThrow(() -> new RuntimeException("Order not found with orderCode: " + orderCode));
        order.setStatus(OrderStatus.CANCELLED);
        order.setExpiredAt(null);
        // Hoàn kho sau khi hủy đơn hàng
        for (OrderItem item : order.getOrderItems()){
            this.bookRepository.restoreStock(item.getBook().getId(), item.getQuantity());
        }
        orderRepository.save(order);
        log.info("Đã hủy đơn hàng #{} và hoàn kho", order.getId());
    }

    @Override
    public OrderResponse getOrderById(Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found with id: " + orderId));
        return this.orderMapper.toOrderResponse(order);
    }

    @Override
    public List<OrderResponse> getOrdersByEmail(String email) {
        User user = userRepository.findByEmail(email);
        if (user == null) {
            throw new RuntimeException("User not found with email: " + email);
        }
        List<Order> orders = orderRepository.findByUserIdOrderByOrderDateDesc(user.getId());
        return orders.stream()
                .map(this.orderMapper::toOrderResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    @Override
    public OrderResponse updateOrderStatus(UpdateOrderRequest request){
        Order order = this.orderRepository.findById(request.getId())
                .orElseThrow(() -> new RuntimeException("Order not found"));
        order.setStatus(OrderStatus.valueOf(request.getStatus()));
        return this.orderMapper.toOrderResponse(this.orderRepository.save(order));
    }

    private String generateOrderCode() {
        // 1. Lấy ngày tháng (Format: YYMMDD)
        String time = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMddHHmmss"));
        // 2. Lấy 6 ký tự đầu của UUID và viết hoa
        String randomPart = UUID.randomUUID().toString().replace("-", "").substring(0, 6).toUpperCase();
        return "ORD-" + time + "-" + randomPart;
    }
}
