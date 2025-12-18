import { createSlice } from "@reduxjs/toolkit";

const inquirySlice = createSlice({
  name: "inquiry",
  initialState: {
    data: null,       // stores all inquiries or single inquiry depending on usage
    singleInquiry: null,
    loading: false,
    error: null,
    success: false,   // ADD THIS
  },
  reducers: {
    setInquiries: (state, action) => {
      console.log("🟣 Redux setInquiries - payload:", action.payload);
      state.data = action.payload;
    },
    setSingleInquiry: (state, action) => {
      console.log("🟣 Redux setSingleInquiry - payload:", action.payload);
      state.singleInquiry = action.payload;
    },
    addInquiry: (state, action) => {
      console.log("🟣 Redux addInquiry - payload:", action.payload);
      if (state.data && Array.isArray(state.data)) {
        state.data.unshift(action.payload);
      } else {
        state.data = [action.payload];
      }
    },
    setInquiryLoading: (state, action) => {
      console.log("🟣 Redux setInquiryLoading - payload:", action.payload);
      state.loading = action.payload;
    },
    setInquiryError: (state, action) => {
      console.log("🟣 Redux setInquiryError - payload:", action.payload);
      state.error = action.payload;
    },
    // ADD THIS REDUCER
    setInquirySuccess: (state, action) => {
      console.log("🟣 Redux setInquirySuccess - payload:", action.payload);
      state.success = action.payload;
    },
    resetInquiryState: (state) => {
      console.log("🟣 Redux resetInquiryState - reset");
      state.data = null;
      state.singleInquiry = null;
      state.loading = false;
      state.error = null;
      state.success = false;  // ADD THIS
    },
  },
});

export const {
  setInquiries,
  setSingleInquiry,
  addInquiry,
  setInquiryLoading,
  setInquiryError,
  setInquirySuccess,  // ADD THIS TO EXPORTS
  resetInquiryState,
} = inquirySlice.actions;

export default inquirySlice.reducer;