// Modal xác nhận hủy đơn hàng
// Tuân thủ SRP: chỉ đảm nhiệm hiển thị UI xác nhận và gọi callback
// Không chứa logic nghiệp vụ hay gọi API trực tiếp

import { XCircle, AlertTriangle } from "lucide-react";
import { Order } from "../../types";

interface CancelOrderModalProps {
    // Trạng thái hiển thị modal
    isOpen: boolean;
    // Đơn hàng cần hủy (hiển thị mã đơn)
    order: Order | null;
    // Trạng thái đang xử lý hủy
    isLoading?: boolean;
    // Callback đóng modal
    onClose: () => void;
    // Callback xác nhận hủy (component cha sẽ xử lý logic)
    onConfirm: (orderId: number) => void;
}

export default function CancelOrderModal({
    isOpen,
    order,
    isLoading = false,
    onClose,
    onConfirm,
}: CancelOrderModalProps) {
    if (!isOpen || !order) return null;

    // Xử lý click xác nhận
    const handleConfirm = () => {
        onConfirm(order.id);
    };

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            {/* Overlay */}
            <div
                className="fixed inset-0 bg-black/40 bg-opacity-50 transition-opacity"
                onClick={onClose}
            />

            {/* Modal Content */}
            <div className="flex min-h-full items-center justify-center p-4">
                <div
                    className="relative bg-white rounded-2xl shadow-xl max-w-md w-full p-6 transform transition-all"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Icon cảnh báo */}
                    <div className="flex justify-center mb-4">
                        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                            <AlertTriangle className="w-8 h-8 text-red-600" />
                        </div>
                    </div>

                    {/* Tiêu đề */}
                    <h3 className="text-xl font-bold text-gray-900 text-center mb-2">
                        Xác nhận hủy đơn hàng
                    </h3>

                    {/* Mã đơn hàng */}
                    <p className="text-center text-gray-600 mb-4">
                        Mã đơn hàng:{" "}
                        <span className="font-semibold text-gray-900">
                            {order.orderCode}
                        </span>
                    </p>

                    {/* Nội dung cảnh báo */}
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                        <p className="text-sm text-red-800">
                            Bạn có chắc chắn muốn hủy đơn hàng này không? Hành
                            động này không thể hoàn tác.
                        </p>
                    </div>

                    {/* Buttons */}
                    <div className="flex gap-3">
                        {/* Nút Hủy bỏ (không hủy đơn) */}
                        <button
                            onClick={onClose}
                            disabled={isLoading}
                            className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Không, giữ đơn hàng
                        </button>

                        {/* Nút Xác nhận hủy */}
                        <button
                            onClick={handleConfirm}
                            disabled={isLoading}
                            className="flex-1 px-4 py-3 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {isLoading ? (
                                <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                                    <span>Đang hủy...</span>
                                </>
                            ) : (
                                <>
                                    <XCircle className="w-5 h-5" />
                                    <span>Xác nhận hủy</span>
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
