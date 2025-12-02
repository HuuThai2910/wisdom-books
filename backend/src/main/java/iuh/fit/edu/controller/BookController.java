package iuh.fit.edu.controller;

import com.turkraft.springfilter.boot.Filter;
import iuh.fit.edu.dto.response.ResultPaginationDTO;
import iuh.fit.edu.dto.response.account.UserInfoResponse;
import iuh.fit.edu.dto.response.book.ResBookDTO;
import iuh.fit.edu.dto.response.book.ResCreateBookDTO;
import iuh.fit.edu.dto.response.book.ResUpdateBookDTO;
import iuh.fit.edu.entity.Book;
import iuh.fit.edu.exception.IdInvalidException;
import iuh.fit.edu.service.BookService;
import iuh.fit.edu.util.GetTokenRequest;
import iuh.fit.edu.util.anotation.ApiMessage;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

/**
 * @author Nguyen Tan Nghi
 * @version 1.0
 */
@RestController
@RequestMapping("/api/books")
public class BookController {
    private final BookService bookService;

    public BookController(BookService bookService) {
        this.bookService = bookService;
    }

    @GetMapping("/{id}")
    @ApiMessage("Lấy dựa vào id")
    public ResponseEntity<ResBookDTO> getBookById(@PathVariable Long id) throws IdInvalidException {
        Book book = this.bookService.findBookById(id);
        if (book == null) {
            throw new IdInvalidException("Book với id: " + id + " không tồn tại");
        }
        return ResponseEntity.status(HttpStatus.OK).body(this.bookService.convertToResBookDTO(book));
    }

    @PostMapping
    @ApiMessage("Tạo sách mới")
    public ResponseEntity<ResCreateBookDTO> createNewBook(@Valid @RequestBody Book book, HttpServletRequest request) throws IdInvalidException {
        System.out.println("=== CREATE BOOK - Received data ===");
        System.out.println("ISBN: " + book.getIsbn());
        System.out.println("Title: " + book.getTitle());
        System.out.println("Author: " + book.getAuthor());
        System.out.println("Year: " + book.getYearOfPublication());
        System.out.println("Selling Price: " + book.getSellingPrice());
        System.out.println("Import Price: " + book.getImportPrice());
        System.out.println("Status: " + book.getStatus());
        System.out.println("Quantity: " + book.getQuantity());
        System.out.println("Categories: " + (book.getCategories() != null ? book.getCategories().size() : "null"));
        System.out.println("Images: " + (book.getImage() != null ? book.getImage().size() : "null"));
        UserInfoResponse user = GetTokenRequest.getInfoUser(request);
        if (this.bookService.existsByIsbn(book.getIsbn())) {
            throw new IdInvalidException("ISBN: " + book.getIsbn() + " đã tồn tại!");
        }

        Book bookCreate = this.bookService.createBook(book, user.getEmail());
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(this.bookService.convertToResCreateBookDTO(bookCreate));
    }

    @DeleteMapping("/{id}")
    @ApiMessage("Xóa sách (cập nhật trạng thái thành ngừng bán)")
    public ResponseEntity<Void> deleteBook(@PathVariable long id, HttpServletRequest request) throws IdInvalidException {
        Book currentBook = this.bookService.findBookById(id);
        if (currentBook == null) {
            throw new IdInvalidException("Book với id: " + id + " không tồn tại");
        }
        UserInfoResponse user = GetTokenRequest.getInfoUser(request);
        this.bookService.deleteBook(id, user.getEmail());
        return ResponseEntity.ok(null);
    }

    @GetMapping
    @ApiMessage("Lấy tất cả book")
    public ResponseEntity<ResultPaginationDTO> getAllBooks(
            @Filter Specification<Book> spec, Pageable pageable
    ) {
        return ResponseEntity.ok(this.bookService.getAllBooks(spec, pageable));
    }

    @PutMapping
    @ApiMessage("Cập nhật book")
    public ResponseEntity<ResUpdateBookDTO> updateBook(@Valid @RequestBody Book book, HttpServletRequest request) throws IdInvalidException {
        try {
            System.out.println("=== UPDATE BOOK - Received ISBN: " + book.getIsbn());

            if (book.getId() == null) {
                throw new IdInvalidException("ID sách không được để trống");
            }

            UserInfoResponse user = GetTokenRequest.getInfoUser(request);
            Book updatedBook = this.bookService.updateBook(book, user.getEmail());
            if (updatedBook == null) {
                throw new IdInvalidException("Book với id: " + book.getId() + " không tồn tại hoặc ISBN đã trùng");
            }

            System.out.println("=== UPDATE SUCCESS ===");
            return ResponseEntity.ok(this.bookService.convertToResUpdateBookDTO(updatedBook));
        } catch (IdInvalidException e) {
            System.err.println("=== ID INVALID ERROR: " + e.getMessage());
            throw e;
        } catch (Exception e) {
            System.err.println("=== UNEXPECTED ERROR ===");
            e.printStackTrace();
            throw new IdInvalidException("Lỗi khi cập nhật sách: " + e.getMessage());
        }
    }
    
    @PatchMapping("/{id}/quantity")
    @ApiMessage("Cập nhật số lượng sách")
    public ResponseEntity<ResUpdateBookDTO> updateBookQuantity(
            @PathVariable Long id,
            @RequestParam int quantity,
            HttpServletRequest request
    ) throws IdInvalidException {
        UserInfoResponse user = GetTokenRequest.getInfoUser(request);
        Book updatedBook = this.bookService.updateBookQuantity(id, quantity);
        return ResponseEntity.ok(this.bookService.convertToResUpdateBookDTO(updatedBook));
    }

    @PostMapping("/{id}/images")
    @ApiMessage("Upload ảnh cho sách")
    public ResponseEntity<List<String>> uploadBookImages(
            @PathVariable Long id,
            @RequestParam("images") MultipartFile[] images
    ) throws IdInvalidException {
        List<String> uploadedPaths = this.bookService.uploadBookImages(id, images);
        return ResponseEntity.ok(uploadedPaths);
    }
}

