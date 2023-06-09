import { CollectionGraph } from "@/components/StoreFront/types/storefront.types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface AllCollectionsState {
  value: CollectionGraph[];
}

const initialAllCollectionsState: AllCollectionsState = {
  value: [],
};

export const allCollectionsSlice = createSlice({
  name: "allCollections",
  initialState: initialAllCollectionsState,
  reducers: {
    setAllCollections: (
      state: AllCollectionsState,
      action: PayloadAction<CollectionGraph[]>
    ) => {
      state.value = action.payload;
    },
  },
});

export const { setAllCollections } = allCollectionsSlice.actions;

export default allCollectionsSlice.reducer;
