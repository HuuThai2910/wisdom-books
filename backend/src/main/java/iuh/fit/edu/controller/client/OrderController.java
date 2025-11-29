/*
 * @ (#) .java    1.0
 * Copyright (c)  IUH. All rights reserved.
 */
package iuh.fit.edu.controller.client;

import iuh.fit.edu.dto.request.order.UpdateOrderRequest;
import iuh.fit.edu.dto.response.order.OrderItemResponse;
import iuh.fit.edu.dto.response.order.OrderResponse;
import iuh.fit.edu.entity.OrderItem;
import iuh.fit.edu.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.apache.coyote.Response;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/*
 * @description
 * @author: Huu Thai
 * @date:
 * @version: 1.0
 */
@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {
    private final OrderService orderService;

    @GetMapping
    public ResponseEntity<List<OrderResponse>> getAllOrders(){
        List<OrderResponse> orderResponses = this.orderService.getOrdersByEmail("admin@bookstore.com");
        return ResponseEntity.ok(orderResponses);
    }

    @GetMapping("/{id}")
    public ResponseEntity<OrderResponse> getOrderById(@PathVariable Long id){
        OrderResponse orderResponse = this.orderService.getOrderById(id);
        return ResponseEntity.ok(orderResponse);
    }

    @PostMapping
    public ResponseEntity<OrderResponse> updateOrderStatus(@RequestBody UpdateOrderRequest request){
        OrderResponse orderResponse = this.orderService.updateOrderStatus(request);
        return ResponseEntity.ok(orderResponse);
    }

}
