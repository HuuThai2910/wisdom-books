package iuh.fit.edu.entity.constant;

public enum OrderStatus {
    PENDING {
        @Override
        public String toString() {
            return "Chờ xác nhận";
        }
    }, PROCESSING {
        @Override
        public String toString() {
            return "Đang xử lý";
        }
    }, SHIPPING {
        @Override
        public String toString() {
            return "Đang vận chuyển";
        }
    }, DELIVERED {
        @Override
        public String toString() {
            return "Đã vận chuyển";
        }
    }, CANCELLED {
        @Override
        public String toString() {
            return "Đã hủy";
        }
    }
}
