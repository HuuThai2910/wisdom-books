package iuh.fit.edu.repository;

import iuh.fit.edu.entity.Order;
import iuh.fit.edu.entity.constant.PaymentMethod;
import iuh.fit.edu.entity.constant.PaymentStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long>, JpaSpecificationExecutor<Order> {
    Optional<Order> findByOrderCode(String orderCode);
    List<Order> findByUserIdOrderByOrderDateDesc(Long userId);
    List<Order> findAllByPaymentMethodAndPaymentStatusAndExpiredAtBefore(PaymentMethod paymentMethod, PaymentStatus paymentStatus, LocalDateTime now);
    
    @Query("SELECT COUNT(o) FROM Order o WHERE o.orderDate >= :startDate AND o.orderDate <= :endDate")
    long countOrdersByDateRange(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);
    
    @Query("SELECT COALESCE(SUM(o.totalPrice), 0) FROM Order o WHERE o.orderDate >= :startDate AND o.orderDate <= :endDate AND o.paymentStatus = 'PAID'")
    double sumRevenueByDateRange(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);
    
    @Query("SELECT COALESCE(SUM(oi.quantity * b.importPrice), 0) FROM OrderItem oi JOIN oi.book b JOIN oi.order o WHERE o.orderDate >= :startDate AND o.orderDate <= :endDate AND o.paymentStatus = 'PAID'")
    double sumImportCostByDateRange(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);
    
    @Query("SELECT COUNT(o) FROM Order o WHERE o.orderDate >= :startDate AND o.orderDate <= :endDate AND o.status = 'CANCELLED'")
    long countCancelledOrdersByDateRange(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);
    
    // Query cho monthly revenue
    @Query("SELECT MONTH(o.orderDate) as month, " +
           "COALESCE(SUM(CASE WHEN o.paymentStatus = 'PAID' THEN o.totalPrice ELSE 0 END), 0) as revenue, " +
           "COUNT(o) as orders " +
           "FROM Order o " +
           "WHERE YEAR(o.orderDate) = :year " +
           "GROUP BY MONTH(o.orderDate) " +
           "ORDER BY MONTH(o.orderDate)")
    List<Object[]> getMonthlyRevenueByYear(@Param("year") int year);
    
    // Query cho top books
    @Query("SELECT b.title, SUM(oi.quantity) " +
           "FROM Order o " +
           "JOIN o.orderItems oi " +
           "JOIN oi.book b " +
           "WHERE o.orderDate >= :startDate AND o.orderDate <= :endDate " +
           "AND o.paymentStatus = 'PAID' " +
           "GROUP BY b.id, b.title " +
           "ORDER BY SUM(oi.quantity) DESC")
    List<Object[]> getTopBooksByDateRange(@Param("startDate") LocalDateTime startDate, 
                                          @Param("endDate") LocalDateTime endDate);
    
    // Query cho top categories
    @Query("SELECT c.name, SUM(oi.quantity) " +
           "FROM Order o " +
           "JOIN o.orderItems oi " +
           "JOIN oi.book b " +
           "JOIN b.categories c " +
           "WHERE o.orderDate >= :startDate AND o.orderDate <= :endDate " +
           "AND o.paymentStatus = 'PAID' " +
           "GROUP BY c.id, c.name " +
           "ORDER BY SUM(oi.quantity) DESC")
    List<Object[]> getTopCategoriesByDateRange(@Param("startDate") LocalDateTime startDate, 
                                                @Param("endDate") LocalDateTime endDate);
}

