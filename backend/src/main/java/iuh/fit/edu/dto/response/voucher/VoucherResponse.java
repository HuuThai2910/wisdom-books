/*
 * @ (#) .java    1.0       
 * Copyright (c)  IUH. All rights reserved.
 */
package iuh.fit.edu.dto.response.voucher;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

/*
 * @description
 * @author: Huu Thai
 * @date:   
 * @version: 1.0
 */
@Getter
@Setter
public class VoucherResponse {
    private Long id;
    private String name;
    private String description;
    private int discountValue;
    private double minOrder;
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "Asia/Ho_Chi_Minh")
    private LocalDateTime endDate;
}
