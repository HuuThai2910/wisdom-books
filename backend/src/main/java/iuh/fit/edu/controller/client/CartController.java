/*
 * @ (#) .java    1.0
 * Copyright (c)  IUH. All rights reserved.
 */
package iuh.fit.edu.controller.client;

import iuh.fit.edu.dto.request.cart.AddCartItemRequest;
import iuh.fit.edu.dto.request.cart.UpdateCartItemRequest;
import iuh.fit.edu.dto.request.cart.UpdateCartSelectRequest;
import iuh.fit.edu.dto.response.cart.CartItemResponse;
import iuh.fit.edu.dto.response.cart.CartResponse;
import iuh.fit.edu.service.CartService;
import iuh.fit.edu.util.anotation.ApiMessage;
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
    public ResponseEntity<CartResponse> fetchCart() {
        CartResponse cartResponse = this.cartService.getCartByUser("admin@bookstore.com");
        return ResponseEntity.ok(cartResponse);
    }

    @PostMapping
    @ApiMessage("Add to cart successfully")
    public ResponseEntity<CartItemResponse> addToCart(@RequestBody AddCartItemRequest addCartItemRequest){
        CartItemResponse cartItemResponse = this.cartService.addToCart("admin@bookstore.com", addCartItemRequest);
        return ResponseEntity.status(HttpStatus.CREATED).body(cartItemResponse);
    }
    @DeleteMapping("/items")
    @ApiMessage("Remove item from cart successfully")
    public ResponseEntity<Void> removeCartItem(@RequestParam List<Long> ids){
        System.out.println(ids);
        this.cartService.removeItem("admin@bookstore.com", ids);
        return ResponseEntity.ok(null);
    }
    @DeleteMapping
    @ApiMessage("Clear cart successfully")
    public ResponseEntity<Void> clearCart(){
        this.cartService.clearCart("admin@bookstore.com");
        return ResponseEntity.ok(null);
    }
    @PutMapping
    @ApiMessage("Update item from cart successfully")
    public ResponseEntity<CartItemResponse> updateCartItem(@RequestBody UpdateCartItemRequest updateCartItemRequest){
        CartItemResponse cartItemResponse = this.cartService.updateQuantity("admin@bookstore.com", updateCartItemRequest);
        return ResponseEntity.ok(cartItemResponse);
    }

    @PutMapping("/select")
    @ApiMessage("Update select from cart item successfully")
    public ResponseEntity<List<CartItemResponse>> updateSelections(@RequestBody UpdateCartSelectRequest request){
        List<CartItemResponse> cartItemResponse = this.cartService.updateSelect("admin@bookstore.com", request);
        return ResponseEntity.ok(cartItemResponse);
    }

    @PutMapping("/select-all")
    @ApiMessage("Update select all successfully")
    public ResponseEntity<Void> updateSelectAll(@RequestParam boolean selected){
        this.cartService.updateSelectAll("admin@bookstore.com", selected);
        return ResponseEntity.ok().build();
    }
}
