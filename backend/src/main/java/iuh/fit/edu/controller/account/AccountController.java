package iuh.fit.edu.controller.account;

import iuh.fit.edu.dto.request.account.*;
import iuh.fit.edu.dto.response.account.*;
import iuh.fit.edu.service.AccountService;
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

    @PostMapping("/register")
    public ResponseEntity<RegisterResponse> registerAccount(@Valid @RequestBody RegisterRequest request){
        RegisterResponse response = this.accountService.registerUser(request);
        System.out.println("Registration response: " + response);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> loginAccount(@Valid @RequestBody LoginRequest request){
        LoginResponse response = this.accountService.loginUser(request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<ForgotPasswordResponse> forgotPassword(@Valid @RequestBody ForgotPasswordRequest request){
        ForgotPasswordResponse response = accountService.forgotPassword(request);
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

}
