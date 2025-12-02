package iuh.fit.edu.service;

import iuh.fit.edu.dto.request.book.ReqCreateBookDTO;
import iuh.fit.edu.dto.request.book.ReqUpdateBookDTO;
import iuh.fit.edu.dto.response.ResultPaginationDTO;
import iuh.fit.edu.dto.response.book.ResBookDTO;
import iuh.fit.edu.dto.response.book.ResCreateBookDTO;
import iuh.fit.edu.dto.response.book.ResUpdateBookDTO;
import iuh.fit.edu.entity.Book;
import iuh.fit.edu.exception.IdInvalidException;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.util.Optional;

/**
 * @author Nguyen Tan Nghi
 * @version 1.0
 * @created 11/24/2025 2:40 PM
 */

public interface BookService {
    Book createBook(Book book);

    Book createBookFromDTO(ReqCreateBookDTO reqCreateBookDTO);

    Book updateBook(Book book);

    Book updateBookFromDTO(ReqUpdateBookDTO reqUpdateBookDTO);

    void deleteBook(Long id);

    Book findBookById(Long id);

    ResultPaginationDTO getAllBooks(Specification<Book> specification, Pageable pageable);

    ResBookDTO convertToResBookDTO(Book book);

    ResCreateBookDTO convertToResCreateBookDTO(Book book);

    ResUpdateBookDTO convertToResUpdateBookDTO(Book book);

    boolean existsByIsbn(String isbn);
    
    Book updateBookQuantity(Long id, int quantity) throws IdInvalidException;
    
    java.util.List<String> uploadBookImages(Long bookId, org.springframework.web.multipart.MultipartFile[] images) throws IdInvalidException;
}
