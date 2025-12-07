import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Order } from "../../types";
import { formatCurrency } from "../../util/formatting";
import OrderStatusBadge from "../orders/OrderStatusBadge";
import PaymentStatusBadge from "../orders/PaymentStatusBadge";

interface OrderDetailModalProps {
    isOpen: boolean;
    order: Order | null;
    onClose: () => void;
}

const OrderDetailModal = ({
    isOpen,
    order,
    onClose,
}: OrderDetailModalProps) => {
    if (!order) return null;

    const formatDate = (dateStr: string) => {
        const d = new Date(dateStr);
        const dd = String(d.getDate()).padStart(2, "0");
        const mm = String(d.getMonth() + 1).padStart(2, "0");
        const yyyy = d.getFullYear();
        const hh = String(d.getHours()).padStart(2, "0");
        const min = String(d.getMinutes()).padStart(2, "0");
        return `${dd}/${mm}/${yyyy} ${hh}:${min}`;
    };

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
                        className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden"
                    >
                        {/* Header */}
                        <div className="bg-linear-to-r from-blue-600 to-blue-700 px-6 py-5 flex items-center justify-between">
                            <div>
                                <h2 className="text-xl font-bold text-white">
                                    Chi tiết đơn hàng
                                </h2>
                                <p className="text-sm text-blue-100 mt-1">
                                    {order.orderCode}
                                </p>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-2 hover:bg-white/10 rounded-full transition-colors text-white"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Content - Scrollable */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-6">
                            {/* Order Info */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-gray-50 rounded-lg p-4">
                                    <div className="text-xs text-gray-600 mb-2">
                                        Ngày đặt
                                    </div>
                                    <div className="text-sm font-semibold text-gray-900">
                                        {formatDate(order.orderDate)}
                                    </div>
                                </div>
                                <div className="bg-gray-50 rounded-lg p-4">
                                    <div className="text-xs text-gray-600 mb-2">
                                        Trạng thái đơn
                                    </div>
                                    <OrderStatusBadge status={order.status} />
                                </div>
                                <div className="bg-gray-50 rounded-lg p-4">
                                    <div className="text-xs text-gray-600 mb-2">
                                        Phương thức thanh toán
                                    </div>
                                    <div className="text-sm font-semibold text-gray-900">
                                        {order.paymentMethod === "VNPAY"
                                            ? "VNPAY"
                                            : order.paymentMethod}
                                    </div>
                                </div>
                                <div className="bg-gray-50 rounded-lg p-4">
                                    <div className="text-xs text-gray-600 mb-2">
                                        Trạng thái thanh toán
                                    </div>
                                    <PaymentStatusBadge
                                        paymentStatus={order.paymentStatus}
                                        paymentMethod={order.paymentMethod}
                                        orderStatus={order.status}
                                    />
                                </div>
                            </div>

                            {/* Receiver Info */}
                            <div>
                                <h3 className="text-xs font-semibold text-gray-700 uppercase tracking-wider mb-3">
                                    Thông tin người nhận
                                </h3>
                                <div className="bg-gray-50 rounded-lg p-5">
                                    <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                                        <div>
                                            <div className="text-xs text-gray-600 mb-1">
                                                Họ tên
                                            </div>
                                            <div className="text-sm font-semibold text-gray-900">
                                                {order.receiverName}
                                            </div>
                                        </div>
                                        <div>
                                            <div className="text-xs text-gray-600 mb-1">
                                                Số điện thoại
                                            </div>
                                            <div className="text-sm font-semibold text-gray-900">
                                                {order.receiverPhone}
                                            </div>
                                        </div>
                                        <div>
                                            <div className="text-xs text-gray-600 mb-1">
                                                Email
                                            </div>
                                            <div className="text-sm font-medium text-gray-900">
                                                {order.receiverEmail}
                                            </div>
                                        </div>
                                        <div>
                                            <div className="text-xs text-gray-600 mb-1">
                                                Địa chỉ giao hàng
                                            </div>
                                            <div className="text-sm text-gray-900 leading-relaxed font-medium">
                                                {order.receiverAddress}
                                            </div>
                                        </div>
                                        {order.note && (
                                            <div className="col-span-2 pt-3 mt-1">
                                                <div className="text-xs text-gray-600 mb-1">
                                                    Ghi chú
                                                </div>
                                                <div className="text-sm text-gray-700 italic font-medium">
                                                    {order.note}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Order Items */}
                            <div>
                                <h3 className="text-xs font-semibold text-gray-700 uppercase tracking-wider mb-3">
                                    Sản phẩm • {order.orderItems.length}
                                </h3>
                                <div className="space-y-2">
                                    {order.orderItems.map((item, index) => (
                                        <div
                                            key={item.id}
                                            className="flex gap-3 p-4 bg-gray-50 rounded-lg"
                                        >
                                            <div className="relative shrink-0">
                                                <img
                                                    src={`https://hai-project-images.s3.us-east-1.amazonaws.com/${item.book.image}`}
                                                    alt={item.book.title}
                                                    className="w-16 h-16 object-cover rounded-lg"
                                                    onError={(e) => {
                                                        e.currentTarget.src =
                                                            "https://via.placeholder.com/80";
                                                    }}
                                                />
                                                <div className="absolute -top-1 -left-1 bg-gray-900 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                                                    {index + 1}
                                                </div>
                                            </div>
                                            <div className="flex-1 min-w-0 flex flex-col justify-between">
                                                <h4 className="text-sm font-semibold text-gray-900 line-clamp-2 leading-snug">
                                                    {item.book.title}
                                                </h4>
                                                <div className="flex items-center justify-between mt-2">
                                                    <span className="text-xs text-gray-600">
                                                        {item.quantity} x{" "}
                                                        {formatCurrency(
                                                            item.price
                                                        )}
                                                    </span>
                                                    <span className="text-sm font-bold text-gray-900">
                                                        {formatCurrency(
                                                            item.price *
                                                                item.quantity
                                                        )}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Update Info */}
                            {order.updateBy && order.updateAt && (
                                <div className="text-xs text-gray-500 pt-4 border-t">
                                    Cập nhật: {formatDate(order.updateAt)} •{" "}
                                    {order.updateBy}
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        <div className="bg-linear-to-r from-blue-600 to-blue-700 px-6 py-5">
                            <div className="text-white space-y-2">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-blue-100">
                                        Tổng số lượng
                                    </span>
                                    <span className="text-sm font-semibold">
                                        {order.orderItems.reduce(
                                            (sum, item) => sum + item.quantity,
                                            0
                                        )}{" "}
                                        sản phẩm
                                    </span>
                                </div>
                                <div className="flex items-center justify-between border-t border-blue-500 pt-2">
                                    <span className="text-base font-semibold">
                                        Tổng tiền
                                    </span>
                                    <span className="text-xl font-bold">
                                        {formatCurrency(order.totalPrice)}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default OrderDetailModal;
