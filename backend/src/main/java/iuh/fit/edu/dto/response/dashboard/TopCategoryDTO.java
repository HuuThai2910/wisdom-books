package iuh.fit.edu.dto.response.dashboard;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TopCategoryDTO {
    private Long categoryId; // ID thể loại
    private String category; // Tên thể loại
    private long sales; // Số lượng đã bán
}
