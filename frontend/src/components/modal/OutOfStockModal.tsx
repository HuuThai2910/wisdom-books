import { AlertCircle } from "lucide-react";

interface OutOfStockModalProps {
    isOpen: boolean;
    message: string;
    onClose: () => void;
    onGoToCart: () => void;
}

const OutOfStockModal = ({
    isOpen,
    message,
    onClose,
    onGoToCart,
}: OutOfStockModalProps) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 overflow-hidden animate-in zoom-in duration-300">
                {/* Icon Section */}
                <div className="pt-6 pb-5 px-6 flex flex-col items-center">
                    <div className="w-16 h-16 rounded-full bg-orange-100 flex items-center justify-center mb-4">
                        <AlertCircle
                            className="w-8 h-8 text-orange-500"
                            strokeWidth={2.5}
                        />
                    </div>

                    <h3 className="text-lg font-bold text-slate-900 mb-2">
                        Rất tiếc
                    </h3>
                    <p className="text-sm text-slate-600 text-center leading-relaxed">
                        {message}
                    </p>
                    <p className="text-xs text-slate-500 text-center mt-2">
                        Chúng tôi rất xin lỗi về sự bất tiện này
                    </p>
                </div>

                {/* Action Buttons */}
                <div className="px-6 pb-6 flex gap-3">
                    <button
                        onClick={onClose}
                        className="flex-1 px-4 py-2.5 text-sm font-semibold text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200 transition-all"
                    >
                        Hủy
                    </button>
                    <button
                        onClick={onGoToCart}
                        className="flex-1 px-4 py-2.5 text-sm font-bold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-all"
                    >
                        Quay lại giỏ hàng
                    </button>
                </div>
            </div>
        </div>
    );
};

export default OutOfStockModal;
