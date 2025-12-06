/*
 * @ (#) .java    1.0
 * Copyright (c)  IUH. All rights reserved.
 */
package iuh.fit.edu.service.impl;

import com.amazonaws.services.cognitoidp.model.AttributeType;
import com.amazonaws.services.cognitoidp.model.CodeMismatchException;
import com.amazonaws.services.cognitoidp.model.ExpiredCodeException;
import com.amazonaws.services.cognitoidp.model.GetUserResult;
import iuh.fit.edu.dto.request.account.*;
import iuh.fit.edu.dto.response.account.*;
import iuh.fit.edu.entity.Role;
import iuh.fit.edu.entity.User;
import iuh.fit.edu.mapper.UserMapper;
import iuh.fit.edu.repository.RoleRepository;
import iuh.fit.edu.repository.UserRepository;
import iuh.fit.edu.service.AccountService;
import iuh.fit.edu.service.CognitoService;
import iuh.fit.edu.service.TokenBlacklistService;
import iuh.fit.edu.service.TokenService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

/*
 * @description
 * @author: Huu Thai
 * @date:
 * @version: 1.0
 */
@Service
public class AccountServiceImpl implements AccountService {
    @Autowired
    UserRepository userRepository;
    @Autowired
    UserMapper userMapper;

    @Autowired
    RoleRepository roleRepository;

    @Autowired
    CognitoService cognitoService;

    @Autowired
    TokenService tokenService;

    @Autowired
    TokenBlacklistService tokenBlacklistService;


    @Override
    public RegisterResponse registerUser(RegisterRequest request,boolean check) {
        String rawPhone = request.getPhone();
        String phoneNumber = request.getPhone();  // giữ nguyên cho DB
        String internationalPhone = "+84" + rawPhone.substring(1); // dùng cho AWS

        if(request.getPassword().equals(request.getConfirmPassword())){
            //save aws cognito
            request.setPhone(internationalPhone);
            String sub=cognitoService.registerUser(request);
            //save database
            User user=userMapper.toUserAccount(request);

            if (check){
                Role role=roleRepository.findById(3L).orElse(null);
                user.setPhone(phoneNumber);
                user.setCreatedBy("system");
                user.setRole(role);
                userRepository.save(user);
            }

            return userMapper.toRegisterResponse(user,sub);
        }else {
            throw new RuntimeException("Password and confirm password do not match");
        }
    }

    @Override
    public LoginResponse loginUser(LoginRequest request) {
        CognitoTokens tokens = cognitoService.loginUser(request);
        if (tokens != null && tokens.getAccessToken() != null) {
            // Lấy thông tin user để lưu token record
            GetUserResult userResult = cognitoService.getUserInfo(tokens.getAccessToken());
            String email = userResult.getUserAttributes().stream()
                    .filter(attr -> "email".equals(attr.getName()))
                    .findFirst()
                    .map(AttributeType::getValue)
                    .orElse(null);
            
            if (email != null) {
                User user = userRepository.findByEmail(email);
                if (user != null) {
                    // Lưu access token record (5 phút)
                    tokenService.saveTokenRecord(user, iuh.fit.edu.entity.constant.TokenType.ACCESS_TOKEN, 5);
                    // Lưu refresh token record (30 ngày)
                    tokenService.saveTokenRecord(user, iuh.fit.edu.entity.constant.TokenType.REFRESH_TOKEN, 30 * 24 * 60);
                }
            }
            
            return LoginResponse.builder()
                    .token(tokens.getAccessToken())
                    .refreshToken(tokens.getRefreshToken())
                    .expiresIn(tokens.getExpiresIn())
                    .success(true)
                    .build();
        }
        throw new RuntimeException("Login failed");
    }

    @Override
    public void logout(String accessToken, String refreshToken) {
        // Blacklist access token ngay lập tức
        try {
            tokenBlacklistService.blacklistToken(accessToken, "User logout - access token");
            System.out.println("[Logout] Access token blacklisted successfully");
        } catch (Exception e) {
            System.err.println("[Logout] Error blacklisting access token: " + e.getMessage());
        }
        
        // Blacklist refresh token nếu có
        if (refreshToken != null && !refreshToken.isEmpty()) {
            try {
                tokenBlacklistService.blacklistToken(refreshToken, "User logout - refresh token");
                System.out.println("[Logout] Refresh token blacklisted successfully");
            } catch (Exception e) {
                System.err.println("[Logout] Error blacklisting refresh token: " + e.getMessage());
            }
        }
        
        // Lấy thông tin user từ token
        try {
            GetUserResult userResult = cognitoService.getUserInfo(accessToken);
            String email = userResult.getUserAttributes().stream()
                    .filter(attr -> "email".equals(attr.getName()))
                    .findFirst()
                    .map(AttributeType::getValue)
                    .orElse(null);
            
            if (email != null) {
                User user = userRepository.findByEmail(email);
                if (user != null) {
                    // Revoke tất cả tokens của user
                    tokenService.revokeAllUserTokens(user);
                }
            }
        } catch (Exception e) {
            // Log error but continue with Cognito logout
        }
        
        // Logout khỏi Cognito
        cognitoService.logout(accessToken);
    }

    @Override
    public ForgotPasswordResponse forgotPassword(ForgotPasswordRequest request) {
        cognitoService.forgotPassword(request);
        return ForgotPasswordResponse.builder()
                .message("success")
                .success(true)
                .build();
    }

    @Override
    public VerifyOtpResponse verifyOtp(VerifyOtpRequest request) {
        try {
            // Tạo request với mật khẩu tạm để verify OTP
            ResetPasswordRequest verifyRequest = new ResetPasswordRequest();
            verifyRequest.setEmail(request.getEmail());
            verifyRequest.setOtp(request.getOtp());
            // Mật khẩu tạm - sẽ không thực sự đổi vì chỉ để verify
            String tempPassword = "TempVerify@123456";
            verifyRequest.setNewPassword(tempPassword);
            verifyRequest.setConfirmPassword(tempPassword);

            cognitoService.resetPassword(verifyRequest);
            
            return VerifyOtpResponse.builder()
                    .success(true)
                    .message("OTP hợp lệ")
                    .build();
        } catch (CodeMismatchException e) {
            return VerifyOtpResponse.builder()
                    .success(false)
                    .message("OTP không đúng")
                    .build();
        } catch (ExpiredCodeException e) {
            return VerifyOtpResponse.builder()
                    .success(false)
                    .message("OTP đã hết hạn")
                    .build();
        } catch (Exception e) {
            return VerifyOtpResponse.builder()
                    .success(false)
                    .message("Lỗi: " + e.getMessage())
                    .build();
        }
    }

    @Override
    public ResetPasswordResponse resetPassword(ResetPasswordRequest request) {
        try {

            ResetPasswordRequest verifyRequest = new ResetPasswordRequest();
            verifyRequest.setEmail(request.getEmail());
            verifyRequest.setOtp(request.getOtp());

            cognitoService.resetPassword(request);
            return ResetPasswordResponse.builder()
                    .success(true)
                    .message("Đặt lại mật khẩu thành công")
                    .build();
        } catch (CodeMismatchException e) {
            return ResetPasswordResponse.builder()
                    .success(false)
                    .message("OTP không đúng")
                    .build();
        } catch (ExpiredCodeException e) {
            return ResetPasswordResponse.builder()
                    .success(false)
                    .message("OTP đã hết hạn")
                    .build();
        } catch (Exception e) {
            return ResetPasswordResponse.builder()
                    .success(false)
                    .message("Lỗi: " + e.getMessage())
                    .build();
        }
    }

    @Override
    public UserInfoResponse getCurrentUserInfo(String accessToken) {
        GetUserResult result=cognitoService.getUserInfo(accessToken);
        String email=result.getUserAttributes().stream().filter(attr -> "email".equals(attr.getName()))
                .findFirst().map(AttributeType::getValue)
                .orElse(null);

        User user=userRepository.findByEmail(email);
        return UserInfoResponse.builder()
                .id(user.getId())
                .avatar(user.getAvatar())
                .phone(user.getPhone())
                .email(user.getEmail())
                .fullName(user.getFullName())
                .address(user.getAddress())
                .gender(user.getGender())
                .role(user.getRole() != null ? user.getRole().getId() : null)
                .userStatus(user.getStatus())
                .build();
    }

    @Override
    public UsersResponse findByAllUser(String email) {
        List<User> users=userRepository.findAll();
        return UsersResponse.builder()
                .users(users)
                .email(email)
                .build();
    }

    @Override
    public LoginResponse refreshAccessToken(String refreshToken) {
        try {
            // Decode refresh token để lấy username (từ cookie hoặc request body cần gửi kèm)
            // Vì refresh token không thể decode như access token, cần lấy username từ request
            // Hoặc lưu mapping refreshToken -> username trong DB
            
            // Tạm thời throw exception để yêu cầu username từ client
            throw new RuntimeException("Username required for refresh token. Please update API call to include username.");
            
        } catch (Exception e) {
            System.err.println("[RefreshToken] Error: " + e.getMessage());
            throw new RuntimeException("Failed to refresh access token: " + e.getMessage());
        }
    }
    
    // Overload method với username parameter
    public LoginResponse refreshAccessToken(String refreshToken, String username) {
        try {
            // Call Cognito để refresh token
            String newAccessToken = cognitoService.refreshToken(refreshToken, username);
            
            // Lấy user info từ email/username
            User user = userRepository.findByEmail(username);
            if (user == null) {
                // Try tìm theo fullName nếu không phải email
                user = userRepository.findAll().stream()
                        .filter(u -> u.getFullName().equals(username))
                        .findFirst()
                        .orElseThrow(() -> new RuntimeException("User not found"));
            }
            
            // Lưu access token record mới (5 phút)
            tokenService.saveTokenRecord(user, iuh.fit.edu.entity.constant.TokenType.ACCESS_TOKEN, 5);
            
            return LoginResponse.builder()
                    .token(newAccessToken)
                    .success(true)
                    .build();
        } catch (Exception e) {
            throw new RuntimeException("Failed to refresh token: " + e.getMessage());
        }
    }
}
