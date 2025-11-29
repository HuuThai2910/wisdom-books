import axiosClient from "./axiosClient";
import { ApiResponse, Order } from "../types";

const orderApi = {
    // Lấy danh sách đơn hàng
    fetchOrders: () => axiosClient.get<ApiResponse<Order[]>>("/orders"),

    // Lấy chi tiết đơn hàng
    getOrderDetail: (orderId: number) =>
        axiosClient.get<ApiResponse<Order>>(`/orders/${orderId}`),

    // Hủy đơn hàng
    cancelOrder: (orderId: number) =>
        axiosClient.put<ApiResponse<Order>>(`/orders/${orderId}/cancel`),
};

export default orderApi;
