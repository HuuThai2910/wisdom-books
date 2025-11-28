package iuh.fit.edu.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import iuh.fit.edu.entity.constant.Gender;
import iuh.fit.edu.entity.constant.UserStatus;
import jakarta.persistence.*;
import lombok.Data;
import lombok.ToString;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "users")
@Data

public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true)
    private String email;

    @Column(nullable = false)
    private String password;
    
    @Column(unique = true)
    private String sub; // Cognito user sub (unique identifier)

    private String fullName;
    private String phone;
    @Embedded
    private Address address;

    private String avatar;

    @Enumerated(EnumType.STRING)
    private UserStatus status = UserStatus.ACTIVE;

    @Enumerated(EnumType.ORDINAL)
    private Gender gender;

    @ManyToOne
    @JoinColumn(name = "role_id")
    @JsonIgnore
    @ToString.Exclude
    private Role role;

    @CreationTimestamp
    private LocalDateTime createdAt;
    private String createdBy;
    private String updatedBy;
    private LocalDateTime updatedAt;


    @OneToMany(mappedBy = "user")
    @ToString.Exclude
    private List<Order> orders;

    @OneToMany(mappedBy = "user")
    @ToString.Exclude
    private List<Review> reviews;

    @OneToOne(mappedBy = "user")
    @ToString.Exclude
    private Cart cart;

    @OneToMany(mappedBy = "user")
    @ToString.Exclude
    private List<EntryForm> entryForms;

    @ManyToMany
    @JoinTable(name = "user_voucher", joinColumns = @JoinColumn(name = "user_id"),
    inverseJoinColumns = @JoinColumn(name = "voucher_id"))
    @ToString.Exclude
    private List<Voucher> vouchers;
}
