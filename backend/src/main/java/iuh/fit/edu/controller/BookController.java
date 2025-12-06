package iuh.fit.edu.controller;

import com.turkraft.springfilter.boot.Filter;
import iuh.fit.edu.dto.request.book.ReqCreateBookDTO;
import iuh.fit.edu.dto.request.book.ReqUpdateBookDTO;
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
    public ResponseEntity<ResCreateBookDTO> createNewBook(@Valid @RequestBody ReqCreateBookDTO reqCreateBookDTO, HttpServletRequest request) throws IdInvalidException {
        UserInfoResponse user = GetTokenRequest.getInfoUser(request);
        if (this.bookService.existsByIsbn(reqCreateBookDTO.getIsbn())) {
            throw new IdInvalidException("ISBN: " + reqCreateBookDTO.getIsbn() + " đã tồn tại!");
        }

        Book book = this.bookService.convertDTOToBook(reqCreateBookDTO);
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
    public ResponseEntity<ResUpdateBookDTO> updateBook(@Valid @RequestBody ReqUpdateBookDTO reqUpdateBookDTO, HttpServletRequest request) throws IdInvalidException {
        try {
            if (reqUpdateBookDTO.getId() == null) {
                throw new IdInvalidException("ID sách không được để trống");
            }

            UserInfoResponse user = GetTokenRequest.getInfoUser(request);
            Book book = this.bookService.convertDTOToBook(reqUpdateBookDTO);
            Book updatedBook = this.bookService.updateBook(book, user.getEmail());
            if (updatedBook == null) {
                throw new IdInvalidException("Book với id: " + reqUpdateBookDTO.getId() + " không tồn tại hoặc ISBN đã trùng");
            }
            return ResponseEntity.ok(this.bookService.convertToResUpdateBookDTO(updatedBook));
        } catch (IdInvalidException e) {
            throw e;
        } catch (Exception e) {
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

