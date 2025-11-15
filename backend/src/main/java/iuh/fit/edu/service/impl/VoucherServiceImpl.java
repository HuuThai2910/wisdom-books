/*
 * @ (#) .java    1.0       
 * Copyright (c)  IUH. All rights reserved.
 */
package iuh.fit.edu.service.impl;

import iuh.fit.edu.dto.response.UserCheckoutReponse;
import iuh.fit.edu.dto.response.voucher.VoucherResponse;
import iuh.fit.edu.mapper.UserMapper;
import iuh.fit.edu.mapper.VoucherMapper;
import iuh.fit.edu.repository.UserRepository;
import iuh.fit.edu.repository.VoucherRepository;
import org.springframework.stereotype.Service;

import java.util.List;

/*
 * @description
 * @author: Huu Thai
 * @date:   
 * @version: 1.0
 */
@Service
public class VoucherServiceImpl implements iuh.fit.edu.service.VoucherService {
    private final VoucherRepository voucherRepository;
    private final UserRepository userRepository;
    private final VoucherMapper voucherMapper;
    private final UserMapper userMapper;

    public VoucherServiceImpl(VoucherRepository voucherRepository, UserRepository userRepository, VoucherMapper voucherMapper, UserMapper userMapper) {
        this.voucherRepository = voucherRepository;
        this.userRepository = userRepository;
        this.voucherMapper = voucherMapper;
        this.userMapper = userMapper;
    }

    @Override
    public List<VoucherResponse> getListVoucherByUser(String email){
        return voucherMapper.toVoucherResponse(this.voucherRepository.findByUsersEmail(email));
    }

    @Override
    public UserCheckoutReponse getUserToCheckOut(String email){
        return userMapper.toUserCheckoutReponse(this.userRepository.findByEmail(email));
    }
}
