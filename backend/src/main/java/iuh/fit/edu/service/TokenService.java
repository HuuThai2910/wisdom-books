package iuh.fit.edu.service;

import iuh.fit.edu.entity.Token;
import iuh.fit.edu.entity.User;
import iuh.fit.edu.entity.constant.TokenType;

public interface TokenService {
    
    /**
     * Lưu token record vào database (không lưu token string, chỉ lưu metadata)
     */
    Token saveTokenRecord(User user, TokenType tokenType, long expirationMinutes);
    
    /**
     * Revoke (vô hiệu hóa) tất cả token của user theo type
     */
    void revokeAllUserTokens(User user, TokenType tokenType);
    
    /**
     * Revoke tất cả token của user (cả access và refresh)
     */
    void revokeAllUserTokens(User user);
    
    /**
     * Xóa token hết hạn từ database
     */
    void deleteExpiredTokens();
    
    /**
     * Kiểm tra xem user có token hợp lệ không
     */
    boolean hasValidToken(User user, TokenType tokenType);
    
    /**
     * Xóa token của user theo type
     */
    void deleteUserTokens(User user, TokenType tokenType);
}
