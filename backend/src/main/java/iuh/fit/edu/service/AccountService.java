/*
 * @ (#) .java    1.0
 * Copyright (c)  IUH. All rights reserved.
 */
package iuh.fit.edu.service;/*
 * @description
 * @author: Huu Thai
 * @date:
 * @version: 1.0
 */


import iuh.fit.edu.dto.request.account.*;
import iuh.fit.edu.dto.response.account.*;
import iuh.fit.edu.entity.User;


public interface AccountService {
    RegisterResponse registerUser(RegisterRequest request,boolean check);
    LoginResponse loginUser(LoginRequest request);
    void logout(String accessToken);
    ForgotPasswordResponse forgotPassword(ForgotPasswordRequest request);
    VerifyOtpResponse verifyOtp(VerifyOtpRequest request);
    ResetPasswordResponse resetPassword(ResetPasswordRequest request);
    UserInfoResponse getCurrentUserInfo(String accessToken);
    UsersResponse findByAllUser(String email);
}
