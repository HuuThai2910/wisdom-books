package iuh.fit.edu.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PaymentResponse {
    private String code;
    private String message;
    private String paymentUrl;
    private String orderCode;
    private double totalPrice;
    private LocalDateTime orderDate;
}

