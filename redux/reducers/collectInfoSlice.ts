import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface CollectInfoState {
  open: boolean;
  id: string;
  index: number | undefined;
}

const initialCollectInfoState: CollectInfoState = {
  open: false,
  id: "",
  index: undefined,
};

export const collectInfoSlice = createSlice({
  name: "collectInfo",
  initialState: initialCollectInfoState,
  reducers: {
    setCollectInfo: (
      state: CollectInfoState,
      { payload: { actionOpen, actionId, actionIndex } }
    ) => {
      state.open = actionOpen;
      state.id = actionId;
      state.index = actionIndex;
    },
  },
});

export const { setCollectInfo } = collectInfoSlice.actions;

export default collectInfoSlice.reducer;
