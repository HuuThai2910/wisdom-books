package iuh.fit.edu.dto.response.order;

import iuh.fit.edu.dto.response.summary.BookSummaryResponse;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrderItemResponse {
    private Long id;
    private BookSummaryResponse book;
    private Integer quantity;
    private Double price;
}

