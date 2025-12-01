package iuh.fit.edu.controller.client;

import iuh.fit.edu.dto.request.order.OrderRequest;
import iuh.fit.edu.dto.response.ApiResponse;
import iuh.fit.edu.dto.response.order.OrderResponse;
import iuh.fit.edu.dto.response.PaymentResponse;
import iuh.fit.edu.service.OrderService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/payment")
@RequiredArgsConstructor
public class PaymentController {

    private final OrderService orderService;

    /**
     * Tạo đơn hàng với 2 phương thức thanh toán:
     * 1. COD (Thanh toán khi nhận hàng) - Tạo đơn hàng ngay lập tức
     * 2. VNPAY - Chuyển hướng đến trang thanh toán VNPay
     */
    @PostMapping("/create-order")
    public ResponseEntity<?> createOrder(@RequestBody OrderRequest orderRequest, HttpServletRequest request) {
            String email = "admin@bookstore.com";
            Object result = this.orderService.createOrder(email, orderRequest, request);
            return ResponseEntity.ok(result);
    }

    /**
     * VNPay callback URL - Xử lý kết quả thanh toán từ VNPay
     * Chỉ tạo đơn hàng khi giao dịch thành công
     */
    @GetMapping("/vnpay-return")
    public ResponseEntity<?> vnpayReturn(@RequestParam Map<String, String> params) {
        PaymentResponse result = this.orderService.confirmOrder(params);
        return ResponseEntity.ok(result);
    }

    @GetMapping("/retry")
    public ResponseEntity<?> retry(@RequestParam String orderCode, HttpServletRequest request){
        PaymentResponse newUrl = this.orderService.retryPayment(orderCode, request);
        return ResponseEntity.ok(newUrl);
    }

    /**
     * Lấy thông tin đơn hàng theo ID
     */
    @GetMapping("/order/{orderId}")
    public ResponseEntity<?> getOrder(@PathVariable Long orderId) {
        try {
            OrderResponse orderResponse = orderService.getOrderById(orderId);
            return ResponseEntity.ok(ApiResponse.success(
                    HttpStatus.OK.value(),
                    "Lấy thông tin đơn hàng thành công",
                    orderResponse));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error(
                            HttpStatus.NOT_FOUND.value(),
                            "Không tìm thấy đơn hàng",
                            null));
        }
    }

    /**
     * Lấy danh sách đơn hàng của user
     */
    @GetMapping("/orders")
    public ResponseEntity<?> getUserOrders() {
        try {
            String email = "admin@bookstore.com"; // Hard-coded email như CartController
            List<OrderResponse> orders = orderService.getOrdersByEmail(email);
            return ResponseEntity.ok(ApiResponse.success(
                    HttpStatus.OK.value(),
                    "Lấy danh sách đơn hàng thành công",
                    orders));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error(
                            HttpStatus.INTERNAL_SERVER_ERROR.value(),
                            "Lỗi khi lấy danh sách đơn hàng: " + e.getMessage(),
                            null));
        }
    }
}
