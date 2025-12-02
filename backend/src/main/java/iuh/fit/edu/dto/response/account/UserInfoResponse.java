package iuh.fit.edu.dto.response.account;

import iuh.fit.edu.entity.Address;
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
public class UserInfoResponse {
    private Long id;
    private String email;
    private String phone;
    private String fullName;
    private String avatar;
    private Address address;
    private Gender gender;
    private Long role;
    private UserStatus userStatus;
}
