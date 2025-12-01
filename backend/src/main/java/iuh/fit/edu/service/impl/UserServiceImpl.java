/*
 * @ (#) .java    1.0
 * Copyright (c)  IUH. All rights reserved.
 */
package iuh.fit.edu.service.impl;
import iuh.fit.edu.dto.request.account.RegisterRequest;
import iuh.fit.edu.dto.request.user.CreateUserRequest;
import iuh.fit.edu.dto.request.user.UpdateUserRequest;
import iuh.fit.edu.dto.response.user.UserDTO;
import iuh.fit.edu.dto.response.user.UserResponseById;
import iuh.fit.edu.dto.response.user.UsersResponse;
import iuh.fit.edu.entity.Role;
import iuh.fit.edu.entity.User;
import iuh.fit.edu.mapper.UserMapper;
import iuh.fit.edu.repository.RoleRepository;
import iuh.fit.edu.repository.UserRepository;
import iuh.fit.edu.service.AccountService;

import iuh.fit.edu.service.CognitoService;
import iuh.fit.edu.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
/*
 * @description
 * @author: Ngoc Hai
 * @date:
 * @version: 1.0
 */



@Service
public class UserServiceImpl implements UserService {
    @Autowired
    UserRepository userRepository;
    @Autowired
    RoleRepository roleRepository;
    @Autowired
    CognitoService cognitoService;

    @Autowired
    UserMapper userMapper;

    @Autowired
    AccountService accountService;

    @Override
    public boolean createUser(CreateUserRequest request) {
        User user = userMapper.toUser(request);
        Role role = roleRepository.findById(request.getRole().getId()).orElse(null);
        accountService.registerUser(RegisterRequest.builder()
                .fullName(user.getFullName())
                .phone(user.getPhone())
                .email(user.getEmail())
                .password(user.getPassword())
                .confirmPassword(request.getConfirmPassword())
                .build(), false);
        user.setRole(role);
        if (user != null) {
            userRepository.save(user);
            return true;
        }
        return false;
    }

    @Override
    public void updateUser(Long id, UpdateUserRequest request) {
        if (request != null) {
            User user = userRepository.findById(id).orElse(null);
            Role role=roleRepository.findById(Long.valueOf(request.getRole())).orElse(null);
            assert user != null;
            user.setRole(role);
            userRepository.save(userMapper.toUpdateUser(request, user));
        }
    }

    @Override
    public void deleteUser(Long id) {
        User user = userRepository.findById(id).orElse(null);
        userRepository.deleteById(id);
        assert user != null;
        cognitoService.disableUser(user.getFullName());
    }

    @Override
    public UserResponseById findUserById(Long id) {
        User user=userRepository.findById(id).orElse(null);
        assert user != null;
        return UserResponseById.builder()
                .id(user.getId())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .gender(user.getGender())
                .phone(user.getPhone())
                .role(user.getRole().getId().toString())
                .userStatus(user.getStatus())
                .address(user.getAddress())
                .avatarURL(user.getAvatar())
                .build();
    }

    @Override
    public UsersResponse findAll() {
        List<User> users = userRepository.findAll();
        return UsersResponse.builder()
                .users(users.stream()
                        .map(user -> UserDTO.builder()
                                .id(user.getId())
                                .fullName(user.getFullName())
                                .email(user.getEmail())
                                .phone(user.getPhone())
                                .role(user.getRole().getName().name())
                                .build()).toList())
                .build();
    }
}

