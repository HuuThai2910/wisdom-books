package iuh.fit.edu.service.impl;

import iuh.fit.edu.dto.request.entryform.BookItemDTO;
import iuh.fit.edu.dto.request.entryform.CreateEntryFormDTO;
import iuh.fit.edu.dto.response.ResultPaginationDTO;
import iuh.fit.edu.dto.response.entryform.ResEntryFormDTO;
import iuh.fit.edu.dto.response.entryform.ResEntryFormDetailDTO;
import iuh.fit.edu.entity.Book;
import iuh.fit.edu.entity.EntryForm;
import iuh.fit.edu.entity.EntryFormDetail;
import iuh.fit.edu.repository.BookRepository;
import iuh.fit.edu.repository.EntryFormDetailRepository;
import iuh.fit.edu.repository.EntryFormRepository;
import iuh.fit.edu.repository.InventoryRepository;
import iuh.fit.edu.service.EntryFormService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

/**
 * @author Nguyen Tan Nghi & The Bao
 * @version 1.0
 */
@Service
@RequiredArgsConstructor
public class EntryFormServiceImpl implements EntryFormService {
    private final EntryFormRepository entryFormRepository;
    private final EntryFormDetailRepository entryFormDetailRepository;
    private final InventoryRepository inventoryRepository;
    private final BookRepository bookRepository;

    @Override
    public ResultPaginationDTO getAllEntryForms(Specification<EntryForm> spec, Pageable pageable) {
        Page<EntryForm> pageEntryForm = this.entryFormRepository.findAll(spec, pageable);
        ResultPaginationDTO rs = new ResultPaginationDTO();
        ResultPaginationDTO.Meta mt = new ResultPaginationDTO.Meta();

        mt.setPage(pageable.getPageNumber() + 1);
        mt.setPageSize(pageable.getPageSize());
        mt.setPages(pageEntryForm.getTotalPages());
        mt.setTotal(pageEntryForm.getTotalElements());

        rs.setMeta(mt);
        rs.setResult(pageEntryForm.getContent().stream()
                .map(this::convertToResEntryFormDTO)
                .toList());

        return rs;
    }

    @Override
    public ResEntryFormDTO convertToResEntryFormDTO(EntryForm entryForm) {
        ResEntryFormDTO dto = new ResEntryFormDTO();
        dto.setId(entryForm.getId());
        dto.setTotalQuantity(entryForm.getTotalQuantity());
        dto.setTotalPrice(entryForm.getTotalPrice());
        dto.setCreatedAt(entryForm.getCreatedAt());
        
        // Get user's full name from user entity
        if (entryForm.getUser() != null) {
            dto.setCreatedBy(entryForm.getUser().getFullName());
        }
        
        return dto;
    }

    @Override
    public Long getNextInvoiceNumber() {
        Long maxId = entryFormRepository.findMaxId();
        return maxId + 1;
    }

    @Override
    public Integer getTotalInventoryQuantity() {
        return inventoryRepository.getTotalQuantity();
    }

    @Override
    @Transactional
    public ResEntryFormDTO createEntryForm(CreateEntryFormDTO dto) {
        // Validate total quantity
        int totalQuantity = dto.getBooks().stream()
                .mapToInt(BookItemDTO::getQuantity)
                .sum();
        
        Integer currentInventoryQty = getTotalInventoryQuantity();
        // Tổng số lượng trong phiếu nhập không được vượt quá tổng số lượng sách trong kho
        if (totalQuantity > currentInventoryQty) {
            throw new IllegalArgumentException("Tổng số lượng sách trong phiếu nhập (" + totalQuantity + ") không được vượt quá tổng số lượng sách trong kho (" + currentInventoryQty + ")");
        }

        // Validate each book quantity
        for (BookItemDTO bookItem : dto.getBooks()) {
            Book book = bookRepository.findByIsbn(bookItem.getIsbn())
                    .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy sách với ISBN: " + bookItem.getIsbn()));
            
            if (book.getQuantity() + bookItem.getQuantity() > 10000) {
                throw new IllegalArgumentException("Số lượng sách " + book.getTitle() + " không được vượt quá 10000 cuốn");
            }
        }

        // Create EntryForm
        EntryForm entryForm = new EntryForm();
        entryForm.setTotalQuantity(totalQuantity);
        entryForm.setTotalPrice(dto.getBooks().stream()
                .mapToDouble(BookItemDTO::getAmount)
                .sum());
        entryForm.setCreatedAt(LocalDateTime.now());
        
        // TODO: Set current user - you need to implement SecurityUtil or get user from context
        // User currentUser = SecurityUtil.getCurrentUser();
        // entryForm.setUser(currentUser);

        EntryForm savedEntryForm = entryFormRepository.save(entryForm);

        // Create EntryFormDetails
        List<EntryFormDetail> details = new ArrayList<>();
        for (BookItemDTO bookItem : dto.getBooks()) {
            Book book = bookRepository.findByIsbn(bookItem.getIsbn())
                    .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy sách với ISBN: " + bookItem.getIsbn()));

            EntryFormDetail detail = new EntryFormDetail();
            detail.setEntryForm(savedEntryForm);
            detail.setBook(book);
            detail.setQuantity(bookItem.getQuantity());
            detail.setUnitPrice(bookItem.getImportPrice());
            
            details.add(detail);
            
            // Update book quantity
            book.setQuantity(book.getQuantity() + bookItem.getQuantity());
            bookRepository.save(book);
        }
        
        entryFormDetailRepository.saveAll(details);

        return convertToResEntryFormDTO(savedEntryForm);
    }

    @Override
    public List<ResEntryFormDetailDTO> getEntryFormDetails(Long entryFormId) {
        List<EntryFormDetail> details = entryFormDetailRepository.findByEntryFormId(entryFormId);
        
        return details.stream().map(detail -> {
            ResEntryFormDetailDTO dto = new ResEntryFormDetailDTO();
            dto.setId(detail.getId());
            dto.setIsbn(detail.getBook().getIsbn());
            dto.setTitle(detail.getBook().getTitle());
            dto.setYearOfPublication(detail.getBook().getYearOfPublication());
            dto.setQuantity(detail.getQuantity());
            dto.setUnitPrice(detail.getUnitPrice());
            dto.setAmount(detail.getQuantity() * detail.getUnitPrice());
            return dto;
        }).toList();
    }
}
