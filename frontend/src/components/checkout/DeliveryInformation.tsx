/**
 * Component form nhập thông tin giao hàng
 * Quản lý: validate form, chọn địa chỉ mặc định, xử lý thay đổi input
 */
import { useState, useEffect } from "react";
import addressData, { WardMapping } from "vietnam-address-database";
import { DeliveryInformationProps } from "../../types";

/**
 * Lấy dữ liệu mapping phường/xã theo tỉnh/thành phố từ database địa chỉ Việt Nam
 * Dùng để lọc danh sách phường theo tỉnh được chọn
 */
const wardMappings = addressData.find(
    (x: any) => x.type === "table" && x.name === "ward_mappings"
)!.data as WardMapping[];

/**
 * Interface định nghĩa các lỗi validation cho từng trường
 * Mỗi trường có thể có message lỗi riêng hoặc undefined nếu hợp lệ
 */
interface ValidationErrors {
    fullName?: string; // Lỗi họ tên
    phone?: string; // Lỗi số điện thoại
    email?: string; // Lỗi email
    ward?: string; // Lỗi phường/xã
    address?: string; // Lỗi địa chỉ
}

/**
 * Component DeliveryInformation
 * @param formData - Dữ liệu form (họ tên, SĐT, email, địa chỉ...)
 * @param onFormChange - Callback khi form thay đổi
 * @param checkDefault - Trạng thái checkbox "Sử dụng địa chỉ mặc định"
 * @param onCheckDefaultChange - Callback khi checkbox thay đổi
 * @param triggerValidation - Ref để parent component trigger validation
 */
const DeliveryInformation: React.FC<DeliveryInformationProps> = ({
    formData,
    onFormChange,
    checkDefault,
    onCheckDefaultChange,
    triggerValidation,
}) => {
    /**
     * State lưu danh sách phường/xã của tỉnh/thành phố được chọn
     * Được cập nhật mỗi khi formData.province thay đổi
     */
    const [wardsForSelectedCity, setWardsForSelectedCity] = useState<string[]>(
        []
    );

    /**
     * State lưu các lỗi validation của từng trường
     * Chỉ hiển thị lỗi của các trường đã touched
     */
    const [errors, setErrors] = useState<ValidationErrors>({});

    /**
     * State lưu danh sách các trường đã touched (đã focus/blur)
     * Dùng để chỉ hiển thị lỗi của trường user đã tương tác
     */
    const [touchedFields, setTouchedFields] = useState<Set<string>>(new Set());

    /**
     * Effect: Lọc danh sách phường/xã theo tỉnh/thành phố được chọn
     * Chạy mỗi khi formData.province thay đổi
     *
     * Logic:
     * 1. Lọc wardMappings theo tỉnh được chọn
     * 2. So sánh cả tên có prefix "Thành phố"/"Tỉnh" và không có prefix
     * 3. Lấy danh sách tên phường unique
     * 4. Cập nhật state wardsForSelectedCity
     */
    useEffect(() => {
        // Lọc phường theo tỉnh/thành phố được chọn
        const filteredWards = wardMappings
            .filter((w) => {
                // Bỏ prefix "Thành phố" hoặc "Tỉnh" để so sánh
                const provinceToMatch = formData.province.replace(
                    /^(Thành phố |Tỉnh )/i,
                    ""
                );
                const wardProvince = w.new_province_name.replace(
                    /^(Thành phố |Tỉnh )/i,
                    ""
                );
                // So sánh cả hai cách: có và không có prefix
                return (
                    wardProvince === provinceToMatch ||
                    w.new_province_name === formData.province
                );
            })
            .map((w) => w.new_ward_name);

        // Loại bỏ duplicate và cập nhật state
        setWardsForSelectedCity(Array.from(new Set(filteredWards)));
    }, [formData.province]);

    /**
     * Hàm validate một trường cụ thể
     * @param name - Tên trường cần validate
     * @param value - Giá trị của trường
     * @returns Message lỗi nếu không hợp lệ, undefined nếu hợp lệ
     *
     * Quy tắc validate theo thứ tự ưu tiên:
     * 1. Kiểm tra empty/rỗng trước
     * 2. Kiểm tra format/độ dài sau
     */
    const validateField = (name: string, value: string): string | undefined => {
        // Ưu tiên 1: Kiểm tra trường rỗng trước
        if (!value || value.trim() === "") {
            switch (name) {
                case "fullName":
                    return "Vui lòng nhập họ và tên";
                case "phone":
                    return "Vui lòng nhập số điện thoại";
                case "email":
                    return "Vui lòng nhập email";
                case "ward":
                    return "Vui lòng chọn xã/phường";
                case "address":
                    return "Vui lòng nhập địa chỉ";
                default:
                    return undefined;
            }
        }

        // Ưu tiên 2: Kiểm tra format và độ dài
        switch (name) {
            case "fullName":
                // Họ tên phải có ít nhất 3 ký tự
                if (value.trim().length < 3) {
                    return "Họ và tên phải có ít nhất 3 ký tự";
                }
                break;
            case "phone":
                // Kiểm tra có chứa ký tự không phải số
                if (/\D/.test(value.trim())) {
                    return "Số điện thoại chỉ được phép nhập số";
                }
                // Kiểm tra đúng 10 chữ số
                const phoneRegex = /^[0-9]{10}$/;
                if (!phoneRegex.test(value.trim())) {
                    return "Số điện thoại phải có đúng 10 số";
                }
                break;
            case "email":
                // Validate format email cơ bản
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(value.trim())) {
                    return "Email không đúng định dạng";
                }
                break;
            case "address":
                // Địa chỉ phải có ít nhất 5 ký tự
                if (value.trim().length < 5) {
                    return "Địa chỉ phải có ít nhất 5 ký tự";
                }
                break;
        }

        // Không có lỗi
        return undefined;
    };

    /**
     * Effect: Validate các trường đã touched và cập nhật errors state
     * Chạy mỗi khi formData hoặc touchedFields thay đổi
     *
     * Chỉ validate và hiển thị lỗi cho các trường user đã tương tác (touched)
     * Tránh hiển thị lỗi ngay khi vừa mở form
     */
    useEffect(() => {
        const newErrors: ValidationErrors = {};

        // Validate họ tên nếu đã touched
        if (touchedFields.has("fullName")) {
            const error = validateField("fullName", formData.fullName);
            if (error) newErrors.fullName = error;
        }

        if (touchedFields.has("phone")) {
            const error = validateField("phone", formData.phone);
            if (error) newErrors.phone = error;
        }

        if (touchedFields.has("email")) {
            const error = validateField("email", formData.email);
            if (error) newErrors.email = error;
        }

        if (touchedFields.has("ward")) {
            const error = validateField("ward", formData.ward);
            if (error) newErrors.ward = error;
        }

        if (touchedFields.has("address")) {
            const error = validateField("address", formData.address);
            if (error) newErrors.address = error;
        }

        setErrors(newErrors);
    }, [formData, touchedFields]);

    /**
     * Hàm format tên tỉnh/thành phố
     * @param name - Tên tỉnh/thành phố
     * @returns Tên đã format với prefix phù hợp
     *
     * Logic:
     * - Nếu đã có prefix "Thành phố" hoặc "Tỉnh" -> giữ nguyên
     * - Nếu chưa có -> thêm prefix "Tỉnh "
     */
    const formatProvinceName = (name: string): string => {
        const lower = name.toLowerCase();
        if (lower.startsWith("thành phố")) return name;
        if (lower.startsWith("tỉnh")) return name;
        return "Tỉnh " + name;
    };

    /**
     * Hàm xử lý khi user thay đổi input/select
     * @param e - Event change
     *
     * Logic đặc biệt cho trường city (tỉnh/thành phố):
     * - Khi đổi tỉnh -> lọc lại danh sách phường
     * - Reset trường ward về rỗng
     * - Mark ward là touched (để hiện lỗi nếu chưa chọn)
     */
    const handleInputChange = (
        e: React.ChangeEvent<
            HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
        >
    ) => {
        const { name, value } = e.target;
        onFormChange({ ...formData, [name]: value });

        if (name === "city") {
            const filteredWards = wardMappings
                .filter((w: any) => w.new_province_name === value)
                .map((w: any) => w.new_ward_name);

            setWardsForSelectedCity(Array.from(new Set(filteredWards)));
            onFormChange({ ...formData, province: value, ward: "" });
            // Mark ward as touched when province changes since ward value is reset
            setTouchedFields((prev) => new Set(prev).add("ward"));
        }
    };

    /**
     * Hàm xử lý khi blur ra khỏi một trường
     * @param fieldName - Tên trường vừa blur
     *
     * Đánh dấu trường là touched để bắt đầu hiển thị lỗi validation
     */
    const handleBlur = (fieldName: string) => {
        setTouchedFields((prev) => new Set(prev).add(fieldName));
    };

    /**
     * Hàm validate tất cả các trường cùng lúc
     * @returns true nếu tất cả trường hợp lệ, false nếu có lỗi
     *
     * Được gọi khi user click nút "Đặt hàng"
     * Validate tất cả trường bắt buộc và hiển thị lỗi nếu có
     */
    const validateAllFields = (): boolean => {
        const newErrors: ValidationErrors = {};
        let isValid = true;

        // Validate fullName
        const fullNameError = validateField("fullName", formData.fullName);
        if (fullNameError) {
            newErrors.fullName = fullNameError;
            isValid = false;
        }

        // Validate phone
        const phoneError = validateField("phone", formData.phone);
        if (phoneError) {
            newErrors.phone = phoneError;
            isValid = false;
        }

        // Validate email
        const emailError = validateField("email", formData.email);
        if (emailError) {
            newErrors.email = emailError;
            isValid = false;
        }

        // Validate ward
        const wardError = validateField("ward", formData.ward);
        if (wardError) {
            newErrors.ward = wardError;
            isValid = false;
        }

        // Validate address
        const addressError = validateField("address", formData.address);
        if (addressError) {
            newErrors.address = addressError;
            isValid = false;
        }

        // Mark all fields as touched to show errors
        setTouchedFields(
            new Set(["fullName", "phone", "email", "ward", "address"])
        );
        setErrors(newErrors);

        return isValid;
    };

    /**
     * Effect: Expose hàm validateAllFields cho parent component
     * Parent có thể gọi triggerValidation.current() để validate form
     * Thường dùng khi submit form từ bên ngoài component này
     */
    useEffect(() => {
        if (triggerValidation) {
            (triggerValidation as any).current = validateAllFields;
        }
    }, [formData, triggerValidation]);

    /**
     * Hàm xử lý khi checkbox "Sử dụng địa chỉ mặc định" thay đổi
     * @param e - Event change của checkbox
     *
     * Logic:
     * - Gọi callback onCheckDefaultChange để parent biết
     * - Nếu checked = true: xóa tất cả lỗi và touched fields
     *   (vì địa chỉ mặc định đã được validate sẵn)
     */
    const handleUseDefaultAddress = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const checked = e.target.checked;
        onCheckDefaultChange(checked);

        // Xóa tất cả lỗi và touched fields khi dùng địa chỉ mặc định
        if (checked) {
            setTouchedFields(new Set());
            setErrors({});
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-6">Thông tin giao hàng</h2>

            <div className="space-y-4">
                {/* Use Default Address Checkbox */}
                <div className="mb-4 pb-4 border-b flex items-center">
                    <input
                        type="checkbox"
                        checked={checkDefault}
                        onChange={handleUseDefaultAddress}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500 mr-2 cursor-pointer"
                    />
                    <span className="text-sm font-medium text-gray-700">
                        Sử dụng địa chỉ mặc định
                    </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Họ và tên <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="fullName"
                            value={formData.fullName}
                            onChange={handleInputChange}
                            onBlur={() => handleBlur("fullName")}
                            placeholder="Nhập đầy đủ họ và tên của bạn"
                            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                                errors.fullName
                                    ? "border-red-500"
                                    : "border-gray-300"
                            }`}
                            required
                        />
                        {errors.fullName && (
                            <p className="mt-1 text-sm text-red-600">
                                {errors.fullName}
                            </p>
                        )}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Số điện thoại{" "}
                            <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                            onBlur={() => handleBlur("phone")}
                            placeholder="Nhập số điện thoại"
                            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                                errors.phone
                                    ? "border-red-500"
                                    : "border-gray-300"
                            }`}
                            required
                        />
                        {errors.phone && (
                            <p className="mt-1 text-sm text-red-600">
                                {errors.phone}
                            </p>
                        )}
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Địa chỉ email <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        onBlur={() => handleBlur("email")}
                        placeholder="Nhập Email"
                        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                            errors.email ? "border-red-500" : "border-gray-300"
                        }`}
                        required
                    />
                    {errors.email && (
                        <p className="mt-1 text-sm text-red-600">
                            {errors.email}
                        </p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Tỉnh/Thành phố <span className="text-red-500">*</span>
                    </label>
                    <select
                        name="city"
                        value={formData.province}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                    >
                        {Array.from(
                            new Set(
                                wardMappings.map((w) => w.new_province_name)
                            )
                        ).map((province) => (
                            <option
                                key={province}
                                value={formatProvinceName(province)}
                            >
                                {formatProvinceName(province)}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Xã/Phường <span className="text-red-500">*</span>
                    </label>
                    <select
                        name="ward"
                        value={formData.ward}
                        onChange={handleInputChange}
                        onBlur={() => handleBlur("ward")}
                        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                            errors.ward ? "border-red-500" : "border-gray-300"
                        }`}
                        required
                    >
                        <option value="">Chọn xã/phường</option>
                        {wardsForSelectedCity.map((ward) => (
                            <option key={ward} value={ward}>
                                {ward}
                            </option>
                        ))}
                    </select>
                    {errors.ward && (
                        <p className="mt-1 text-sm text-red-600">
                            {errors.ward}
                        </p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Địa chỉ <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        onBlur={() => handleBlur("address")}
                        placeholder="Ví dụ: Số 18 Ngõ 86 Phú Kiều"
                        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                            errors.address
                                ? "border-red-500"
                                : "border-gray-300"
                        }`}
                        required
                    />
                    {errors.address && (
                        <p className="mt-1 text-sm text-red-600">
                            {errors.address}
                        </p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Ghi chú đơn hàng (nếu có):
                    </label>
                    <textarea
                        name="orderNote"
                        value={formData.orderNote}
                        onChange={handleInputChange}
                        placeholder="Ghi chú..."
                        rows={3}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                </div>
            </div>
        </div>
    );
};

export default DeliveryInformation;
