import { useState } from "react";
import { UsePaymentMethodReturn } from "../../types";

/**
 * Custom hook quản lý phương thức thanh toán
 * Xử lý: state phương thức thanh toán (COD hoặc VNPAY)
 * @param initialMethod - Phương thức thanh toán mặc định (mặc định là "COD")
 * @returns State phương thức thanh toán và hàm thay đổi phương thức
 */
export const usePaymentMethod = (
    initialMethod: string = "COD"
): UsePaymentMethodReturn => {
    // State lưu phương thức thanh toán hiện tại
    const [paymentMethod, setPaymentMethod] = useState<string>(initialMethod);

    /**
     * Hàm xử lý thay đổi phương thức thanh toán
     * @param method - Phương thức mới (COD hoặc VNPAY)
     * Được gọi khi user chọn radio button phương thức thanh toán
     */
    const handlePaymentMethodChange = (method: string) => {
        setPaymentMethod(method);
    };

    return {
        paymentMethod,
        handlePaymentMethodChange,
    };
};
