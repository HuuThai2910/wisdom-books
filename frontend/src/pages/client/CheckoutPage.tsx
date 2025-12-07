import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import VoucherModal from "../../components/modal/VoucherModal";
import OutOfStockModal from "../../components/modal/OutOfStockModal";
import CheckoutBreadcrumb from "../../components/checkout/CheckoutBreadcrumb";
import DeliveryInformation from "../../components/checkout/DeliveryInformation";
import VoucherSelector from "../../components/checkout/VoucherSelector";
import PaymentMethod from "../../components/checkout/PaymentMethod";
import OrderSummary from "../../components/checkout/OrderSummary";
import { useCheckout } from "../../hooks/checkout/useCheckout";
import { useDeliveryForm } from "../../hooks/checkout/useDeliveryForm";
import { usePaymentMethod } from "../../hooks/checkout/usePaymentMethod";
import { useOrderSubmit } from "../../hooks/checkout/useOrderSubmit";

/**
 * Component trang thanh toán
 * Xử lý toàn bộ quy trình đặt hàng từ nhập thông tin giao hàng đến thanh toán
 */
const CheckOutPage = () => {
    const navigate = useNavigate();
    // Ref để trigger validation từ component DeliveryInformation
    const validateFormRef = useRef<(() => boolean) | null>(null);

    // === CUSTOM HOOKS ===

    // Hook quản lý logic checkout: voucher, tính toán giá
    const {
        checkoutItems, // Danh sách sản phẩm checkout từ Redux
        defaultAddress, // Địa chỉ mặc định của user
        vouchers, // Danh sách voucher có thể dùng
        selectedVoucher, // ID voucher đang chọn
        selectedVoucherData, // Thông tin chi tiết voucher đang chọn
        isVoucherModalOpen, // Trạng thái mở/đóng modal voucher
        subtotal, // Tổng tiền trước giảm giá
        discount, // Số tiền được giảm
        total, // Tổng tiền sau giảm giá
        handleSelectVoucher, // Hàm chọn voucher
        handleRemoveVoucher, // Hàm bỏ chọn voucher
        openVoucherModal, // Hàm mở modal voucher
        closeVoucherModal, // Hàm đóng modal voucher
    } = useCheckout();

    // Hook quản lý form thông tin giao hàng
    const {
        formData, // Dữ liệu form (họ tên, SĐT, địa chỉ...)
        checkDefault, // Trạng thái checkbox "Sử dụng địa chỉ mặc định"
        handleFormChange, // Hàm cập nhật dữ liệu form
        handleCheckDefaultChange, // Hàm xử lý khi toggle checkbox địa chỉ mặc định
    } = useDeliveryForm(defaultAddress || undefined);

    // Hook quản lý phương thức thanh toán
    const { paymentMethod, handlePaymentMethodChange } = usePaymentMethod();

    // Hook xử lý submit đơn hàng
    const {
        handleSubmit: submitOrder, // Hàm submit đơn hàng
        outOfStockModal, // State modal thông báo hết hàng
        closeOutOfStockModal, // Hàm đóng modal hết hàng
    } = useOrderSubmit();

    /**
     * Hàm xử lý submit form đặt hàng
     * Gọi submitOrder với các tham số cần thiết
     */
    const handleSubmit = () => {
        submitOrder(
            formData, // Thông tin giao hàng
            paymentMethod, // Phương thức thanh toán (COD/VNPAY)
            selectedVoucher, // ID voucher đã chọn
            total, // Tổng tiền sau giảm giá
            validateFormRef // Ref để trigger validation form
        );
    };

    /**
     * Hàm xử lý khi click "Quay lại giỏ hàng" trong modal hết hàng
     * Đóng modal và chuyển về trang giỏ hàng
     */
    const handleGoToCart = () => {
        closeOutOfStockModal();
        navigate("/cart");
    };

    return (
        <div className="min-h-screen max-w-7xl mx-auto bg-gray-50 mt-20">
            <CheckoutBreadcrumb />

            <div className="py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Section - Form */}
                    <div className="lg:col-span-2 space-y-6">
                        <DeliveryInformation
                            formData={formData}
                            onFormChange={handleFormChange}
                            defaultAddress={defaultAddress || undefined}
                            checkDefault={checkDefault}
                            onCheckDefaultChange={handleCheckDefaultChange}
                            triggerValidation={validateFormRef as any}
                        />

                        <VoucherSelector
                            selectedVoucher={selectedVoucher}
                            selectedVoucherData={selectedVoucherData}
                            discount={discount}
                            onOpenModal={openVoucherModal}
                            onRemoveVoucher={handleRemoveVoucher}
                        />

                        <PaymentMethod
                            paymentMethod={paymentMethod}
                            onPaymentMethodChange={handlePaymentMethodChange}
                        />
                    </div>

                    {/* Right Section - Order Summary */}
                    <div className="lg:col-span-1">
                        <OrderSummary
                            checkoutItems={checkoutItems}
                            subtotal={subtotal}
                            discount={discount}
                            total={total}
                            onSubmit={handleSubmit}
                        />
                    </div>
                </div>
            </div>

            <VoucherModal
                isOpen={isVoucherModalOpen}
                onClose={closeVoucherModal}
                vouchers={vouchers}
                subtotal={subtotal}
                selectedVoucher={selectedVoucher}
                onSelectVoucher={handleSelectVoucher}
            />

            <OutOfStockModal
                isOpen={outOfStockModal.isOpen}
                message={outOfStockModal.message}
                onClose={closeOutOfStockModal}
                onGoToCart={handleGoToCart}
            />
        </div>
    );
};

export default CheckOutPage;
