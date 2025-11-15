import { useCallback } from "react";
import { UseOrderSubmitReturn, DeliveryFormData } from "../types";

export const useOrderSubmit = (): UseOrderSubmitReturn => {
    const handleSubmit = useCallback(
        (
            formData: DeliveryFormData,
            paymentMethod: string,
            selectedVoucher: number | null,
            total: number
        ) => {
            // Validate form data
            const requiredFields: (keyof DeliveryFormData)[] = [
                "fullName",
                "phone",
                "email",
                "province",
                "ward",
                "address",
            ];
            const missingFields = requiredFields.filter(
                (field) => !formData[field]
            );

            if (missingFields.length > 0) {
                alert(
                    `Vui lòng điền đầy đủ thông tin: ${missingFields.join(
                        ", "
                    )}`
                );
                return;
            }

            // Prepare order data
            const orderData = {
                deliveryInfo: formData,
                paymentMethod,
                voucherId: selectedVoucher,
                total,
                timestamp: new Date().toISOString(),
            };

            console.log("Order submitted:", orderData);

            // TODO: Call API to submit order
            // orderApi.createOrder(orderData)
            //     .then(res => {
            //         alert("Đơn hàng của bạn đã được gửi thành công!");
            //         // Redirect to order confirmation page
            //     })
            //     .catch(err => {
            //         alert("Có lỗi xảy ra khi gửi đơn hàng. Vui lòng thử lại!");
            //         console.error(err);
            //     });

            alert("Đơn hàng của bạn đã được gửi!");
        },
        []
    );

    return {
        handleSubmit,
    };
};
