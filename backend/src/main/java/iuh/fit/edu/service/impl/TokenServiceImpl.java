package iuh.fit.edu.service.impl;

import iuh.fit.edu.entity.Token;
import iuh.fit.edu.entity.User;
import iuh.fit.edu.entity.constant.TokenType;
import iuh.fit.edu.repository.TokenRepository;
import iuh.fit.edu.service.TokenService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
@Slf4j
public class TokenServiceImpl implements TokenService {

    private final TokenRepository tokenRepository;

    @Override
    @Transactional
    public Token saveTokenRecord(User user, TokenType tokenType, long expirationMinutes) {
        // Tạo token record mới
        Token token = Token.builder()
                .user(user)
                .tokenType(tokenType)
                .expiresAt(LocalDateTime.now().plusMinutes(expirationMinutes))
                .revoked(false)
                .build();
        
        return tokenRepository.save(token);
    }

    @Override
    @Transactional
    public void revokeAllUserTokens(User user, TokenType tokenType) {
        tokenRepository.revokeAllUserTokensByType(user, tokenType);
        log.info("Revoked all {} tokens for user: {}", tokenType, user.getEmail());
    }

    @Override
    @Transactional
    public void revokeAllUserTokens(User user) {
        tokenRepository.revokeAllUserTokensByType(user, TokenType.ACCESS_TOKEN);
        tokenRepository.revokeAllUserTokensByType(user, TokenType.REFRESH_TOKEN);
        log.info("Revoked all tokens for user: {}", user.getEmail());
    }

    @Override
    @Transactional
    public void deleteExpiredTokens() {
        tokenRepository.deleteExpiredTokens(LocalDateTime.now());
        log.info("Deleted expired tokens");
    }

    @Override
    public boolean hasValidToken(User user, TokenType tokenType) {
        return tokenRepository.findByUserAndTokenTypeAndRevokedFalse(user, tokenType)
                .map(token -> token.getExpiresAt().isAfter(LocalDateTime.now()))
                .orElse(false);
    }

    @Override
    @Transactional
    public void deleteUserTokens(User user, TokenType tokenType) {
        tokenRepository.deleteByUserAndTokenType(user, tokenType);
        log.info("Deleted all {} tokens for user: {}", tokenType, user.getEmail());
    }
}
