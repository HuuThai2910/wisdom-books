package iuh.fit.edu.entity;


import iuh.fit.edu.entity.enums.OrderStatus;
import iuh.fit.edu.entity.enums.PaymentMethod;
import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "orders")
@Data
public class Order {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String orderCode;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @Enumerated(EnumType.STRING)
    private OrderStatus status = OrderStatus.PENDING;

    private String receiverAddress;
    private String receiverName;
    private String receiverPhone;
    private String updateBy;
    private LocalDateTime updateAt;

    @Enumerated(EnumType.STRING)
    private PaymentMethod paymentMethod;
    private double totalPrice;

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL)
    private List<OrderDetail> orderItems ;

    private LocalDateTime orderDate;

    @ManyToOne
    @JoinColumn(name = "promotion_id")
    private Promotion promotion;
}