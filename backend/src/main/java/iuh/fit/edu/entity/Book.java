package iuh.fit.edu.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import iuh.fit.edu.entity.constant.BookStatus;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.Data;

import java.time.OffsetDateTime;
import java.time.ZoneId;
import java.util.List;

@Entity
@Table(name = "books")
@Data
public class Book {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "ISBN không được để trống")
    @Pattern(regexp = "^[0-9-]{10,17}$", 
             message = "ISBN không hợp lệ (phải là 10-13 chữ số, có thể có dấu gạch ngang)")
    private String isbn;
    
    @NotBlank(message = "Tên sách không được để trống")
    @Size(min = 1, max = 500, message = "Tên sách phải từ 1-500 ký tự")
    private String title;
    
    @NotBlank(message = "Tên tác giả không được để trống")
    @Size(min = 1, max = 200, message = "Tên tác giả phải từ 1-200 ký tự")
    private String author;
    
    @Min(value = 1900, message = "Năm xuất bản phải từ 1900 trở lên")
    @Max(value = 2025, message = "Năm xuất bản không được vượt quá năm hiện tại")
    private int yearOfPublication;

    @Size(max = 1000, message = "Mô tả ngắn không quá 1000 ký tự")
    private String shortDes;

    @Column(columnDefinition = "MEDIUMTEXT")
    private String description;

    @Min(value = 1, message = "Giá bán phải lớn hơn 0")
    @NotNull(message = "Giá bán không được để trống")
    private double sellingPrice;
    
    @Min(value = 1, message = "Giá nhập phải lớn hơn 0")
    @NotNull(message = "Giá nhập không được để trống")
    private double importPrice;
    
    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "book_images", joinColumns = @JoinColumn(name = "book_id"))
    @Column(name = "image_path")
    private List<String> image;

    @Enumerated(EnumType.STRING)
    @NotNull(message = "Trạng thái sách không được để trống")
    private BookStatus status;

    @Column(columnDefinition = "DATETIME")
    private OffsetDateTime createdAt;
    
    @Column(columnDefinition = "DATETIME")
    private OffsetDateTime updatedAt;
    
    private String createdBy;
    private String updatedBy;
    
    @Min(value = 1, message = "Số lượng phải lớn hơn 0")
    private int quantity;

    @OneToMany(mappedBy = "book")
    @JsonIgnore
    private List<OrderItem> orderItems;

    @OneToMany(mappedBy = "book")
    private List<Review> reviews;

    @ManyToMany(cascade = {CascadeType.PERSIST, CascadeType.MERGE})
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
        this.createdAt = OffsetDateTime.now(ZoneId.of("Asia/Ho_Chi_Minh"));
    }

    @PreUpdate
    public void handleBeforeUpdateAt() {
        this.updatedAt = OffsetDateTime.now(ZoneId.of("Asia/Ho_Chi_Minh"));
    }
}