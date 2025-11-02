package iuh.fit.edu.entity.enums;

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

