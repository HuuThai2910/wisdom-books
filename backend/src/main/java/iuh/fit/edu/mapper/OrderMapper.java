/*
 * @ (#) .java    1.0
 * Copyright (c)  IUH. All rights reserved.
 */
package iuh.fit.edu.mapper;

import iuh.fit.edu.dto.response.order.OrderResponse;
import iuh.fit.edu.entity.Order;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

/*
 * @description
 * @author: Huu Thai
 * @date:
 * @version: 1.0
 */
@Mapper(componentModel = "spring", uses = {OrderItemMapper.class})
public interface OrderMapper {
    @Mapping(target = "userId", source = "user.id")
    @Mapping(target = "userName", source = "user.fullName")
    OrderResponse toOrderResponse(Order order);
}
