package iuh.fit.edu.repository;

import iuh.fit.edu.entity.Supplier;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 * @author Nguyen Tan Nghi
 * @created 11/24/2025 3:13 PM
 * @version 1.0
 */
public interface SupplierRepository extends JpaRepository<Supplier,Long> {
}
