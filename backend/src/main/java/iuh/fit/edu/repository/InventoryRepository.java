package iuh.fit.edu.repository;

import iuh.fit.edu.entity.Inventory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

/**
 * @author Nguyen Tan Nghi
 * @created 11/24/2025 3:11 PM
 * @version 1.0
 */
public interface InventoryRepository extends JpaRepository<Inventory, Long> {
    
    @Query("SELECT COALESCE(SUM(i.quantity), 0) FROM Inventory i")
    Integer getTotalQuantity();
}
