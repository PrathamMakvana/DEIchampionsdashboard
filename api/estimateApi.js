import Swal from "sweetalert2";
import { fetcher, fetcherPost } from "@/utils/axios";
import {
  setLoading,
  setUserEstimates,
  setAllEstimates,
} from "../store/slice/estimateSlice";

export const getUserEstimates = (email) => async (dispatch) => {
  try {
    dispatch(setLoading(true));

    const res = await fetcher(`/estimate/get-by-email/${email}`);
    const userEstimates = res?.data || [];

    dispatch(setUserEstimates(userEstimates));
    dispatch(setLoading(false));
    return userEstimates;
  } catch (err) {
    dispatch(setLoading(false));
    Swal.fire("Error!", "Could not fetch your estimates", "error");
    return [];
  }
};

// ✅ Update status (Accept / Reject)
export const updateEstimateStatus = (id, status, email) => async (dispatch) => {
  try {
    dispatch(setLoading(true));

    await fetcherPost([
      `/estimate/update-status/${id}`,
      { estimateStatus: status },
    ]);

    dispatch(setLoading(false));

    Swal.fire("Updated!", `Estimate marked as ${status}`, "success");

    // Refresh the estimates list
    if (email) {
      dispatch(getUserEstimates(email));
    }
  } catch (err) {
    dispatch(setLoading(false));
    Swal.fire("Error!", "Could not update estimate status", "error");
  }
};

// 📄 Download PDF
export const downloadEstimatePDF = async (pdfUrl, event = null) => {
  if (event) {
    event.preventDefault();
    event.stopPropagation();
  }

  const response = await fetch(pdfUrl);
  const blob = await response.blob();

  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = pdfUrl.split("/").pop();
  link.click();

  URL.revokeObjectURL(link.href);
};
