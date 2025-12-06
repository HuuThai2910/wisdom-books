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
        int maxAge = 3600 * 24; // 24 giờ
        
        // Bỏ HttpOnly để frontend có thể debug được cookie
        // SameSite=Lax cho localhost development
        String setCookie = String.format("id_token=%s; Path=/; Max-Age=%d; SameSite=Lax",
                token, maxAge);
        response.addHeader("Set-Cookie", setCookie);
        
        UserInfoResponse userInfoResponse=accountService.getCurrentUserInfo(token);
        email= userInfoResponse.getEmail();
        
        System.out.println("[Login] Set cookie id_token for user: " + userInfoResponse.getEmail());
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
    public ResponseEntity<String> logoutAccount(@RequestHeader("Authorization") String token){
        String accessToken = token.replace("Bearer ", "");
        accountService.logout(accessToken);
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
            @RequestBody Map<String, String> request,
            HttpServletResponse response) {
        String refreshToken = request.get("refreshToken");
        String username = request.get("username");
        
        if (refreshToken == null || username == null) {
            throw new RuntimeException("refreshToken and username are required");
        }
        
        LoginResponse loginResponse = ((AccountServiceImpl) accountService).refreshAccessToken(refreshToken, username);
        
        // Set cookie với new access token
        Cookie cookie = new Cookie("id_token", loginResponse.getToken());
        cookie.setPath("/");
        cookie.setMaxAge(300); // 5 phút
        cookie.setHttpOnly(false); // Để debug, production nên = true
        cookie.setAttribute("SameSite", "Lax");
        response.addCookie(cookie);
        
        System.out.println("[RefreshToken] New access token set in cookie for user: " + username);
        
        return ResponseEntity.ok(loginResponse);
    }

    @GetMapping("/api/test/roles")
    public String testRoles(Authentication authentication) {
        authentication.getAuthorities()
                .forEach(a -> System.out.println(a.getAuthority()));
        return "Check console logs";
    }


}
