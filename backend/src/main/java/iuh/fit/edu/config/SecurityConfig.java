/*
 * @ (#) .java    1.0
 * Copyright (c)  IUH. All rights reserved.
 */
package iuh.fit.edu.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.web.SecurityFilterChain;

/*
 * @description
 * @author: Huu Thai
 * @date:
 * @version: 1.0
 */
@Configuration
public class SecurityConfig {
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

          final String COGNITO_JWKS_URL =
                "https://cognito-idp.ap-southeast-1.amazonaws.com/ap-southeast-1_rnIXnN2rr/.well-known/jwks.json";
        http
                .csrf(AbstractHttpConfigurer::disable) // tắt CSRF cho API REST
                .cors(Customizer.withDefaults()) // ✅ dùng Customizer thay vì .cors()
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(HttpMethod.POST,"/api/auth/register").permitAll()
                        .requestMatchers(HttpMethod.POST,"/api/auth/login").permitAll()
                        .requestMatchers(HttpMethod.POST,"/api/auth/forgot-password").permitAll()
                        .requestMatchers(HttpMethod.POST,"/api/auth/verify-otp").permitAll()
                        .requestMatchers(HttpMethod.POST,"/api/auth/reset-password").permitAll()
                        .requestMatchers(HttpMethod.POST,"/api/auth/oauth2/login").permitAll()
                        .requestMatchers(HttpMethod.GET,"/api/users").permitAll()
                        .requestMatchers(HttpMethod.POST,"/api/users").permitAll()
                        .requestMatchers(HttpMethod.PUT,"/api/users/**").permitAll()
                        .requestMatchers(HttpMethod.DELETE,"/api/users/delete/**").permitAll()
                        .requestMatchers(HttpMethod.GET,"/api/users/**").permitAll()
                        .requestMatchers("/api/**").permitAll()

                        // Protected endpoints - cần authentication
                        .requestMatchers(HttpMethod.POST,"/api/auth/logout").authenticated()
                        .requestMatchers(HttpMethod.GET,"/api/auth/me").authenticated()
                        .requestMatchers(HttpMethod.GET,"/api/auth/users").authenticated()
                        // All other endpoints require authentication
                        .anyRequest().authenticated()
                )
                .oauth2ResourceServer(oauth -> oauth
                        .jwt(jwt -> jwt
                                .jwkSetUri(COGNITO_JWKS_URL)
                        )
                );


        return http.build();
    }
}
