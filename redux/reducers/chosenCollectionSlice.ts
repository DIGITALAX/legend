import { CollectionGraph } from "@/components/StoreFront/types/storefront.types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface ChosenCollectionState {
  value: CollectionGraph | undefined;
}

const initialChosenCollectionState: ChosenCollectionState = {
  value: undefined,
};

export const chosenCollectionSlice = createSlice({
  name: "chosenCollection",
  initialState: initialChosenCollectionState,
  reducers: {
    setChosenCollection: (
      state: ChosenCollectionState,
      action: PayloadAction<CollectionGraph | undefined>
    ) => {
      state.value = action.payload;
    },
  },
});

export const { setChosenCollection } = chosenCollectionSlice.actions;

export default chosenCollectionSlice.reducer;
