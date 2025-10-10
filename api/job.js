import {
  setJobCategories,
  setJobs,
  setJobTypes,
  setLoading,
  setCurrentJob,
  setMyApplications,
  setDepartments,
  setMySavedJobs,
} from "@/store/slice/jobSlice";
import {
  fetcher,
  fetcherDelete,
  fetcherPost,
  fetcherUpdate,
} from "@/utils/axios";

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
      const data = await fetcherUpdate([`/job/update/${id}`, formData]);
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

export const getMyApplications = () => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const res = await fetcher("job/my-applications");
    dispatch(setMyApplications(res?.data || []));
    dispatch(setLoading(false));
    return res;
  } catch (error) {
    console.error("Error fetching my applications:", error);
    dispatch(setLoading(false));
    return null;
  }
};

export const applyJob =
  (id, { showSuccess, showError }) =>
  async (dispatch) => {
    try {
      dispatch(setLoading(true));
      const res = await fetcherPost(`/job/apply/${id}`);
      dispatch(setLoading(false));

      dispatch(getMyApplications());

      showSuccess("You have successfully applied for this job.");
      return res;
    } catch (error) {
      console.error("Error applying job:", error);
      dispatch(setLoading(false));
      showError(error?.response?.data?.message || "Failed to apply for job.");
      return null;
    }
  };

export const unapplyJob =
  (id, { showSuccess, showError }) =>
  async (dispatch) => {
    try {
      dispatch(setLoading(true));
      const res = await fetcherPost(`/job/unapply/${id}`);
      dispatch(setLoading(false));

      dispatch(getMyApplications());

      showSuccess("You have unapplied from this job.");
      return res;
    } catch (error) {
      console.error("Error unapplying job:", error);
      dispatch(setLoading(false));
      showError(error?.response?.data?.message || "Failed to unapply job.");
      return null;
    }
  };

export const getMySavedJobs = () => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const res = await fetcher("/job/my-saved");
    dispatch(setMySavedJobs(res?.data || []));
    dispatch(setLoading(false));
    return res;
  } catch (error) {
    console.error("Error fetching saved jobs:", error);
    dispatch(setLoading(false));
    return null;
  }
};

export const saveJob =
  (id, { showSuccess, showError }) =>
  async (dispatch) => {
    try {
      dispatch(setLoading(true));
      const res = await fetcherPost(`/job/save/${id}`);
      dispatch(setLoading(false));

      // Refresh saved jobs
      dispatch(getMySavedJobs());

      showSuccess("Job saved successfully.");
      return res;
    } catch (error) {
      console.error("Error saving job:", error);
      dispatch(setLoading(false));
      showError(error?.response?.data?.message || "Failed to save job.");
      return null;
    }
  };

export const unsaveJob =
  (id, { showSuccess, showError }) =>
  async (dispatch) => {
    try {
      dispatch(setLoading(true));
      const res = await fetcherPost(`/job/unsave/${id}`);
      dispatch(setLoading(false));

      // Refresh saved jobs
      dispatch(getMySavedJobs());

      showSuccess("Job unsaved successfully.");
      return res;
    } catch (error) {
      console.error("Error unsaving job:", error);
      dispatch(setLoading(false));
      showError(error?.response?.data?.message || "Failed to unsave job.");
      return null;
    }
  };

export const getDepartments = () => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const res = await fetcher("/department/get-all");
    dispatch(setDepartments(res?.data || []));
    dispatch(setLoading(false));
    return res;
  } catch (error) {
    console.error("Error fetching departments:", error);
    dispatch(setLoading(false));
    return null;
  }
};
export const updateApplicationStatus =
  ({ jobId, applicantId, status }, { showSuccess, showError }) =>
  async (dispatch) => {
    try {
      dispatch(setLoading(true));
      const response = await fetcherUpdate([
        "/job/application/status",
        { jobId, applicantId, status },
      ]);
      dispatch(setLoading(false));
      showSuccess(`Applicant ${status} successfully!`);
      return response;
    } catch (error) {
      console.error("🚀 ~ updateApplicationStatus error:", error);
      dispatch(setLoading(false));
      showError(
        error?.response?.data?.error || "Failed to update application status."
      );
      return null;
    }
  };
