import { Collection } from "@/components/Launch/types/launch.types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface ProductInformationState {
  value: Collection[];
}

const initialProductInformationState: ProductInformationState = {
  value: [
    {
      acceptedTokens: [],
      basePrices: [],
      grantOnly: false,
      discount: 0,
      printType: "apparel",
      uri: {
        description: "",
        external_url: "",
        image: "",
        name: "",
        type: "",
      },
      amount: 10,
    },
    {
      acceptedTokens: [],
      basePrices: [],
      grantOnly: false,
      discount: 0,
      printType: "apparel",
      uri: {
        description: "",
        external_url: "",
        image: "",
        name: "",
        type: "",
      },
      amount: 10,
    },
    {
      acceptedTokens: [],
      basePrices: [],
      grantOnly: false,
      discount: 0,
      printType: "apparel",
      uri: {
        description: "",
        external_url: "",
        image: "",
        name: "",
        type: "",
      },
      amount: 10,
    },
  ],
};

export const productInformationSlice = createSlice({
  name: "productInformation",
  initialState: initialProductInformationState,
  reducers: {
    setProductInformation: (
      state: ProductInformationState,
      action: PayloadAction<Collection[]>
    ) => {
      state.value = action.payload;
    },
  },
});

export const { setProductInformation } = productInformationSlice.actions;

export default productInformationSlice.reducer;
