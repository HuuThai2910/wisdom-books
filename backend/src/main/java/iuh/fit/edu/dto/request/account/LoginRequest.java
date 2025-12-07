package iuh.fit.edu.dto.request.account;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LoginRequest {
    private String fullName; // Có thể là email hoặc fullName
    private String password;
    
    // Alias cho trường hợp frontend gửi email
    public String getUsername() {
        return fullName;
    }
}
