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

import iuh.fit.edu.dto.response.UserCheckoutReponse;
import iuh.fit.edu.dto.response.voucher.VoucherResponse;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

public interface VoucherService {
    List<VoucherResponse> getListVoucherByUser(String email);

    UserCheckoutReponse getUserToCheckOut(String email);

    @Transactional
    void removeVoucherFromUser(String email, Long voucherId);
}
