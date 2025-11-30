/*
 * @ (#) .java    1.0
 * Copyright (c)  IUH. All rights reserved.
 */
package iuh.fit.edu.controller.client;

import com.turkraft.springfilter.boot.Filter;
import iuh.fit.edu.dto.request.order.UpdateOrderRequest;
import iuh.fit.edu.dto.response.ResultPaginationDTO;
import iuh.fit.edu.dto.response.order.OrderItemResponse;
import iuh.fit.edu.dto.response.order.OrderResponse;
import iuh.fit.edu.dto.response.order.UpdateOrderStatusResponse;
import iuh.fit.edu.entity.Order;
import iuh.fit.edu.entity.OrderItem;
import iuh.fit.edu.service.OrderService;
import iuh.fit.edu.util.anotation.ApiMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.coyote.Response;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
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
@Slf4j
public class OrderController {
    private final OrderService orderService;

    @GetMapping
    @ApiMessage("Get all order")
    public ResponseEntity<ResultPaginationDTO> getAllOrder(@Filter Specification<Order> spec, Pageable pageable){
        return ResponseEntity.ok(this.orderService.getAllOrder(spec, pageable));
    }

    @GetMapping("/user")
    @ApiMessage("Get orders by user")
    public ResponseEntity<List<OrderResponse>> getOrdersByUser(){
        List<OrderResponse> orderResponses = this.orderService.getOrdersByEmail("admin@bookstore.com");
        return ResponseEntity.ok(orderResponses);
    }

    @GetMapping("/{id}")
    @ApiMessage("Get order by id")
    public ResponseEntity<OrderResponse> getOrderById(@PathVariable Long id){
        OrderResponse orderResponse = this.orderService.getOrderById(id);
        return ResponseEntity.ok(orderResponse);
    }

    @PostMapping
    @ApiMessage("Update order status")
    public ResponseEntity<UpdateOrderStatusResponse> updateOrderStatus(@RequestBody UpdateOrderRequest request){
        log.info("Request " + request);
        UpdateOrderStatusResponse orderResponse = this.orderService.updateOrderStatus(request);
        log.info("Response: " + orderResponse);
        return ResponseEntity.ok(orderResponse);
    }

}
