import axiosClient from "./axiosClient";

const cartAPI = {
    // Lấy giỏ hàng hiện tại
    fetchCart: () => axiosClient.get("/cart"),

    // Thêm sản phẩm vào giỏ hàng
    // item = { productId: number, quantity: number }
    addItem: (item) => axiosClient.post("/cart", item),

    // Xóa sản phẩm khỏi giỏ hàng theo itemId
    removeItem: (id) => axiosClient.delete(`/cart/${id}`),

    // Cập nhật số lương sản phẩm giỏ hàng theo itemId
    updateItem: (item) => axiosClient.put("/cart", item),

    // Cập nhật select cho sản phẩm trong giỏ hàng
    updateSelections: (selections) =>
        axiosClient.put("/cart/select", selections),

    // Cập nhật select all cho toàn bộ sản phẩm trong giỏ hàng
    updateSelectAll: (selected) =>
        axiosClient.put(`/cart/select-all?selected=${selected}`),

    // Xóa toàn bộ giỏ hàng
    clearCart: () => axiosClient.delete("/cart"),
};

export default cartAPI;
