import {
  setJobCategories,
  setJobs,
  setJobTypes,
  setLoading,
  setCurrentJob,
} from "@/store/slice/jobSlice";
import { fetcher, fetcherDelete, fetcherPost } from "@/utils/axios";

export const getJobCategories = () => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const data = await fetcher("/job-categories/get-all");
    dispatch(setJobCategories(data));
    dispatch(setLoading(false));
    return data;
  } catch (error) {
    console.error("Error fetching job categories:", error);
    dispatch(setLoading(false));
    return null;
  }
};

export const getJobTypes = () => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const res = await fetcher("/jobType/get-all");
    dispatch(setJobTypes(res?.data || []));
    dispatch(setLoading(false));
    return res;
  } catch (error) {
    console.error("Error fetching job types:", error);
    dispatch(setLoading(false));
    return null;
  }
};

export const createJobs =
  (formData, { showSuccess, showError }) =>
  async (dispatch) => {
    try {
      dispatch(setLoading(true));
      const data = await fetcherPost(["/job", formData]);
      dispatch(setLoading(false));
      showSuccess("Job created successfully!");
      return data;
    } catch (error) {
      console.log("🚀error --->", error);
      dispatch(setLoading(false));
      showError(error?.response?.data?.message || "Failed to create job.");
      return null;
    }
  };

export const getJobs = () => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const res = await fetcher("/job/get-all");
    dispatch(setJobs(res?.data || []));
    dispatch(setLoading(false));
    return res;
  } catch (error) {
    console.error("Error fetching jobs:", error);
    dispatch(setLoading(false));
    return null;
  }
};

export const getJob = (id) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const res = await fetcher(`/job/get-one/${id}`);
    dispatch(setCurrentJob(res?.data || null));
    dispatch(setLoading(false));
    return res;
  } catch (error) {
    console.error("Error fetching job:", error);
    dispatch(setLoading(false));
    return null;
  }
};

export const updateJob =
  (id, formData, { showSuccess, showError }) =>
  async (dispatch) => {
    try {
      dispatch(setLoading(true));
      const data = await fetcherPost([`/job/update/${id}`, formData]);
      dispatch(setLoading(false));
      showSuccess("Job updated successfully!");
      return data;
    } catch (error) {
      console.log("🚀error --->", error);
      dispatch(setLoading(false));
      showError(error?.response?.data?.message || "Failed to update job.");
      return null;
    }
  };

export const deleteJob =
  (id, { showSuccess, showError }) =>
  async (dispatch) => {
    try {
      dispatch(setLoading(true));
      const data = await fetcherDelete([`/job/delete/${id}`]);
      dispatch(setLoading(false));
      showSuccess("Job deleted successfully!");
      // Refresh jobs list after deletion
      dispatch(getJobs());
      return data;
    } catch (error) {
      console.log("🚀error --->", error);
      dispatch(setLoading(false));
      showError(error?.response?.data?.message || "Failed to delete job.");
      return null;
    }
  };
