package iuh.fit.edu.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.OffsetDateTime;

@Entity
@Table(name = "blacklisted_tokens", indexes = {
    @Index(name = "idx_token", columnList = "token"),
    @Index(name = "idx_expiry", columnList = "expiryDate")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
public class BlacklistedToken {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false, unique = true, columnDefinition = "TEXT")
    private String token;
    
    @Column(nullable = false)
    private OffsetDateTime blacklistedAt;
    
    @Column(nullable = false)
    private OffsetDateTime expiryDate;
    
    private String reason; // Optional: lý do blacklist (logout, security, etc.)
    
    public BlacklistedToken(String token, OffsetDateTime expiryDate, String reason) {
        this.token = token;
        this.blacklistedAt = OffsetDateTime.now();
        this.expiryDate = expiryDate;
        this.reason = reason;
    }
}
