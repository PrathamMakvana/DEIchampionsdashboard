import {
  setLoading,
  setFcmTokens,
  setUserFcmTokens,
} from "@/store/slice/notificationSlice";
import { fetcher, fetcherPost } from "@/utils/axios";

// ✅ Save or update user FCM token
export const saveFcmToken =
  (payload, { showSuccess, showError } = {}) =>
  async (dispatch) => {
    try {
      dispatch(setLoading(true));
      console.log("🚀 Payload for FCM token:", payload);
      const res = await fetcherPost(["/fcm-token/save", payload]);

      console.log("🚀 FCM token save response:", res);
      dispatch(setLoading(false));

      if (showSuccess) showSuccess("FCM token saved successfully!");
      return res;
    } catch (error) {
      console.error("Error saving FCM token:", error);
      dispatch(setLoading(false));
      if (showError)
        showError(error?.response?.data?.message || "Failed to save FCM token.");
      return null;
    }
  };

// ✅ Fetch all FCM tokens (admin use)
export const getAllFcmTokens = () => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const res = await fetcher("/fcm-token/get-all");
    dispatch(setFcmTokens(res?.data || []));
    dispatch(setLoading(false));
    return res;
  } catch (error) {
    console.error("Error fetching all FCM tokens:", error);
    dispatch(setLoading(false));
    return null;
  }
};

// ✅ Fetch FCM tokens by user
export const getUserFcmTokens = (userId) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const res = await fetcher(`/fcm-token/get-by-user/${userId}`);
    dispatch(setUserFcmTokens(res?.data || []));
    dispatch(setLoading(false));
    return res;
  } catch (error) {
    console.error("Error fetching user FCM tokens:", error);
    dispatch(setLoading(false));
    return null;
  }
};
