import { createSlice } from "@reduxjs/toolkit";

export interface FiltersState {
  print: string[];
  grant: string | undefined;
  timestamp: boolean | undefined;
  tokens: string[];
  discount: boolean | undefined;
  collectors: boolean | undefined;
}

const initialFiltersState: FiltersState = {
  print: [],
  grant: undefined,
  timestamp: undefined,
  tokens: [],
  discount: undefined,
  collectors: undefined,
};

export const filtersSlice = createSlice({
  name: "filters",
  initialState: initialFiltersState,
  reducers: {
    setFilters: (
      state: FiltersState,
      {
        payload: {
          actionPrint,
          actionGrant,
          actionTimestamp,
          actionTokens,
          actionDiscount,
          actionCollectors,
        },
      }
    ) => {
      state.print = actionPrint;
      state.grant = actionGrant;
      state.timestamp = actionTimestamp;
      state.tokens = actionTokens;
      state.discount = actionDiscount;
      state.collectors = actionCollectors;
    },
  },
});
export const { setFilters } = filtersSlice.actions;

export default filtersSlice.reducer;
