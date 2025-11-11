// src/api/cartApi.js
import axiosClient from "./axiosClient";

const cartAPI = {
    // Lấy giỏ hàng hiện tại
    getCart: () => axiosClient.get("/cart"),

    // Thêm sản phẩm vào giỏ hàng
    // item = { productId: number, quantity: number }
    addItem: (item) => axiosClient.post("/cart/add", item),

    // Xóa sản phẩm khỏi giỏ hàng theo productId
    removeItem: (id) => axiosClient.delete(`/cart/remove/${id}`),

    // Xóa toàn bộ giỏ hàng
    clearCart: () => axiosClient.delete("/cart/clear"),
};

export default cartAPI;
