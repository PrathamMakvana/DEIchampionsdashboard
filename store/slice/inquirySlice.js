import { createSlice } from "@reduxjs/toolkit";

const inquirySlice = createSlice({
  name: "inquiry",
  initialState: {
    inquiries: [],
    estimates: [],
    loading: false,
  },
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setInquiries: (state, action) => {
      state.inquiries = action.payload || [];
    },
    setEstimates: (state, action) => {
      state.estimates = action.payload || [];
    },
  },
});

export const { setLoading, setInquiries, setEstimates } = inquirySlice.actions;
export default inquirySlice.reducer;
