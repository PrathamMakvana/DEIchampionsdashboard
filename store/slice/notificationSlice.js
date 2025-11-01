import { createSlice } from "@reduxjs/toolkit";

const notificationSlice = createSlice({
  name: "notification",
  initialState: {
    fcmTokens: [],     
    userFcmTokens: [],  
    loading: false,
  },
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setFcmTokens: (state, action) => {
      state.fcmTokens = action.payload || [];
    },
    setUserFcmTokens: (state, action) => {
      state.userFcmTokens = action.payload || [];
    },
  },
});

export const { setLoading, setFcmTokens, setUserFcmTokens } =
  notificationSlice.actions;

export default notificationSlice.reducer;
