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
import iuh.fit.edu.dto.response.cart.CartResponse;
import org.springframework.transaction.annotation.Transactional;

public interface CartService {
    CartResponse getCartByUser(String email);

    @Transactional
    CartResponse addToCart(String email, AddCartItemRequest cartRequest);

    @Transactional
    CartResponse updateQuantity(String email, UpdateCartItemRequest updateCartItemRequest);

    void removeItem(String emal, Long id);
}
