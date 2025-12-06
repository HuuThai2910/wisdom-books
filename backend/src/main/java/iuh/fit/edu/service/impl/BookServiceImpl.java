package iuh.fit.edu.service.impl;

import iuh.fit.edu.dto.request.book.ReqCreateBookDTO;
import iuh.fit.edu.dto.request.book.ReqUpdateBookDTO;
import iuh.fit.edu.dto.response.ResultPaginationDTO;
import iuh.fit.edu.dto.response.book.ResBookDTO;
import iuh.fit.edu.dto.response.book.ResCreateBookDTO;
import iuh.fit.edu.dto.response.book.ResUpdateBookDTO;
import iuh.fit.edu.entity.*;
import iuh.fit.edu.entity.constant.BookStatus;
import iuh.fit.edu.exception.IdInvalidException;
import iuh.fit.edu.mapper.BookMapper;
import iuh.fit.edu.repository.BookRepository;
import iuh.fit.edu.repository.CategoryRepository;
import iuh.fit.edu.repository.EntryFormDetailRepository;
import iuh.fit.edu.repository.EntryFormRepository;
import iuh.fit.edu.repository.InventoryRepository;
import iuh.fit.edu.repository.SupplierRepository;
import iuh.fit.edu.repository.UserRepository;
import iuh.fit.edu.service.BookService;
import iuh.fit.edu.service.S3Service;
import iuh.fit.edu.service.UserService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * @author Nguyen Tan Nghi
 * @version 1.0
 * @created 11/24/2025 2:48 PM
 */
@Service
public class BookServiceImpl implements BookService {
    private final BookRepository bookRepository;
    private final InventoryRepository inventoryRepository;
    private final SupplierRepository supplierRepository;
    private final CategoryRepository categoryRepository;
    private final EntryFormRepository entryFormRepository;
    private final EntryFormDetailRepository entryFormDetailRepository;
    private final UserRepository userRepository;
    private final BookMapper bookMapper;
    private final S3Service s3Service;


    public BookServiceImpl(BookRepository bookRepository, InventoryRepository inventoryRepository,
                           SupplierRepository supplierRepository, CategoryRepository categoryRepository,
                           EntryFormRepository entryFormRepository, EntryFormDetailRepository entryFormDetailRepository,
                           UserRepository userRepository, BookMapper bookMapper, S3Service s3Service) {
        this.bookRepository = bookRepository;
        this.inventoryRepository = inventoryRepository;
        this.supplierRepository = supplierRepository;
        this.categoryRepository = categoryRepository;
        this.entryFormRepository = entryFormRepository;
        this.entryFormDetailRepository = entryFormDetailRepository;
        this.userRepository = userRepository;
        this.bookMapper = bookMapper;
        this.s3Service = s3Service;
    }

    @Override
    @Transactional
    public Book createBook(Book book, String email) {
        if (book.getSupplier() != null && book.getSupplier().getId() != null) {
            Optional<Supplier> optionalSupplier = this.supplierRepository.findById(book.getSupplier().getId());
            book.setSupplier(optionalSupplier.orElse(null));
        }
        if (book.getCategories() != null && !book.getCategories().isEmpty()) {
            List<Category> validCategories = book.getCategories().stream()
                    .filter(cat -> cat.getId() != null)
                    .map(cat -> this.categoryRepository.findById(cat.getId()).orElse(null))
                    .filter(Objects::nonNull)
                    .toList();
            book.setCategories(validCategories);
        }
        if (book.getInventory() != null && book.getInventory().getId() != null) {
            Optional<Inventory> optionalInventory = this.inventoryRepository.findById(book.getInventory().getId());
            book.setInventory(optionalInventory.orElse(null));
        }

        book.setCreatedBy(email);
        Book savedBook = this.bookRepository.save(book);
        if (savedBook.getQuantity() > 0 && savedBook.getInventory() != null) {
            Inventory inventory = savedBook.getInventory();
            inventory.setQuantity(inventory.getQuantity() + savedBook.getQuantity());
            this.inventoryRepository.save(inventory);
        }
        User user = this.userRepository.findByEmail(email);
        if (user == null) {
            throw new RuntimeException("User not found");
        }
        if (savedBook.getQuantity() > 0) {
            createEntryFormForBook(savedBook, savedBook.getQuantity(), savedBook.getImportPrice(), user);
        }

        return savedBook;
    }

    @Override
    @Transactional
    public Book updateBook(Book book, String email) {
        try {
            Optional<Book> optionalBook = this.bookRepository.findById(book.getId());
            if (optionalBook.isPresent()) {
                Book updatedBook = optionalBook.get();
                if (book.getIsbn() != null && !book.getIsbn().isEmpty() && !book.getIsbn().equals(updatedBook.getIsbn())) {
                    if (this.bookRepository.existsByIsbn(book.getIsbn())) {
                        return null;
                    }
                    updatedBook.setIsbn(book.getIsbn());
                }
                if (book.getAuthor() != null && !book.getAuthor().isEmpty()) {
                    updatedBook.setAuthor(book.getAuthor());
                }
                if (book.getTitle() != null && !book.getTitle().isEmpty()) {
                    updatedBook.setTitle(book.getTitle());
                }
                if (book.getYearOfPublication() > 0) {
                    updatedBook.setYearOfPublication(book.getYearOfPublication());
                }
                if (book.getShortDes() != null) {
                    updatedBook.setShortDes(book.getShortDes());
                }
                if (book.getDescription() != null) {
                    updatedBook.setDescription(book.getDescription());
                }
                if (book.getSellingPrice() >= 0) {
                    updatedBook.setSellingPrice(book.getSellingPrice());
                }
                if (book.getImportPrice() >= 0) {
                    updatedBook.setImportPrice(book.getImportPrice());
                }
                if (book.getStatus() != null) {
                    updatedBook.setStatus(book.getStatus());
                }
                int oldQuantity = updatedBook.getQuantity();
                if (book.getQuantity() >= 0) {
                    updatedBook.setQuantity(book.getQuantity());
                }

                // Cập nhật danh sách hình ảnh
                if (book.getImage() != null) {
                    if (updatedBook.getImage() != null) {
                        updatedBook.getImage().clear();
                        updatedBook.getImage().addAll(book.getImage());
                    } else {
                        updatedBook.setImage(book.getImage());
                    }
                }
                if (book.getSupplier() != null && book.getSupplier().getId() != null) {
                    Optional<Supplier> optionalSupplier = this.supplierRepository.findById(book.getSupplier().getId());
                    updatedBook.setSupplier(optionalSupplier.orElse(updatedBook.getSupplier()));
                }
                if (book.getCategories() != null) {
                    List<Category> validCategories = book.getCategories().stream()
                            .filter(cat -> cat.getId() != null)
                            .map(cat -> this.categoryRepository.findById(cat.getId()).orElse(null))
                            .filter(Objects::nonNull)
                            .toList();
                    updatedBook.getCategories().clear();
                    updatedBook.getCategories().addAll(validCategories);
                }
                if (book.getInventory() != null && book.getInventory().getId() != null) {
                    System.out.println("Updating inventory: " + book.getInventory().getId());
                    Optional<Inventory> optionalInventory = this.inventoryRepository.findById(book.getInventory().getId());
                    updatedBook.setInventory(optionalInventory.orElse(updatedBook.getInventory()));
                }
                int newQuantity = updatedBook.getQuantity();
                int quantityDiff = newQuantity - oldQuantity;
                updatedBook.setUpdatedAt(OffsetDateTime.now());
                updatedBook.setUpdatedBy(email);
                Book savedBook = this.bookRepository.save(updatedBook);
                User user = this.userRepository.findByEmail(email);
                if (user == null) {
                    throw new RuntimeException("User not found");
                }
                if (quantityDiff > 0) {
                    createEntryFormForBook(savedBook, quantityDiff, book.getImportPrice() > 0 ? book.getImportPrice() : savedBook.getImportPrice(), user);
                }

                return savedBook;
            }
            return null;
        } catch (Exception e) {
            System.err.println("=== ERROR IN UPDATE BOOK SERVICE ===");
            e.printStackTrace();
            throw e;
        }
    }

    @Override
    @Transactional
    public void deleteBook(Long id, String email) {
        Optional<Book> optionalBook = this.bookRepository.findById(id);
        if (optionalBook.isPresent()) {
            Book book = optionalBook.get();
            book.setStatus(BookStatus.STOP_SALE);
            book.setUpdatedAt(OffsetDateTime.now());
            book.setUpdatedBy(email);
            this.bookRepository.save(book);
        }
    }

    @Override
    public Book findBookById(Long id) {
        return this.bookRepository.findById(id).orElse(null);
    }


    @Override
    public ResultPaginationDTO getAllBooks(Specification<Book> specification, Pageable pageable) {

        Specification<Book> statusSpec = (root, query, cb) ->
                root.get("status").in(BookStatus.SALE, BookStatus.OUT_STOCK);

        Specification<Book> finalSpec = specification == null
                ? statusSpec
                : specification.and(statusSpec);

        Page<Book> bookPage = this.bookRepository.findAll(finalSpec, pageable);

        ResultPaginationDTO rs = new ResultPaginationDTO();
        ResultPaginationDTO.Meta mt = new ResultPaginationDTO.Meta();

        mt.setPage(pageable.getPageNumber() + 1);
        mt.setPageSize(pageable.getPageSize());
        mt.setPages(bookPage.getTotalPages());
        mt.setTotal(bookPage.getTotalElements());

        rs.setMeta(mt);

        rs.setResult(
                bookPage.getContent()
                        .stream()
                        .map(this::convertToResBookDTO)
                        .toList()
        );

        return rs;
    }


    @Override
    public ResBookDTO convertToResBookDTO(Book book) {
        return bookMapper.toResBookDTO(book);
    }

    @Override
    public ResCreateBookDTO convertToResCreateBookDTO(Book book) {
        return bookMapper.toResCreateBookDTO(book);
    }

    @Override
    public ResUpdateBookDTO convertToResUpdateBookDTO(Book book) {
        return bookMapper.toResUpdateBookDTO(book);
    }

    @Override
    public Book convertDTOToBook(ReqCreateBookDTO dto) {
        Book book = new Book();
        book.setIsbn(dto.getIsbn());
        book.setTitle(dto.getTitle());
        book.setAuthor(dto.getAuthor());
        book.setYearOfPublication(dto.getYearOfPublication());
        book.setDescription(dto.getDescription());
        book.setSellingPrice(dto.getSellingPrice());
        book.setImportPrice(dto.getImportPrice());
        book.setStatus(dto.getStatus());
        book.setQuantity(dto.getQuantity());
        book.setImage(dto.getImage());

        // Convert category IDs to Category entities
        if (dto.getCategoryIds() != null && !dto.getCategoryIds().isEmpty()) {
            List<Category> categories = new ArrayList<>();
            for (Long categoryId : dto.getCategoryIds()) {
                Category category = categoryRepository.findById(categoryId).orElse(null);
                if (category != null) {
                    categories.add(category);
                }
            }
            book.setCategories(categories);
        }

        // Convert supplier ID to Supplier entity
        if (dto.getSupplierId() != null) {
            Supplier supplier = supplierRepository.findById(dto.getSupplierId()).orElse(null);
            book.setSupplier(supplier);
        }

        // Convert inventory ID to Inventory entity
        if (dto.getInventoryId() != null) {
            Inventory inventory = inventoryRepository.findById(dto.getInventoryId()).orElse(null);
            book.setInventory(inventory);
        }

        return book;
    }

    @Override
    public Book convertDTOToBook(ReqUpdateBookDTO dto) {
        Book book = new Book();
        book.setId(dto.getId());
        book.setIsbn(dto.getIsbn());
        book.setTitle(dto.getTitle());
        book.setAuthor(dto.getAuthor());
        book.setYearOfPublication(dto.getYearOfPublication());
        book.setDescription(dto.getDescription());
        book.setSellingPrice(dto.getSellingPrice());
        book.setImportPrice(dto.getImportPrice());
        book.setStatus(dto.getStatus());
        book.setQuantity(dto.getQuantity());
        book.setImage(dto.getImage());

        // Convert category IDs to Category entities
        if (dto.getCategoryIds() != null && !dto.getCategoryIds().isEmpty()) {
            List<Category> categories = new ArrayList<>();
            for (Long categoryId : dto.getCategoryIds()) {
                Category category = categoryRepository.findById(categoryId).orElse(null);
                if (category != null) {
                    categories.add(category);
                }
            }
            book.setCategories(categories);
        }

        // Convert supplier ID to Supplier entity
        if (dto.getSupplierId() != null) {
            Supplier supplier = supplierRepository.findById(dto.getSupplierId()).orElse(null);
            book.setSupplier(supplier);
        }

        // Convert inventory ID to Inventory entity
        if (dto.getInventoryId() != null) {
            Inventory inventory = inventoryRepository.findById(dto.getInventoryId()).orElse(null);
            book.setInventory(inventory);
        }

        return book;
    }

    @Override
    public boolean existsByIsbn(String isbn) {
        return this.bookRepository.existsByIsbn(isbn);
    }

    /**
     * Tạo EntryForm và EntryFormDetail khi nhập hàng
     *
     * @param book      Sách được nhập
     * @param quantity  Số lượng nhập
     * @param unitPrice Giá nhập đơn vị
     */
    private void createEntryFormForBook(Book book, int quantity, double unitPrice, User user) {
        try {
            // Tạo EntryForm (Phiếu nhập)
            EntryForm entryForm = new EntryForm();
            entryForm.setTotalQuantity(quantity);
            entryForm.setTotalPrice(quantity * unitPrice);
            entryForm.setCreatedAt(OffsetDateTime.now());
            entryForm.setUser(user);

            // Lưu EntryForm
            EntryForm savedEntryForm = this.entryFormRepository.save(entryForm);

            // Tạo EntryFormDetail (Chi tiết phiếu nhập)
            EntryFormDetail entryFormDetail = new EntryFormDetail();
            entryFormDetail.setBook(book);
            entryFormDetail.setEntryForm(savedEntryForm);
            entryFormDetail.setQuantity(quantity);
            entryFormDetail.setUnitPrice(unitPrice);

            // Lưu EntryFormDetail
            EntryFormDetail savedDetail = this.entryFormDetailRepository.save(entryFormDetail);

        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    @Override
    public Book updateBookQuantity(Long bookId, int quantity) throws IdInvalidException {
        if (quantity < 0) {
            throw new IdInvalidException("Số lượng không được nhỏ hơn 0");
        }

        Book book = this.findBookById(bookId);
        if (book == null) {
            throw new IdInvalidException("Book với id: " + bookId + " không tồn tại");
        }

        if (book.getInventory() != null) {
            book.getInventory().setQuantity(quantity);
        } else {
            throw new IdInvalidException("Book không có inventory");
        }
        return this.bookRepository.save(book);
    }

    @Override
    public List<String> uploadBookImages(Long bookId, MultipartFile[] images) throws IdInvalidException {
        // Kiểm tra sách có tồn tại không
        Book book = this.findBookById(bookId);
        if (book == null) {
            throw new IdInvalidException("Book với id: " + bookId + " không tồn tại");
        }

        if (images == null || images.length == 0) {
            throw new IdInvalidException("Phải upload ít nhất 1 ảnh");
        }
        List<String> uploadedPaths = new ArrayList<>();
        String bookFolder = "books/" + bookId;
        for (MultipartFile image : images) {
            if (image != null && !image.isEmpty()) {
                try {
                    String s3Path = s3Service.uploadFile(image, bookFolder);
                    uploadedPaths.add(s3Path);
                } catch (Exception e) {
                    throw new IdInvalidException("Lỗi khi upload ảnh: " + e.getMessage());
                }
            }
        }
        if (book.getImage() == null) {
            book.setImage(uploadedPaths);
        } else {
            List<String> existingImages = book.getImage().stream()
                    .filter(img -> !img.contains("placeholder") && !img.contains("temp-"))
                    .collect(Collectors.toList());
            existingImages.addAll(uploadedPaths);
            book.setImage(existingImages);
        }
        this.bookRepository.save(book);
        return uploadedPaths;
    }
}
