package iuh.fit.edu.service.impl;

import iuh.fit.edu.entity.BlacklistedToken;
import iuh.fit.edu.repository.BlacklistedTokenRepository;
import iuh.fit.edu.service.TokenBlacklistService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.OffsetDateTime;
import java.time.ZoneOffset;

@Service
@RequiredArgsConstructor
@Slf4j
public class TokenBlacklistServiceImpl implements TokenBlacklistService {
    
    private final BlacklistedTokenRepository blacklistedTokenRepository;
    private final JwtDecoder jwtDecoder;
    
    @Override
    @Transactional
    public void blacklistToken(String token, String reason) {
        try {
            // Decode JWT để lấy expiry time
            Jwt jwt = jwtDecoder.decode(token);
            Instant expiry = jwt.getExpiresAt();
            
            if (expiry == null) {
                // Nếu không có expiry, set 5 phút từ bây giờ
                expiry = Instant.now().plusSeconds(300);
            }
            
            OffsetDateTime expiryDate = OffsetDateTime.ofInstant(expiry, ZoneOffset.UTC);
            
            // Kiểm tra xem token đã bị blacklist chưa
            if (!blacklistedTokenRepository.existsByToken(token)) {
                BlacklistedToken blacklistedToken = new BlacklistedToken(token, expiryDate, reason);
                blacklistedTokenRepository.save(blacklistedToken);
                log.info("[TokenBlacklist] Token blacklisted successfully, expires at: {}", expiryDate);
            } else {
                log.info("[TokenBlacklist] Token already blacklisted");
            }
        } catch (Exception e) {
            log.error("[TokenBlacklist] Error blacklisting token: {}", e.getMessage());
            // Nếu decode thất bại, vẫn blacklist với expiry 5 phút
            OffsetDateTime expiryDate = OffsetDateTime.now().plusMinutes(5);
            BlacklistedToken blacklistedToken = new BlacklistedToken(token, expiryDate, reason);
            blacklistedTokenRepository.save(blacklistedToken);
        }
    }
    
    @Override
    public boolean isTokenBlacklisted(String token) {
        return blacklistedTokenRepository.existsByToken(token);
    }
    
    @Override
    @Transactional
    public void cleanupExpiredTokens() {
        OffsetDateTime now = OffsetDateTime.now();
        long count = blacklistedTokenRepository.countByExpiryDateBefore(now);
        
        if (count > 0) {
            blacklistedTokenRepository.deleteByExpiryDateBefore(now);
            log.info("[TokenBlacklist] Cleaned up {} expired tokens", count);
        }
    }
}
