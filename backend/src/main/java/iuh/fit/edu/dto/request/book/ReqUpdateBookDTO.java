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

    @NotBlank(message = "ISBN không được để trống")
    private String isbn;

    @NotBlank(message = "Tiêu đề không được để trống")
    private String title;

    @NotBlank(message = "Tác giả không được để trống")
    private String author;

    @NotNull(message = "Năm xuất bản không được để trống")
    @Min(value = 1900, message = "Năm xuất bản phải từ 1900 trở lên")
    @Max(value = 2025, message = "Năm xuất bản không được vượt quá năm hiện tại")
    private Integer yearOfPublication;

    private String shortDes;

    private String description;

    @NotNull(message = "Giá bán không được để trống")
    @Min(value = 1, message = "Giá bán phải lớn hơn 0")
    private Double sellingPrice;

    @NotNull(message = "Giá nhập không được để trống")
    @Min(value = 1, message = "Giá nhập phải lớn hơn 0")
    private Double importPrice;

    private BookStatus status;

    @NotNull(message = "Số lượng không được để trống")
    @Min(value = 0, message = "Số lượng phải lớn hơn hoặc bằng 0")
    private Integer quantity;

    // Danh sách đường dẫn hình ảnh
    @NotNull(message = "Vui lòng tải lên ảnh cho sách")
    @Size(min = 1, max = 8, message = "Số lượng ảnh phải từ 1 đến 8")
    private List<String> image;

    // Danh sách ID của categories
    @NotNull(message = "Vui lòng chọn thể loại")
    @Size(min = 1, message = "Vui lòng chọn ít nhất một thể loại")
    private List<Long> categoryIds;

    // ID của supplier
    @NotNull(message = "Vui lòng chọn nhà cung cấp")
    private Long supplierId;

    // ID của inventory
    private Long inventoryId;
}

