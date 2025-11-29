package iuh.fit.edu.dto.request.user;

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
public class UpdateUserRequest {
    private String fullName;
    private String phone;
    private Gender gender;
    private String diaChi;
    private Role role;
    private UserStatus status;
    private String avatarURL;
}
