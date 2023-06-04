import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface PostValuesState {
  value: {
    title: string | undefined;
    editionAmount: number;
  };
}

const initialPostValuesState: PostValuesState = {
  value: {
    title: undefined,
    editionAmount: 100,
  },
};

export const postValuesSlice = createSlice({
  name: "postValues",
  initialState: initialPostValuesState,
  reducers: {
    setPostValues: (
      state: PostValuesState,
      action: PayloadAction<{
        title: string | undefined;
        editionAmount: number;
      }>
    ) => {
      state.value = action.payload;
    },
  },
});

export const { setPostValues } = postValuesSlice.actions;

export default postValuesSlice.reducer;
