package iuh.fit.edu.repository;

import iuh.fit.edu.entity.BlacklistedToken;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.OffsetDateTime;
import java.util.Optional;

@Repository
public interface BlacklistedTokenRepository extends JpaRepository<BlacklistedToken, Long> {
    
    boolean existsByToken(String token);
    
    Optional<BlacklistedToken> findByToken(String token);
    
    void deleteByExpiryDateBefore(OffsetDateTime date);
    
    long countByExpiryDateBefore(OffsetDateTime date);
}
