package iuh.fit.edu.entities;


import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Entity
@Table(name = "reviews")
@Data
public class Review {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    private Book book;

    @ManyToOne
    private User user;

    private int rating;

    @Column(columnDefinition = "MEDIUMTEXT")
    private String comment;
    private LocalDateTime reviewDate;
}