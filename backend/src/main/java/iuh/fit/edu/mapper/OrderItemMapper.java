/*
 * @ (#) .java    1.0
 * Copyright (c)  IUH. All rights reserved.
 */
package iuh.fit.edu.mapper;


import iuh.fit.edu.dto.response.order.OrderItemResponse;
import iuh.fit.edu.entity.OrderItem;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

/*
 * @description
 * @author: Huu Thai
 * @date:
 * @version: 1.0
 */
@Mapper(componentModel = "spring", uses = {BookMapper.class})
public interface OrderItemMapper {
    @Mapping(target = "book", source = "book")
    OrderItemResponse toOrderItemResponse(OrderItem orderItem);
}
