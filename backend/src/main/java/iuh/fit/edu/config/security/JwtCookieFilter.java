package iuh.fit.edu.config.security;


import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationConverter;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Arrays;

public class JwtCookieFilter extends OncePerRequestFilter {

    private final JwtDecoder jwtDecoder;
    private final JwtAuthenticationConverter jwtAuthenticationConverter;

    public JwtCookieFilter(JwtDecoder jwtDecoder, JwtAuthenticationConverter jwtAuthenticationConverter) {
        this.jwtDecoder = jwtDecoder;
        this.jwtAuthenticationConverter = jwtAuthenticationConverter;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {

        String requestURI = request.getRequestURI();
        System.out.println("[JwtCookieFilter] ========== FILTER START ==========");
        System.out.println("[JwtCookieFilter] Processing request: " + request.getMethod() + " " + requestURI);
        System.out.println("[JwtCookieFilter] Existing authentication: " + SecurityContextHolder.getContext().getAuthentication());
        
        Cookie[] cookies = request.getCookies();
        boolean foundToken = false;
        
        if (cookies != null) {
            for (Cookie cookie : cookies) {
                if ("id_token".equals(cookie.getName())) {
                    foundToken = true;
                    try {
                        String token = cookie.getValue();
                        System.out.println("[JwtCookieFilter] Found id_token cookie, length: " + token.length());
                        
                        Jwt jwt = jwtDecoder.decode(token);
                        System.out.println("[JwtCookieFilter] JWT decoded successfully");
                        System.out.println("[JwtCookieFilter] JWT claims: " + jwt.getClaims());
                        
                        JwtAuthenticationToken authToken = (JwtAuthenticationToken) jwtAuthenticationConverter.convert(jwt);
                        
                        if (authToken != null) {
                            System.out.println("[JwtCookieFilter] Authorities: " + authToken.getAuthorities());
                            System.out.println("[JwtCookieFilter] Setting authentication in SecurityContext");
                            SecurityContextHolder.getContext().setAuthentication(authToken);
                        } else {
                            System.out.println("[JwtCookieFilter] WARNING: Auth token conversion returned null!");
                        }
                    } catch (Exception e) {
                        System.err.println("[JwtCookieFilter] ERROR: Failed to process JWT: " + e.getClass().getName() + " - " + e.getMessage());
                        e.printStackTrace();
                    }
                    break;
                }
            }
        }
        
        if (!foundToken) {
            System.out.println("[JwtCookieFilter] No id_token cookie found");
        }
        
        System.out.println("[JwtCookieFilter] Final authentication: " + SecurityContextHolder.getContext().getAuthentication());
        System.out.println("[JwtCookieFilter] ========== FILTER END ==========");

        filterChain.doFilter(request, response);
    }
}


