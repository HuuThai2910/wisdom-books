package iuh.fit.edu.dto.response.user;

import iuh.fit.edu.entity.Role;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class UserDTO {
    private Long id;
    private String fullName;
    private String email;
    private String phone;
    private String role;
    private String userStatus;
    private String avatar;
}
