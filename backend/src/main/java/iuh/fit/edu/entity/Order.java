package iuh.fit.edu.entity;


import com.fasterxml.jackson.annotation.JsonFormat;
import iuh.fit.edu.entity.constant.OrderStatus;
import iuh.fit.edu.entity.constant.PaymentMethod;
import iuh.fit.edu.entity.constant.PaymentStatus;
import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;
import java.time.OffsetDateTime;
import java.util.List;

@Entity
@Table(name = "orders")
@Data
public class Order {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(unique = true, nullable = false)
    private String orderCode;
    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @Enumerated(EnumType.STRING)
    private OrderStatus status;

    private String receiverAddress;
    private String receiverName;
    private String receiverPhone;
    private String receiverEmail;

    private String updateBy;
    private OffsetDateTime updateAt;
    @Enumerated(EnumType.STRING)
    private PaymentMethod paymentMethod;
    @Enumerated(EnumType.STRING)
    private PaymentStatus paymentStatus;
    @Column(columnDefinition = "MEDIUMTEXT")
    private String note;
    private double totalPrice;
    private String txnRef;
    
    @Column(columnDefinition = "DATETIME")
    private OffsetDateTime orderDate;
    
    @Column(columnDefinition = "DATETIME")
    private OffsetDateTime expiredAt;

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL)
    private List<OrderItem> orderItems;

    @PreUpdate
    public void handleBeforeUpdateAt() {
        this.updateAt = OffsetDateTime.now();
    }
}