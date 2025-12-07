package iuh.fit.edu.repository;

import iuh.fit.edu.entity.EntryForm;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;

/**
 * @author Nguyen Tan Nghi & The Bao
 * @version 1.0
 */
public interface EntryFormRepository extends JpaRepository<EntryForm, Long>, JpaSpecificationExecutor<EntryForm> {
    
    @Query("SELECT COALESCE(MAX(e.id), 0) FROM EntryForm e")
    Long findMaxId();
}

