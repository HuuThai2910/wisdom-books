import { Order } from "../../types";

interface PaymentStatusBadgeProps {
    paymentStatus: Order["paymentStatus"];
    paymentMethod?: Order["paymentMethod"];
    orderStatus?: Order["status"];
}

const PaymentStatusBadge = ({
    paymentStatus,
    paymentMethod,
    orderStatus,
}: PaymentStatusBadgeProps) => {
    // Chờ thanh toán - VNPAY chưa thanh toán và đơn đang chờ
    if (
        paymentMethod === "VNPAY" &&
        paymentStatus === "UNPAID" &&
        orderStatus === "PENDING"
    ) {
        return (
            <div className="inline-flex items-center gap-2 px-3 py-2 rounded-full bg-orange-100">
                <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                <span className="text-xs font-medium text-orange-700 whitespace-nowrap">
                    Chờ thanh toán
                </span>
            </div>
        );
    }

    // Đã thanh toán badge - tất cả trường hợp đã thanh toán
    if (paymentStatus === "PAID") {
        return (
            <div className="inline-flex items-center gap-2 px-3 py-2 rounded-full bg-green-100">
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                <span className="text-xs font-medium text-green-700 whitespace-nowrap">
                    Đã thanh toán
                </span>
            </div>
        );
    }

    // Chưa thanh toán badge - các trường hợp khác chưa thanh toán
    if (paymentStatus === "UNPAID") {
        return (
            <div className="inline-flex items-center gap-2 px-3 py-2 rounded-full bg-orange-100">
                <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                <span className="text-xs font-medium text-orange-700 whitespace-nowrap">
                    Chưa thanh toán
                </span>
            </div>
        );
    }

    return null;
};

export default PaymentStatusBadge;
