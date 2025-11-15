import { X, Percent } from "lucide-react";
import { VoucherModalProps } from "../../types";

const VoucherModal: React.FC<VoucherModalProps> = ({
    isOpen,
    onClose,
    vouchers,
    selectedVoucher,
    onSelectVoucher,
}) => {
    if (!isOpen) return null;

    const handleCheckboxChange = (voucherId: number) => {
        // If clicking the already selected voucher, unselect it
        if (selectedVoucher === voucherId) {
            onSelectVoucher(null);
        } else {
            // Otherwise, select the new voucher
            onSelectVoucher(voucherId);
        }
    };

    const formatDate = (dateString?: string) => {
        if (!dateString) return "";
        const date = new Date(dateString);
        return date.toLocaleDateString("vi-VN");
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-xs">
            <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[85vh] overflow-hidden flex flex-col shadow-2xl">
                {/* Header */}
                <div className="flex items-center justify-between p-5 border-b bg-linear-to-r from-blue-50 to-indigo-50">
                    <div className="flex items-center space-x-3">
                        <div className="p-2 bg-blue-100 rounded-lg">
                            <Percent className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-gray-800">
                                CHỌN MÃ KHUYẾN MÃI
                            </h2>
                            <p className="text-xs text-gray-500 mt-0.5">
                                Chỉ được chọn 1 mã khuyến mãi
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <X className="w-6 h-6 text-gray-500" />
                    </button>
                </div>

                {/* Input Field */}
                <div className="p-4 border-b bg-gray-50">
                    <div className="flex space-x-3">
                        <input
                            type="text"
                            placeholder="Nhập mã khuyến mãi / Gift Card"
                            className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                        />
                        <button className="px-8 py-3 bg-blue-600 text-red-100 rounded-xl hover:bg-blue-700 transition-all hover:shadow-lg font-medium">
                            Áp dụng
                        </button>
                    </div>
                </div>

                {/* Voucher List */}
                <div className="flex-1 overflow-y-auto">
                    {/* Discount Vouchers Section */}
                    <div className="p-4">
                        <div className="flex items-center justify-between mb-3">
                            <h3 className="font-bold text-lg text-gray-800">
                                Mã giảm giá
                            </h3>
                            <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                                Áp dụng tối đa: 1
                            </span>
                        </div>

                        <div className="space-y-4">
                            {vouchers.map((voucher) => {
                                const isSelected =
                                    selectedVoucher === voucher.id;
                                const isDisabled =
                                    selectedVoucher &&
                                    selectedVoucher !== voucher.id;

                                return (
                                    <div
                                        key={voucher.id}
                                        className={`flex items-stretch border-2 rounded-xl overflow-hidden transition-all ${
                                            isDisabled
                                                ? "opacity-40 cursor-not-allowed"
                                                : "hover:border-blue-400 hover:shadow-md"
                                        } ${
                                            isSelected
                                                ? "border-blue-500 ring-2 ring-blue-100 shadow-lg"
                                                : "border-gray-200"
                                        }`}
                                    >
                                        {/* Icon Section */}
                                        <div className="bg-linear-to-br from-yellow-100 to-orange-100 flex items-center justify-center p-4 w-28 shrink-0">
                                            <div className="text-center">
                                                <div className="bg-white rounded-full p-2 mb-2 inline-block">
                                                    <Percent className="w-8 h-8 text-orange-600" />
                                                </div>
                                                <p className="text-xs font-bold text-orange-800">
                                                    Mã giảm
                                                </p>
                                            </div>
                                        </div>

                                        {/* Divider */}
                                        <div className="w-px bg-gray-200 border-l-2 border-dashed"></div>

                                        {/* Content Section */}
                                        <div className="flex-1 p-4 flex items-center">
                                            <div className="flex-1">
                                                <h4 className="font-bold text-gray-900 mb-1.5 text-base">
                                                    {voucher.name}
                                                </h4>
                                                <p className="text-sm text-gray-600 mb-2 leading-relaxed">
                                                    {voucher.description}
                                                </p>
                                                <p className="text-xs text-gray-500 mb-2">
                                                    HSD:{" "}
                                                    {formatDate(
                                                        voucher.endDate
                                                    )}
                                                </p>
                                                {isSelected && (
                                                    <div className="mt-2 text-sm text-green-600 font-bold">
                                                        ✓ Đã áp dụng
                                                    </div>
                                                )}
                                            </div>

                                            {/* Checkbox - Vertically Centered */}
                                            <div className="flex items-center ml-4">
                                                <input
                                                    type="checkbox"
                                                    checked={isSelected}
                                                    onChange={() =>
                                                        handleCheckboxChange(
                                                            voucher.id
                                                        )
                                                    }
                                                    disabled={!!isDisabled}
                                                    className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Footer with Apply Button */}
                <div className="p-4 border-t bg-linear-to-r from-gray-50 to-blue-50">
                    <button
                        onClick={onClose}
                        className="w-full bg-linear-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-xl font-bold hover:from-blue-700 hover:to-indigo-700 transition-all hover:shadow-xl transform hover:scale-[1.02]"
                    >
                        Xác nhận
                    </button>
                </div>
            </div>
        </div>
    );
};

export default VoucherModal;
