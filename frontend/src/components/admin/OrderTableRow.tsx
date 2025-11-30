import { Eye, Edit } from "lucide-react";
import { Order } from "../../types";
import { formatCurrency } from "../../util/formatting";
import OrderStatusBadge from "../orders/OrderStatusBadge";

interface OrderTableRowProps {
    order: Order;
    index: number;
    onViewDetail: (order: Order) => void;
    onUpdateStatus: (order: Order) => void;
}

const OrderTableRow = ({
    order,
    index,
    onViewDetail,
    onUpdateStatus,
}: OrderTableRowProps) => {
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
        <tr className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
            <td className="px-4 py-3 text-center text-sm text-gray-700">
                {index + 1}
            </td>
            <td className="px-4 py-3 text-sm">
                <div className="font-medium text-blue-600">
                    {order.orderCode}
                </div>
            </td>
            <td className="px-4 py-3 text-sm text-gray-700">
                {order.userName}
            </td>
            
            <td className="px-4 py-3 text-sm text-gray-700">
                {formatDate(order.orderDate)}
            </td>
            <td className="px-4 py-3 text-sm font-semibold text-gray-900">
                {formatCurrency(order.totalPrice)}
            </td>
            <td className="px-4 py-3 text-center">
                <div className="flex justify-center">
                    <OrderStatusBadge status={order.status} />
                </div>
            </td>
            <td className="px-4 py-3 text-center">
                <div className="flex items-center justify-center gap-2">
                    <button
                        onClick={() => onViewDetail(order)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                        title="Xem chi tiết"
                    >
                        <Eye className="w-5 h-5" />
                    </button>
                    <button
                        onClick={() => onUpdateStatus(order)}
                        className="p-2 text-green-600 hover:bg-green-50 rounded-md transition-colors"
                        title="Cập nhật trạng thái"
                    >
                        <Edit className="w-5 h-5" />
                    </button>
                </div>
            </td>
        </tr>
    );
};

export default OrderTableRow;
