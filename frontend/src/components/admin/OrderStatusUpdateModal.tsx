import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Order } from "../../types";
import { ORDER_STATUS_CONFIG } from "../../constants/orderStatus";

interface OrderStatusUpdateModalProps {
    isOpen: boolean;
    order: Order | null;
    onClose: () => void;
    onConfirm: (orderId: number, newStatus: Order["status"]) => void;
}

const OrderStatusUpdateModal = ({
    isOpen,
    order,
    onClose,
    onConfirm,
}: OrderStatusUpdateModalProps) => {
    const [selectedStatus, setSelectedStatus] = useState<Order["status"] | "">(
        order?.status || ""
    );

    if (!order) return null;

    const handleConfirm = () => {
        if (selectedStatus && selectedStatus !== order.status) {
            onConfirm(order.id, selectedStatus as Order["status"]);
            onClose();
        }
    };

    // Định nghĩa luồng chuyển trạng thái hợp lệ
    const getAvailableStatuses = (
        currentStatus: Order["status"]
    ): Order["status"][] => {
        switch (currentStatus) {
            case "PENDING":
                return ["PROCESSING", "CANCELLED"];
            case "PROCESSING":
                return ["SHIPPING", "CANCELLED"];
            case "SHIPPING":
                return ["DELIVERED", "CANCELLED"];
            case "DELIVERED":
                return []; // Không thể thay đổi
            case "CANCELLED":
                return []; // Không thể thay đổi
            default:
                return [];
        }
    };

    const availableStatuses = getAvailableStatuses(order.status);

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4"
                    onClick={onClose}
                >
                    <motion.div
                        initial={{ scale: 0.95, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.95, opacity: 0 }}
                        onClick={(e) => e.stopPropagation()}
                        className="bg-white rounded-lg shadow-xl w-full max-w-md"
                    >
                        {/* Header */}
                        <div className="border-b border-gray-200 px-6 py-4 flex items-center justify-between">
                            <h2 className="text-xl font-bold text-gray-800">
                                Cập nhật trạng thái đơn hàng
                            </h2>
                            <button
                                onClick={onClose}
                                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Mã đơn hàng
                                </label>
                                <div className="text-lg font-semibold text-blue-600">
                                    {order.orderCode}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Trạng thái hiện tại
                                </label>
                                <div className="inline-block">
                                    <div
                                        className={`flex items-center gap-2 px-4 py-2 rounded-full ${
                                            ORDER_STATUS_CONFIG[order.status]
                                                .bgColor
                                        }`}
                                    >
                                        <div
                                            className={`w-2 h-2 rounded-full ${
                                                ORDER_STATUS_CONFIG[
                                                    order.status
                                                ].iconBgColor
                                            }`}
                                        ></div>
                                        <span
                                            className={`text-sm font-medium ${
                                                ORDER_STATUS_CONFIG[
                                                    order.status
                                                ].textColor
                                            }`}
                                        >
                                            {
                                                ORDER_STATUS_CONFIG[
                                                    order.status
                                                ].label
                                            }
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {availableStatuses.length > 0 ? (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Chọn trạng thái mới
                                    </label>
                                    <div className="space-y-2">
                                        {availableStatuses.map((status) => (
                                            <label
                                                key={status}
                                                className="flex items-center gap-3 p-3  rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                                            >
                                                <input
                                                    type="radio"
                                                    name="status"
                                                    value={status}
                                                    checked={
                                                        selectedStatus ===
                                                        status
                                                    }
                                                    onChange={(e) =>
                                                        setSelectedStatus(
                                                            e.target
                                                                .value as Order["status"]
                                                        )
                                                    }
                                                    className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                                                />
                                                <div
                                                    className={`flex items-center gap-2 px-3 py-1 rounded-full ${ORDER_STATUS_CONFIG[status].bgColor}`}
                                                >
                                                    <div
                                                        className={`w-2 h-2 rounded-full ${ORDER_STATUS_CONFIG[status].iconBgColor}`}
                                                    ></div>
                                                    <span
                                                        className={`text-sm font-medium ${ORDER_STATUS_CONFIG[status].textColor}`}
                                                    >
                                                        {
                                                            ORDER_STATUS_CONFIG[
                                                                status
                                                            ].label
                                                        }
                                                    </span>
                                                </div>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                                    <p className="text-sm text-yellow-800">
                                        Đơn hàng đã ở trạng thái cuối cùng,
                                        không thể thay đổi.
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex justify-end gap-3">
                            <button
                                onClick={onClose}
                                className="px-6 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-md font-semibold transition-colors"
                            >
                                Hủy
                            </button>
                            {availableStatuses.length > 0 && (
                                <button
                                    onClick={handleConfirm}
                                    disabled={
                                        !selectedStatus ||
                                        selectedStatus === order.status
                                    }
                                    className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Xác nhận
                                </button>
                            )}
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default OrderStatusUpdateModal;
