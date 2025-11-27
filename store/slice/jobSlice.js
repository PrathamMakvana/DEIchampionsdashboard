import { createSlice } from "@reduxjs/toolkit";

const jobSlice = createSlice({
  name: "job",
  initialState: {
    jobCategories: [],
    jobTypes: [],
    departments: [],
    salaryRanges: [],
    jobs: [],
    currentJob: null,
    myApplications: [],
    mySavedJobs: [],
    recommendedJobs: [],
    educations: [], 
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
    setDepartments: (state, action) => {
      state.departments = action.payload || [];
    },
    setJobs: (state, action) => {
      state.jobs = action.payload || [];
    },
    setCurrentJob: (state, action) => {
      state.currentJob = action.payload || null;
    },
    setMyApplications: (state, action) => {
      state.myApplications = action.payload || [];
    },
    setMySavedJobs: (state, action) => {
      state.mySavedJobs = action.payload || [];
    },
    setSalaryRanges: (state, action) => {
      state.salaryRanges = action.payload || [];
    },
    setRecommendedJobs: (state, action) => {
      state.recommendedJobs = action.payload || [];
    },
    setEducations: (state, action) => {
      state.educations = action.payload || []; 
    },
  },
});

export const {
  setLoading,
  setJobCategories,
  setJobTypes,
  setDepartments,
  setJobs,
  setCurrentJob,
  setMyApplications,
  setMySavedJobs,
  setSalaryRanges,
  setRecommendedJobs,
  setEducations,
} = jobSlice.actions;

export default jobSlice.reducer;
