import axiosClient from "./axiosClient";
import {
    ApiResponse,
    Order,
    UpdatedOrderResponse,
    PaginatedResponse,
} from "../types";

const orderApi = {
    // Lấy danh sách đơn hàng (chỉ admin có quyền)
    fetchOrders: (params?: {
        page?: number;
        size?: number;
        filter?: string;
        sort?: string;
    }) =>
        axiosClient.get<ApiResponse<PaginatedResponse<Order>>>("/orders", {
            params,
        }),

    // Lấy danh sách đơn hàng theo user
    fetchOrdersByUser: () =>
        axiosClient.get<ApiResponse<Order[]>>("/orders/user"),

    // Lấy chi tiết đơn hàng
    getOrderDetail: (orderId: number) =>
        axiosClient.get<ApiResponse<Order>>(`/orders/${orderId}`),

    // Hủy đơn hàng (gửi request với id và status CANCELLED)
    cancelOrder: (orderId: number) =>
        axiosClient.put<ApiResponse<UpdatedOrderResponse>>("/orders/cancel", {
            id: orderId,
            status: "CANCELLED",
        }),

    // Cập nhật trạng thái đơn hàng (chỉ admin có quyền)
    updateOrderStatus: (data: { id: number; status: Order["status"] }) =>
        axiosClient.put<ApiResponse<UpdatedOrderResponse>>("/orders", data),

    // Kiểm tra user đã mua sách chưa (có đơn DELIVERED)
    checkUserPurchased: (bookId: number) =>
        axiosClient.get<ApiResponse<boolean>>(`/orders/check-purchased/${bookId}`),
};

export default orderApi;
