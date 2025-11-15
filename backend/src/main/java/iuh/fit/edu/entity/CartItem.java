package iuh.fit.edu.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.proxy.HibernateProxy;

import java.util.Objects;

@Entity
@Table(name = "cart_items")
@Getter
@Setter
@ToString
@NoArgsConstructor
@AllArgsConstructor
public class CartItem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private int quantity;

    @ToString.Include
    private boolean selected = false;


    @ManyToOne
    @JoinColumn(name = "cart_id", nullable = true)
    private Cart cart;

    @ManyToOne
    @JoinColumn(name = "book_id")
    private Book book;

}