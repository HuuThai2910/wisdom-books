package iuh.fit.edu.entity.constant;

public enum PaymentMethod {
    COD{
        @Override
        public String toString() {
            return "Tiền mặt";
        }
    }, CREDIT_CARD{
        @Override
        public String toString() {
            return "Chuyển khoản";
        }
    }
}
