import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import cartAPI from "../../api/cartApi";

export const fetchCart = createAsyncThunk("cart/fetch", async () => {
    const res = await cartAPI.getCart();
    return res;
});

export const addToCart = createAsyncThunk("cart/add", async (item) => {
    const res = await cartAPI.addItem(item);
    return res;
});

export const removeFromCart = createAsyncThunk("cart/remove", async (id) => {
    const res = await cartAPI.removeItem(id);
    return res;
});

export const clearCart = createAsyncThunk("cart/clear", async () => {
    const res = await cartAPI.clearCart();
    return res;
});

const cartSlice = createSlice({
    name: "cart",
    initialState: { items: [], loading: false, error: null },
    extraReducers: (builder) => {
        builder
            .addCase(fetchCart.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchCart.fulfilled, (state, action) => {
                state.items = action.payload.items;
                state.loading = false;
            })
            .addCase(fetchCart.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(addToCart.pending, (state) => {
                state.loading = true;
            })
            .addCase(addToCart.fulfilled, (state, action) => {
                state.items = action.payload.items;
                state.loading = false;
            })
            .addCase(addToCart.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(removeFromCart.pending, (state) => {
                state.loading = true;
            })
            .addCase(removeFromCart.fulfilled, (state, action) => {
                state.items = action.payload.items;
                state.loading = false;
            })
            .addCase(removeFromCart.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(clearCart.pending, (state) => {
                state.loading = true;
            })
            .addCase(clearCart.fulfilled, (state, action) => {
                state.items = [];
                state.loading = false;
            })
            .addCase(clearCart.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });
    },
});

export default cartSlice.reducer;
