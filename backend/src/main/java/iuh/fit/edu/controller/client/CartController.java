/*
 * @ (#) .java    1.0
 * Copyright (c)  IUH. All rights reserved.
 */
package iuh.fit.edu.controller.client;

import iuh.fit.edu.dto.request.cart.AddCartItemRequest;
import iuh.fit.edu.dto.request.cart.UpdateCartItemRequest;
import iuh.fit.edu.dto.request.cart.UpdateCartSelectRequest;
import iuh.fit.edu.dto.response.account.UserInfoResponse;
import iuh.fit.edu.dto.response.cart.CartItemResponse;
import iuh.fit.edu.dto.response.cart.CartResponse;
import iuh.fit.edu.service.CartService;
import iuh.fit.edu.util.GetTokenRequest;
import iuh.fit.edu.util.anotation.ApiMessage;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpStatus;
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
@RequestMapping("/api/cart")
public class CartController {
    private final CartService cartService;

    public CartController(CartService cartService) {
        this.cartService = cartService;
    }

    @GetMapping
    @ApiMessage("Get cart successfully")
    public ResponseEntity<CartResponse> fetchCart(HttpServletRequest request) {
        UserInfoResponse user = GetTokenRequest.getInfoUser(request);
        CartResponse cartResponse = this.cartService.getCartByUser(user.getEmail());
        return ResponseEntity.ok(cartResponse);
    }

    @PostMapping
    @ApiMessage("Add to cart successfully")
    public ResponseEntity<CartItemResponse> addToCart(@RequestBody AddCartItemRequest addCartItemRequest, HttpServletRequest request){
        UserInfoResponse user = GetTokenRequest.getInfoUser(request);
        CartItemResponse cartItemResponse = this.cartService.addToCart(user.getEmail(), addCartItemRequest);
        return ResponseEntity.status(HttpStatus.CREATED).body(cartItemResponse);
    }
    @DeleteMapping("/items")
    @ApiMessage("Remove item from cart successfully")
    public ResponseEntity<Void> removeCartItem(@RequestParam List<Long> ids, HttpServletRequest request){
        UserInfoResponse user = GetTokenRequest.getInfoUser(request);
        this.cartService.removeItem(user.getEmail(), ids);
        return ResponseEntity.ok(null);
    }
    @DeleteMapping
    @ApiMessage("Clear cart successfully")
    public ResponseEntity<Void> clearCart(HttpServletRequest request){
        UserInfoResponse user = GetTokenRequest.getInfoUser(request);
        this.cartService.clearCart(user.getEmail());
        return ResponseEntity.ok(null);
    }
    @PutMapping
    @ApiMessage("Update item from cart successfully")
    public ResponseEntity<CartItemResponse> updateCartItem(@RequestBody UpdateCartItemRequest updateCartItemRequest, HttpServletRequest request){
        UserInfoResponse user = GetTokenRequest.getInfoUser(request);
        CartItemResponse cartItemResponse = this.cartService.updateQuantity(user.getEmail(), updateCartItemRequest);
        return ResponseEntity.ok(cartItemResponse);
    }

    @PutMapping("/select")
    @ApiMessage("Update select from cart item successfully")
    public ResponseEntity<List<CartItemResponse>> updateSelections(@RequestBody UpdateCartSelectRequest request, HttpServletRequest httpServletRequest){
        UserInfoResponse user = GetTokenRequest.getInfoUser(httpServletRequest);
        List<CartItemResponse> cartItemResponse = this.cartService.updateSelect(user.getEmail(), request);
        return ResponseEntity.ok(cartItemResponse);
    }

    @PutMapping("/select-all")
    @ApiMessage("Update select all successfully")
    public ResponseEntity<Void> updateSelectAll(@RequestParam boolean selected, HttpServletRequest httpServletRequest){
        UserInfoResponse user = GetTokenRequest.getInfoUser(httpServletRequest);
        this.cartService.updateSelectAll(user.getEmail(), selected);
        return ResponseEntity.ok().build();
    }
}
