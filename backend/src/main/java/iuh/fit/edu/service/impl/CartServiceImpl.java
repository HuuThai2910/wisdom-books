/*
 * @ (#) .java    1.0
 * Copyright (c)  IUH. All rights reserved.
 */
package iuh.fit.edu.service.impl;

import iuh.fit.edu.dto.request.AddCartItemRequest;
import iuh.fit.edu.dto.request.UpdateCartItemRequest;
import iuh.fit.edu.dto.request.UpdateCartSelectRequest;
import iuh.fit.edu.dto.response.cart.CartItemResponse;
import iuh.fit.edu.dto.response.cart.CartResponse;
import iuh.fit.edu.entity.Book;
import iuh.fit.edu.entity.Cart;
import iuh.fit.edu.entity.CartItem;
import iuh.fit.edu.entity.User;
import iuh.fit.edu.mapper.CartItemMapper;
import iuh.fit.edu.mapper.CartMapper;
import iuh.fit.edu.repository.BookRepository;
import iuh.fit.edu.repository.CartItemRepository;
import iuh.fit.edu.repository.CartRepository;
import iuh.fit.edu.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

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
    private final CartItemMapper cartItemMapper;


    public CartServiceImpl(CartRepository cartRepository, UserRepository userRepository, BookRepository bookRepository, CartItemRepository cartItemRepository, CartMapper cartMapper, CartItemMapper cartItemMapper) {
        this.cartRepository = cartRepository;
        this.userRepository = userRepository;
        this.bookRepository = bookRepository;
        this.cartItemRepository = cartItemRepository;
        this.cartMapper = cartMapper;
        this.cartItemMapper = cartItemMapper;
    }

    @Override
    public CartResponse getCartByUser(String email) {
        return cartMapper.toCartResponse(this.cartRepository.findByUser_Email(email));
    }

    @Transactional
    @Override
    public CartItemResponse addToCart(String email, AddCartItemRequest cartRequest) {
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
            cartItem = new CartItem();
            cartItem.setCart(cart);
            cartItem.setBook(book);
            cartItem.setQuantity(cartRequest.getQuantity());
        } else {
            cartItem.setQuantity(cartItem.getQuantity() + cartRequest.getQuantity());
        }
        return this.cartItemMapper.toCartItemResponse(this.cartItemRepository.save(cartItem));
    }

    @Transactional
    @Override
    public CartItemResponse updateQuantity(String email, UpdateCartItemRequest request) {
        Cart cart = this.cartRepository.findByUser_Email(email);
        if (cart == null) {
            throw new RuntimeException("Cart not found");
        }
        CartItem cartItem = this.cartItemRepository.findById(request.getId())
                .orElseThrow(() -> new RuntimeException("Cart item not found"));
        cartItem.setQuantity(request.getQuantity());
        return this.cartItemMapper.toCartItemResponse(cartItem);
    }

    @Transactional
    @Override
    public List<CartItemResponse> updateSelect(String email, UpdateCartSelectRequest request){
        System.out.println(request);
        Cart cart = this.cartRepository.findByUser_Email(email);
        if (cart == null) {
            throw new RuntimeException("Cart not found");
        }
        List<CartItemResponse> updatedReponses = new ArrayList<>();
        for(UpdateCartSelectRequest.ItemSelection selection : request.getSelections()){
            CartItem cartItem = this.cartItemRepository.findById(selection.getId())
                    .orElseThrow(() -> new RuntimeException("Cart item not found"));
            cartItem.setSelected(selection.isSelected());
            updatedReponses.add(cartItemMapper.toCartItemResponse(cartItem));
        }
        return updatedReponses;
    }

    @Transactional
    @Override
    public void updateSelectAll(String email, boolean selected){
        Cart cart = this.cartRepository.findByUser_Email(email);
        if (cart == null) {
            throw new RuntimeException("Cart not found");
        }
        for(CartItem cartItem : cart.getCartItems()){
            cartItem.setSelected(selected);
        }
        this.cartItemRepository.saveAll(cart.getCartItems());
    }

    @Override
    public void removeItem(String emal, Long id) {
        Cart cart = this.cartRepository.findByUser_Email(emal);
        cart.getCartItems().removeIf(cartItem -> cartItem.getId().equals(id));
        cart.setSum(cart.getSum() - 1);
        this.cartRepository.save(cart);
    }

    @Override
    public void clearCart(String email) {
        Cart cart = this.cartRepository.findByUser_Email(email);
        cart.getCartItems().clear();
        cart.setSum(0);
        this.cartRepository.save(cart);
    }
}
