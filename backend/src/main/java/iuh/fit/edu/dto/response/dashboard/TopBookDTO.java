package iuh.fit.edu.dto.response.dashboard;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TopBookDTO {
    private String name; // Tên sách
    private long sales; // Số lượng đã bán
}
