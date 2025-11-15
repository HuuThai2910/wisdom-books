/*
 * @ (#) .java    1.0       
 * Copyright (c)  IUH. All rights reserved.
 */
package iuh.fit.edu.mapper;

import iuh.fit.edu.dto.response.voucher.VoucherResponse;
import iuh.fit.edu.entity.Voucher;
import org.mapstruct.Mapper;

import java.util.List;

/*
 * @description
 * @author: Huu Thai
 * @date:   
 * @version: 1.0
 */
@Mapper(componentModel = "spring")
public interface VoucherMapper {
    List<VoucherResponse> toVoucherResponse(List<Voucher> voucher);
}
