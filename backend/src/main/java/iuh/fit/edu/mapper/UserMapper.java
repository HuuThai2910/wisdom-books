/*
 * @ (#) .java    1.0       
 * Copyright (c)  IUH. All rights reserved.
 */
package iuh.fit.edu.mapper;

import iuh.fit.edu.dto.response.UserCheckoutReponse;
import iuh.fit.edu.entity.User;
import org.mapstruct.Mapper;

/*
 * @description
 * @author: Huu Thai
 * @date:   
 * @version: 1.0
 */
@Mapper(componentModel = "spring")
public interface UserMapper {
    UserCheckoutReponse toUserCheckoutReponse(User user);
}
