import { PaymentMethodProps } from "../../types";

const PaymentMethod: React.FC<PaymentMethodProps> = ({
    paymentMethod,
    onPaymentMethodChange,
}) => {
    return (
        <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-6">
                Phương thức thanh toán
            </h2>

            <div className="space-y-4">
                <label className="flex items-start cursor-pointer">
                    <input
                        type="radio"
                        name="payment"
                        value="bank-transfer"
                        checked={paymentMethod === "bank-transfer"}
                        onChange={(e) => onPaymentMethodChange(e.target.value)}
                        className="mt-1 mr-3"
                    />
                    <div className="flex-1">
                        <div className="font-medium">
                            Chuyển khoản ngân hàng
                        </div>
                        <p className="text-sm text-gray-600 mt-1">
                            Thực hiện thanh toán vào ngay tài khoản ngân hàng
                            của chúng tôi. Vui lòng sử dụng Mã đơn hàng của bạn
                            trong phần Nội dung thanh toán. Đơn hàng sẽ được
                            giao sau khi tiền đã chuyển.
                        </p>
                    </div>
                </label>

                <label className="flex items-start cursor-pointer">
                    <input
                        type="radio"
                        name="payment"
                        value="cod"
                        checked={paymentMethod === "cod"}
                        onChange={(e) => onPaymentMethodChange(e.target.value)}
                        className="mt-1 mr-3"
                    />
                    <div className="flex-1">
                        <div className="font-medium">
                            Trả tiền mặt khi nhận hàng
                        </div>
                    </div>
                </label>
            </div>

            {paymentMethod === "bank-transfer" && (
                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                    <h3 className="font-semibold mb-3">Thông tin ngân hàng</h3>
                    <div className="space-y-2 text-sm">
                        <div>
                            <span className="font-medium">Chủ tài khoản:</span>{" "}
                            NGUYEN NGOC LAN
                        </div>
                        <div>
                            <span className="font-medium">Số tài khoản:</span>{" "}
                            5686999669
                        </div>
                        <div>
                            <span className="font-medium">Ngân Hàng:</span>{" "}
                            TECHCOMBANK
                        </div>
                        <div>
                            <span className="font-medium">
                                Nội dung chuyển khoản:
                            </span>{" "}
                            Mã đơn hàng + SĐT (ví dụ: 0123 + 0912345678)
                        </div>
                    </div>
                    <div className="mt-4 flex justify-center">
                        <div className="w-48 h-48 bg-gray-200 rounded-lg flex items-center justify-center">
                            <span className="text-gray-500">QR Code</span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PaymentMethod;
