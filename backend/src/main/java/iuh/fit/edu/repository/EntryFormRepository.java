package iuh.fit.edu.repository;

import iuh.fit.edu.entity.EntryForm;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

/**
 * @author Nguyen Tan Nghi
 * @version 1.0
 */
public interface EntryFormRepository extends JpaRepository<EntryForm, Long>, JpaSpecificationExecutor<EntryForm> {
}

