package iuh.fit.edu.dto.request.entryform;

import lombok.Data;
import java.util.List;

/**
 * @author The Bao
 * @version 1.0
 */
@Data
public class CreateEntryFormDTO {
    private String supplier;
    private String invoiceNumber;
    private List<BookItemDTO> books;
}
