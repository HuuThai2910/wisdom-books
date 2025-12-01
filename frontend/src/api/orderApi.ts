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

    // Hủy đơn hàng
    cancelOrder: (orderId: number) =>
        axiosClient.put<ApiResponse<Order>>(`/orders/${orderId}/cancel`),

    // Cập nhật trạng thái đơn hàng (chỉ admin có quyền)
    updateOrderStatus: (data: { id: number; status: Order["status"] }) =>
        axiosClient.post<ApiResponse<UpdatedOrderResponse>>("/orders", data),
};

export default orderApi;
