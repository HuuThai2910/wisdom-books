package iuh.fit.edu.service;

public interface TokenBlacklistService {
    
    /**
     * Thêm token vào blacklist
     */
    void blacklistToken(String token, String reason);
    
    /**
     * Kiểm tra xem token có bị blacklist không
     */
    boolean isTokenBlacklisted(String token);
    
    /**
     * Xóa các token đã hết hạn khỏi blacklist
     */
    void cleanupExpiredTokens();
}
