/*
 * @ (#) .java    1.0
 * Copyright (c)  IUH. All rights reserved.
 */
package iuh.fit.edu.controller.client;

import iuh.fit.edu.dto.request.AddCartItemRequest;
import iuh.fit.edu.dto.request.UpdateCartItemRequest;
import iuh.fit.edu.dto.response.cart.CartItemResponse;
import iuh.fit.edu.dto.response.cart.CartResponse;
import iuh.fit.edu.service.CartService;
import iuh.fit.edu.util.anotation.ApiMessage;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

/*
 * @description
 * @author: Huu Thai
 * @date:
 * @version: 1.0
 */
@Controller
@RequestMapping("/api/carts")
public class CartController {
    private final CartService cartService;

    public CartController(CartService cartService) {
        this.cartService = cartService;
    }

    @GetMapping
    @ApiMessage("Get cart successfully")
    public ResponseEntity<CartResponse> getCart() {
        CartResponse cartResponse = this.cartService.getCartByUser("admin@bookstore.com");
        System.out.println(cartResponse);
        return ResponseEntity.ok(cartResponse);
    }

    @PostMapping
    @ApiMessage("Add to cart successfully")
    public ResponseEntity<CartResponse> addToCart(@RequestBody AddCartItemRequest addCartItemRequest){
        CartResponse cartResponse = this.cartService.addToCart("admin@bookstore.com", addCartItemRequest);
        return ResponseEntity.status(HttpStatus.CREATED).body(cartResponse);
    }
    @DeleteMapping("/{itemId}")
    @ApiMessage("Remove item from cart successfully")
    public ResponseEntity<Void> removeCartItem(@PathVariable Long itemId){
        this.cartService.removeItem("admin@bookstore.com", itemId);
        return ResponseEntity.ok(null);
    }
    @PutMapping
    @ApiMessage("Update item from cart successfully")
    public ResponseEntity<CartResponse> updateCartItem(@RequestBody UpdateCartItemRequest updateCartItemRequest){
        CartResponse cartResponse = this.cartService.updateQuantity("admin@bookstore.com", updateCartItemRequest);
        return ResponseEntity.ok(cartResponse);
    }
}
