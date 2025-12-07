package iuh.fit.edu.repository;

import iuh.fit.edu.entity.Token;
import iuh.fit.edu.entity.User;
import iuh.fit.edu.entity.constant.TokenType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface TokenRepository extends JpaRepository<Token, Long> {
    
    // Tìm token của user theo type và chưa bị revoke
    Optional<Token> findByUserAndTokenTypeAndRevokedFalse(User user, TokenType tokenType);
    
    // Tìm tất cả token của user theo type
    List<Token> findByUserAndTokenType(User user, TokenType tokenType);
    
    // Xóa tất cả token của user theo type
    @Modifying
    @Query("DELETE FROM Token t WHERE t.user = :user AND t.tokenType = :tokenType")
    void deleteByUserAndTokenType(@Param("user") User user, @Param("tokenType") TokenType tokenType);
    
    // Xóa tất cả token của user
    @Modifying
    @Query("DELETE FROM Token t WHERE t.user = :user")
    void deleteByUser(@Param("user") User user);
    
    // Revoke tất cả token của user theo type
    @Modifying
    @Query("UPDATE Token t SET t.revoked = true WHERE t.user = :user AND t.tokenType = :tokenType")
    void revokeAllUserTokensByType(@Param("user") User user, @Param("tokenType") TokenType tokenType);
    
    // Xóa token hết hạn
    @Modifying
    @Query("DELETE FROM Token t WHERE t.expiresAt < :now")
    void deleteExpiredTokens(@Param("now") LocalDateTime now);
}
