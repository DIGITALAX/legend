import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface UpkeepIDState {
  upkeepID: string | undefined;
}

const initialUpkeepIDState: UpkeepIDState = {
  upkeepID: undefined,
};

export const upkeepIDSlice = createSlice({
  name: "upkeepID",
  initialState: initialUpkeepIDState,
  reducers: {
    setUpkeepID: (
      state: UpkeepIDState,
      action: PayloadAction<string | undefined>
    ) => {
      state.upkeepID = action.payload;
    },
  },
});

export const { setUpkeepID } = upkeepIDSlice.actions;

export default upkeepIDSlice.reducer;
