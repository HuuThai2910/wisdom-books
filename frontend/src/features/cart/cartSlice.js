// src/features/cart/cartSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import cartAPI from "../../api/cartApi";

// 1️⃣ Lấy cart
export const fetchCart = createAsyncThunk(
    "cart/fetchCart",
    async (_, thunkAPI) => {
        try {
            const res = await cartAPI.getCart();
            const result = res.data; // { success, message, data, status, errors }

            if (!result.success)
                return thunkAPI.rejectWithValue(result.message);

            return result.data; // mảng CartItem
        } catch (err) {
            return thunkAPI.rejectWithValue(
                err.response?.data?.message || err.message
            );
        }
    }
);

// 2️⃣ Thêm item
export const addToCart = createAsyncThunk(
    "cart/addToCart",
    async ({ productId, quantity }, thunkAPI) => {
        try {
            const res = await cartAPI.addItem({ productId, quantity });
            const result = res.data;

            if (!result.success)
                return thunkAPI.rejectWithValue(result.message);

            return result.data; // CartItem mới hoặc cart updated
        } catch (err) {
            return thunkAPI.rejectWithValue(
                err.response?.data?.message || err.message
            );
        }
    }
);

// 3️⃣ Xóa item
export const removeFromCart = createAsyncThunk(
    "cart/removeFromCart",
    async (productId, thunkAPI) => {
        try {
            const res = await cartAPI.removeItem(productId);
            const result = res.data;

            if (!result.success)
                return thunkAPI.rejectWithValue(result.message);

            return productId; // trả về id đã xóa
        } catch (err) {
            return thunkAPI.rejectWithValue(
                err.response?.data?.message || err.message
            );
        }
    }
);

// 4️⃣ Xóa toàn bộ cart
export const clearCart = createAsyncThunk(
    "cart/clearCart",
    async (_, thunkAPI) => {
        try {
            const res = await cartAPI.clearCart();
            const result = res.data;

            if (!result.success)
                return thunkAPI.rejectWithValue(result.message);

            return []; // trả về cart trống
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
        items: [],
        status: "idle", // idle | loading | success | error
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            // fetchCart
            .addCase(fetchCart.pending, (state) => {
                state.status = "loading";
                state.error = null;
            })
            .addCase(fetchCart.fulfilled, (state, action) => {
                state.status = "success";
                state.items = action.payload;
            })
            .addCase(fetchCart.rejected, (state, action) => {
                state.status = "error";
                state.error = action.payload;
            })

            // addToCart
            .addCase(addToCart.pending, (state) => {
                state.status = "loading";
                state.error = null;
            })
            .addCase(addToCart.fulfilled, (state, action) => {
                state.status = "success";
                const index = state.items.findIndex(
                    (i) => i.product.id === action.payload.product.id
                );
                if (index >= 0) {
                    state.items[index] = action.payload; // update quantity
                } else {
                    state.items.push(action.payload); // add new
                }
            })
            .addCase(addToCart.rejected, (state, action) => {
                state.status = "error";
                state.error = action.payload;
            })

            // removeFromCart
            .addCase(removeFromCart.pending, (state) => {
                state.status = "loading";
                state.error = null;
            })
            .addCase(removeFromCart.fulfilled, (state, action) => {
                state.status = "success";
                state.items = state.items.filter(
                    (i) => i.product.id !== action.payload
                );
            })
            .addCase(removeFromCart.rejected, (state, action) => {
                state.status = "error";
                state.error = action.payload;
            })

            // clearCart
            .addCase(clearCart.pending, (state) => {
                state.status = "loading";
                state.error = null;
            })
            .addCase(clearCart.fulfilled, (state, action) => {
                state.status = "success";
                state.items = [];
            })
            .addCase(clearCart.rejected, (state, action) => {
                state.status = "error";
                state.error = action.payload;
            });
    },
});

export default cartSlice.reducer;
