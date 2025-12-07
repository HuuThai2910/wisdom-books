package iuh.fit.edu.dto.response.user;

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
public class UserResponseById {
    private Long id;
    private String fullName;
    private String email;
    private String phone;
    private Gender gender;
    private Address address;
    private String role;
    private UserStatus userStatus;
    private String avatarURL;
}
