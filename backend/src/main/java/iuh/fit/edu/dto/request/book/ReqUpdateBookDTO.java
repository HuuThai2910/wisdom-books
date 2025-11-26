package iuh.fit.edu.dto.request.book;

import iuh.fit.edu.entity.constant.BookStatus;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

/**
 * @author Nguyen Tan Nghi
 * @version 1.0
 * @created 11/25/2025
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ReqUpdateBookDTO {

    @NotNull(message = "ID không được để trống")
    private Long id;

    private String isbn;

    private String title;

    private String author;

    @Min(value = 1000, message = "Năm xuất bản phải lớn hơn 1000")
    @Max(value = 9999, message = "Năm xuất bản phải nhỏ hơn 10000")
    private Integer yearOfPublication;

    private String shortDes;

    private String description;

    @Min(value = 0, message = "Giá bán phải lớn hơn hoặc bằng 0")
    private Double sellingPrice;

    @Min(value = 0, message = "Giá nhập phải lớn hơn hoặc bằng 0")
    private Double importPrice;

    private BookStatus status;

    @Min(value = 0, message = "Số lượng phải lớn hơn hoặc bằng 0")
    private Integer quantity;

    // Danh sách đường dẫn hình ảnh
    private List<String> image;

    // Danh sách ID của categories
    private List<Long> categoryIds;

    // ID của supplier
    private Long supplierId;

    // ID của inventory
    private Long inventoryId;
}

