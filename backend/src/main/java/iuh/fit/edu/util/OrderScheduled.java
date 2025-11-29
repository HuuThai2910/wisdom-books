/*
 * @ (#) .java    1.0
 * Copyright (c)  IUH. All rights reserved.
 */
package iuh.fit.edu.util;

import iuh.fit.edu.entity.Order;
import iuh.fit.edu.service.OrderService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.util.List;

/*
 * @description
 * @author: Huu Thai
 * @date:
 * @version: 1.0
 */
@EnableScheduling
@Slf4j
@RequiredArgsConstructor
@Component
public class OrderScheduled {
    private final OrderService orderService;


    @Scheduled(fixedRate = 5000, initialDelay = 0)
    public void cancelExpiredOrders(){
        List<Order> orders = this.orderService.getExpiredOrders();
        if(!orders.isEmpty()){
            log.info("Tìm thấy {} đơn hàng VNPAY hết hạn. Đang tiến hành hủy ....", orders.size());
            for(Order order : orders){
                try {
                    log.info("Đang hủy đơn hàng: {}", order.getOrderCode());
                    this.orderService.cancelOrder(order.getOrderCode());
                    log.info("Hủy đơn hàng {} thành công", order.getOrderCode());
                }catch (Exception e){
                    log.error("Có lỗi xảy ra trong qúa trình hủy đơn hàng {}", order.getOrderCode(), e.getMessage());
                }
            }
        }
    }
}
