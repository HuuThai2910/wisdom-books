package iuh.fit.edu.dto.response.account;

import iuh.fit.edu.entity.User;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class UsersResponse {
    private String email;
    private List<User> users;
}
