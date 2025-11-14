// src/redux/slices/authSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  loading: false,
  profileCompletion: {},
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setProfileCompletion: (state, action) => {
      state.profileCompletion = action.payload;
    },
    logout: (state) => {
      state.user = null;
      localStorage.removeItem("jobportaltoken");
    },
  },
});

export const { setUser, setLoading, setProfileCompletion, logout } =
  authSlice.actions;
export default authSlice.reducer;
