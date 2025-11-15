/*
 * @ (#) .java    1.0
 * Copyright (c)  IUH. All rights reserved.
 */
package iuh.fit.edu.dto.response;

import iuh.fit.edu.entity.Address;
import lombok.Getter;
import lombok.Setter;

/*
 * @description
 * @author: Huu Thai
 * @date:
 * @version: 1.0
 */
@Getter
@Setter
public class UserCheckoutReponse {
    private Long id;
    private String email;
    private String fullName;
    private String phone;
    private Address address;
}
