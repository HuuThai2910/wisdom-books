/*
 * @ (#) .java    1.0
 * Copyright (c)  IUH. All rights reserved.
 */
package iuh.fit.edu.entity;

import jakarta.persistence.Embeddable;
import lombok.Getter;
import lombok.Setter;
import org.springframework.stereotype.Service;

/*
 * @description
 * @author: Huu Thai
 * @date:
 * @version: 1.0
 */
@Embeddable
@Getter
@Setter
public class Address {
    private String address;
    private String ward;
    private String province;
}
