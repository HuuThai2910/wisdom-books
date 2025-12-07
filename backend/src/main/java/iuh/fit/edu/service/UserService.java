package iuh.fit.edu.service;

import iuh.fit.edu.dto.request.user.CreateUserRequest;
import iuh.fit.edu.dto.request.user.UpdateUserRequest;
import iuh.fit.edu.dto.response.account.RegisterResponse;
import iuh.fit.edu.dto.response.user.UserResponseById;
import iuh.fit.edu.dto.response.user.UsersResponse;
import iuh.fit.edu.entity.User;
import org.springframework.web.multipart.MultipartFile;

public interface UserService {
    boolean createUser(CreateUserRequest request,String email);
    void updateUser(Long id, UpdateUserRequest request, String email);
    void deleteUser(Long id,String email);
    UserResponseById findUserById(Long id);
    UsersResponse findAll();
    UsersResponse findAll(String keyword, String sortBy, String sortDirection, String role, String status);
    String getAvatarUrl(String filename);
    String uploadAvatar(MultipartFile avatar);
}
