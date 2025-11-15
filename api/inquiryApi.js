import Swal from "sweetalert2";
import {
  fetcher,
  fetcherPost,
  fetcherUpdate,
} from "@/utils/axios";
import {
  setLoading,
  setInquiries,
  setEstimates,
} from "../store/slice/inquirySlice";



// ✅ Get all inquiries for user (filtered by email)
export const getUserInquiries = (email) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const res = await fetcher("/inquiry/get-all");
    const userInquiries = res?.data?.filter((inq) => inq.email === email) || [];
    dispatch(setInquiries(userInquiries));
    dispatch(setLoading(false));
    return userInquiries;
  } catch (error) {
    console.error("Error fetching inquiries:", error);
    dispatch(setLoading(false));
    return [];
  }
};

// ✅ Get all estimates (for linking inquiries → estimate)
export const getAllEstimates = () => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const res = await fetcher("/estimate/get-all");
    dispatch(setEstimates(res?.data || []));
    dispatch(setLoading(false));
    return res?.data;
  } catch (error) {
    console.error("Error fetching estimates:", error);
    dispatch(setLoading(false));
    return [];
  }
};

// ✅ Update inquiry status (accept / reject)
export const updateInquiryStatus = (id, status, email) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    await fetcherPost([`/inquiry/update-status/${id}`, { status }]);
    dispatch(setLoading(false));

    Swal.fire("Success!", `Inquiry has been ${status.toLowerCase()} successfully.`, "success");

    // 🔥 Correct refresh
    dispatch(getAllEstimates());
    dispatch(getUserInquiries(email));

  } catch (error) {
    console.error("Error updating inquiry status:", error);
    dispatch(setLoading(false));
    Swal.fire("Error!", "Failed to update inquiry status.", "error");
  }
};


// ✅ Download estimate PDF
export const downloadEstimatePDF = (pdfUrl) => {
  const link = document.createElement("a");
  link.href = pdfUrl;
  link.download = pdfUrl.split("/").pop();
  link.click();
};
