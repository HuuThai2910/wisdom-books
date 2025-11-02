package iuh.fit.edu.entity;

import iuh.fit.edu.entity.enums.InventoryStatus;
import jakarta.persistence.*;
import lombok.Data;

import java.util.List;

@Entity
@Table(name = "inventories")
@Data
public class Inventory {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private int quantity;
    private InventoryStatus inventoryStatus;

    @OneToMany(mappedBy = "inventory")
    private List<Book> books;

}