import { CollectionGraph } from "@/components/StoreFront/types/storefront.types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface GrantCollectionState {
  value: CollectionGraph[];
}

const initialGrantCollectionState: GrantCollectionState = {
  value: [],
};

export const grantCollectionSlice = createSlice({
  name: "grantCollection",
  initialState: initialGrantCollectionState,
  reducers: {
    setGrantCollection: (
      state: GrantCollectionState,
      action: PayloadAction<CollectionGraph[]>
    ) => {
      state.value = action.payload;
    },
  },
});

export const { setGrantCollection } = grantCollectionSlice.actions;

export default grantCollectionSlice.reducer;
