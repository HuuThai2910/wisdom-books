package iuh.fit.edu.dto.response.book;

import com.fasterxml.jackson.annotation.JsonFormat;
import iuh.fit.edu.entity.constant.BookStatus;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.OffsetDateTime;

/**
 * @author Nguyen Tan Nghi
 * @version 1.0
 * @created 11/24/2025 4:06 PM
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ResUpdateBookDTO {
    private Long id;
    private String isbn;
    private String title;
    private String author;
    private int yearOfPublication;
    private String shortDes;
    private String description;
    private double sellingPrice;
    private double importPrice;
    private BookStatus status;
    // @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "Asia/Ho_Chi_Minh")
    private OffsetDateTime createdAt;
    // @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "Asia/Ho_Chi_Minh")
    private OffsetDateTime updatedAt;
    private String createdBy;
    private String updatedBy;
    private int quantity;
    private BookImage[] bookImage;
    private Category[] category;
    private Supplier supplier;
    private EntryFormDetail entryFormDetail;


    @Getter
    @Setter
    @AllArgsConstructor
    @NoArgsConstructor
    public static class BookImage{
        private long bookId;
        private String imagePath;
    }

    @Getter
    @Setter
    @AllArgsConstructor
    @NoArgsConstructor
    public static class Category{
        private long id;
        private String description;
        private String name;
    }
    @Getter
    @Setter
    @AllArgsConstructor
    @NoArgsConstructor
    public static class Supplier{
        private long id;
        private String address;
        private String companyName;
        private String email;
        private String phone;
    }
    @Getter
    @Setter
    @AllArgsConstructor
    @NoArgsConstructor
    public static class EntryFormDetail{
        private long id;
        private EntryForm entryForm;
        @Getter
        @Setter
        @AllArgsConstructor
        @NoArgsConstructor
        public static class EntryForm{
            private long id;
            private int totalQuantity;
            private double totalPrice;
            private OffsetDateTime createdAt;
        }
    }
}
