import { Order } from "../types";

export const ORDER_STATUS_CONFIG: Record<
    Order["status"],
    {
        label: string;
        bgColor: string;
        textColor: string;
        iconBgColor: string;
    }
> = {
    PENDING: {
        label: "Chờ xác nhận",
        bgColor: "bg-yellow-100",
        textColor: "text-yellow-800",
        iconBgColor: "bg-yellow-500",
    },
    PROCESSING: {
        label: "Đang xử lý",
        bgColor: "bg-blue-100",
        textColor: "text-blue-800",
        iconBgColor: "bg-blue-500",
    },
    SHIPPING: {
        label: "Đang vận chuyển",
        bgColor: "bg-blue-100",
        textColor: "text-blue-800",
        iconBgColor: "bg-blue-500",
    },
    DELIVERED: {
        label: "Hoàn thành",
        bgColor: "bg-green-100",
        textColor: "text-green-800",
        iconBgColor: "bg-green-500",
    },
    CANCELLED: {
        label: "Đã hủy",
        bgColor: "bg-red-100",
        textColor: "text-red-800",
        iconBgColor: "bg-red-500",
    },
};
