/*
 * @ (#) .java    1.0
 * Copyright (c)  IUH. All rights reserved.
 */
package iuh.fit.edu.service;/*
 * @description
 * @author: Huu Thai
 * @date:
 * @version: 1.0
 */

import iuh.fit.edu.dto.request.AddCartItemRequest;
import iuh.fit.edu.dto.request.UpdateCartItemRequest;
import iuh.fit.edu.dto.request.UpdateCartSelectRequest;
import iuh.fit.edu.dto.response.cart.CartItemResponse;
import iuh.fit.edu.dto.response.cart.CartResponse;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

public interface CartService {
    CartResponse getCartByUser(String email);

    @Transactional
    CartItemResponse addToCart(String email, AddCartItemRequest cartRequest);

    @Transactional
    CartItemResponse updateQuantity(String email, UpdateCartItemRequest updateCartItemRequest);

    @Transactional
    List<CartItemResponse> updateSelect(String email, UpdateCartSelectRequest request);

    @Transactional
    void updateSelectAll(String email, boolean selected);

    void removeItem(String emal, Long id);

    void clearCart(String email);
}
