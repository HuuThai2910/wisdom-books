package iuh.fit.edu.dto.response.account;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class LoginResponse {
    private String token; // access token
    private String refreshToken;
    private boolean success;
    private long expiresIn; // seconds until expiration
}
