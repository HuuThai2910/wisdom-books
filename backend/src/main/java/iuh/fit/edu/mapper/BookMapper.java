package iuh.fit.edu.mapper;

import iuh.fit.edu.dto.response.book.ResBookDTO;
import iuh.fit.edu.dto.response.book.ResCreateBookDTO;
import iuh.fit.edu.dto.response.book.ResUpdateBookDTO;
import iuh.fit.edu.dto.response.summary.BookSummaryResponse;
import iuh.fit.edu.entity.Book;
import iuh.fit.edu.entity.EntryFormDetail;
import iuh.fit.edu.entity.Supplier;
import org.mapstruct.*;

import java.util.List;

/**
 * @author Nguyen Tan Nghi
 * @version 1.0
 * @created 11/24/2025 4:21 PM
 */
@Mapper(componentModel = "spring")
public interface BookMapper {
    @Mapping(target = "image", source = "image", qualifiedByName = "firstImage")
    @Mapping(target = "price", source = "sellingPrice")
    BookSummaryResponse toBookSummaryResponse(Book book);

    @Named("firstImage")
    default String mapFirstImage(List<String> images) {
        return (images != null && !images.isEmpty()) ? images.getFirst() : null;
    }

    // =============================
    // MAP ĐƠN GIẢN
    // =============================
    @Mapping(target = "bookImage", ignore = true)
    @Mapping(target = "category", ignore = true)
    @Mapping(target = "review", ignore = true)
    @Mapping(target = "supplier", ignore = true)
    ResBookDTO toResBookDTO(Book book);

    @Mapping(target = "bookImage", ignore = true)
    @Mapping(target = "category", ignore = true)
    @Mapping(target = "supplier", ignore = true)
    @Mapping(target = "entryFormDetail", ignore = true)
    ResCreateBookDTO toResCreateBookDTO(Book book);

    @Mapping(target = "bookImage", ignore = true)
    @Mapping(target = "category", ignore = true)
    @Mapping(target = "supplier", ignore = true)
    @Mapping(target = "entryFormDetail", ignore = true)
    ResUpdateBookDTO toResUpdateBookDTO(Book book);

    // =====================================================================
    //              AFTER MAPPING FOR ResBookDTO
    // =====================================================================
    @AfterMapping
    default void mapResBookDTO(Book book, @MappingTarget ResBookDTO dto) {

        // ---------- IMAGE ----------
        if (book.getImage() != null) {
            dto.setBookImage(book.getImage()
                    .stream()
                    .map(img -> new ResBookDTO.BookImage(book.getId(), img))
                    .toArray(ResBookDTO.BookImage[]::new));
        }

        // ---------- CATEGORY ----------
        if (book.getCategories() != null) {
            dto.setCategory(book.getCategories()
                    .stream()
                    .map(c -> new ResBookDTO.Category(
                            c.getId(), c.getDescription(), c.getName()))
                    .toArray(ResBookDTO.Category[]::new));
        }

        // ---------- REVIEW ----------
        if (book.getReviews() != null) {
            dto.setReview(book.getReviews()
                    .stream()
                    .sorted((r1, r2) -> r2.getReviewDate().compareTo(r1.getReviewDate())) // Sort by date DESC (newest first)
                    .map(r -> {
                        String userName = "Khách hàng";
                        String userAvatar = null;
                        String userEmail = null;
                        if (r.getUser() != null) {
                            userName = r.getUser().getFullName() != null ? r.getUser().getFullName() : "Khách hàng";
                            userAvatar = r.getUser().getAvatar();
                            userEmail = r.getUser().getEmail();
                        }
                        return new ResBookDTO.Review(
                                r.getId(), 
                                r.getComment(), 
                                r.getRating(), 
                                r.getReviewDate(),
                                userName,
                                userAvatar,
                                userEmail);
                    })
                    .toArray(ResBookDTO.Review[]::new));
        }

        // ---------- SUPPLIER ----------
        Supplier s = book.getSupplier();
        if (s != null) {
            dto.setSupplier(new ResBookDTO.Supplier(
                    s.getId(), s.getAddress(), s.getCompanyName(), s.getEmail(), s.getPhone()
            ));
        }
    }


    // =====================================================================
    //              AFTER MAPPING FOR ResCreateBookDTO
    // =====================================================================
    @AfterMapping
    default void mapResCreateBookDTO(Book book, @MappingTarget ResCreateBookDTO dto) {

        // ---------- IMAGE ----------
        if (book.getImage() != null) {
            dto.setBookImage(book.getImage()
                    .stream()
                    .map(img -> new ResCreateBookDTO.BookImage(book.getId(), img))
                    .toArray(ResCreateBookDTO.BookImage[]::new));
        }

        // ---------- CATEGORY ----------
        if (book.getCategories() != null) {
            dto.setCategory(book.getCategories()
                    .stream()
                    .map(c -> new ResCreateBookDTO.Category(
                            c.getId(), c.getDescription(), c.getName()))
                    .toArray(ResCreateBookDTO.Category[]::new));
        }

        // ---------- SUPPLIER ----------
        Supplier s = book.getSupplier();
        if (s != null) {
            dto.setSupplier(new ResCreateBookDTO.Supplier(
                    s.getId(), s.getAddress(), s.getCompanyName(), s.getEmail(), s.getPhone()
            ));
        }

        // ---------- ENTRY FORM DETAIL (lấy mới nhất) ----------
        List<EntryFormDetail> list = book.getEntryFormDetails();
        if (list != null && !list.isEmpty()) {

            EntryFormDetail latest = list.stream()
                    .sorted((a, b) -> b.getEntryForm().getCreatedAt()
                            .compareTo(a.getEntryForm().getCreatedAt()))
                    .findFirst()
                    .orElse(null);

            if (latest != null) {
                dto.setEntryFormDetail(
                        new ResCreateBookDTO.EntryFormDetail(
                                latest.getId(),
                                new ResCreateBookDTO.EntryFormDetail.EntryForm(
                                        latest.getEntryForm().getId(),
                                        latest.getEntryForm().getTotalQuantity(),
                                        latest.getEntryForm().getTotalPrice(),
                                        latest.getEntryForm().getCreatedAt()
                                )
                        )
                );
            }
        }
    }

    @AfterMapping
    default void mapResUpdateBookDTO(Book book, @MappingTarget ResUpdateBookDTO dto) {

        // ---------- IMAGE ----------
        if (book.getImage() != null) {
            dto.setBookImage(book.getImage()
                    .stream()
                    .map(img -> new ResUpdateBookDTO.BookImage(book.getId(), img))
                    .toArray(ResUpdateBookDTO.BookImage[]::new));
        }

        // ---------- CATEGORY ----------
        if (book.getCategories() != null) {
            dto.setCategory(book.getCategories()
                    .stream()
                    .map(c -> new ResUpdateBookDTO.Category(
                            c.getId(), c.getDescription(), c.getName()))
                    .toArray(ResUpdateBookDTO.Category[]::new));
        }

        // ---------- SUPPLIER ----------
        Supplier s = book.getSupplier();
        if (s != null) {
            dto.setSupplier(new ResUpdateBookDTO.Supplier(
                    s.getId(), s.getAddress(), s.getCompanyName(), s.getEmail(), s.getPhone()
            ));
        }

        // ---------- ENTRY FORM DETAIL (lấy mới nhất) ----------
        List<EntryFormDetail> list = book.getEntryFormDetails();
        if (list != null && !list.isEmpty()) {

            EntryFormDetail latest = list.stream()
                    .sorted((a, b) -> b.getEntryForm().getCreatedAt()
                            .compareTo(a.getEntryForm().getCreatedAt()))
                    .findFirst()
                    .orElse(null);

            if (latest != null) {
                dto.setEntryFormDetail(
                        new ResUpdateBookDTO.EntryFormDetail(
                                latest.getId(),
                                new ResUpdateBookDTO.EntryFormDetail.EntryForm(
                                        latest.getEntryForm().getId(),
                                        latest.getEntryForm().getTotalQuantity(),
                                        latest.getEntryForm().getTotalPrice(),
                                        latest.getEntryForm().getCreatedAt()
                                )
                        )
                );
            }
        }
    }
}