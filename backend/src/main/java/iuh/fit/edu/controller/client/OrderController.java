/*
 * @ (#) .java    1.0
 * Copyright (c)  IUH. All rights reserved.
 */
package iuh.fit.edu.controller.client;

import com.turkraft.springfilter.boot.Filter;
import iuh.fit.edu.dto.request.order.UpdateOrderRequest;
import iuh.fit.edu.dto.response.ResultPaginationDTO;
import iuh.fit.edu.dto.response.account.UserInfoResponse;
import iuh.fit.edu.dto.response.order.OrderResponse;
import iuh.fit.edu.dto.response.order.UpdateOrderStatusResponse;
import iuh.fit.edu.entity.Order;
import iuh.fit.edu.service.OrderService;
import iuh.fit.edu.util.GetTokenRequest;
import iuh.fit.edu.util.anotation.ApiMessage;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Security;
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
    public ResponseEntity<List<OrderResponse>> getOrdersByUser(HttpServletRequest request){
        UserInfoResponse user = GetTokenRequest.getInfoUser(request);
        List<OrderResponse> orderResponses = this.orderService.getOrdersByEmail(user.getEmail());
        return ResponseEntity.ok(orderResponses);
    }

    @GetMapping("/{id}")
    @ApiMessage("Get order by id")
    public ResponseEntity<OrderResponse> getOrderById(@PathVariable Long id){
        OrderResponse orderResponse = this.orderService.getOrderById(id);
        return ResponseEntity.ok(orderResponse);
    }

    @PutMapping
    @ApiMessage("Update order status")
    public ResponseEntity<UpdateOrderStatusResponse> updateOrderStatus(@RequestBody UpdateOrderRequest request, HttpServletRequest httpServletRequest){
        log.info("Request " + request);
        UserInfoResponse user = GetTokenRequest.getInfoUser(httpServletRequest);
        UpdateOrderStatusResponse orderResponse = this.orderService.updateOrderStatus(request, user.getEmail());
        log.info("Response: " + orderResponse);
        return ResponseEntity.ok(orderResponse);
    }

    @PutMapping("/cancel")
    @ApiMessage("Cancel order")
    public ResponseEntity<UpdateOrderStatusResponse> cancelOrder(@RequestBody UpdateOrderRequest request, HttpServletRequest httpServletRequest){
        UserInfoResponse user = GetTokenRequest.getInfoUser(httpServletRequest);
        return ResponseEntity.ok(this.orderService.updateOrderStatus(request, user.getEmail()));
    }


}
