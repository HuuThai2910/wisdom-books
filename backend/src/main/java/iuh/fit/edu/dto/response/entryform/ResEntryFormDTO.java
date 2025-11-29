package iuh.fit.edu.dto.response.entryform;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ResEntryFormDTO {
    private Long id;
    private int totalQuantity;
    private double totalPrice;
    private LocalDateTime createdAt;
    private String createdBy; // User's full name
}
