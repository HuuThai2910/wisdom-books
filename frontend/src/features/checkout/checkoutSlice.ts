import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CheckoutState, CheckoutItem } from "../../types";

const initialState: CheckoutState = {
    checkoutItems: JSON.parse(localStorage.getItem("checkoutItems") || "[]"),
};

const checkoutSlice = createSlice({
    name: "checkout",
    initialState,
    reducers: {
        setCheckoutItems: (state, action: PayloadAction<CheckoutItem[]>) => {
            state.checkoutItems = action.payload;

            localStorage.setItem(
                "checkoutItems",
                JSON.stringify(state.checkoutItems)
            );
        },
        clearCheckoutItems: (state) => {
            state.checkoutItems = [];
            localStorage.removeItem("checkoutItems");
        },
    },
});

export const { setCheckoutItems, clearCheckoutItems } = checkoutSlice.actions;
export default checkoutSlice.reducer;
