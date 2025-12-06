package iuh.fit.edu.config;

import iuh.fit.edu.service.TokenBlacklistService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class TokenCleanupScheduler {
    
    private final TokenBlacklistService tokenBlacklistService;
    
    /**
     * Chạy mỗi 5 phút để xóa các token đã hết hạn
     */
    @Scheduled(fixedRate = 300000) // 5 phút = 300,000 ms
    public void cleanupExpiredTokens() {
        log.info("[TokenCleanup] Starting cleanup of expired blacklisted tokens");
        tokenBlacklistService.cleanupExpiredTokens();
    }
}
