package iuh.fit.edu.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "vouchers")
@Data
public class Voucher {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String description;
    private int discountValue;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private int quantity;
    private double minOrder;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private String createdBy;
    private String updatedBy;

    @ManyToMany(mappedBy = "vouchers")
    private List<User> users;

}