package iuh.fit.edu.config.security;

import com.fasterxml.jackson.databind.ObjectMapper;
import iuh.fit.edu.entity.User;
import iuh.fit.edu.entity.constant.UserStatus;
import iuh.fit.edu.repository.UserRepository;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

/**
 * Filter để kiểm tra user status sau khi đã authenticate
 * Nếu user bị INACTIVE trong database, trả về lỗi ACCOUNT_DISABLED
 */
public class UserStatusFilter extends OncePerRequestFilter {

    private final UserRepository userRepository;
    private final ObjectMapper objectMapper = new ObjectMapper();

    public UserStatusFilter(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        
        // Chỉ kiểm tra nếu user đã authenticated
        if (authentication != null && authentication.isAuthenticated() && 
            authentication.getPrincipal() instanceof Jwt) {
            
            Jwt jwt = (Jwt) authentication.getPrincipal();
            String email = jwt.getClaimAsString("email");
            
            if (email != null) {
                User user = userRepository.findByEmail(email);
                
                if (user != null && user.getStatus() == UserStatus.INACTIVE) {
                    System.out.println("[UserStatusFilter] User " + email + " is INACTIVE, blocking request");
                    
                    // Clear authentication
                    SecurityContextHolder.clearContext();
                    
                    // Trả về response ACCOUNT_DISABLED
                    response.setStatus(HttpServletResponse.SC_FORBIDDEN);
                    response.setContentType("application/json;charset=UTF-8");
                    
                    Map<String, Object> errorResponse = new HashMap<>();
                    errorResponse.put("error", "ACCOUNT_DISABLED");
                    errorResponse.put("message", "Tài khoản của bạn đã bị vô hiệu hóa bởi quản trị viên");
                    errorResponse.put("status", 403);
                    errorResponse.put("path", request.getRequestURI());
                    
                    response.getWriter().write(objectMapper.writeValueAsString(errorResponse));
                    return; // Dừng filter chain
                }
            }
        }
        
        filterChain.doFilter(request, response);
    }
}
