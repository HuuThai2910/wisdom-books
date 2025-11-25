package iuh.fit.edu.entity.constant;

public enum PaymentMethod {
    COD{
        @Override
        public String toString() {
            return "Thanh toán khi nhận hàng";
        }
    }, VNPAY{
        @Override
        public String toString() {
            return "Thanh toán VNPay";
        }
    }
}
