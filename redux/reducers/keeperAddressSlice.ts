import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface KeeperAddressState {
  value: string;
}

const initialKeeperAddressState: KeeperAddressState = {
  value: "",
};

export const keeperAddressSlice = createSlice({
  name: "keeperAddress",
  initialState: initialKeeperAddressState,
  reducers: {
    setKeeperAddress: (
      state: KeeperAddressState,
      action: PayloadAction<string>
    ) => {
      state.value = action.payload;
    },
  },
});

export const { setKeeperAddress } = keeperAddressSlice.actions;

export default keeperAddressSlice.reducer;
