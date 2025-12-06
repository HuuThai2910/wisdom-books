import { useCallback, useState } from "react";
import toast from "react-hot-toast";
import { useAppDispatch, useAppSelector } from "../../app/store";
import paymentApi from "../../api/paymentApi";
import voucherApi from "../../api/voucherApi";
import {
    UseOrderSubmitReturn,
    DeliveryFormData,
    CheckoutItem,
} from "../../types";
import { removeItem } from "../../features/cart/cartSlice";
import { clearCheckoutItems } from "../../features/checkout/checkoutSlice";

/**
 * Custom hook xử lý logic submit đơn hàng
 * Xử lý: validate form, chuẩn bị dữ liệu, gọi API tạo đơn, xử lý thanh toán, quản lý modal hết hàng
 * @returns Hàm handleSubmit và các state/hàm quản lý modal
 */
export const useOrderSubmit = (): UseOrderSubmitReturn & {
    outOfStockModal: {
        isOpen: boolean;
        message: string;
    };
    closeOutOfStockModal: () => void;
} => {
    /**
     * State quản lý modal thông báo sản phẩm hết hàng
     * isOpen: trạng thái mở/đóng modal
     * message: nội dung thông báo lỗi từ API
     */
    const [outOfStockModal, setOutOfStockModal] = useState({
        isOpen: false,
        message: "",
    });

    /**
     * Hàm đóng modal hết hàng
     * Reset state modal về trạng thái ban đầu
     */
    const closeOutOfStockModal = useCallback(() => {
        setOutOfStockModal({ isOpen: false, message: "" });
    }, []);

    const dispatch = useAppDispatch();

    // Lấy danh sách sản phẩm checkout từ Redux store
    const checkoutItems = useAppSelector(
        (state) => state.checkout.checkoutItems
    );

    /**
     * Hàm xử lý submit đơn hàng
     * @param formData - Thông tin giao hàng (tên, SĐT, địa chễ...)
     * @param paymentMethod - Phương thức thanh toán (COD hoặc VNPAY)
     * @param selectedVoucher - ID voucher đã chọn (nếu có)
     * @param total - Tổng tiền sau giảm giá
     * @param validateFormRef - Ref để trigger validation form
     *
     * Quy trình:
     * 1. Validate form thông tin giao hàng
     * 2. Chuẩn bị dữ liệu đơn hàng
     * 3. Gọi API tạo đơn hàng
     * 4. Xử lý theo phương thức thanh toán:
     *    - VNPAY: Chuyển đến trang thanh toán VNPay
     *    - COD: Chuyển đến trang thành công
     * 5. Xóa voucher đã dùng và xóa sản phẩm khỏi giỏ hàng
     */
    const handleSubmit = useCallback(
        async (
            formData: DeliveryFormData,
            paymentMethod: string,
            selectedVoucher: number | null,
            total: number,
            validateFormRef?: React.MutableRefObject<(() => boolean) | null>
        ) => {
            // Bước 1: Trigger validation ở component DeliveryInformation
            if (validateFormRef?.current) {
                const isValid = validateFormRef.current();
                if (!isValid) {
                    return; // Dừng nếu form không hợp lệ
                }
            }

            // Bước 2: Chuẩn bị dữ liệu gửi API

            // Chuyển đổi danh sách sản phẩm sang định dạng API yêu cầu
            const items = checkoutItems.map((item: CheckoutItem) => ({
                bookId: item.book.id,
                quantity: item.quantity,
                price: item.book.price,
            }));

            // Ghép địa chỉ đầy đủ từ các trường riêng biệt
            const fullAddress = `${formData.address}, ${formData.ward}, ${formData.province}`;

            // Lấy phương thức thanh toán (đã đúng định dạng API)
            const apiPaymentMethod = paymentMethod;

            // Tạo object dữ liệu đơn hàng theo định dạng API
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

            // Bước 3: Gọi API tạo đơn hàng và xử lý kết quả
            try {
                const response = await paymentApi.createOrder(orderData);

                if (response.data.success) {
                    // Xóa voucher đã sử dụng (nếu có)
                    // Xóa voucher đã sử dụng (nếu có)
                    if (selectedVoucher !== null) {
                        await voucherApi.removeVoucherFromUser(selectedVoucher);
                    }

                    // Xóa sản phẩm khỏi giỏ hàng trên server
                    try {
                        await dispatch(
                            removeItem(checkoutItems.map((item) => item.id))
                        ).unwrap();
                    } catch (e) {
                        // Tiếp tục nếu xóa thất bại; user có thể thử lại sau
                    }

                    // Xóa danh sách checkout từ Redux store
                    dispatch(clearCheckoutItems());

                    // Bước 4: Xử lý theo phương thức thanh toán

                    // Nếu thanh toán qua VNPAY và có link thanh toán
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
                }
            } catch (error: any) {
                const errorMessage = error?.response?.data?.message || "";
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
