package iuh.fit.edu.entity.constant;

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

