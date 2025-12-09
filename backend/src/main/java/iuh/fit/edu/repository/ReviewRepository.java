package iuh.fit.edu.repository;

import iuh.fit.edu.entity.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {
    Optional<Review> findByBook_IdAndUser_Email(Long bookId, String email);
}
