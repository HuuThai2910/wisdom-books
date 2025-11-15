import { Ticket } from "lucide-react";
import { formatCurrency } from "../../util/formatting";
import { VoucherSelectorProps } from "../../types";

const VoucherSelector: React.FC<VoucherSelectorProps> = ({
    selectedVoucher,
    selectedVoucherData,
    discount,
    onOpenModal,
    onRemoveVoucher,
}) => {
    return (
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
                Mã khuyến mãi
            </label>
            {selectedVoucher ? (
                <div
                    onClick={onOpenModal}
                    className="flex items-center justify-between px-4 py-3 border border-blue-500 bg-blue-50 rounded-lg cursor-pointer hover:bg-blue-100 transition-colors"
                >
                    <div className="flex items-center space-x-2">
                        <Ticket className="w-5 h-5 text-blue-600" />
                        <div>
                            <p className="text-sm font-medium text-blue-800">
                                {selectedVoucherData?.name}
                            </p>
                            <p className="text-xs text-blue-600">
                                Giảm {formatCurrency(discount)}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onRemoveVoucher();
                        }}
                        className="text-red-600 hover:text-red-800 text-sm font-medium"
                    >
                        Xóa
                    </button>
                </div>
            ) : (
                <button
                    onClick={onOpenModal}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors flex items-center justify-between"
                >
                    <span className="text-gray-600">
                        Chọn hoặc nhập mã khuyến mãi
                    </span>
                    <Ticket className="w-5 h-5 text-gray-400" />
                </button>
            )}
        </div>
    );
};

export default VoucherSelector;
