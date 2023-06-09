import { createSlice } from "@reduxjs/toolkit";

export interface DropModalState {
  value: boolean;
  message?: string;
}

const initialDropModalState: DropModalState = {
  value: false,
  message: undefined,
};

export const dropModalSlice = createSlice({
  name: "dropModal",
  initialState: initialDropModalState,
  reducers: {
    setDropModal: (
      state: DropModalState,
      { payload: { actionValue, actionMessage } }
    ) => {
      state.value = actionValue;
      state.message = actionMessage;
    },
  },
});
export const { setDropModal } = dropModalSlice.actions;

export default dropModalSlice.reducer;
