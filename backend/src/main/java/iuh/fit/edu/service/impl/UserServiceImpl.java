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
import iuh.fit.edu.entity.constant.UserStatus;
import iuh.fit.edu.mapper.UserMapper;
import iuh.fit.edu.repository.RoleRepository;
import iuh.fit.edu.repository.UserRepository;
import iuh.fit.edu.service.AccountService;

import iuh.fit.edu.service.CognitoService;
import iuh.fit.edu.service.S3Service;
import iuh.fit.edu.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.time.OffsetDateTime;
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
    S3Service s3Service;

    @Autowired
    UserMapper userMapper;

    @Autowired
    AccountService accountService;

    @Override
    public boolean createUser(CreateUserRequest request,String email) {
        System.out.println("CreateUserRequest avatarURL: " + request.getAvatarURL());
        
        User user = userMapper.toUser(request);

        System.out.println("User avatar after mapping: " + user.getAvatar());

        Role role = roleRepository.findById(request.getRole().getId()).orElse(null);
        accountService.registerUser(RegisterRequest.builder()
                .fullName(user.getFullName())
                .phone(user.getPhone())
                .email(user.getEmail())
                .password(request.getPassword())
                .confirmPassword(request.getConfirmPassword())
                .build(), false);
        user.setRole(role);
        user.setCreatedBy(email);
        user.setAvatar(request.getAvatarURL());

        System.out.println("User avatar before save: " + user.getAvatar());
        
        if (user != null) {
            User savedUser = userRepository.save(user);
            System.out.println("User avatar after save: " + savedUser.getAvatar());
            return true;
        }
        return false;
    }

    @Override
    public void updateUser(Long id, UpdateUserRequest request,String email) {
        if (request != null) {
            User user = userRepository.findById(id).orElse(null);
            assert user != null;
            
            // Lưu role và status cũ để so sánh
            Role oldRole = user.getRole();
            UserStatus oldStatus = user.getStatus();
            
            // Cập nhật role mới
            Role newRole = roleRepository.findById(Long.valueOf(request.getRole())).orElse(null);
            user.setRole(newRole);
            user.setUpdatedBy(email);
            user.setUpdatedAt(OffsetDateTime.now());
            // Map other fields first
            User updatedUser = userMapper.toUpdateUser(request, user);
            updatedUser.setAvatar(request.getAvatarURL());

            // Update avatar AFTER mapping to prevent overwrite
            if (request.getAvatarURL() != null && !request.getAvatarURL().isEmpty()) {
                updatedUser.setAvatar(request.getAvatarURL());
            }
            
            userRepository.save(updatedUser);
            
            // Cập nhật role trên AWS Cognito nếu role thay đổi
            if (newRole != null && !newRole.equals(oldRole)) {
                try {
                    String cognitoGroupName = newRole.getName().name(); // ADMIN, STAFF, CUSTOMER, WARE_HOUSE_STAFF
                    cognitoService.updateUserRole(user.getFullName(), cognitoGroupName);
                    System.out.println("[UserService] Updated user " + user.getFullName() + " role to " + cognitoGroupName + " in Cognito");
                } catch (Exception e) {
                    System.err.println("[UserService] Failed to update Cognito role: " + e.getMessage());
                    // Không throw exception để không làm gián đoạn việc update database
                }
            }
            
            // Cập nhật status trên AWS Cognito nếu status thay đổi
            if (request.getStatus() != null && request.getStatus() != oldStatus) {
                try {
                    if (request.getStatus() == UserStatus.INACTIVE) {
                        cognitoService.disableUser(user.getFullName());
                        System.out.println("[UserService] Disabled user " + user.getFullName() + " in Cognito");
                    } else if (request.getStatus() == UserStatus.ACTIVE) {
                        cognitoService.enableUser(user.getFullName());
                        System.out.println("[UserService] Enabled user " + user.getFullName() + " in Cognito");
                    }
                } catch (Exception e) {
                    System.err.println("[UserService] Failed to update Cognito status: " + e.getMessage());
                    // Không throw exception để không làm gián đoạn việc update database
                }
            }
        }
    }

    @Override
    public void deleteUser(Long id,String email) {
        User user = userRepository.findById(id).orElse(null);
        assert user != null;
        user.setStatus(UserStatus.INACTIVE);
        user.setUpdatedBy(email);
        user.setUpdatedAt(OffsetDateTime.now());
        userRepository.save(user);
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
                .role(user.getRole() != null ? user.getRole().getId().toString() : null)
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
                        .filter(user -> user != null)  // Filter out null users
                        .map(user -> UserDTO.builder()
                                .id(user.getId())
                                .fullName(user.getFullName())
                                .email(user.getEmail())
                                .phone(user.getPhone())
                                .role(user.getRole() != null ? user.getRole().getName().name() : null)
                                .userStatus(user.getStatus() != null ? user.getStatus().name() : "ACTIVE")
                                .avatar(user.getAvatar())
                                .build()).toList())
                .build();
    }

    @Override
    public UsersResponse findAll(String keyword, String sortBy, String sortDirection, String role, String status) {
        List<User> users = userRepository.findAll();
        
        // Filter out null users first
        users = users.stream()
                .filter(user -> user != null)
                .toList();
        
        // Filter by keyword (search in fullName, email, phone)
        if (keyword != null && !keyword.trim().isEmpty()) {
            String lowerKeyword = keyword.toLowerCase().trim();
            users = users.stream()
                    .filter(user -> 
                        (user.getFullName() != null && user.getFullName().toLowerCase().contains(lowerKeyword)) ||
                        (user.getEmail() != null && user.getEmail().toLowerCase().contains(lowerKeyword)) ||
                        (user.getPhone() != null && user.getPhone().toLowerCase().contains(lowerKeyword))
                    )
                    .toList();
        }
        
        // Filter by role
        if (role != null && !role.trim().isEmpty()) {
            users = users.stream()
                    .filter(user -> user.getRole() != null && 
                            user.getRole().getName().name().equalsIgnoreCase(role))
                    .toList();
        }
        
        // Filter by status
        if (status != null && !status.trim().isEmpty()) {
            users = users.stream()
                    .filter(user -> user.getStatus() != null && 
                            user.getStatus().name().equalsIgnoreCase(status))
                    .toList();
        }
        
        // Sort
        if (sortBy != null && !sortBy.trim().isEmpty()) {
            boolean ascending = sortDirection == null || sortDirection.equalsIgnoreCase("asc");
            
            users = switch (sortBy.toLowerCase()) {
                case "name", "fullname" -> users.stream()
                        .sorted((u1, u2) -> {
                            String name1 = u1.getFullName() != null ? u1.getFullName() : "";
                            String name2 = u2.getFullName() != null ? u2.getFullName() : "";
                            return ascending ? name1.compareToIgnoreCase(name2) : name2.compareToIgnoreCase(name1);
                        })
                        .toList();
                case "email" -> users.stream()
                        .sorted((u1, u2) -> {
                            String email1 = u1.getEmail() != null ? u1.getEmail() : "";
                            String email2 = u2.getEmail() != null ? u2.getEmail() : "";
                            return ascending ? email1.compareToIgnoreCase(email2) : email2.compareToIgnoreCase(email1);
                        })
                        .toList();
                case "role" -> users.stream()
                        .sorted((u1, u2) -> {
                            String role1 = u1.getRole() != null ? u1.getRole().getName().name() : "";
                            String role2 = u2.getRole() != null ? u2.getRole().getName().name() : "";
                            return ascending ? role1.compareToIgnoreCase(role2) : role2.compareToIgnoreCase(role1);
                        })
                        .toList();
                case "status" -> users.stream()
                        .sorted((u1, u2) -> {
                            String status1 = u1.getStatus() != null ? u1.getStatus().name() : "";
                            String status2 = u2.getStatus() != null ? u2.getStatus().name() : "";
                            return ascending ? status1.compareToIgnoreCase(status2) : status2.compareToIgnoreCase(status1);
                        })
                        .toList();
                case "createdat", "created" -> users.stream()
                        .sorted((u1, u2) -> {
                            if (u1.getCreatedAt() == null) return ascending ? 1 : -1;
                            if (u2.getCreatedAt() == null) return ascending ? -1 : 1;
                            return ascending ? u1.getCreatedAt().compareTo(u2.getCreatedAt()) 
                                             : u2.getCreatedAt().compareTo(u1.getCreatedAt());
                        })
                        .toList();
                default -> users;
            };
        }
        
        return UsersResponse.builder()
                .users(users.stream()
                        .filter(user -> user != null)  // Extra safety check
                        .map(user -> UserDTO.builder()
                                .id(user.getId())
                                .fullName(user.getFullName())
                                .email(user.getEmail())
                                .phone(user.getPhone())
                                .role(user.getRole() != null ? user.getRole().getName().name() : null)
                                .userStatus(user.getStatus() != null ? user.getStatus().name() : "ACTIVE")
                                .avatar(user.getAvatar())
                                .build()).toList())
                .build();
    }

    @Override
    public String getAvatarUrl(String filename) {
        if (filename == null || filename.isEmpty()) {
            return null;
        }
        return s3Service.getFileUrl(filename);
    }

    @Override
    public String uploadAvatar(MultipartFile avatar) {
        if (avatar == null || avatar.isEmpty()) {
            throw new RuntimeException("Avatar file is empty");
        }
        return s3Service.uploadFile(avatar, "users/avatars");
    }
}

