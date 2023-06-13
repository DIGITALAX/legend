import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface HomeGrantState {
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
      }
    | undefined;
}

const initialHomeGrantState: HomeGrantState = {
  value: undefined,
};

export const homeGrantSlice = createSlice({
  name: "homeGrant",
  initialState: initialHomeGrantState,
  reducers: {
    setHomeGrant: (
      state: HomeGrantState,
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
          }
        | undefined
      >
    ) => {
      state.value = action.payload;
    },
  },
});

export const { setHomeGrant } = homeGrantSlice.actions;

export default homeGrantSlice.reducer;
