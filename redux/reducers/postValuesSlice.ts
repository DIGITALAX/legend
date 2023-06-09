import { PostValues } from "@/components/Launch/types/launch.types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface PostValuesState {
  value: PostValues;
}

const initialPostValuesState: PostValuesState = {
  value: {
    title: undefined,
    editionAmount: 100,
    description: undefined,
    sustained: undefined,
    involved: undefined,
    price: 1,
    referralFee: 0,
    currency: "",
    recipients: [
      {
        recipient: "",
        split: 0,
      },
      {
        recipient: "",
        split: 0,
      },
      {
        recipient: "",
        split: 0,
      },
    ],
    filledInAmount: 0,
  },
};

export const postValuesSlice = createSlice({
  name: "postValues",
  initialState: initialPostValuesState,
  reducers: {
    setPostValues: (
      state: PostValuesState,
      action: PayloadAction<PostValues>
    ) => {
      state.value = action.payload;
    },
  },
});

export const { setPostValues } = postValuesSlice.actions;

export default postValuesSlice.reducer;
