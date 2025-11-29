import { XCircle, Clock } from "lucide-react";

interface ExpiredOrderModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
}

const ExpiredOrderModal = ({
    isOpen,
    onClose,
    onConfirm,
}: ExpiredOrderModalProps) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full mx-4 overflow-hidden animate-in zoom-in duration-300">
                {/* Icon Section */}
                <div className="pt-8 pb-6 px-6 flex flex-col items-center">
                    <div className="relative">
                        <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center">
                            <XCircle
                                className="w-10 h-10 text-red-500"
                                strokeWidth={2.5}
                            />
                        </div>
                        <div className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                            <Clock className="w-3.5 h-3.5 text-white" />
                        </div>
                    </div>

                    <h3 className="text-xl font-bold text-slate-900 mt-5 mb-2">
                        Đơn hàng đã hết hạn
                    </h3>
                    <p className="text-sm text-slate-500 text-center max-w-xs">
                        Thanh toán không thành công do quá thời gian cho phép
                    </p>
                </div>

                {/* Body */}
                <div className="px-6 pb-6">
                    <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200">
                        <p className="text-sm text-slate-700 leading-relaxed text-center">
                            Đơn hàng đã bị hủy tự động. Bạn có muốn tải lại danh
                            sách để xem trạng thái mới nhất?
                        </p>
                    </div>
                </div>

                {/* Footer */}
                <div className="px-6 pb-6 flex gap-3">
                    <button
                        onClick={onClose}
                        className="flex-1 px-5 py-3 text-sm font-semibold text-slate-700 bg-slate-100 rounded-xl hover:bg-slate-200 transition-all"
                    >
                        Để sau
                    </button>
                    <button
                        onClick={onConfirm}
                        className="flex-1 px-5 py-3 text-sm font-bold text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/30 hover:shadow-xl hover:shadow-blue-600/40"
                    >
                        Tải lại
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ExpiredOrderModal;
