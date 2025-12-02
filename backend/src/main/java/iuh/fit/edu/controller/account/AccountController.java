package iuh.fit.edu.controller.account;

import iuh.fit.edu.dto.request.account.*;
import iuh.fit.edu.dto.response.account.*;
import iuh.fit.edu.service.AccountService;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

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
        int maxAge = 3600;
        Cookie cookie = new Cookie("id_token", token);
        cookie.setHttpOnly(true);       // Không thể đọc bằng JS
        cookie.setSecure(true);         // Chỉ gửi qua HTTPS
        cookie.setPath("/");            // gửi cho toàn bộ domain
        cookie.setMaxAge(maxAge);       // thời gian sống cookie
        response.addCookie(cookie);
        UserInfoResponse userInfoResponse=accountService.getCurrentUserInfo(token);
        email= userInfoResponse.getEmail();
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
    public ResponseEntity<LoginResponse> refreshToken(@RequestHeader("Authorization") String token){
        String refreshToken = token.replace("Bearer ", "");
        LoginResponse response = accountService.refreshAccessToken(refreshToken);
        return ResponseEntity.ok(response);
    }

}
