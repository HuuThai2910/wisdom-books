/*
 * @ (#) .java    1.0
 * Copyright (c)  IUH. All rights reserved.
 */
package iuh.fit.edu.dto.request.cart;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/*
 * @description
 * @author: Huu Thai
 * @date:
 * @version: 1.0
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class AddCartItemRequest {
    private Long bookId;
    private int quantity;
}
