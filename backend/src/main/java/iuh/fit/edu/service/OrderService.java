package iuh.fit.edu.service;

import iuh.fit.edu.dto.request.order.OrderRequest;
import iuh.fit.edu.dto.request.order.UpdateOrderRequest;
import iuh.fit.edu.dto.response.PaymentResponse;
import iuh.fit.edu.dto.response.order.OrderResponse;
import iuh.fit.edu.entity.Order;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;

public interface OrderService {
    PaymentResponse retryPayment(String oderCode, HttpServletRequest request);

    PaymentResponse confirmOrder(Map<String, String> params);

    @Transactional
    List<Order> getExpiredOrders();

    void cancelOrder(String orderCode);
    OrderResponse getOrderById(Long orderId);
    List<OrderResponse> getOrdersByEmail(String email);

    Object createOrder(String email, OrderRequest request, HttpServletRequest httpServletRequest);

    @Transactional
    OrderResponse updateOrderStatus(UpdateOrderRequest request);
}

