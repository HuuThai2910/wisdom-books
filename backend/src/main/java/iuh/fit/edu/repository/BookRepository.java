package iuh.fit.edu.repository;

import iuh.fit.edu.entity.Book;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.Optional;

/**
 * @author Nguyen Tan Nghi
 * @created 11/24/2025 2:35 PM
 * @version 1.0
 */
public interface BookRepository extends JpaRepository<Book, Long>, JpaSpecificationExecutor<Book> {
    boolean existsByIsbn(String isbn);
    Optional<Book> findByIsbn(String isbn);

}
