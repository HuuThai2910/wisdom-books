import { CheckCircle } from "lucide-react";
import { Order } from "../../types";

interface PaymentStatusBadgeProps {
    paymentStatus: Order["paymentStatus"];
    paymentMethod: Order["paymentMethod"];
    orderStatus: Order["status"];
}

const PaymentStatusBadge = ({
    paymentStatus,
    paymentMethod,
    orderStatus,
}: PaymentStatusBadgeProps) => {
    // Chờ thanh toán badge
    if (
        paymentMethod === "VNPAY" &&
        paymentStatus === "UNPAID" &&
        orderStatus === "PENDING"
    ) {
        return (
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-orange-100 border-2 border-orange-300 animate-pulse">
                <svg
                    className="w-4 h-4 text-orange-600"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                >
                    <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                        clipRule="evenodd"
                    />
                </svg>
                <span className="text-sm font-bold text-orange-700">
                    Chờ thanh toán
                </span>
            </div>
        );
    }

    // Đã thanh toán badge
    if (paymentStatus === "PAID") {
        return (
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-green-100 border-2 border-green-300">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span className="text-sm font-bold text-green-700">
                    Đã thanh toán
                </span>
            </div>
        );
    }

    return null;
};

export default PaymentStatusBadge;
