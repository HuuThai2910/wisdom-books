package iuh.fit.edu.repository;

import iuh.fit.edu.entity.EntryFormDetail;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

/**
 * @author Nguyen Tan Nghi
 * @version 1.0
 */
public interface EntryFormDetailRepository extends JpaRepository<EntryFormDetail, Long>, JpaSpecificationExecutor<EntryFormDetail> {
    
    @Query("SELECT d FROM EntryFormDetail d WHERE d.entryForm.id = :entryFormId")
    List<EntryFormDetail> findByEntryFormId(@Param("entryFormId") Long entryFormId);
}

