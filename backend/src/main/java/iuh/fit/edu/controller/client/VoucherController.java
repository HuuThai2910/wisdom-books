/*
 * @ (#) .java    1.0       
 * Copyright (c)  IUH. All rights reserved.
 */
package iuh.fit.edu.controller.client;

import iuh.fit.edu.dto.response.UserCheckoutReponse;
import iuh.fit.edu.dto.response.account.UserInfoResponse;
import iuh.fit.edu.dto.response.voucher.VoucherResponse;
import iuh.fit.edu.service.VoucherService;
import iuh.fit.edu.util.GetTokenRequest;
import iuh.fit.edu.util.anotation.ApiMessage;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/*
 * @description
 * @author: Huu Thai
 * @date:   
 * @version: 1.0
 */
@RestController
@RequestMapping("/api/vouchers")
public class VoucherController {
    private final VoucherService voucherService;

    public VoucherController(VoucherService voucherService) {
        this.voucherService = voucherService;
    }

    @GetMapping("/user")
    public ResponseEntity<List<VoucherResponse>> getListVoucherByUser(HttpServletRequest request){
        UserInfoResponse user = GetTokenRequest.getInfoUser(request);
        return ResponseEntity.ok(this.voucherService.getListVoucherByUser(user.getEmail()));
    }

    @GetMapping("/user/me")
    public ResponseEntity<UserCheckoutReponse> getUserToCheckOut(HttpServletRequest request){
        UserInfoResponse user = GetTokenRequest.getInfoUser(request);
        return ResponseEntity.ok(this.voucherService.getUserToCheckOut(user.getEmail()));
    }

    /**
     * Xóa voucher khỏi user hiện tại
     * DELETE /api/vouchers/{voucherId}/me
     */
    @DeleteMapping("/{voucherId}/me")
    @ApiMessage("Voucher removed from your account successfully")
    public ResponseEntity<Void> removeVoucherFromUser(@PathVariable Long voucherId, HttpServletRequest request){
        UserInfoResponse user = GetTokenRequest.getInfoUser(request);
        this.voucherService.removeVoucherFromUser(user.getEmail(), voucherId);
        return ResponseEntity.ok(null);
    }
}
