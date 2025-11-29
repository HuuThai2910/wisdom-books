package iuh.fit.edu.dto.request.order;

import lombok.Data;

@Data
public class OrderItemRequest {
    private Long bookId;
    private Integer quantity;
    private Double price;
}

