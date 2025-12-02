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
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.Optional;

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
    public Book createBook(Book book) {
        // Xử lý Supplier nếu có
        if (book.getSupplier() != null && book.getSupplier().getId() != null) {
            Optional<Supplier> optionalSupplier = this.supplierRepository.findById(book.getSupplier().getId());
            book.setSupplier(optionalSupplier.orElse(null));
        }

        // Xử lý Categories nếu có
        if (book.getCategories() != null && !book.getCategories().isEmpty()) {
            List<Category> validCategories = book.getCategories().stream()
                    .filter(cat -> cat.getId() != null)
                    .map(cat -> this.categoryRepository.findById(cat.getId()).orElse(null))
                    .filter(Objects::nonNull)
                    .toList();
            book.setCategories(validCategories);
        }

        // Xử lý Inventory nếu có
        if (book.getInventory() != null && book.getInventory().getId() != null) {
            Optional<Inventory> optionalInventory = this.inventoryRepository.findById(book.getInventory().getId());
            book.setInventory(optionalInventory.orElse(null));
        }

        // Lưu sách vào database
        Book savedBook = this.bookRepository.save(book);

        // Cập nhật inventory quantity khi tạo sách mới
        if (savedBook.getQuantity() > 0 && savedBook.getInventory() != null) {
            Inventory inventory = savedBook.getInventory();
            inventory.setQuantity(inventory.getQuantity() + savedBook.getQuantity());
            this.inventoryRepository.save(inventory);
        }

        // Tạo EntryForm và EntryFormDetail khi thêm sách mới
        if (savedBook.getQuantity() > 0) {
            createEntryFormForBook(savedBook, savedBook.getQuantity(), savedBook.getImportPrice());
        }

        return savedBook;
    }

    @Override
    @Transactional
    public Book updateBook(Book book) {
        try {
            System.out.println("=== SERVICE: UPDATE BOOK ===");
            System.out.println("Finding book with ID: " + book.getId());

            Optional<Book> optionalBook = this.bookRepository.findById(book.getId());
            if (optionalBook.isPresent()) {
                Book updatedBook = optionalBook.get();
                System.out.println("Found book: " + updatedBook.getTitle());

                // Cập nhật ISBN nếu có thay đổi
                if (book.getIsbn() != null && !book.getIsbn().isEmpty() && !book.getIsbn().equals(updatedBook.getIsbn())) {
                    // Kiểm tra ISBN mới có bị trùng không
                    if (this.bookRepository.existsByIsbn(book.getIsbn())) {
                        System.err.println("ISBN already exists: " + book.getIsbn());
                        return null; // Trả về null để Controller xử lý
                    }
                    updatedBook.setIsbn(book.getIsbn());
                }

                // Cập nhật các trường cơ bản - CHỈ KHI KHÔNG NULL
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
                    System.out.println("Updating status from " + updatedBook.getStatus() + " to " + book.getStatus());
                    updatedBook.setStatus(book.getStatus());
                }
                
                // Lưu số lượng CŨ trước khi cập nhật
                int oldQuantity = updatedBook.getQuantity();
                
                // Cập nhật quantity
                if (book.getQuantity() >= 0) {
                    updatedBook.setQuantity(book.getQuantity());
                }

                // Cập nhật danh sách hình ảnh
                if (book.getImage() != null) {
                    System.out.println("Updating images: " + book.getImage().size());
                    // Clear existing images and add new ones for ElementCollection
                    if (updatedBook.getImage() != null) {
                        updatedBook.getImage().clear();
                        updatedBook.getImage().addAll(book.getImage());
                    } else {
                        updatedBook.setImage(book.getImage());
                    }
                }

                // Cập nhật Supplier
                if (book.getSupplier() != null && book.getSupplier().getId() != null) {
                    System.out.println("Updating supplier: " + book.getSupplier().getId());
                    Optional<Supplier> optionalSupplier = this.supplierRepository.findById(book.getSupplier().getId());
                    updatedBook.setSupplier(optionalSupplier.orElse(updatedBook.getSupplier()));
                }

                // Cập nhật Categories (ManyToMany)
                if (book.getCategories() != null) {
                    System.out.println("Updating categories: " + book.getCategories().size());
                    List<Category> validCategories = book.getCategories().stream()
                            .filter(cat -> cat.getId() != null)
                            .map(cat -> this.categoryRepository.findById(cat.getId()).orElse(null))
                            .filter(Objects::nonNull)
                            .toList();
                    System.out.println("Valid categories found: " + validCategories.size());
                    // Clear existing categories and add new ones
                    updatedBook.getCategories().clear();
                    updatedBook.getCategories().addAll(validCategories);
                }

                // Cập nhật Inventory
                if (book.getInventory() != null && book.getInventory().getId() != null) {
                    System.out.println("Updating inventory: " + book.getInventory().getId());
                    Optional<Inventory> optionalInventory = this.inventoryRepository.findById(book.getInventory().getId());
                    updatedBook.setInventory(optionalInventory.orElse(updatedBook.getInventory()));
                }

                // Tính toán chênh lệch số lượng
                int newQuantity = updatedBook.getQuantity();
                int quantityDiff = newQuantity - oldQuantity;

                // Cập nhật thông tin audit
                updatedBook.setUpdatedAt(LocalDateTime.now());
                updatedBook.setUpdatedBy("tan nghi");

                System.out.println("=== BEFORE SAVE ===");
                System.out.println("Book ID: " + updatedBook.getId());
                System.out.println("Title: " + updatedBook.getTitle());
                System.out.println("Author: " + updatedBook.getAuthor());
                System.out.println("Quantity: " + updatedBook.getQuantity());
                System.out.println("Selling Price: " + updatedBook.getSellingPrice());
                System.out.println("Categories count: " + (updatedBook.getCategories() != null ? updatedBook.getCategories().size() : 0));

                System.out.println("Saving book to database...");
                Book savedBook = this.bookRepository.save(updatedBook);
                System.out.println("Book saved successfully!");
                
                System.out.println("=== AFTER SAVE ===");
                System.out.println("Saved Book ID: " + savedBook.getId());
                System.out.println("Saved Title: " + savedBook.getTitle());
                System.out.println("Saved Quantity: " + savedBook.getQuantity());

                System.out.println("=== AFTER SAVE ===");
                System.out.println("Saved Book ID: " + savedBook.getId());
                System.out.println("Saved Title: " + savedBook.getTitle());
                System.out.println("Saved Quantity: " + savedBook.getQuantity());

                // Nếu số lượng tăng, tạo EntryForm
                if (quantityDiff > 0) {
                    System.out.println("Quantity increased by: " + quantityDiff + ". Creating EntryForm...");
                    createEntryFormForBook(savedBook, quantityDiff, book.getImportPrice() > 0 ? book.getImportPrice() : savedBook.getImportPrice());
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
    public void deleteBook(Long id) {
        Optional<Book> optionalBook = this.bookRepository.findById(id);
        if (optionalBook.isPresent()) {
            Book book = optionalBook.get();
            book.setStatus(BookStatus.STOP_SALE);
            book.setUpdatedAt(LocalDateTime.now());
            book.setUpdatedBy("tan nghi");
            this.bookRepository.save(book);
        }
    }

    @Override
    public Book findBookById(Long id) {
        return this.bookRepository.findById(id).orElse(null);
    }

    @Override
    @Transactional
    public Book createBookFromDTO(ReqCreateBookDTO reqCreateBookDTO) {
        Book book = new Book();
        book.setIsbn(reqCreateBookDTO.getIsbn());
        book.setTitle(reqCreateBookDTO.getTitle());
        book.setAuthor(reqCreateBookDTO.getAuthor());
        book.setYearOfPublication(reqCreateBookDTO.getYearOfPublication());
        book.setShortDes(reqCreateBookDTO.getShortDes());
        book.setDescription(reqCreateBookDTO.getDescription());
        book.setSellingPrice(reqCreateBookDTO.getSellingPrice());
        book.setImportPrice(reqCreateBookDTO.getImportPrice());
        book.setStatus(reqCreateBookDTO.getStatus());
        book.setQuantity(reqCreateBookDTO.getQuantity());
        book.setImage(reqCreateBookDTO.getImage());

        // Xử lý Supplier
        if (reqCreateBookDTO.getSupplierId() != null) {
            Supplier supplier = new Supplier();
            supplier.setId(reqCreateBookDTO.getSupplierId());
            book.setSupplier(supplier);
        }

        // Xử lý Categories
        if (reqCreateBookDTO.getCategoryIds() != null && !reqCreateBookDTO.getCategoryIds().isEmpty()) {
            List<Category> categories = reqCreateBookDTO.getCategoryIds().stream()
                    .map(id -> {
                        Category cat = new Category();
                        cat.setId(id);
                        return cat;
                    })
                    .toList();
            book.setCategories(categories);
        }

        // Xử lý Inventory
        if (reqCreateBookDTO.getInventoryId() != null) {
            Inventory inventory = new Inventory();
            inventory.setId(reqCreateBookDTO.getInventoryId());
            book.setInventory(inventory);
        }

        return this.createBook(book);
    }

    @Override
    @Transactional
    public Book updateBookFromDTO(ReqUpdateBookDTO reqUpdateBookDTO) {
        Book book = this.findBookById(reqUpdateBookDTO.getId());
        if (book == null) {
            return null;
        }

        // Cập nhật các trường nếu không null
        if (reqUpdateBookDTO.getIsbn() != null) {
            book.setIsbn(reqUpdateBookDTO.getIsbn());
        }
        if (reqUpdateBookDTO.getTitle() != null) {
            book.setTitle(reqUpdateBookDTO.getTitle());
        }
        if (reqUpdateBookDTO.getAuthor() != null) {
            book.setAuthor(reqUpdateBookDTO.getAuthor());
        }
        if (reqUpdateBookDTO.getYearOfPublication() != null) {
            book.setYearOfPublication(reqUpdateBookDTO.getYearOfPublication());
        }
        if (reqUpdateBookDTO.getShortDes() != null) {
            book.setShortDes(reqUpdateBookDTO.getShortDes());
        }
        if (reqUpdateBookDTO.getDescription() != null) {
            book.setDescription(reqUpdateBookDTO.getDescription());
        }
        if (reqUpdateBookDTO.getSellingPrice() != null) {
            book.setSellingPrice(reqUpdateBookDTO.getSellingPrice());
        }
        if (reqUpdateBookDTO.getImportPrice() != null) {
            book.setImportPrice(reqUpdateBookDTO.getImportPrice());
        }
        if (reqUpdateBookDTO.getStatus() != null) {
            book.setStatus(reqUpdateBookDTO.getStatus());
        }
        if (reqUpdateBookDTO.getQuantity() != null) {
            book.setQuantity(reqUpdateBookDTO.getQuantity());
        }
        if (reqUpdateBookDTO.getImage() != null) {
            book.setImage(reqUpdateBookDTO.getImage());
        }

        // Xử lý Supplier
        if (reqUpdateBookDTO.getSupplierId() != null) {
            Supplier supplier = new Supplier();
            supplier.setId(reqUpdateBookDTO.getSupplierId());
            book.setSupplier(supplier);
        }

        // Xử lý Categories
        if (reqUpdateBookDTO.getCategoryIds() != null) {
            List<Category> categories = reqUpdateBookDTO.getCategoryIds().stream()
                    .map(id -> {
                        Category cat = new Category();
                        cat.setId(id);
                        return cat;
                    })
                    .toList();
            book.setCategories(categories);
        }

        // Xử lý Inventory
        if (reqUpdateBookDTO.getInventoryId() != null) {
            Inventory inventory = new Inventory();
            inventory.setId(reqUpdateBookDTO.getInventoryId());
            book.setInventory(inventory);
        }

        return this.updateBook(book);
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
    public boolean existsByIsbn(String isbn) {
        return this.bookRepository.existsByIsbn(isbn);
    }

    /**
     * Tạo EntryForm và EntryFormDetail khi nhập hàng
     * @param book Sách được nhập
     * @param quantity Số lượng nhập
     * @param unitPrice Giá nhập đơn vị
     */
    private void createEntryFormForBook(Book book, int quantity, double unitPrice) {
        try {
            System.out.println("=== CREATING ENTRY FORM ===");
            System.out.println("Book: " + book.getTitle());
            System.out.println("Quantity: " + quantity);
            System.out.println("Unit Price: " + unitPrice);

            // Tạo EntryForm (Phiếu nhập)
            EntryForm entryForm = new EntryForm();
            entryForm.setTotalQuantity(quantity);
            entryForm.setTotalPrice(quantity * unitPrice);
            entryForm.setCreatedAt(LocalDateTime.now());

            // Tìm user (có thể lấy từ SecurityContext, tạm thời dùng user đầu tiên)
            Optional<User> optionalUser = this.userRepository.findById(1L);
            optionalUser.ifPresent(entryForm::setUser);

            // Lưu EntryForm
            EntryForm savedEntryForm = this.entryFormRepository.save(entryForm);
            System.out.println("EntryForm created with ID: " + savedEntryForm.getId());

            // Tạo EntryFormDetail (Chi tiết phiếu nhập)
            EntryFormDetail entryFormDetail = new EntryFormDetail();
            entryFormDetail.setBook(book);
            entryFormDetail.setEntryForm(savedEntryForm);
            entryFormDetail.setQuantity(quantity);
            entryFormDetail.setUnitPrice(unitPrice);

            // Lưu EntryFormDetail
            EntryFormDetail savedDetail = this.entryFormDetailRepository.save(entryFormDetail);
            System.out.println("EntryFormDetail created with ID: " + savedDetail.getId());
            System.out.println("=== ENTRY FORM CREATED SUCCESSFULLY ===");

        } catch (Exception e) {
            System.err.println("=== ERROR CREATING ENTRY FORM ===");
            e.printStackTrace();
            // Không throw exception để không làm gián đoạn việc tạo/cập nhật sách
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
        
        // Upload từng ảnh vào folder riêng của sách: books/{bookId}/
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

        // Cập nhật danh sách ảnh vào database
        if (book.getImage() == null) {
            book.setImage(uploadedPaths);
        } else {
            book.getImage().addAll(uploadedPaths);
        }
        
        this.bookRepository.save(book);
        
        return uploadedPaths;
    }
}
