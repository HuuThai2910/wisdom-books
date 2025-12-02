package iuh.fit.edu.service.impl;

import com.amazonaws.services.cognitoidp.AWSCognitoIdentityProvider;
import com.amazonaws.services.cognitoidp.model.*;
import iuh.fit.edu.dto.request.account.ForgotPasswordRequest;
import iuh.fit.edu.dto.request.account.LoginRequest;
import iuh.fit.edu.dto.request.account.RegisterRequest;
import iuh.fit.edu.dto.request.account.ResetPasswordRequest;
import iuh.fit.edu.service.CognitoService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.util.Base64;
import java.util.HashMap;
import java.util.Map;

@Service
public class CognitoServiceImpl implements CognitoService {
    @Value("${cognito.user-pool-id}")
    private String userPoolId;
    @Value("${cognito.client-id}")
    private String clientId;
    @Value("${cognito.client-secret}")
    private String clientSecret;

    private final AWSCognitoIdentityProvider  cognitoIdentityProvider;

    @Autowired
    public CognitoServiceImpl(AWSCognitoIdentityProvider cognitoIdentityProvider) {
        this.cognitoIdentityProvider = cognitoIdentityProvider;
    }

    @Override
    public String registerUser(RegisterRequest request) {
        AdminCreateUserRequest createUser=new AdminCreateUserRequest()
                .withUserPoolId(userPoolId)
                .withUsername(request.getFullName())
                .withUserAttributes(
                        new AttributeType().withName("email").withValue(request.getEmail()),
                        new AttributeType().withName("email_verified").withValue("true"),
                        new AttributeType().withName("phone_number").withValue(request.getPhone()),
                        new AttributeType().withName("name").withValue(request.getFullName())
                ).withMessageAction("SUPPRESS");

        AdminCreateUserResult result= cognitoIdentityProvider.adminCreateUser(createUser);

        AdminSetUserPasswordRequest passwordRequest=new AdminSetUserPasswordRequest()
                .withUserPoolId(userPoolId)
                        .withUsername(request.getFullName())
                                .withPassword(request.getPassword()).withPermanent(true);

        cognitoIdentityProvider.adminSetUserPassword(passwordRequest);
        return result.getUser().getAttributes().stream()
                .filter(x-> "sub".equals(x.getName()))
                .findFirst().map(AttributeType::getValue)
                .orElse(null);
    }

    @Override
    public String loginUser(LoginRequest request) {
        authParams.put("USERNAME",request.getFullName());
        authParams.put("PASSWORD",request.getPassword());
        authParams.put("SECRET_HASH", calculateSecretHash(request.getFullName(), clientId, clientSecret));

        AdminInitiateAuthRequest authRequest=new AdminInitiateAuthRequest()
                .withUserPoolId(userPoolId)
                .withClientId(clientId)
                .withAuthFlow(AuthFlowType.ADMIN_NO_SRP_AUTH)
                .withAuthParameters(authParams);

        AdminInitiateAuthResult result=cognitoIdentityProvider.adminInitiateAuth(authRequest);

        Map<String,String> tokens=new HashMap<>();
        tokens.put("idToken",result.getAuthenticationResult().getIdToken());
        tokens.put("accessToken",result.getAuthenticationResult().getAccessToken());
        return tokens.get("accessToken");
    }

    @Override
    public void logout(String accessToken) {
        GlobalSignOutRequest request=new GlobalSignOutRequest()
                .withAccessToken(accessToken);
        cognitoIdentityProvider.globalSignOut(request);
    }

    @Override
    public void forgotPassword(ForgotPasswordRequest request) {
        com.amazonaws.services.cognitoidp.model.ForgotPasswordRequest forgetRequest=
                new com.amazonaws.services.cognitoidp.model.ForgotPasswordRequest()
                        .withClientId(clientId)
                        .withUsername(request.getEmail())
                                .withSecretHash(calculateSecretHash(request.getEmail(),clientId,clientSecret));
        cognitoIdentityProvider.forgotPassword(forgetRequest);
    }

    @Override
    public void resetPassword(ResetPasswordRequest request) {
            if(request.getConfirmPassword().equals(request.getNewPassword())){
                ConfirmForgotPasswordRequest confirm=new ConfirmForgotPasswordRequest()
                        .withClientId(clientId)
                        .withUsername(request.getEmail())
                        .withConfirmationCode(request.getOtp())
                        .withPassword(request.getNewPassword())
                        .withSecretHash(calculateSecretHash(request.getEmail(),clientId,clientSecret));
                cognitoIdentityProvider.confirmForgotPassword(confirm);
            }
    }

    @Override
    public GetUserResult getUserInfo(String accessToken) {
        GetUserRequest userRequest=new GetUserRequest()
                .withAccessToken(accessToken);
        return cognitoIdentityProvider.getUser(userRequest);
    }

    @Override
    public void disableUser(String fullName) {
        AdminDisableUserRequest request=new AdminDisableUserRequest()
                .withUsername(fullName)
                .withUserPoolId(userPoolId);
        cognitoIdentityProvider.adminDisableUser(request);
    }


    public String calculateSecretHash(String username, String clientId, String clientSecret) {
        try {
            String message = username + clientId;
            Mac mac = Mac.getInstance("HmacSHA256");
            mac.init(new SecretKeySpec(clientSecret.getBytes("UTF-8"), "HmacSHA256"));
            byte[] rawHmac = mac.doFinal(message.getBytes("UTF-8"));
            return Base64.getEncoder().encodeToString(rawHmac);
        } catch (Exception e) {
            throw new RuntimeException("Error while calculating SECRET_HASH", e);
        }
    }
}
