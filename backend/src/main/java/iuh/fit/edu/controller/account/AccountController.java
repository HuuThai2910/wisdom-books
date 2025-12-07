package iuh.fit.edu.controller.account;

import iuh.fit.edu.dto.request.account.*;
import iuh.fit.edu.dto.response.account.*;
import iuh.fit.edu.service.AccountService;
import iuh.fit.edu.service.impl.AccountServiceImpl;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AccountController {
    @Autowired
    AccountService accountService;
    public static String email;

    @PostMapping("/register")
    public ResponseEntity<RegisterResponse> registerAccount(@Valid @RequestBody RegisterRequest request){
        RegisterResponse response = this.accountService.registerUser(request,true);
        System.out.println("Registration response: " + response);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> loginAccount(@Valid @RequestBody LoginRequest request, HttpServletResponse response){

        LoginResponse cognitoResponse = this.accountService.loginUser(request);
        String token=cognitoResponse.getToken();
        String refreshToken=cognitoResponse.getRefreshToken();
        
        // Set access token cookie (5 phút)
        String accessTokenCookie = String.format("id_token=%s; Path=/; Max-Age=%d; SameSite=Lax",
                token, 300);
        response.addHeader("Set-Cookie", accessTokenCookie);
        
        // Set refresh token cookie (30 ngày)
        String refreshTokenCookie = String.format("refresh_token=%s; Path=/; Max-Age=%d; SameSite=Lax",
                refreshToken, 30 * 24 * 3600);
        response.addHeader("Set-Cookie", refreshTokenCookie);
        
        UserInfoResponse userInfoResponse=accountService.getCurrentUserInfo(token);
        email= userInfoResponse.getEmail();
        
        System.out.println("[Login] Set cookies (access + refresh) for user: " + userInfoResponse.getEmail());
        return ResponseEntity.ok(cognitoResponse);
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<ForgotPasswordResponse> forgotPassword(@Valid @RequestBody ForgotPasswordRequest request){
        ForgotPasswordResponse response = accountService.forgotPassword(request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/verify-otp")
    public ResponseEntity<VerifyOtpResponse> verifyOtp(@RequestBody VerifyOtpRequest request){
        VerifyOtpResponse response = accountService.verifyOtp(request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/reset-password")
    public ResponseEntity<ResetPasswordResponse> resetPassword(@RequestBody ResetPasswordRequest request){
        ResetPasswordResponse response=accountService.resetPassword(request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/logout")
    public ResponseEntity<String> logoutAccount(
            @RequestHeader("Authorization") String token,
            @CookieValue(value = "refresh_token", required = false) String refreshToken){
        String accessToken = token.replace("Bearer ", "");
        accountService.logout(accessToken, refreshToken);
        return ResponseEntity.ok("Logged out successfully");
    }


    @GetMapping("/me")
    public ResponseEntity<UserInfoResponse> getCurrentUser(@RequestHeader("Authorization") String token){
        String accessToken = token.replace("Bearer ", "");
        UserInfoResponse response = accountService.getCurrentUserInfo(accessToken);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/users")
    public ResponseEntity<UsersResponse> getAllUser(Authentication authentication){
        Jwt jwt = (Jwt) authentication.getPrincipal();
        String email = jwt.getClaim("email");
        return ResponseEntity.ok(accountService.findByAllUser(email));
    }

    @PostMapping("/refresh-token")
    public ResponseEntity<LoginResponse> refreshToken(
            @CookieValue(value = "refresh_token", required = false) String refreshTokenCookie,
            @RequestBody(required = false) Map<String, String> request,
            HttpServletResponse response) {
        // Ưu tiên lấy từ cookie, fallback về request body
        String refreshToken = refreshTokenCookie != null ? refreshTokenCookie : 
                             (request != null ? request.get("refreshToken") : null);
        String username = request != null ? request.get("username") : null;
        
        if (refreshToken == null) {
            throw new RuntimeException("refreshToken is required (from cookie or body)");
        }
        if (username == null) {
            throw new RuntimeException("username is required");
        }
        
        LoginResponse loginResponse = ((AccountServiceImpl) accountService).refreshAccessToken(refreshToken, username);
        
        // Set new access token cookie (5 phút)
        String accessTokenCookie = String.format("id_token=%s; Path=/; Max-Age=%d; SameSite=Lax",
                loginResponse.getToken(), 300);
        response.addHeader("Set-Cookie", accessTokenCookie);
        
        // Set new refresh token cookie nếu có (30 ngày)
        if (loginResponse.getRefreshToken() != null) {
            String newRefreshCookie = String.format("refresh_token=%s; Path=/; Max-Age=%d; SameSite=Lax",
                    loginResponse.getRefreshToken(), 30 * 24 * 3600);
            response.addHeader("Set-Cookie", newRefreshCookie);
        }
        
        System.out.println("[RefreshToken] New tokens set in cookies for user: " + username);
        
        return ResponseEntity.ok(loginResponse);
    }

    @GetMapping("/api/test/roles")
    public String testRoles(Authentication authentication) {
        authentication.getAuthorities()
                .forEach(a -> System.out.println(a.getAuthority()));
        return "Check console logs";
    }


}
