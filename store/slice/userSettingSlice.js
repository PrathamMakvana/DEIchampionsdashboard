import { createSlice } from "@reduxjs/toolkit";

const userSettingsSlice = createSlice({
  name: "userSettings",
  initialState: {
    data: null,
    loading: false,
  },
  reducers: {
    setUserSettings: (state, action) => {
      console.log("🟣 Redux setUserSettings - payload:", action.payload);
      state.data = action.payload;
    },
    setLoading: (state, action) => {
      console.log("🟣 Redux setLoading - payload:", action.payload);
      state.loading = action.payload;
    },
  },
});

export const { setUserSettings, setLoading } = userSettingsSlice.actions;

export default userSettingsSlice.reducer;