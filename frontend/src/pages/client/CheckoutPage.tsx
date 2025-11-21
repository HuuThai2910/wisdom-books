import VoucherModal from "../../components/modal/VoucherModal";
import CheckoutBreadcrumb from "../../components/checkout/CheckoutBreadcrumb";
import DeliveryInformation from "../../components/checkout/DeliveryInformation";
import VoucherSelector from "../../components/checkout/VoucherSelector";
import PaymentMethod from "../../components/checkout/PaymentMethod";
import OrderSummary from "../../components/checkout/OrderSummary";
import { useCheckout } from "../../hooks/useCheckout";
import { useDeliveryForm } from "../../hooks/useDeliveryForm";
import { usePaymentMethod } from "../../hooks/usePaymentMethod";
import { useOrderSubmit } from "../../hooks/useOrderSubmit";

const CheckOutPage = () => {
    // Custom hooks
    const {
        checkoutItems,
        defaultAddress,
        vouchers,
        selectedVoucher,
        selectedVoucherData,
        isVoucherModalOpen,
        subtotal,
        discount,
        total,
        handleSelectVoucher,
        handleRemoveVoucher,
        openVoucherModal,
        closeVoucherModal,
    } = useCheckout();

    const {
        formData,
        checkDefault,
        handleFormChange,
        handleCheckDefaultChange,
    } = useDeliveryForm(defaultAddress || undefined);

    const { paymentMethod, handlePaymentMethodChange } = usePaymentMethod();

    const { handleSubmit: submitOrder } = useOrderSubmit();

    const handleSubmit = () => {
        submitOrder(formData, paymentMethod, selectedVoucher, total);
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
        </div>
    );
};

export default CheckOutPage;
