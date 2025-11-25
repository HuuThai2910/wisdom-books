package iuh.fit.edu.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import iuh.fit.edu.entity.constant.BookStatus;
import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "books")
@Data
public class Book {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String isbn;
    private String title;
    private String author;
    private int yearOfPublication;

    private String shortDes;

    @Column(columnDefinition = "MEDIUMTEXT")
    private String description;

    private double sellingPrice;
    private double importPrice;
    @ElementCollection
    @CollectionTable(name = "book_images", joinColumns = @JoinColumn(name = "book_id"))
    @Column(name = "image_path")
    private List<String> image;

    @Enumerated(EnumType.STRING)
    private BookStatus status;


    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private String createdBy;
    private String updatedBy;
    private int quantity;

    @OneToMany(mappedBy = "book")
    @JsonIgnore
    private List<OrderItem> orderItems;

    @OneToMany(mappedBy = "book")
    private List<Review> reviews;

    @ManyToMany
    @JoinTable(
            name = "book_categories",
            joinColumns = @JoinColumn(name = "book_id"),
            inverseJoinColumns = @JoinColumn(name = "category_id")
    )
    private List<Category> categories;

    @ManyToOne
    @JoinColumn(name = "supplier_id")
    private Supplier supplier;

    @OneToMany(mappedBy = "book")
    private List<CartItem> cartItems;

    @ManyToOne
    @JoinColumn(name = "inventory_id")
    private Inventory inventory;

    @OneToMany(mappedBy = "book")
    private List<EntryFormDetail> entryFormDetails;
    @PrePersist
    public void handleBeforeCreateAt() {
        this.createdBy =  "Tan Nghi";
        this.createdAt = LocalDateTime.now();
    }

    @PreUpdate
    public void handleBeforeUpdateAt() {
        this.createdBy =  "Tan Nghi";
        this.updatedAt = LocalDateTime.now();
    }
}