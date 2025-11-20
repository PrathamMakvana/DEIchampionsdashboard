import { createSlice } from "@reduxjs/toolkit";

const userSettingsSlice = createSlice({
  name: "userSettings",
  initialState: {
    data: null,
    loading: false,
  },
  reducers: {
    setUserSettings: (state, action) => {
      state.data = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
  },
});

export const { setUserSettings, setLoading } = userSettingsSlice.actions;

export default userSettingsSlice.reducer;
