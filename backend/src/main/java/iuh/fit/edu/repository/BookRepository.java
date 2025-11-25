/*
 * @ (#) .java    1.0
 * Copyright (c)  IUH. All rights reserved.
 */
package iuh.fit.edu.repository;

import iuh.fit.edu.entity.Book;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/*
 * @description
 * @author: Huu Thai
 * @date:
 * @version: 1.0
 */
@Repository
public interface BookRepository extends JpaRepository<Book, Long> {

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

}
