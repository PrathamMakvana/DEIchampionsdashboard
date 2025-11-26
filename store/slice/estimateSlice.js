import { createSlice } from "@reduxjs/toolkit";

const estimateSlice = createSlice({
  name: "estimate",
  initialState: {
    userEstimates: [],
    allEstimates: [],
    loading: false,
  },
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setUserEstimates: (state, action) => {
      state.userEstimates = action.payload || [];
    },
    setAllEstimates: (state, action) => {
      state.allEstimates = action.payload || [];
    },
  },
});

export const { setLoading, setUserEstimates, setAllEstimates } =
  estimateSlice.actions;

export default estimateSlice.reducer;