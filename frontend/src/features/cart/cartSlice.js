// src/features/cart/cartSlice.js
import {
    createSlice,
    createAsyncThunk,
    createSelector,
} from "@reduxjs/toolkit";
import cartAPI from "../../api/cartApi";

// Lấy cart
export const fetchCart = createAsyncThunk(
    "cart/fetchCart",
    async (_, thunkAPI) => {
        try {
            const res = await cartAPI.fetchCart();
            const result = res.data;
            return result?.data?.cartItems || [];
        } catch (err) {
            return thunkAPI.rejectWithValue(
                err.response?.data?.message || err.message
            );
        }
    }
);

// Thêm item
export const addItem = createAsyncThunk(
    "cart/addItem",
    async ({ bookId, quantity }, thunkAPI) => {
        try {
            const res = await cartAPI.addItem({ bookId, quantity });
            const result = res.data;
            return result.data;
        } catch (err) {
            return thunkAPI.rejectWithValue(
                err.response?.data?.message || err.message
            );
        }
    }
);
// Cập nhât item
export const updateItem = createAsyncThunk(
    "cart/updateItem",
    async ({ id, quantity }, thunkAPI) => {
        try {
            const res = await cartAPI.updateItem({ id, quantity });
            // API returns { status, success, message, data: {...} }
            return res.data?.data || res.data;
        } catch (err) {
            return thunkAPI.rejectWithValue(
                err.response?.data?.message || err.message
            );
        }
    }
);
// Xóa item
export const removeItem = createAsyncThunk(
    "cart/removeFromCart",
    async (itemId, thunkAPI) => {
        try {
            console.log("test");
            await cartAPI.removeItem(itemId);

            return itemId;
        } catch (err) {
            return thunkAPI.rejectWithValue(
                err.response?.data?.message || err.message
            );
        }
    }
);

// Xóa toàn bộ cart
export const clearCart = createAsyncThunk(
    "cart/clearCart",
    async (_, thunkAPI) => {
        try {
            await cartAPI.clearCart();
            return [];
        } catch (err) {
            return thunkAPI.rejectWithValue(
                err.response?.data?.message || err.message
            );
        }
    }
);

// Cập nhật select cho item
export const updateSelections = createAsyncThunk(
    "cart/updateSelect",
    async (selections, thunkAPI) => {
        try {
            const res = await cartAPI.updateSelections(selections);
            // API returns { status, success, message, data: [...] }
            return res.data?.data || res.data;
        } catch (err) {
            return thunkAPI.rejectWithValue(
                err.response?.data?.message || err.message
            );
        }
    }
);

// Cập nhật select all
export const updateSelectAll = createAsyncThunk(
    "cart/updateSelectAll",
    async (selected, thunkAPI) => {
        try {
            await cartAPI.updateSelectAll(selected);
            return selected;
        } catch (err) {
            return thunkAPI.rejectWithValue(
                err.response?.data?.message || err.message
            );
        }
    }
);

const cartSlice = createSlice({
    name: "cart",
    initialState: {
        cartItems: [],
        status: "idle", // idle | loading | succeeded | failed
        error: null,
    },
    reducers: {
        // Hàm để cập nhật các select item và hiển thị ngay lập tức cho UI
        optimisticUpdateSelection: (state, action) => {
            const { id, selected } = action.payload;
            const item = state.cartItems.find((i) => i.id === id);
            if (item) {
                item.selected = selected;
            }
        },
        // Hàm để cập nhật tất cả select item và hiển thị ngay lập tức cho UI
        optimisticUpdateSelectAll: (state, action) => {
            const selected = action.payload;
            state.cartItems.forEach((i) => (i.selected = selected));
        },
        // Hàm để cập nhật số lượng item và hiển thị ngay lập tức cho UI
        optimisticUpdateQuantity: (state, action) => {
            const { id, quantity } = action.payload;
            const item = state.cartItems.find((i) => i.id === id);
            if (item) {
                item.quantity = quantity;
            }
        },
    },
    extraReducers: (builder) => {
        builder
            // FETCH CART
            .addCase(fetchCart.pending, (state) => {
                state.status = "loading";
                state.error = null;
            })
            .addCase(fetchCart.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.cartItems = action.payload;
            })
            .addCase(fetchCart.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload;
            })

            // ADD TO CART
            .addCase(addItem.fulfilled, (state, action) => {
                state.status = "succeeded";
                const existingItem = state.cartItems.find(
                    (item) => item.id === action.payload.id
                );
                if (existingItem) {
                    existingItem.quantity += action.payload.quantity;
                } else {
                    state.cartItems.push(action.payload);
                }
            })

            // UPDATE QUANTITY
            .addCase(updateItem.fulfilled, (state, action) => {
                state.status = "succeeded";
                const updated = action.payload;
                const index = state.cartItems.findIndex(
                    (i) => i.id === updated.id
                );
                if (index != -1) {
                    state.cartItems[index] = updated;
                }
            })

            // REMOVE ITEM
            .addCase(removeItem.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.cartItems = state.cartItems.filter(
                    (i) => i.id !== action.payload
                );
            })

            // CLEAR CART
            .addCase(clearCart.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.cartItems = action.payload; // []
            })

            // Update select
            .addCase(updateSelections.fulfilled, (state, action) => {
                state.status = "succeeded";
                // Payload is array of updated cart items from server
                if (Array.isArray(action.payload)) {
                    action.payload.forEach((updatedItem) => {
                        const item = state.cartItems.find(
                            (i) => i.id === updatedItem.id
                        );
                        if (item) {
                            item.selected = updatedItem.selected;
                        }
                    });
                }
            })

            // Update all
            .addCase(updateSelectAll.fulfilled, (state, action) => {
                state.status = "succeeded";
                const selected = action.payload;
                state.cartItems.forEach((i) => (i.selected = selected));
            })

            // Xử lý lỗi chung
            .addMatcher(
                (action) => action.type.endsWith("rejected"),
                (state, action) => {
                    state.status = "failed";
                    state.error = action.payload;
                }
            );
    },
});

export const {
    optimisticUpdateSelection,
    optimisticUpdateSelectAll,
    optimisticUpdateQuantity,
} = cartSlice.actions;
export default cartSlice.reducer;

export const selectSelectedItems = createSelector(
    (state) => state.cart.cartItems,
    (cartItems) => cartItems.filter((i) => i.selected)
);

export const selectTotals = createSelector(
    selectSelectedItems,
    (selectedItems) => {
        const totalQuantity = selectedItems.reduce(
            (sum, i) => sum + i.quantity,
            0
        );
        const totalPrice = selectedItems.reduce(
            (sum, i) => sum + i.quantity * i.book.price,
            0
        );
        return { totalQuantity, totalPrice };
    }
);
