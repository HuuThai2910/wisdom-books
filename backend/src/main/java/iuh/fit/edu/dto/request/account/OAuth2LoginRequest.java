package iuh.fit.edu.dto.request.account;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OAuth2LoginRequest {
    private String email;
    private String fullName;
    private String provider; // "GOOGLE" or "FACEBOOK"
    private String providerId; // unique ID from provider
}
