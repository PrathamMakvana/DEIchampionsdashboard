import Swal from "sweetalert2";
import { fetcher, fetcherPost } from "@/utils/axios";
import {
  setTermsLoading,
  setTermsData,
  setAccepted,
} from "../store/slice/termsSlice";

// 📌 Fetch Terms & Conditions content
export const getTermsAndConditions = () => async (dispatch) => {
  try {
    dispatch(setTermsLoading(true));

    const encoded = encodeURIComponent("Terms & Conditions");
    const res = await fetcher(`/footer-page/get-by-name/${encoded}`);

    dispatch(setTermsData(res?.data || null));
    
    // ❌ REMOVE THIS - Footer page doesn't have user acceptance info
    // const isAccepted = res?.data?.isAccepted || false;
    // dispatch(setAccepted(isAccepted));

    dispatch(setTermsLoading(false));
    return res?.data;
  } catch (err) {
    dispatch(setTermsLoading(false));
    Swal.fire("Error!", "Unable to fetch Terms & Conditions", "error");
    return null;
  }
};



export const getUserTermsAcceptance = (userId) => async (dispatch) => {
  try {
    dispatch(setTermsLoading(true));

    const res = await fetcher(`/terms-acceptance/get-by-user/${userId}`);

    const isAccepted = res?.data?.isAccepted || false;
    dispatch(setAccepted(isAccepted));

    dispatch(setTermsLoading(false));
    return res?.data;
  } catch (err) {
    dispatch(setTermsLoading(false));
    // If record doesn't exist, user hasn't accepted
    dispatch(setAccepted(false));
    return null;
  }
};


// 📌 Accept Terms & Conditions (Correct API)
export const acceptTerms = (userId, version = 1) => async (dispatch) => {
  try {
    dispatch(setTermsLoading(true));

    await fetcherPost([
      `/terms-acceptance/accept`,
      { userId, version }
    ]);

    dispatch(setAccepted(true));
    dispatch(setTermsLoading(false));

    Swal.fire("Accepted!", "You have accepted the Terms & Conditions.", "success");
  } catch (err) {
    dispatch(setTermsLoading(false));
    Swal.fire("Error!", "Failed to accept Terms & Conditions", "error");
  }
};
