import { useState, useEffect } from "react";
import addressData, { WardMapping } from "vietnam-address-database";
import { DeliveryInformationProps } from "../../types";

const wardMappings = addressData.find(
    (x: any) => x.type === "table" && x.name === "ward_mappings"
)!.data as WardMapping[];

const DeliveryInformation: React.FC<DeliveryInformationProps> = ({
    formData,
    onFormChange,
    checkDefault,
    onCheckDefaultChange,
}) => {
    const [wardsForSelectedCity, setWardsForSelectedCity] = useState<string[]>(
        []
    );

    useEffect(() => {
        // Lọc phường theo tỉnh/thành phố được chọn
        const filteredWards = wardMappings
            .filter((w) => {
                // So sánh với cả tên có format và không có format
                const provinceToMatch = formData.province.replace(
                    /^(Thành phố |Tỉnh )/i,
                    ""
                );
                const wardProvince = w.new_province_name.replace(
                    /^(Thành phố |Tỉnh )/i,
                    ""
                );
                return (
                    wardProvince === provinceToMatch ||
                    w.new_province_name === formData.province
                );
            })
            .map((w) => w.new_ward_name);

        setWardsForSelectedCity(Array.from(new Set(filteredWards)));
    }, [formData.province]);

    const formatProvinceName = (name: string): string => {
        const lower = name.toLowerCase();
        if (lower.startsWith("thành phố")) return name;
        if (lower.startsWith("tỉnh")) return name;
        return "Tỉnh " + name;
    };

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
        }
    };

    const handleUseDefaultAddress = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const checked = e.target.checked;
        onCheckDefaultChange(checked);
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
                            placeholder="Nhập đầy đủ họ và tên của bạn"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Số điện thoại{" "}
                            <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                            placeholder="Nhập số điện thoại"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            required
                        />
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
                        placeholder="Nhập Email"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                    />
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
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                    >
                        <option value="">Chọn xã/phường</option>
                        {wardsForSelectedCity.map((ward) => (
                            <option key={ward} value={ward}>
                                {ward}
                            </option>
                        ))}
                    </select>
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
                        placeholder="Ví dụ: Số 18 Ngõ 86 Phú Kiều"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                    />
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
