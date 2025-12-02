package iuh.fit.edu.util;

import iuh.fit.edu.dto.response.account.UserInfoResponse;
import iuh.fit.edu.service.AccountService;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class GetTokenRequest {

     private static AccountService accountService;

     @Autowired
    public GetTokenRequest(AccountService accountService) {
        GetTokenRequest.accountService = accountService;
    }

    public static UserInfoResponse getInfoUser(HttpServletRequest request){
        String token = null;
        if (request.getCookies() != null) {
            for (Cookie c : request.getCookies()) {
                if ("id_token".equals(c.getName())) {
                    token = c.getValue();
                    break;
                }
            }
        }

        return accountService.getCurrentUserInfo(token);
    }
}
