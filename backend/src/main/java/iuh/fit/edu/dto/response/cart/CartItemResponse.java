/*
 * @ (#) .java    1.0
 * Copyright (c)  IUH. All rights reserved.
 */
package iuh.fit.edu.dto.response.cart;

import iuh.fit.edu.dto.response.summary.BookSummaryResponse;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

/*
 * @description
 * @author: Huu Thai
 * @date:
 * @version: 1.0
 */
@Data
@Getter
@Setter
public class CartItemResponse {
    private Long id;
    private int quantity;
    private boolean selected;
    private BookSummaryResponse book;
}
