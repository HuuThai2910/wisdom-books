import { ApiResponse, Payment } from "../types";
import axiosClient from "./axiosClient";
interface OrderItemRequest {
    bookId: number;
    quantity: number;
    price: number;
}
interface OrderRequest {
    receiverName: string;
    receiverPhone: string;
    receiverAddress: string;
    receiverEmail: string;
    note: string;
    paymentMethod: "COD" | "VNPAY";
    totalPrice: number;
    items: OrderItemRequest[];
}
const paymentApi = {
    retryVNPay: (orderCode: string) =>
        axiosClient.get<ApiResponse<Payment>>("/payment/retry", {
            params: { orderCode },
        }),
    createOrder: (order: OrderRequest) =>
        axiosClient.post<ApiResponse<any>>("/payment/create-order", order),
    vnpayReturn: (params: Record<string, string>) =>
        axiosClient.get<ApiResponse<any>>("/payment/vnpay-return", {
            params,
        }),
};

export default paymentApi;
