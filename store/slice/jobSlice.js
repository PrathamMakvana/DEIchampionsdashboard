import { createSlice } from "@reduxjs/toolkit";

const jobSlice = createSlice({
  name: "job",
  initialState: {
    jobCategories: [],
    jobTypes: [],
    jobs: [],
    currentJob: null,
    loading: false,
  },
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setJobCategories: (state, action) => {
      state.jobCategories = action.payload || [];
    },
    setJobTypes: (state, action) => {
      state.jobTypes = action.payload || [];
    },
    setJobs: (state, action) => {
      state.jobs = action.payload || [];
    },
    setCurrentJob: (state, action) => {
      state.currentJob = action.payload || null;
    },
  },
});

export const {
  setLoading,
  setJobCategories,
  setJobTypes,
  setJobs,
  setCurrentJob,
} = jobSlice.actions;
export default jobSlice.reducer;
