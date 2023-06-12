import { createSlice } from "@reduxjs/toolkit";

export interface FiltersState {
  name: string;
  street: string;
  apt: string;
  state: string;
  code: string;
  country: string;
}

const initialFiltersState: FiltersState = {
  name: "",
  street: "",
  apt: "",
  state: "",
  code: "",
  country: "",
};

export const filtersSlice = createSlice({
  name: "filters",
  initialState: initialFiltersState,
  reducers: {
    setFilters: (
      state: FiltersState,
      {
        payload: {
          actionName,
          actionStreet,
          actionApt,
          actionCode,
          actionCountry,
          actionState,
        },
      }
    ) => {
      state.name = actionName;
      state.street = actionStreet;
      state.apt = actionApt;
      state.code = actionCode;
      state.country = actionCountry;
      state.state = actionState;
    },
  },
});
export const { setFilters } = filtersSlice.actions;

export default filtersSlice.reducer;
