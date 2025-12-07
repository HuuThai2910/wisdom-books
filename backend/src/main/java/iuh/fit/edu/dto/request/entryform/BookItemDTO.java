package iuh.fit.edu.dto.request.entryform;

import lombok.Data;

/**
 * @author The Bao
 * @version 1.0
 */
@Data
public class BookItemDTO {
    private String isbn;
    private String title;
    private int yearOfPublication;
    private double importPrice;
    private int quantity;
    private double amount;
}
