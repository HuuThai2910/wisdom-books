package iuh.fit.edu.service;

import com.amazonaws.services.cognitoidp.model.GetUserResult;
import iuh.fit.edu.dto.request.account.ForgotPasswordRequest;
import iuh.fit.edu.dto.request.account.LoginRequest;
import iuh.fit.edu.dto.request.account.RegisterRequest;
import iuh.fit.edu.dto.request.account.ResetPasswordRequest;
import iuh.fit.edu.dto.response.account.CognitoTokens;

public interface CognitoService {
    String registerUser(RegisterRequest request);
    CognitoTokens loginUser(LoginRequest request);
    void logout(String accessToken);
    void forgotPassword(ForgotPasswordRequest request);
    void resetPassword(ResetPasswordRequest request);
    GetUserResult getUserInfo(String accessToken);
    void disableUser(String fullName);
    void enableUser(String fullName);
    
    // Refresh token
    String refreshToken(String refreshToken, String username);
    
    // Quản lý Cognito Groups (Roles)
    void updateUserRole(String username, String newRole);
    void addUserToGroup(String username, String groupName);
    void removeUserFromGroup(String username, String groupName);
}
