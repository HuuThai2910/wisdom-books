package iuh.fit.edu.repository;

import iuh.fit.edu.entity.Order;
import iuh.fit.edu.entity.constant.PaymentMethod;
import iuh.fit.edu.entity.constant.PaymentStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    Optional<Order> findByOrderCode(String orderCode);
    List<Order> findByUserIdOrderByOrderDateDesc(Long userId);
    List<Order> findAllByPaymentMethodAndPaymentStatusAndExpiredAtBefore(PaymentMethod paymentMethod, PaymentStatus paymentStatus, LocalDateTime now);
}

