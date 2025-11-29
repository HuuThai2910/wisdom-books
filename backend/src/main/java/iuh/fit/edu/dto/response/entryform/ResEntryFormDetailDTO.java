package iuh.fit.edu.dto.response.entryform;

import lombok.Data;

/**
 * @author The Bao
 * @version 1.0
 */
@Data
public class ResEntryFormDetailDTO {
    private Long id;
    private String isbn;
    private String title;
    private int yearOfPublication;
    private int quantity;
    private double unitPrice;
    private double amount;
}
