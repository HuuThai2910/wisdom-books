package iuh.fit.edu.entity.constant;

public enum OrderStatus {
    PENDING {
        @Override
        public String toString() {
            return "Chờ duyệt";
        }
    }, PROCESSING {
        @Override
        public String toString() {
            return "Đang xử lý";
        }
    }, SHIPPING {
        @Override
        public String toString() {
            return "Đang giao";
        }
    }, DELIVERED {
        @Override
        public String toString() {
            return "Đã giao";
        }
    }, CANCELLED {
        @Override
        public String toString() {
            return "Đã hủy";
        }
    }
}
