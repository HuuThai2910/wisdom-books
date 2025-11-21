import axiosClient from "./axiosClient";
import { ApiResponse, CartItem } from "../types";

interface AddItemParams {
    bookId: number;
    quantity: number;
}

interface UpdateItemParams {
    id: number;
    quantity: number;
}

interface UpdateSelectionsParams {
    selections: Array<{
        id: number;
        selected: boolean;
    }>;
}

const cartAPI = {
    // Lấy giỏ hàng hiện tại
    fetchCart: () =>
        axiosClient.get<ApiResponse<{ cartItems: CartItem[] }>>("/cart"),

    // Thêm sản phẩm vào giỏ hàng
    addItem: (item: AddItemParams) =>
        axiosClient.post<ApiResponse<CartItem>>("/cart", item),

    // Xóa sản phẩm khỏi giỏ hàng theo itemId
    removeItem: (id: number) =>
        axiosClient.delete<ApiResponse<void>>(`/cart/${id}`),

    // Cập nhật số lượng sản phẩm giỏ hàng theo itemId
    updateItem: (item: UpdateItemParams) =>
        axiosClient.put<ApiResponse<CartItem>>("/cart", item),

    // Cập nhật select cho sản phẩm trong giỏ hàng
    updateSelections: (params: UpdateSelectionsParams) =>
        axiosClient.put<ApiResponse<void>>("/cart/select", params),

    // Cập nhật select all cho toàn bộ sản phẩm trong giỏ hàng
    updateSelectAll: (selected: boolean) =>
        axiosClient.put<ApiResponse<void>>(
            `/cart/select-all?selected=${selected}`
        ),

    // Xóa toàn bộ giỏ hàng
    clearCart: () => axiosClient.delete<ApiResponse<void>>("/cart"),
};

export default cartAPI;
