package iuh.fit.edu.dto.response.account;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class RegisterResponse {
    private String fullName;
    private String email;
    private String password;
    private String phone;
    private String sub;
}
