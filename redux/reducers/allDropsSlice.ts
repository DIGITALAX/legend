import { CollectionGraph } from "@/components/StoreFront/types/storefront.types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface AllDropsState {
  value: CollectionGraph[];
}

const initialAllDropsState: AllDropsState = {
  value: [],
};

export const allDropsSlice = createSlice({
  name: "allDrops",
  initialState: initialAllDropsState,
  reducers: {
    setAllDrops: (
      state: AllDropsState,
      action: PayloadAction<CollectionGraph[]>
    ) => {
      state.value = action.payload;
    },
  },
});

export const { setAllDrops } = allDropsSlice.actions;

export default allDropsSlice.reducer;
