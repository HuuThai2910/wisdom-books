/*
 * @ (#) .java    1.0
 * Copyright (c)  IUH. All rights reserved.
 */
package iuh.fit.edu.repository;

import iuh.fit.edu.entity.Cart;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/*
 * @description
 * @author: Huu Thai
 * @date:
 * @version: 1.0
 */
@Repository
public interface CartRepository extends JpaRepository<Cart, Long> {
    Cart findByUser_Id(Long userId);
    Cart findByUser_Email(String email);
}
