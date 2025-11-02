package iuh.fit.edu.entity.enums;

public enum InventoryStatus {
    IN_STOCK {
        @Override
        public String toString() {
            return "Còn hàng";
        }
    }, OUT_STOCK {
        @Override
        public String toString() {
            return "Hết hàng";
        }
    };
}
