/*
 * @ (#) .java    1.0       
 * Copyright (c)  IUH. All rights reserved.
 */
package iuh.fit.edu.mapper;

import iuh.fit.edu.dto.request.account.RegisterRequest;
import iuh.fit.edu.dto.request.user.CreateUserRequest;
import iuh.fit.edu.dto.request.user.UpdateUserRequest;
import iuh.fit.edu.dto.response.UserCheckoutReponse;
import iuh.fit.edu.dto.response.account.RegisterResponse;
import iuh.fit.edu.entity.User;
import iuh.fit.edu.repository.UserRepository;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

/*
 * @description
 * @author: Huu Thai
 * @date:   
 * @version: 1.0
 */
@Mapper(componentModel = "spring")
public interface UserMapper {
    UserCheckoutReponse toUserCheckoutReponse(User user);
    RegisterResponse toRegisterResponse(User user,String sub);
    User toUserAccount(RegisterRequest request);
    @Mapping(target = "role",ignore = true)
    User toUser(CreateUserRequest request);
    @Mapping(target = "email",ignore = true)
    User toUpdateUser(UpdateUserRequest request,@MappingTarget User user);
}
