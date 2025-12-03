/*
 * @ (#) .java    1.0       
 * Copyright (c)  IUH. All rights reserved.
 */
package iuh.fit.edu.service.impl;

import iuh.fit.edu.config.VNPayConfig;
import iuh.fit.edu.entity.Order;
import iuh.fit.edu.entity.constant.OrderStatus;
import iuh.fit.edu.entity.constant.PaymentMethod;
import iuh.fit.edu.entity.constant.PaymentStatus;
import iuh.fit.edu.repository.OrderRepository;
import iuh.fit.edu.service.PaymentService;
import iuh.fit.edu.util.VNPayUtil;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.text.SimpleDateFormat;
import java.time.LocalDateTime;
import java.util.*;/*
 * @description
 * @author: Huu Thai
 * @date:   
 * @version: 1.0
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class PaymentServiceImpl implements PaymentService {

    private final VNPayConfig vnPayConfig;


    @Override
    public String createVNPayUrl(Order order, HttpServletRequest request) {

        // Generate transaction reference
        String txnRef = order.getOrderCode() + "_" + System.currentTimeMillis();
        // Calculate amount (VNPay requires amount in VND * 100)
        long amount = (long) (order.getTotalPrice() * 100);



        // Build VNPay parameters - EXACTLY as per VNPay specification
        Map<String, String> vnpParams = new TreeMap<>(); // TreeMap tự động sort
        vnpParams.put("vnp_Version", vnPayConfig.getVersion());
        vnpParams.put("vnp_Command", vnPayConfig.getCommand());
        vnpParams.put("vnp_TmnCode", vnPayConfig.getTmnCode());
        vnpParams.put("vnp_Amount", String.valueOf(amount));
        vnpParams.put("vnp_CurrCode", "VND");
        vnpParams.put("vnp_TxnRef", txnRef);
        vnpParams.put("vnp_OrderInfo", "Thanh toan don hang " + order.getOrderCode());
        vnpParams.put("vnp_OrderType", vnPayConfig.getOrderType());
        vnpParams.put("vnp_Locale", "vn");
        vnpParams.put("vnp_ReturnUrl", vnPayConfig.getReturnUrl());
        vnpParams.put("vnp_IpAddr", VNPayUtil.getIpAddress(request));

        // Date time
//        Calendar cld = Calendar.getInstance(TimeZone.getTimeZone("Etc/GMT+7"));
//        SimpleDateFormat formatter = new SimpleDateFormat("yyyyMMddHHmmss");
//        String vnpCreateDate = formatter.format(cld.getTime());
        Calendar cld = Calendar.getInstance(TimeZone.getTimeZone("Asia/Ho_Chi_Minh"));
        SimpleDateFormat formatter = new SimpleDateFormat("yyyyMMddHHmmss");
        formatter.setTimeZone(TimeZone.getTimeZone("Asia/Ho_Chi_Minh"));
        String vnpCreateDate = formatter.format(cld.getTime());
        vnpParams.put("vnp_CreateDate", vnpCreateDate);
        vnpParams.put("vnp_CreateDate", vnpCreateDate);
        System.out.println("vnp_IpAddr=" + VNPayUtil.getIpAddress(request));
        System.out.println("vnp_CreateDate=" + vnpCreateDate);
        System.out.println("Payment URL = " + vnPayConfig.getReturnUrl());


        cld.add(Calendar.MINUTE, 10);
        String vnpExpireDate = formatter.format(cld.getTime());
        vnpParams.put("vnp_ExpireDate", vnpExpireDate);

        // Build hash data and query string (TreeMap already sorted)
        List<String> fieldNames = new ArrayList<>(vnpParams.keySet());
        Collections.sort(fieldNames);
        StringBuilder hashData = new StringBuilder();
        StringBuilder query = new StringBuilder();
        Iterator<String> itr = fieldNames.iterator();
        while (itr.hasNext()) {
            String fieldName = itr.next();
            String fieldValue = vnpParams.get(fieldName);
            if (fieldValue != null && !fieldValue.isEmpty()) {
                // Build hash data: encode value per VNPay spec
                hashData.append(fieldName).append('=')
                        .append(URLEncoder.encode(fieldValue, StandardCharsets.US_ASCII));

                // Build query string (WITH URL encoding)
                query.append(URLEncoder.encode(fieldName, StandardCharsets.US_ASCII)).append('=')
                        .append(URLEncoder.encode(fieldValue, StandardCharsets.US_ASCII));

                if (itr.hasNext()) {
                    hashData.append('&');
                    query.append('&');
                }
            }
        }
        // Generate secure hash from encoded data
        String vnpSecureHash = VNPayUtil.hmacSHA512(vnPayConfig.getHashSecret(), hashData.toString());
        // Build final payment URL - Hash is NOT URL encoded when added to URL
        String paymentUrl = vnPayConfig.getPayUrl() + "?" + query + "&vnp_SecureHash=" + vnpSecureHash;
        return paymentUrl;
    }


    @Override
    public boolean validateCallBack(Map<String, String> params) {

        // Get secure hash from params
        String vnpSecureHash = params.get("vnp_SecureHash");

        // Remove hash params
        params.remove("vnp_SecureHash");
        params.remove("vnp_SecureHashType");

        // Calculate hash
        String signValue = VNPayUtil.hashAllFields(params, vnPayConfig.getHashSecret());

        // Verify signature
        return signValue.equals(vnpSecureHash);
    }
}


