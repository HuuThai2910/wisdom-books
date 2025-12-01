// src/features/order/orderSlice.ts
import {
    createSlice,
    createAsyncThunk,
    createSelector,
    PayloadAction,
} from "@reduxjs/toolkit";
import orderApi from "../../api/orderApi";
import { Order, PaginatedResponse, UpdatedOrderResponse } from "../../types";

// ===== ASYNC THUNKS =====

// Lấy tất cả đơn hàng (có phân trang)
export const fetchAllOrders = createAsyncThunk<
    PaginatedResponse<Order>,
    | {
          page?: number;
          size?: number;
          filter?: string;
          sort?: string;
      }
    | undefined,
    { rejectValue: string }
>("order/fetchAllOrders", async (params, thunkAPI) => {
    try {
        const res = await orderApi.fetchOrders(params);
        return res.data.data;
    } catch (err: any) {
        return thunkAPI.rejectWithValue(
            err.response?.data?.message || err.message
        );
    }
});

// Lấy đơn hàng của user hiện tại
export const fetchUserOrders = createAsyncThunk<
    Order[],
    void,
    { rejectValue: string }
>("order/fetchUserOrders", async (_, thunkAPI) => {
    try {
        const res = await orderApi.fetchOrdersByUser();
        return res.data.data;
    } catch (err: any) {
        return thunkAPI.rejectWithValue(
            err.response?.data?.message || err.message
        );
    }
});

// Lấy chi tiết đơn hàng theo ID
export const fetchOrderById = createAsyncThunk<
    Order,
    number,
    { rejectValue: string }
>("order/fetchOrderById", async (orderId, thunkAPI) => {
    try {
        const res = await orderApi.getOrderDetail(orderId);
        return res.data.data;
    } catch (err: any) {
        return thunkAPI.rejectWithValue(
            err.response?.data?.message || err.message
        );
    }
});

// Hủy đơn hàng
export const cancelOrder = createAsyncThunk<
    Order,
    number,
    { rejectValue: string }
>("order/cancelOrder", async (orderId, thunkAPI) => {
    try {
        const res = await orderApi.cancelOrder(orderId);
        return res.data.data;
    } catch (err: any) {
        return thunkAPI.rejectWithValue(
            err.response?.data?.message || err.message
        );
    }
});

// Cập nhật trạng thái đơn hàng (Admin)
export const updateOrderStatus = createAsyncThunk<
    UpdatedOrderResponse,
    { id: number; status: Order["status"] },
    { rejectValue: string }
>("order/updateOrderStatus", async (updateData, thunkAPI) => {
    try {
        const res = await orderApi.updateOrderStatus(updateData);
        return res.data.data;
    } catch (err: any) {
        return thunkAPI.rejectWithValue(
            err.response?.data?.message || err.message
        );
    }
});

// ===== STATE INTERFACE =====

interface OrderSliceState {
    // Danh sách đơn hàng (cho admin - có phân trang)
    orders: Order[];
    ordersMeta: {
        page: number;
        pageSize: number;
        pages: number;
        total: number;
    } | null;

    // Đơn hàng của user
    userOrders: Order[];

    // Chi tiết đơn hàng đang xem
    currentOrder: Order | null;

    // Trạng thái loading
    status: "idle" | "loading" | "succeeded" | "failed";
    fetchingOrderId: number | null; // Đang fetch detail của order nào

    // Lỗi
    error: string | null;
}

const initialState: OrderSliceState = {
    orders: [],
    ordersMeta: null,
    userOrders: [],
    currentOrder: null,
    status: "idle",
    fetchingOrderId: null,
    error: null,
};

// ===== SLICE =====

const orderSlice = createSlice({
    name: "order",
    initialState,
    reducers: {
        // Clear current order detail
        clearCurrentOrder: (state) => {
            state.currentOrder = null;
        },

        // Clear error
        clearError: (state) => {
            state.error = null;
        },

        // Optimistic update cho order status (dùng khi admin update)
        optimisticUpdateOrderStatus: (
            state,
            action: PayloadAction<{ id: number; status: Order["status"] }>
        ) => {
            const { id, status } = action.payload;

            // Update trong danh sách orders (admin)
            const orderInList = state.orders.find((o) => o.id === id);
            if (orderInList) {
                orderInList.status = status;
            }

            // Update trong userOrders
            const userOrder = state.userOrders.find((o) => o.id === id);
            if (userOrder) {
                userOrder.status = status;
            }

            // Update currentOrder nếu đang xem
            if (state.currentOrder && state.currentOrder.id === id) {
                state.currentOrder.status = status;
            }
        },
    },
    extraReducers: (builder) => {
        builder
            // ===== FETCH ALL ORDERS (ADMIN) =====
            .addCase(fetchAllOrders.pending, (state) => {
                state.status = "loading";
                state.error = null;
            })
            .addCase(fetchAllOrders.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.orders = action.payload.result;
                state.ordersMeta = action.payload.meta;
            })
            .addCase(fetchAllOrders.rejected, (state, action) => {
                state.status = "failed";
                state.error =
                    action.payload || "Không thể tải danh sách đơn hàng";
            })

            // ===== FETCH USER ORDERS =====
            .addCase(fetchUserOrders.pending, (state) => {
                state.status = "loading";
                state.error = null;
            })
            .addCase(fetchUserOrders.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.userOrders = action.payload;
            })
            .addCase(fetchUserOrders.rejected, (state, action) => {
                state.status = "failed";
                state.error =
                    action.payload || "Không thể tải đơn hàng của bạn";
            })

            // ===== FETCH ORDER BY ID =====
            .addCase(fetchOrderById.pending, (state, action) => {
                state.fetchingOrderId = action.meta.arg;
                state.error = null;
            })
            .addCase(fetchOrderById.fulfilled, (state, action) => {
                state.fetchingOrderId = null;
                state.currentOrder = action.payload;
            })
            .addCase(fetchOrderById.rejected, (state, action) => {
                state.fetchingOrderId = null;
                state.error =
                    action.payload || "Không thể tải chi tiết đơn hàng";
            })

            // ===== CANCEL ORDER =====
            .addCase(cancelOrder.fulfilled, (state, action) => {
                const canceledOrder = action.payload;

                // Update trong orders
                const orderIndex = state.orders.findIndex(
                    (o) => o.id === canceledOrder.id
                );
                if (orderIndex !== -1) {
                    state.orders[orderIndex] = canceledOrder;
                }

                // Update trong userOrders
                const userOrderIndex = state.userOrders.findIndex(
                    (o) => o.id === canceledOrder.id
                );
                if (userOrderIndex !== -1) {
                    state.userOrders[userOrderIndex] = canceledOrder;
                }

                // Update currentOrder
                if (state.currentOrder?.id === canceledOrder.id) {
                    state.currentOrder = canceledOrder;
                }
            })

            // ===== UPDATE ORDER STATUS =====
            .addCase(updateOrderStatus.fulfilled, (state, action) => {
                const { id, status } = action.payload;

                // Update status trong orders
                const order = state.orders.find((o) => o.id === id);
                if (order) {
                    order.status = status;
                }

                // Update trong userOrders
                const userOrder = state.userOrders.find((o) => o.id === id);
                if (userOrder) {
                    userOrder.status = status;
                }

                // Update currentOrder
                if (state.currentOrder?.id === id) {
                    state.currentOrder.status = status;
                }
            })

            // ===== XỬ LÝ LỖI CHUNG =====
            .addMatcher(
                (action): action is PayloadAction<string> =>
                    action.type.startsWith("order/") &&
                    action.type.endsWith("rejected"),
                (state, action) => {
                    state.status = "failed";
                    state.error = action.payload || "Có lỗi xảy ra";
                }
            );
    },
});

// ===== ACTIONS =====
export const { clearCurrentOrder, clearError, optimisticUpdateOrderStatus } =
    orderSlice.actions;

// ===== SELECTORS =====

// Selector lấy danh sách orders (admin)
export const selectOrders = (state: { order: OrderSliceState }) =>
    state.order.orders;

// Selector lấy meta phân trang
export const selectOrdersMeta = (state: { order: OrderSliceState }) =>
    state.order.ordersMeta;

// Selector lấy user orders
export const selectUserOrders = (state: { order: OrderSliceState }) =>
    state.order.userOrders;

// Selector lấy current order
export const selectCurrentOrder = (state: { order: OrderSliceState }) =>
    state.order.currentOrder;

// Selector lấy trạng thái loading
export const selectOrderStatus = (state: { order: OrderSliceState }) =>
    state.order.status;

// Selector lấy error
export const selectOrderError = (state: { order: OrderSliceState }) =>
    state.order.error;

// Selector lấy order đang fetch
export const selectFetchingOrderId = (state: { order: OrderSliceState }) =>
    state.order.fetchingOrderId;

// Selector lọc orders theo status
export const selectOrdersByStatus = createSelector(
    [selectUserOrders, (_: any, status: Order["status"] | "ALL") => status],
    (orders, status) => {
        if (status === "ALL") return orders;
        return orders.filter((order) => order.status === status);
    }
);

// Selector đếm số lượng orders theo status
export const selectOrderCountByStatus = createSelector(
    [selectUserOrders],
    (orders) => {
        return {
            ALL: orders.length,
            PENDING: orders.filter((o) => o.status === "PENDING").length,
            PROCESSING: orders.filter((o) => o.status === "PROCESSING").length,
            SHIPPING: orders.filter((o) => o.status === "SHIPPING").length,
            DELIVERED: orders.filter((o) => o.status === "DELIVERED").length,
            CANCELLED: orders.filter((o) => o.status === "CANCELLED").length,
        };
    }
);

// ===== EXPORT REDUCER =====
export default orderSlice.reducer;
