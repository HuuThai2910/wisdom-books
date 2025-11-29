/*
 * @ (#) .java    1.0       
 * Copyright (c)  IUH. All rights reserved.
 */
package iuh.fit.edu.controller.client;

import iuh.fit.edu.dto.response.UserCheckoutReponse;
import iuh.fit.edu.dto.response.voucher.VoucherResponse;
import iuh.fit.edu.service.VoucherService;
import iuh.fit.edu.util.anotation.ApiMessage;
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
    public ResponseEntity<List<VoucherResponse>> getListVoucherByUser(){
        return ResponseEntity.ok(this.voucherService.getListVoucherByUser("admin@bookstore.com"));
    }

    @GetMapping("/user/me")
    public ResponseEntity<UserCheckoutReponse> getUserToCheckOut(){
        return ResponseEntity.ok(this.voucherService.getUserToCheckOut("admin@bookstore.com"));
    }

    /**
     * Xóa voucher khỏi user hiện tại
     * DELETE /api/vouchers/{voucherId}/me
     */
    @DeleteMapping("/{voucherId}/me")
    @ApiMessage("Voucher removed from your account successfully")
    public ResponseEntity<Void> removeVoucherFromUser(@PathVariable Long voucherId){
        this.voucherService.removeVoucherFromUser("admin@bookstore.com", voucherId);
        return ResponseEntity.ok(null);
    }
}
