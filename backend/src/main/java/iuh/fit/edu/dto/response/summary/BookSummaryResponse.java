/*
 * @ (#) .java    1.0
 * Copyright (c)  IUH. All rights reserved.
 */
package iuh.fit.edu.dto.response.summary;

import lombok.Data;
import lombok.Getter;

/*
 * @description
 * @author: Huu Thai
 * @date:
 * @version: 1.0
 */
@Getter
@Data
public class BookSummaryResponse {
    private Long id;
    private String title;
    private double price;
    private String image;
    private int quantity;
}
