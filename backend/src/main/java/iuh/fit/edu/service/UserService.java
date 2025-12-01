package iuh.fit.edu.service;

import iuh.fit.edu.dto.request.user.CreateUserRequest;
import iuh.fit.edu.dto.request.user.UpdateUserRequest;
import iuh.fit.edu.dto.response.account.RegisterResponse;
import iuh.fit.edu.dto.response.user.UserResponseById;
import iuh.fit.edu.dto.response.user.UsersResponse;
import iuh.fit.edu.entity.User;

public interface UserService {
    boolean createUser(CreateUserRequest request);
    void updateUser(Long id, UpdateUserRequest request);
    void deleteUser(Long id);
    UserResponseById findUserById(Long id);
    UsersResponse findAll();
}
