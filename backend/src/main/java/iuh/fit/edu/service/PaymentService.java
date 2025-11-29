package iuh.fit.edu.service;

import iuh.fit.edu.dto.response.PaymentResponse;
import iuh.fit.edu.entity.Order;
import jakarta.servlet.http.HttpServletRequest;

import java.util.Map;

public interface PaymentService {
    String createVNPayUrl(Order order, HttpServletRequest request);
    boolean validateCallBack(Map<String, String> params);
}

