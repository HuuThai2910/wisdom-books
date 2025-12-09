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
import iuh.fit.edu.entity.Voucher;
import iuh.fit.edu.mapper.UserMapper;
import iuh.fit.edu.repository.RoleRepository;
import iuh.fit.edu.repository.UserRepository;
import iuh.fit.edu.repository.VoucherRepository;
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
    VoucherRepository voucherRepository;

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

        // Validate theo thứ tự hiển thị trong form: fullName -> email -> phone
        // Check cả 2 để có thể báo lỗi đầy đủ hơn
        
        boolean fullNameExists = userRepository.existsByFullName(request.getFullName());
        boolean emailExists = userRepository.existsByEmail(request.getEmail());
        
        // Nếu cả 2 đều trùng, ưu tiên báo fullName trước (theo thứ tự form)
        if (fullNameExists && emailExists) {
            throw new RuntimeException("BOTH_EXISTS: Tên người dùng và email đã được sử dụng");
        }
        
        // 1. Kiểm tra fullName đã tồn tại chưa (field đầu tiên trong form)
        // Cognito dùng fullName làm username nên phải unique
        if (fullNameExists) {
            throw new RuntimeException("FULLNAME_EXISTS: Tên người dùng này đã được sử dụng");
        }
        
        // 2. Kiểm tra email đã tồn tại chưa (field thứ hai trong form)
        if (emailExists) {
            throw new RuntimeException("EMAIL_EXISTS: Email này đã được đăng ký");
        }

        if(request.getPassword().equals(request.getConfirmPassword())){
            //save aws cognito
            request.setPhone(internationalPhone);
            String sub;
            try {
                sub = cognitoService.registerUser(request);
            } catch (Exception e) {
                // Parse Cognito exceptions để báo lỗi rõ ràng hơn
                String errorMsg = e.getMessage() != null ? e.getMessage().toLowerCase() : "";
                
                // Nếu Cognito báo email đã tồn tại
                if (errorMsg.contains("email") || errorMsg.contains("user already exists") || 
                    errorMsg.contains("usernameexistsexception") || errorMsg.contains("aliasexistsexception")) {
                    throw new RuntimeException("EMAIL_EXISTS: Email này đã được đăng ký");
                }
                
                // Nếu Cognito báo username đã tồn tại
                if (errorMsg.contains("username") || errorMsg.contains("user with username")) {
                    throw new RuntimeException("FULLNAME_EXISTS: Tên người dùng này đã được sử dụng");
                }
                
                // Rethrow exception gốc nếu không match
                throw e;
            }
            
            //save database
            User user=userMapper.toUserAccount(request);

            if (check){
                Role role=roleRepository.findById(3L).orElse(null);
                user.setPhone(phoneNumber);
                user.setCreatedBy("system");
                user.setRole(role);
                System.out.println(user);
                userRepository.save(user);
                System.out.println("user 1" + user);
                
                // Add user to CUSTOMER group in Cognito
                try {
                    cognitoService.addUserToGroup(request.getFullName(), "CUSTOMER");
                    System.out.println("[Register] Added new user to CUSTOMER group in Cognito");
                } catch (Exception e) {
                    System.err.println("[Register] Failed to add user to CUSTOMER group: " + e.getMessage());
                    // Continue anyway - user is created, just missing group
                }
                
                // Gán voucher id=1 cho CUSTOMER mới đăng ký
                try {
                    Voucher welcomeVoucher = voucherRepository.findById(1L).orElse(null);
                    if (welcomeVoucher != null) {
                        if (user.getVouchers() == null) {
                            user.setVouchers(new java.util.ArrayList<>());
                        }
                        user.getVouchers().add(welcomeVoucher);
                        userRepository.save(user);
                        System.out.println("[Register] Assigned welcome voucher (id=1) to new CUSTOMER");
                    } else {
                        System.err.println("[Register] Welcome voucher (id=1) not found");
                    }
                } catch (Exception e) {
                    System.err.println("[Register] Failed to assign welcome voucher: " + e.getMessage());
                    // Continue anyway - user is created, just missing voucher
                }
            }

            return userMapper.toRegisterResponse(user,sub);
        }else {
            throw new RuntimeException("Password and confirm password do not match");
        }
    }

    @Override
    public LoginResponse loginUser(LoginRequest request) {
        try {
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
        } catch (RuntimeException e) {
            if (e.getMessage() != null && e.getMessage().startsWith("ACCOUNT_DISABLED:")) {
                throw e; // Ném lại exception để controller xử lý
            }
            throw new RuntimeException("Login failed");
        }
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
            
            // AWS Cognito không luôn trả về refresh token mới khi refresh
            // Nếu không có refresh token mới, giữ lại refresh token cũ
            return LoginResponse.builder()
                    .token(newAccessToken)
                    .refreshToken(refreshToken) // Giữ lại refresh token cũ
                    .success(true)
                    .build();
        } catch (Exception e) {
            throw new RuntimeException("Failed to refresh token: " + e.getMessage());
        }
    }
    
    /**
     * Fix method để add user CUSTOMER vào Cognito group
     * Dùng cho các user đã tồn tại mà chưa có trong group
     */
    public void fixCustomerGroup(String username) {
        try {
            cognitoService.addUserToGroup(username, "CUSTOMER");
            System.out.println("[Fix] Successfully added " + username + " to CUSTOMER group");
        } catch (Exception e) {
            System.err.println("[Fix] Error adding user to group: " + e.getMessage());
            throw new RuntimeException("Failed to add user to CUSTOMER group: " + e.getMessage());
        }
    }
}
