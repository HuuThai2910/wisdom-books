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
        String token= cognitoService.loginUser(request);
        if (token!=null){
            return LoginResponse.builder()
                    .token(token)
                    .success(true)
                    .build();
        }
        throw new RuntimeException("Login failed");
    }

    @Override
    public void logout(String accessToken) {
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
                .avatar(user.getAvatar())
                .phone(user.getPhone())
                .email(user.getEmail())
                .fullName(user.getFullName())
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
}
