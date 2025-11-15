// src/features/cart/cartSlice.ts
import {
    createSlice,
    createAsyncThunk,
    createSelector,
    PayloadAction,
} from "@reduxjs/toolkit";
import cartAPI from "../../api/cartApi";
import { CartItem } from "../../types";

// Lấy cart
export const fetchCart = createAsyncThunk<
    CartItem[],
    void,
    { rejectValue: string }
>("cart/fetchCart", async (_, thunkAPI) => {
    try {
        const res = await cartAPI.fetchCart();
        const result = res.data;
        return result?.data?.cartItems || [];
    } catch (err: any) {
        return thunkAPI.rejectWithValue(
            err.response?.data?.message || err.message
        );
    }
});

// Thêm item
export const addItem = createAsyncThunk<
    CartItem,
    { bookId: number; quantity: number },
    { rejectValue: string }
>("cart/addItem", async ({ bookId, quantity }, thunkAPI) => {
    try {
        const res = await cartAPI.addItem({ bookId, quantity });
        const result = res.data;
        return result.data;
    } catch (err: any) {
        return thunkAPI.rejectWithValue(
            err.response?.data?.message || err.message
        );
    }
});

// Cập nhật item
export const updateItem = createAsyncThunk<
    CartItem,
    { id: number; quantity: number },
    { rejectValue: string }
>("cart/updateItem", async ({ id, quantity }, thunkAPI) => {
    try {
        const res = await cartAPI.updateItem({ id, quantity });
        return res.data?.data || res.data;
    } catch (err: any) {
        return thunkAPI.rejectWithValue(
            err.response?.data?.message || err.message
        );
    }
});

// Xóa item
export const removeItem = createAsyncThunk<
    number,
    number,
    { rejectValue: string }
>("cart/removeFromCart", async (itemId, thunkAPI) => {
    try {
        console.log("test");
        await cartAPI.removeItem(itemId);
        return itemId;
    } catch (err: any) {
        return thunkAPI.rejectWithValue(
            err.response?.data?.message || err.message
        );
    }
});

// Xóa toàn bộ cart
export const clearCart = createAsyncThunk<
    CartItem[],
    void,
    { rejectValue: string }
>("cart/clearCart", async (_, thunkAPI) => {
    try {
        await cartAPI.clearCart();
        return [];
    } catch (err: any) {
        return thunkAPI.rejectWithValue(
            err.response?.data?.message || err.message
        );
    }
});

// Cập nhật select cho item
export const updateSelections = createAsyncThunk<
    any,
    { [key: number]: boolean },
    { rejectValue: string }
>("cart/updateSelect", async (selections, thunkAPI) => {
    try {
        const res = await cartAPI.updateSelections(selections);
        return (res.data as any)?.data || res.data;
    } catch (err: any) {
        return thunkAPI.rejectWithValue(
            err.response?.data?.message || err.message
        );
    }
});

// Cập nhật select all
export const updateSelectAll = createAsyncThunk<
    boolean,
    boolean,
    { rejectValue: string }
>("cart/updateSelectAll", async (selected, thunkAPI) => {
    try {
        await cartAPI.updateSelectAll(selected);
        return selected;
    } catch (err: any) {
        return thunkAPI.rejectWithValue(
            err.response?.data?.message || err.message
        );
    }
});

interface CartSliceState {
    cartItems: CartItem[];
    status: "idle" | "loading" | "succeeded" | "failed";
    error: string | null;
}

const initialState: CartSliceState = {
    cartItems: [],
    status: "idle",
    error: null,
};

const cartSlice = createSlice({
    name: "cart",
    initialState,
    reducers: {
        // Hàm để cập nhật các select item và hiển thị ngay lập tức cho UI
        optimisticUpdateSelection: (
            state,
            action: PayloadAction<{ id: number; selected: boolean }>
        ) => {
            const { id, selected } = action.payload;
            const item = state.cartItems.find((i) => i.id === id);
            if (item) {
                item.selected = selected;
            }
        },
        // Hàm để cập nhật tất cả select item và hiển thị ngay lập tức cho UI
        optimisticUpdateSelectAll: (state, action: PayloadAction<boolean>) => {
            const selected = action.payload;
            state.cartItems.forEach((i) => (i.selected = selected));
        },
        // Hàm để cập nhật số lượng item và hiển thị ngay lập tức cho UI
        optimisticUpdateQuantity: (
            state,
            action: PayloadAction<{ id: number; quantity: number }>
        ) => {
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
                state.error = action.payload || null;
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
                (action): action is PayloadAction<string> =>
                    action.type.endsWith("rejected"),
                (state, action) => {
                    state.status = "failed";
                    state.error = action.payload || null;
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
    (state: { cart: CartSliceState }) => state.cart.cartItems,
    (cartItems) => cartItems.filter((i: CartItem) => i.selected)
);

export const selectTotals = createSelector(
    selectSelectedItems,
    (selectedItems) => {
        const totalQuantity = selectedItems.reduce(
            (sum: number, i: CartItem) => sum + i.quantity,
            0
        );
        const totalPrice = selectedItems.reduce(
            (sum: number, i: CartItem) => sum + i.quantity * i.book.price,
            0
        );
        return { totalQuantity, totalPrice };
    }
);
