/*
 * @ (#) .java    1.0
 * Copyright (c)  IUH. All rights reserved.
 */
package iuh.fit.edu.dto.request.order;

import lombok.Data;

/*
 * @description
 * @author: Huu Thai
 * @date:
 * @version: 1.0
 */
@Data
public class UpdateOrderRequest {
    private Long id;
    private String status;
}
