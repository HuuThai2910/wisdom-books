import { ORDER_STATUS_CONFIG } from "../../constants/orderStatus";
import { Order } from "../../types";

interface OrderStatusBadgeProps {
    status: Order["status"];
}

const OrderStatusBadge = ({ status }: OrderStatusBadgeProps) => {
    const config = ORDER_STATUS_CONFIG[status];

    return (
        <div
            className={`flex items-center gap-2 px-4 py-2 rounded-full ${config.bgColor}`}
        >
            <div className={`w-2 h-2 rounded-full ${config.iconBgColor}`}></div>
            <span className={`text-sm font-medium ${config.textColor}`}>
                {config.label}
            </span>
        </div>
    );
};

export default OrderStatusBadge;
