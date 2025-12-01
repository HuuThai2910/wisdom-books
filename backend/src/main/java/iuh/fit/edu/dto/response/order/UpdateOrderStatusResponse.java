/*
 * @ (#) .java    1.0
 * Copyright (c)  IUH. All rights reserved.
 */
package iuh.fit.edu.dto.response.order;

import iuh.fit.edu.entity.constant.OrderStatus;
import lombok.Data;

/*
 * @description
 * @author: Huu Thai
 * @date:
 * @version: 1.0
 */
@Data
public class UpdateOrderStatusResponse {
    private Long id;
    private OrderStatus status;

}
