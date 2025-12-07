package iuh.fit.edu.dto.response.account;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class CognitoTokens {
    private String accessToken;
    private String idToken;
    private String refreshToken;
    private int expiresIn; // seconds
}
