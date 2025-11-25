package iuh.fit.edu.entity.constant;

/**
 * @author Nguyen Tan Nghi
 * @version 1.0
 * @created 11/25/2025 9:10 PM
 */
public enum PaymentStatus {
    UNPAID {
        @Override
        public String toString() {
            return "Chưa thanh toán";
        }
    },
    PAID {
        @Override
        public String toString() {
            return "Đã thanh toán";
        }
    }
}