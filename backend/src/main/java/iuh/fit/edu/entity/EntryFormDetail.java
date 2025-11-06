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

    @ManyToOne
    private Book book;

    @ManyToOne
    @JoinColumn(name = "entry_form_id")
    private EntryForm entryForm;
}