package iuh.fit.edu.repository;

import iuh.fit.edu.entity.EntryFormDetail;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

/**
 * @author Nguyen Tan Nghi
 * @version 1.0
 */
public interface EntryFormDetailRepository extends JpaRepository<EntryFormDetail, Long>, JpaSpecificationExecutor<EntryFormDetail> {
}

