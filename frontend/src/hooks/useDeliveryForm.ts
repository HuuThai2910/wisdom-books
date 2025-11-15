import { useState } from "react";
import { UseDeliveryFormReturn, DeliveryFormData, User } from "../types";

export const useDeliveryForm = (
    defaultAddress?: User
): UseDeliveryFormReturn => {
    const [checkDefault, setCheckDefault] = useState<boolean>(false);
    const [formData, setFormData] = useState<DeliveryFormData>({
        fullName: "",
        phone: "",
        email: "",
        province: "Thành phố Hồ Chí Minh",
        ward: "",
        address: "",
        orderNote: "",
    });

    const handleCheckDefaultChange = (checked: boolean) => {
        setCheckDefault(checked);

        if (checked && defaultAddress) {
            // Lấy dữ liệu từ cấu trúc defaultAddress.address
            const province =
                defaultAddress.address?.province || "Thành phố Hồ Chí Minh";
            const ward = defaultAddress.address?.ward || "";
            const address = defaultAddress.address?.address || "";

            setFormData({
                fullName: defaultAddress.fullName || "",
                phone: defaultAddress.phone || "",
                email: defaultAddress.email || "",
                province: province,
                ward: ward,
                address: address,
                orderNote: "",
            });
        } else {
            // Reset form khi bỏ check
            setFormData({
                fullName: "",
                phone: "",
                email: "",
                province: "Thành phố Hồ Chí Minh",
                ward: "",
                address: "",
                orderNote: "",
            });
        }
    };

    const handleFormChange = (newFormData: DeliveryFormData) => {
        setFormData(newFormData);
    };

    return {
        formData,
        checkDefault,
        handleFormChange,
        handleCheckDefaultChange,
    };
};
