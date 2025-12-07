package iuh.fit.edu.dto.response.user;

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
    private List<UserDTO> users;
}
