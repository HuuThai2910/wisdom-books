package iuh.fit.edu.repository;

import iuh.fit.edu.entity.OrderItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface OrderDetailRepository extends JpaRepository<OrderItem, Long> {
}

