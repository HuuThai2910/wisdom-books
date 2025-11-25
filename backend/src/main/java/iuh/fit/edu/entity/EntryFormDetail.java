package iuh.fit.edu.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "entry_form_details")
@Data
public class EntryFormDetail {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private int quantity;        // Số lượng nhập
    private double unitPrice;    // Giá nhập đơn vị

    @ManyToOne
    @JoinColumn(name = "book_id")
    private Book book;

    @ManyToOne
    @JoinColumn(name = "entry_form_id")
    private EntryForm entryForm;
}