package iuh.fit.edu.entities.enums;

public enum BookStatus {
    SALE {
        @Override
        public String toString() {
            return "Đang bán";
        }
    }, STOP_SALE {
        @Override
        public String toString() {
            return "Ngừng bán";
        }
    };
}

