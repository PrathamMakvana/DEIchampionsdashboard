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
      state.loading = false;
      localStorage.removeItem("jobportaltoken");
    },
  },
  extraReducers: (builder) => {
    builder.addCase("persist/REHYDRATE", (state, action) => {
      if (action.payload && action.payload.auth) {
        state.loading = false;
        if (!action.payload.auth.user) {
          state.profileCompletion = {};
        }
      }
    });
  },
});

export const { setUser, setLoading, setProfileCompletion, logout } =
  authSlice.actions;
export default authSlice.reducer;
