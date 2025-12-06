import { useState, useEffect } from "react";
import { UseDeliveryFormReturn, DeliveryFormData, User } from "../../types";

/**
 * Custom hook quản lý form thông tin giao hàng
 * Xử lý: auto-fill địa chỉ mặc định, quản lý checkbox "Sử dụng địa chỉ mặc định"
 * @param defaultAddress - Thông tin địa chỉ mặc định của user (optional)
 * @returns Dữ liệu form và các hàm xử lý
 */
export const useDeliveryForm = (
    defaultAddress?: User
): UseDeliveryFormReturn => {
    /**
     * State quản lý checkbox "Sử dụng địa chỉ mặc định"
     * Tự động check nếu defaultAddress tồn tại
     */
    const [checkDefault, setCheckDefault] = useState<boolean>(!!defaultAddress);

    /**
     * State lưu dữ liệu form giao hàng
     * Khởi tạo với lazy initialization:
     * - Nếu có defaultAddress: tự động điền thông tin từ defaultAddress
     * - Nếu không: khởi tạo form trống với province mặc định là "Thành phố Hồ Chí Minh"
     */
    const [formData, setFormData] = useState<DeliveryFormData>(() => {
        if (defaultAddress) {
            const province =
                defaultAddress.address?.province || "Thành phố Hồ Chí Minh";
            const ward = defaultAddress.address?.ward || "";
            const address = defaultAddress.address?.address || "";

            return {
                fullName: defaultAddress.fullName || "",
                phone: defaultAddress.phone || "",
                email: defaultAddress.email || "",
                province: province,
                ward: ward,
                address: address,
                orderNote: "",
            };
        }

        return {
            fullName: "",
            phone: "",
            email: "",
            province: "Thành phố Hồ Chí Minh",
            ward: "",
            address: "",
            orderNote: "",
        };
    });

    /**
     * Effect: Cập nhật form khi defaultAddress thay đổi (async load)
     * Khi defaultAddress được fetch từ API về, tự động điền vào form
     * Chỉ chạy khi defaultAddress có giá trị và checkDefault đang false
     */
    useEffect(() => {
        if (defaultAddress && !checkDefault) {
            setCheckDefault(true);
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
        }
    }, [defaultAddress]);

    /**
     * Hàm xử lý khi user toggle checkbox "Sử dụng địa chỉ mặc định"
     * @param checked - Trạng thái mới của checkbox (true/false)
     *
     * - Nếu checked = true: điền thông tin từ defaultAddress vào form
     * - Nếu checked = false: reset form về trạng thái trống
     */
    const handleCheckDefaultChange = (checked: boolean) => {
        setCheckDefault(checked);

        if (checked && defaultAddress) {
            // Nhánh checked = true: Điền thông tin từ defaultAddress
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
            // Nhánh checked = false: Reset form về trạng thái trống
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

    /**
     * Hàm cập nhật dữ liệu form
     * @param newFormData - Dữ liệu form mới
     * Được gọi từ component DeliveryInformation khi user nhập liệu
     */
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
