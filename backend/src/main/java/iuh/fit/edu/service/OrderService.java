package iuh.fit.edu.service;

import iuh.fit.edu.dto.request.order.OrderRequest;
import iuh.fit.edu.dto.request.order.UpdateOrderRequest;
import iuh.fit.edu.dto.response.PaymentResponse;
import iuh.fit.edu.dto.response.ResultPaginationDTO;
import iuh.fit.edu.dto.response.order.OrderResponse;
import iuh.fit.edu.dto.response.order.UpdateOrderStatusResponse;
import iuh.fit.edu.entity.Order;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;

public interface OrderService {
    PaymentResponse retryPayment(String oderCode, HttpServletRequest request);

    PaymentResponse confirmOrder(Map<String, String> params);

    @Transactional
    List<Order> getExpiredOrders();

    void cancelOrder(String orderCode);

    ResultPaginationDTO getAllOrder(Specification<Order> specification, Pageable pageable);

    OrderResponse getOrderById(Long orderId);
    List<OrderResponse> getOrdersByEmail(String email);

    Object createOrder(String email, OrderRequest request, HttpServletRequest httpServletRequest);

    @Transactional
    UpdateOrderStatusResponse updateOrderStatus(UpdateOrderRequest request, String email);

    boolean checkUserPurchasedBook(String email, Long bookId);
}

