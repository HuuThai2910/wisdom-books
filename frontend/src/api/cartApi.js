import axiosClient from "./axiosClient";

const cartAPI = {
    getCart: () => axiosClient.get("/cart"),
    addItem: (item) => axiosClient.post("/cart/add", item),
    removeItem: (id) => axiosClient.delete(`/cart/remove/${id}`),
    clearCart: () => axiosClient.delete("/cart/clear"),
};

export default cartAPI;
