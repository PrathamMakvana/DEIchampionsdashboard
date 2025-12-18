import {
  setInquiries,
  setSingleInquiry,
  setInquiryLoading,
  setInquiryError,
  addInquiry,
  setInquirySuccess,
} from "@/store/slice/inquirySlice";

import { fetcher, fetcherPost, fetcherDelete } from "@/utils/axios";

/* -----------------------------------------------------
 ✅ Fetch all inquiries (GET)
----------------------------------------------------- */
export const getAllInquiries = () => async (dispatch) => {
  try {
    console.log("🟡 getAllInquiries - START");
    dispatch(setInquiryLoading(true));
    dispatch(setInquiryError(null));

    const res = await fetcher("/inquiry/get-all");
    console.log("🟢 getAllInquiries - API Response:", res);

    if (res.success) {
      dispatch(setInquiries(res.data || []));
      console.log("🟢 getAllInquiries - Dispatched to Redux");
    } else {
      dispatch(setInquiryError("Failed to fetch inquiries"));
    }

    dispatch(setInquiryLoading(false));
    console.log("🟢 getAllInquiries - COMPLETE");
    return res.data;
  } catch (error) {
    console.error("🔴 getAllInquiries - ERROR:", error);
    dispatch(setInquiryError(error.message || "Something went wrong"));
    dispatch(setInquiryLoading(false));
    return null;
  }
};

/* -----------------------------------------------------
 ✅ Get single inquiry by ID (GET)
----------------------------------------------------- */
export const getInquiryById = (id) => async (dispatch) => {
  try {
    console.log(`🟡 getInquiryById - START for ID: ${id}`);
    dispatch(setInquiryLoading(true));
    dispatch(setInquiryError(null));

    const res = await fetcher(`/inquiry/get-one/${id}`);
    console.log("🟢 getInquiryById - API Response:", res);

    if (res.success) {
      dispatch(setSingleInquiry(res.data));
      console.log("🟢 getInquiryById - Dispatched to Redux");
    } else {
      dispatch(setInquiryError("Failed to fetch inquiry"));
    }

    dispatch(setInquiryLoading(false));
    console.log("🟢 getInquiryById - COMPLETE");
    return res.data;
  } catch (error) {
    console.error("🔴 getInquiryById - ERROR:", error);
    dispatch(setInquiryError(error.message || "Something went wrong"));
    dispatch(setInquiryLoading(false));
    return null;
  }
};

/* -----------------------------------------------------
 ✅ Create new inquiry (POST)
----------------------------------------------------- */
export const createInquiry =
  (payload, { showSuccess, showError } = {}) =>
  async (dispatch) => {
    dispatch(setInquiryLoading(true));
    dispatch(setInquiryError(null));
    dispatch(setInquirySuccess(false));

    try {
      console.log("🟡 createInquiry - START", payload);

      // Call API
      const res = await fetcherPost(["/inquiry/add", payload]);
      console.log("🟢 createInquiry - API Response:", res);

      if (res.success) {
        // Update Redux state
        dispatch(addInquiry(res.data));
        dispatch(setInquirySuccess(true));

        if (typeof showSuccess === "function") {
          showSuccess("Inquiry created successfully!");
        }
      } else {
        dispatch(setInquiryError(res.message || "Failed to create inquiry"));
        if (typeof showError === "function") {
          showError(res.message || "Failed to create inquiry");
        }
      }

      dispatch(setInquiryLoading(false));

      // Always return the API response so the caller can await it
      return res;
    } catch (error) {
      console.error("🔴 createInquiry - ERROR:", error);

      const message = error.response?.data?.message || error.message || "Something went wrong";
      dispatch(setInquiryError(message));
      dispatch(setInquiryLoading(false));

      if (typeof showError === "function") {
        showError(message);
      }

      // Return a standard error object so the caller can handle it
      return { success: false, message };
    }
  };


/* -----------------------------------------------------
 ✅ Update inquiry (POST)
----------------------------------------------------- */
export const updateInquiry = (id, payload, { showSuccess, showError } = {}) => async (dispatch) => {
  try {
    console.log(`🟡 updateInquiry - START for ID: ${id}`, payload);
    dispatch(setInquiryLoading(true));
    dispatch(setInquiryError(null));

    const res = await fetcherPost([`/inquiry/update/${id}`, payload]);
    console.log("🟢 updateInquiry - API Response:", res);

    if (res.success) {
      dispatch(getInquiryById(id));
      if (typeof showSuccess === "function") showSuccess("Inquiry updated successfully!");
    } else {
      dispatch(setInquiryError(res.message || "Failed to update inquiry"));
      if (typeof showError === "function") showError(res.message || "Failed to update inquiry");
    }

    dispatch(setInquiryLoading(false));
    console.log("🟢 updateInquiry - COMPLETE");
    return res;
  } catch (error) {
    console.error("🔴 updateInquiry - ERROR:", error);
    dispatch(setInquiryError(error.message || "Something went wrong"));
    dispatch(setInquiryLoading(false));
    if (typeof showError === "function") showError(error.message || "Something went wrong");
    return null;
  }
};

/* -----------------------------------------------------
 ✅ Delete inquiry (DELETE)
----------------------------------------------------- */
export const deleteInquiry = (id, { showSuccess, showError } = {}) => async (dispatch) => {
  try {
    console.log(`🟡 deleteInquiry - START for ID: ${id}`);
    dispatch(setInquiryLoading(true));
    dispatch(setInquiryError(null));

    const res = await fetcherDelete(`/inquiry/delete/${id}`);
    console.log("🟢 deleteInquiry - API Response:", res);

    if (res.success) {
      dispatch(getAllInquiries());
      if (typeof showSuccess === "function") showSuccess("Inquiry deleted successfully!");
    } else {
      dispatch(setInquiryError(res.message || "Failed to delete inquiry"));
      if (typeof showError === "function") showError(res.message || "Failed to delete inquiry");
    }

    dispatch(setInquiryLoading(false));
    console.log("🟢 deleteInquiry - COMPLETE");
    return res;
  } catch (error) {
    console.error("🔴 deleteInquiry - ERROR:", error);
    dispatch(setInquiryError(error.message || "Something went wrong"));
    dispatch(setInquiryLoading(false));
    if (typeof showError === "function") showError(error.message || "Something went wrong");
    return null;
  }
};



export const getAllServices = async () => {
  try {
    const res = await fetcher("/dei-service/get-all");
    if (res.success) {
      return res.data || [];
    } else {
      console.error("Failed to fetch services");
      return [];
    }
  } catch (error) {
    console.error("Error fetching services:", error);
    return [];
  }
};
