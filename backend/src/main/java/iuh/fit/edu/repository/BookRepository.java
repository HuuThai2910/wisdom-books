package iuh.fit.edu.repository;

import iuh.fit.edu.entity.Book;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

   
@Repository
public interface BookRepository extends JpaRepository<Book, Long>, JpaSpecificationExecutor<Book> {
     boolean existsByIsbn(String isbn);
     Optional<Book> findByIsbn(String isbn);
     
     // Fetch book with reviews and review users
     @EntityGraph(attributePaths = {"reviews", "reviews.user"})
     @Query("SELECT b FROM Book b WHERE b.id = :id")
     Optional<Book> findByIdWithReviewsAndUsers(@Param("id") Long id);

    // 1. ATOMIC REDUCE (Trừ số lượng an toàn)
    // Logic: Chỉ trừ khi stock >= qty.
    // Return: số dòng update thành công (1 nếu thành công, 0 nếu thất bại/hết hàng)
    @Modifying
    @Query("update Book b set b.quantity = b.quantity - :quantity " +
            "where b.id = :id and b.quantity >= :quantity")
    int reduceQuantity(@Param("id") Long id, @Param("quantity") int quantity);

    // 2. ATOMIC RESTORE (Hoàn số lượng khi hủy đơn)
    @Modifying
    @Query("update Book b set b.quantity = b.quantity + :quantity " +
            "where b.id = :id")
    int restoreStock(@Param("id") Long id, @Param("quantity") int quantity);
    
    @Query("SELECT COUNT(b) FROM Book b WHERE b.quantity = 0 and b.status = 'SALE'")
    long countOutOfStockBooks();
    
    @Query("SELECT COUNT(b) FROM Book b WHERE b.quantity > 0 AND b.quantity <= 10")
    long countLowStockBooks();

        @Query("SELECT COUNT(b) FROM Book b WHERE b.createdAt >= :startDate AND b.createdAt <= :endDate")
        long countNewBooksByDateRange(@Param("startDate") java.time.OffsetDateTime startDate, @Param("endDate") java.time.OffsetDateTime endDate);

}
