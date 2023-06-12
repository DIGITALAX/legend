import { PurchaseCollection } from "@/components/StoreFront/types/storefront.types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface CartItemsState {
  value: PurchaseCollection[];
}

const initialCartItemsState: CartItemsState = {
  value: [],
};

export const cartItemsSlice = createSlice({
  name: "cartItems",
  initialState: initialCartItemsState,
  reducers: {
    setCartItems: (
      state: CartItemsState,
      action: PayloadAction<PurchaseCollection[]>
    ) => {
      state.value = action.payload;
    },
  },
});

export const { setCartItems } = cartItemsSlice.actions;

export default cartItemsSlice.reducer;
