import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface GrantsState {
  value:
    | {
        keeperAddress: string;
        accessControlAddress: string;
        dynamicNFTAddress: string;
        name: string;
        profileId: number;
        pubId: number;
        timestamp: string;
        deployer: string;
      }[];
}

const initialGrantsState: GrantsState = {
  value: [],
};

export const grantsSlice = createSlice({
  name: "grants",
  initialState: initialGrantsState,
  reducers: {
    setGrants: (
      state: GrantsState,
      action: PayloadAction<
        | {
            keeperAddress: string;
            accessControlAddress: string;
            dynamicNFTAddress: string;
            name: string;
            profileId: number;
            pubId: number;
            timestamp: string;
            deployer: string;
          }[]
      >
    ) => {
      state.value = action.payload;
    },
  },
});

export const { setGrants } = grantsSlice.actions;

export default grantsSlice.reducer;
