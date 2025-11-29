import { useCallback, useState } from "react";
import toast from "react-hot-toast";
import { useAppDispatch, useAppSelector } from "../app/store";
import paymentApi from "../api/paymentApi";
import voucherApi from "../api/voucherApi";
import { UseOrderSubmitReturn, DeliveryFormData, CheckoutItem } from "../types";
import { removeItem } from "../features/cart/cartSlice";
import { clearCheckoutItems } from "../features/checkout/checkoutSlice";

export const useOrderSubmit = (): UseOrderSubmitReturn & {
    outOfStockModal: {
        isOpen: boolean;
        message: string;
    };
    closeOutOfStockModal: () => void;
} => {
    const [outOfStockModal, setOutOfStockModal] = useState({
        isOpen: false,
        message: "",
    });

    const closeOutOfStockModal = useCallback(() => {
        setOutOfStockModal({ isOpen: false, message: "" });
    }, []);
    const dispatch = useAppDispatch();
    const checkoutItems = useAppSelector(
        (state) => state.checkout.checkoutItems
    );

    const handleSubmit = useCallback(
        async (
            formData: DeliveryFormData,
            paymentMethod: string,
            selectedVoucher: number | null,
            total: number,
            validateFormRef?: React.MutableRefObject<(() => boolean) | null>
        ) => {
            // Trigger validation in DeliveryInformation component
            if (validateFormRef?.current) {
                const isValid = validateFormRef.current();
                if (!isValid) {
                    return;
                }
            }

            // Prepare items for API
            const items = checkoutItems.map((item: CheckoutItem) => ({
                bookId: item.book.id,
                quantity: item.quantity,
                price: item.book.price,
            }));

            // Prepare full address
            const fullAddress = `${formData.address}, ${formData.ward}, ${formData.province}`;

            // Map payment method to API format
            const apiPaymentMethod = paymentMethod;

            // Prepare order data for API
            const orderData = {
                receiverName: formData.fullName,
                receiverPhone: formData.phone,
                receiverAddress: fullAddress,
                receiverEmail: formData.email,
                note: formData.orderNote || "",
                paymentMethod: apiPaymentMethod as "COD" | "VNPAY",
                totalPrice: total,
                items: items,
            };

            try {
                const response = await paymentApi.createOrder(orderData);

                if (response.data.success) {
                    if (selectedVoucher !== null) {
                        await voucherApi.removeVoucherFromUser(selectedVoucher);
                    }
                    // Ensure cart items are removed on server before redirecting
                    try {
                        await dispatch(
                            removeItem(checkoutItems.map((item) => item.id))
                        ).unwrap();
                    } catch (e) {
                        // Proceed even if cleanup fails; user can retry later
                    }
                    dispatch(clearCheckoutItems());
                    // If payment method is VNPAY and has paymentUrl, redirect to payment
                    if (
                        apiPaymentMethod === "VNPAY" &&
                        response.data.data.paymentUrl
                    ) {
                        toast.success("Đang chuyển đến trang thanh toán...");
                        window.location.href = response.data.data
                            .paymentUrl as string;
                    } else {
                        // COD order success - redirect to payment success page with order info
                        const orderInfo = response.data.data;
                        const params = new URLSearchParams({
                            cod: "true",
                            orderCode: orderInfo.orderCode || "",
                            totalPrice: orderInfo.totalPrice?.toString() || "0",
                            orderDate:
                                orderInfo.orderDate || new Date().toISOString(),
                        });
                        toast.success(
                            "Đơn hàng của bạn đã được đặt thành công!"
                        );
                        window.location.href = `/payment-success?${params.toString()}`;
                    }
                } else {
                    // Check if error is out of stock in response
                    const errorMessage = response.data.message || "";

                    if (errorMessage.includes("không đủ số lượng")) {
                        setOutOfStockModal({
                            isOpen: true,
                            message: errorMessage,
                        });
                    } else {
                        toast.error(
                            errorMessage || "Có lỗi xảy ra khi đặt hàng"
                        );
                    }
                }
            } catch (error: any) {
                const errorMessage = error.message || "";
                if (errorMessage.includes("không đủ số lượng")) {
                    setOutOfStockModal({
                        isOpen: true,
                        message: errorMessage,
                    });
                } else {
                    toast.error(errorMessage || "Có lỗi xảy ra khi đặt hàng");
                }
                console.error("Order submission error:", error);
            }
        },
        [checkoutItems]
    );

    return {
        handleSubmit,
        outOfStockModal,
        closeOutOfStockModal,
    };
};
