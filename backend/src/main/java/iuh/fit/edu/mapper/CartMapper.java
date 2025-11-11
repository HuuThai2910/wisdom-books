/*
 * @ (#) .java    1.0
 * Copyright (c)  IUH. All rights reserved.
 */
package iuh.fit.edu.mapper;

import iuh.fit.edu.dto.response.cart.CartResponse;
import iuh.fit.edu.entity.Cart;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

/*
 * @description
 * @author: Huu Thai
 * @date:
 * @version: 1.0
 */
@Mapper(componentModel = "spring", uses = {CartItemMapper.class})
public interface CartMapper {
    @Mapping(target = "cartItems", source = "cartItems")
    CartResponse toCartResponse(Cart cart);
}
