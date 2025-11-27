import { createSlice } from "@reduxjs/toolkit";

const termsSlice = createSlice({
  name: "terms",
  initialState: {
    termsData: null,
    loading: false,
    accepted: false,
  },
  reducers: {
    setTermsLoading: (state, action) => {
      state.loading = action.payload;
    },
    setTermsData: (state, action) => {
      state.termsData = action.payload;
    },
    setAccepted: (state, action) => {
      state.accepted = action.payload;
    },
  },
});

export const { setTermsLoading, setTermsData, setAccepted } =
  termsSlice.actions;

export default termsSlice.reducer;
