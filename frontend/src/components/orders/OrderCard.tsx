import { Eye, EyeOff, XCircle } from "lucide-react";
import { Order } from "../../types";
import { formatCurrency } from "../../util/formatting";
import OrderStatusBadge from "./OrderStatusBadge";
import PaymentStatusBadge from "./PaymentStatusBadge";
import PaymentNotice from "./PaymentNotice";

interface OrderCardProps {
    order: Order;
    isExpanded: boolean;
    onToggleDetail: (orderId: number) => void;
    onRetryPayment: (orderCode: string, expiredAt: string) => void;
    // Callback hủy đơn hàng (chỉ cho PENDING)
    onCancelOrder?: (order: Order) => void;
    children?: React.ReactNode;
}

const OrderCard = ({
    order,
    isExpanded,
    onToggleDetail,
    onRetryPayment,
    onCancelOrder,
    children,
}: OrderCardProps) => {
    const showPaymentButton =
        order.paymentMethod === "VNPAY" &&
        order.paymentStatus === "UNPAID" &&
        order.status === "PENDING";

    const showPaymentNotice = showPaymentButton && order.expiredAt;

    // Chỉ hiển thị nút hủy khi đơn hàng ở trạng thái PENDING
    const showCancelButton = order.status === "PENDING";

    return (
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden hover:shadow-lg transition-all duration-300 border-2 border-transparent">
            {/* Order Header */}
            <div className="px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-6">
                    <div>
                        <p className="text-sm mb-1 font-medium">Mã đơn hàng</p>
                        <p className="text-lg font-bold text-gray-700">
                            {order.orderCode}
                        </p>
                    </div>

                    <div className="h-10 w-px bg-gray-200"></div>

                    <div>
                        <p className="text-sm mb-1 font-medium">Ngày đặt</p>
                        <p className="text-sm text-gray-700 font-bold">
                            {new Date(order.orderDate).toLocaleDateString(
                                "vi-VN"
                            )}
                        </p>
                    </div>

                    <div className="h-10 w-px bg-gray-200"></div>

                    <div>
                        <p className="text-sm mb-1 font-medium">Phương thức</p>
                        <p className="text-sm text-gray-700 font-bold">
                            {order.paymentMethod}
                        </p>
                    </div>
                </div>

                {/* Status Badges */}
                <div className="flex items-center gap-3">
                    {order.paymentMethod === "VNPAY" &&
                        order.status === "PENDING" && (
                            <PaymentStatusBadge
                                paymentStatus={order.paymentStatus}
                                paymentMethod={order.paymentMethod}
                                orderStatus={order.status}
                            />
                        )}
                    <OrderStatusBadge status={order.status} />
                </div>
            </div>

            {/* Payment Notice */}
            {showPaymentNotice && <PaymentNotice expiredAt={order.expiredAt} />}

            {/* Divider */}
            <div className="border-t border-gray-100"></div>

            {/* Order Footer */}
            <div className="px-6 py-4 flex items-center justify-between">
                <div>
                    <p className="text-xs text-gray-500 mb-1">Tổng tiền:</p>
                    <p className="text-2xl font-bold text-blue-600">
                        {formatCurrency(order.totalPrice)}
                    </p>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-3">
                    {/* Nút thanh toán lại (chỉ VNPAY UNPAID PENDING) */}
                    {showPaymentButton && (
                        <button
                            onClick={() =>
                                onRetryPayment(order.orderCode, order.expiredAt)
                            }
                            className="flex items-center gap-2 px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-all text-sm font-bold shadow-lg hover:shadow-xl transform hover:scale-105"
                        >
                            <svg
                                className="w-4 h-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                                />
                            </svg>
                            Thanh toán lại
                        </button>
                    )}

                    {/* Nút hủy đơn (chỉ PENDING) */}
                    {showCancelButton && onCancelOrder && (
                        <button
                            onClick={() => onCancelOrder(order)}
                            className="flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all text-sm font-medium shadow-md hover:shadow-lg"
                        >
                            <XCircle className="w-4 h-4" />
                            Hủy đơn hàng
                        </button>
                    )}

                    {/* Nút xem chi tiết */}
                    <button
                        onClick={() => onToggleDetail(order.id)}
                        className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all text-sm font-medium shadow-md hover:shadow-lg"
                    >
                        {isExpanded ? (
                            <>
                                <EyeOff className="w-4 h-4" />
                                Thu gọn
                            </>
                        ) : (
                            <>
                                <Eye className="w-4 h-4" />
                                Xem chi tiết
                            </>
                        )}
                    </button>
                </div>
            </div>

            {/* Order Details (children) */}
            {isExpanded && children}
        </div>
    );
};

export default OrderCard;
