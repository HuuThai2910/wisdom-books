package iuh.fit.edu.config;

import iuh.fit.edu.config.security.CustomAccessDeniedHandler;
import iuh.fit.edu.config.security.CustomAuthenticationEntryPoint;
import iuh.fit.edu.config.security.JwtCookieFilter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.NimbusJwtDecoder;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationConverter;
import org.springframework.security.oauth2.server.resource.authentication.JwtGrantedAuthoritiesConverter;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableMethodSecurity
public class SecurityConfig {

    @Autowired
    private CustomAccessDeniedHandler accessDeniedHandler;

    @Autowired
    private CustomAuthenticationEntryPoint authenticationEntryPoint;

    private final String COGNITO_JWKS_URL =
            "https://cognito-idp.ap-southeast-1.amazonaws.com/ap-southeast-1_rnIXnN2rr/.well-known/jwks.json";

    @Bean
    public JwtDecoder jwtDecoder() {
        return NimbusJwtDecoder.withJwkSetUri(COGNITO_JWKS_URL).build();
    }

    @Bean
    public JwtAuthenticationConverter jwtAuthenticationConverter() {
        JwtGrantedAuthoritiesConverter grantedAuthoritiesConverter = new JwtGrantedAuthoritiesConverter();
        grantedAuthoritiesConverter.setAuthoritiesClaimName("cognito:groups");
        grantedAuthoritiesConverter.setAuthorityPrefix(""); // giữ nguyên tên role từ Cognito

        JwtAuthenticationConverter converter = new JwtAuthenticationConverter();
        converter.setJwtGrantedAuthoritiesConverter(grantedAuthoritiesConverter);
        return converter;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

        // Thêm filter đọc JWT từ cookie trước UsernamePasswordAuthenticationFilter
        http.addFilterBefore(
                new JwtCookieFilter(jwtDecoder(), jwtAuthenticationConverter()),
                UsernamePasswordAuthenticationFilter.class
        );

        http
                .csrf(AbstractHttpConfigurer::disable)
                .cors(Customizer.withDefaults())
                .authorizeHttpRequests(auth -> auth
                        // Public endpoints - không cần xác thực
                        .requestMatchers(HttpMethod.POST, "/api/auth/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/books/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/categories/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/tz").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/users/avatar/**").permitAll()

                        // Shopping endpoints - tất cả user đã đăng nhập đều có thể mua hàng
                        .requestMatchers("/api/cart/**").authenticated()
                        .requestMatchers(HttpMethod.GET, "/api/orders/user").authenticated()
                        .requestMatchers(HttpMethod.PUT, "/api/orders/cancel").authenticated()
                        .requestMatchers("/api/payment/**").authenticated()
                        .requestMatchers("/api/vouchers/**").authenticated()
                        
                        // Auth endpoints - tất cả user đã đăng nhập
                        .requestMatchers(HttpMethod.GET, "/api/auth/me").authenticated()
                        .requestMatchers(HttpMethod.POST, "/api/auth/logout").authenticated()
                        .requestMatchers(HttpMethod.POST, "/api/auth/refresh-token").authenticated()
                        .requestMatchers(HttpMethod.POST, "/api/users/avatar/**").authenticated()

                        // Admin endpoints - CHÚ Ý: các rule cụ thể phải đặt TRƯỚC các rule chung
                        .requestMatchers("/api/users/**").hasAnyAuthority("ADMIN", "1")
                        .requestMatchers("/api/dashboard/**").hasAnyAuthority("ADMIN", "1")
                        
                        // Staff endpoints (POST/PUT/DELETE books và orders)
                        .requestMatchers(HttpMethod.POST, "/api/books/**").hasAnyAuthority("ADMIN", "STAFF", "1", "2")
                        .requestMatchers(HttpMethod.PUT, "/api/books/**").hasAnyAuthority("ADMIN", "STAFF", "1", "2")
                        .requestMatchers(HttpMethod.DELETE, "/api/books/**").hasAnyAuthority("ADMIN", "STAFF", "1", "2")
                        .requestMatchers("/api/orders/**").hasAnyAuthority("ADMIN", "STAFF", "1", "2")
                        
                        // Warehouse endpoints
                        .requestMatchers("/api/entry-forms/**").hasAnyAuthority("ADMIN", "WARE_HOUSE_STAFF", "1", "4")

                        // Default: authenticated
                        .anyRequest().authenticated()
                )
                .exceptionHandling(exceptions -> exceptions
                        .accessDeniedHandler(accessDeniedHandler)
                        .authenticationEntryPoint(authenticationEntryPoint)
                )
                // TẮT oauth2ResourceServer vì đã dùng JwtCookieFilter
                // .oauth2ResourceServer(oauth -> oauth
                //         .jwt(jwt -> jwt
                //                 .jwkSetUri(COGNITO_JWKS_URL)
                //                 .jwtAuthenticationConverter(jwtAuthenticationConverter())
                //         )
                // )
                .formLogin(f -> f.disable());

        return http.build();
    }
}
