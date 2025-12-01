package iuh.fit.edu.dto.request.user;

import iuh.fit.edu.entity.Address;
import iuh.fit.edu.entity.Role;
import iuh.fit.edu.entity.constant.Gender;
import iuh.fit.edu.entity.constant.UserStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class CreateUserRequest {
    private String fullName;
    private String email;
    private String phone;
    private Gender gender;
    private Address address;
    private Role role;
    private UserStatus userStatus;
    private String password;
    private String confirmPassword;
    private String avatarURL;
}
