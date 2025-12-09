/*
 * @ (#) .java    1.0
 * Copyright (c)  IUH. All rights reserved.
 */
package iuh.fit.edu.repository;/*
 * @description
 * @author: Huu Thai
 * @date:
 * @version: 1.0
 */

import iuh.fit.edu.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.OffsetDateTime;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    User findByEmail(String email);
    User findByPhone(String phone);
    User findByFullName(String fullName);
    
    boolean existsByEmail(String email);
    boolean existsByFullName(String fullName);
    
    @Query("SELECT COUNT(u) FROM User u WHERE u.role.name = 'CUSTOMER'")
    long countCustomers();
    
    @Query("SELECT COUNT(u) FROM User u WHERE u.role.name = 'CUSTOMER' AND u.createdAt >= :startDate AND u.createdAt <= :endDate")
    long countNewCustomersByDateRange(@Param("startDate") OffsetDateTime startDate, @Param("endDate") OffsetDateTime endDate);
}
