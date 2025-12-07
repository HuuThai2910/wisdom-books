package iuh.fit.edu.dto.request.order;

import iuh.fit.edu.entity.constant.PaymentMethod;
import lombok.Data;

import java.util.List;

@Data
public class OrderRequest {
    private String receiverName;
    private String receiverPhone;
    private String receiverAddress;
    private String receiverEmail;
    private String note;
    private PaymentMethod paymentMethod;
    private double totalPrice; // Tổng giá trị đơn hàng (client tính và gửi lên)
    private List<OrderItemRequest> items;
}

