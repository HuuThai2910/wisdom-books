/*
 * @ (#) .java    1.0
 * Copyright (c)  IUH. All rights reserved.
 */
package iuh.fit.edu.mapper;

import iuh.fit.edu.dto.response.cart.CartItemResponse;
import iuh.fit.edu.entity.CartItem;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

/*
 * @description
 * @author: Huu Thai
 * @date:
 * @version: 1.0
 */
@Mapper(componentModel = "spring", uses = {BookMapper.class})
public interface CartItemMapper {
    @Mapping(target = "book", source = "book")
    CartItemResponse toCartItemResponse(CartItem cartItem);
}
