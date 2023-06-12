import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface ErrorState {
  value: boolean;
  message: string | undefined;
}

const initialErrorState: ErrorState = {
  value: false,
  message: undefined,
};

export const errorSlice = createSlice({
  name: "error",
  initialState: initialErrorState,
  reducers: {
    setError: (
      state: ErrorState,
      { payload: { actionValue, actionMessage } }
    ) => {
      state.value = actionValue;
      state.message = actionMessage;
    },
  },
});

export const { setError } = errorSlice.actions;

export default errorSlice.reducer;
