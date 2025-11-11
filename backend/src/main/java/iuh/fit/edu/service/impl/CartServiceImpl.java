/*
 * @ (#) .java    1.0
 * Copyright (c)  IUH. All rights reserved.
 */
package iuh.fit.edu.service.impl;

import iuh.fit.edu.dto.request.AddCartItemRequest;
import iuh.fit.edu.dto.request.UpdateCartItemRequest;
import iuh.fit.edu.dto.response.cart.CartResponse;
import iuh.fit.edu.entity.Book;
import iuh.fit.edu.entity.Cart;
import iuh.fit.edu.entity.CartItem;
import iuh.fit.edu.entity.User;
import iuh.fit.edu.mapper.CartMapper;
import iuh.fit.edu.repository.BookRepository;
import iuh.fit.edu.repository.CartItemRepository;
import iuh.fit.edu.repository.CartRepository;
import iuh.fit.edu.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/*
 * @description
 * @author: Huu Thai
 * @date:
 * @version: 1.0
 */
@Service
public class CartServiceImpl implements iuh.fit.edu.service.CartService {
    private final CartRepository cartRepository;
    private final UserRepository userRepository;
    private final BookRepository bookRepository;
    private final CartItemRepository cartItemRepository;
    private final CartMapper cartMapper;


    public CartServiceImpl(CartRepository cartRepository, UserRepository userRepository, BookRepository bookRepository, CartItemRepository cartItemRepository, CartMapper cartMapper) {
        this.cartRepository = cartRepository;
        this.userRepository = userRepository;
        this.bookRepository = bookRepository;
        this.cartItemRepository = cartItemRepository;
        this.cartMapper = cartMapper;
    }

    @Override
    public CartResponse getCartByUser(String email) {
        return cartMapper.toCartResponse(this.cartRepository.findByUser_Email(email));
    }

    @Transactional
    @Override
    public CartResponse addToCart(String email, AddCartItemRequest cartRequest) {
        User user = this.userRepository.findByEmail(email);
        Cart cart = this.cartRepository.findByUser_Email(email);
        if (cart == null) {
            Cart newCart = new Cart();
            newCart.setUser(user);
            newCart.setSum(0);
            cart = this.cartRepository.save(newCart);
        }
        Book book = this.bookRepository.findById(cartRequest.getBookId())
                .orElseThrow(() -> new RuntimeException("Book not found"));
        CartItem cartItem = this.cartItemRepository.findByCartAndBook(cart, book);
        if (cartItem == null) {
            CartItem newCartItem = new CartItem();
            newCartItem.setCart(cart);
            newCartItem.setBook(book);
            newCartItem.setQuantity(cartRequest.getQuantity());
            cart.getCartItems().add(newCartItem);
            cart.setSum(cart.getSum() + 1);
            this.cartRepository.save(cart);
        } else {
            cartItem.setQuantity(cartItem.getQuantity() + cartRequest.getQuantity());
        }
        return this.cartMapper.toCartResponse(cart);
    }

    @Transactional
    @Override
    public CartResponse updateQuantity(String email, UpdateCartItemRequest request){
        Cart cart = this.cartRepository.findByUser_Email(email);
        if(cart == null){
            throw new RuntimeException("Cart not found");
        }
        CartItem cartItem = cart.getCartItems().stream()
                .filter(cartItem1 -> cartItem1.getId().equals(request.getId()))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Cart item not found"));
        if(request.getQuantity() <= 0){
            cart.getCartItems().remove(cartItem);
        }else {
            cartItem.setQuantity(request.getQuantity());
        }
        return cartMapper.toCartResponse(this.cartRepository.save(cart));
    }
    @Override
    public void removeItem(String emal, Long id){
        Cart cart = this.cartRepository.findByUser_Email(emal);
        cart.getCartItems().removeIf(cartItem -> cartItem.getId().equals(id));
        this.cartRepository.save(cart);
    }
}
