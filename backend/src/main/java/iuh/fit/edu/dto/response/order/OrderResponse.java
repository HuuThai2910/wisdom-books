package iuh.fit.edu.dto.response.order;

import com.fasterxml.jackson.annotation.JsonFormat;
import iuh.fit.edu.entity.constant.OrderStatus;
import iuh.fit.edu.entity.constant.PaymentMethod;
import iuh.fit.edu.entity.constant.PaymentStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrderResponse {
    private Long id;
    private String orderCode;
    private Long userId;
    private String userName;
    private OrderStatus status;
    private String receiverAddress;
    private String receiverName;
    private String receiverPhone;
    private String receiverEmail;
    private PaymentMethod paymentMethod;
    private PaymentStatus paymentStatus;
    private String note;
    private double totalPrice;
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "Asia/Ho_Chi_Minh")
    private LocalDateTime orderDate;
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "Asia/Ho_Chi_Minh")
    private LocalDateTime expiredAt;
    private List<OrderItemResponse> orderItems;
}

