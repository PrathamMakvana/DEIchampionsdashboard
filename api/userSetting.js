import {
  setUserSettings,
  setLoading,
} from "@/store/slice/userSettingSlice";

import { fetcher, fetcherUpdate, fetcherDelete } from "@/utils/axios";

/* -----------------------------------------------------
 ✅ Get settings (GET)
----------------------------------------------------- */
export const getMyUserSettings = () => async (dispatch) => {
  try {
    console.log("🟡 getMyUserSettings - START");
    dispatch(setLoading(true));

    const res = await fetcher("/user-setting/get-my");
    console.log("🟢 getMyUserSettings - API Response:", res);
    
    // FIX: fetcher already returns res.data, so we access res.data directly
    const settingsData = res?.data || null;
    console.log("🟢 getMyUserSettings - Settings data to store:", settingsData);
    
    dispatch(setUserSettings(settingsData));
    console.log("🟢 getMyUserSettings - Dispatched to Redux");
    
    dispatch(setLoading(false));
    console.log("🟢 getMyUserSettings - COMPLETE");

    return res;
  } catch (error) {
    console.error("🔴 getMyUserSettings - ERROR:", error);
    console.error("🔴 getMyUserSettings - Error response:", error?.response);
    dispatch(setLoading(false));
    return null;
  }
};


export const getSettingsByUserId = (userId) => async (dispatch) => {
  try {
    console.log("🟡 getSettingsByUserId - START for user:", userId);
    
    const res = await fetcher(`/user-setting/get-by-user/${userId}`);
    console.log("🟢 getSettingsByUserId - API Response:", res);
    
    const settingsData = res?.data || null;
    console.log("🟢 getSettingsByUserId - Settings data:", settingsData);
    
    return settingsData;
  } catch (error) {
    console.error("🔴 getSettingsByUserId - ERROR:", error);
    console.error("🔴 getSettingsByUserId - Error response:", error?.response);
    return null;
  }
};


/* -----------------------------------------------------
 ✅ Create or Update User Settings (PUT)
----------------------------------------------------- */
export const updateUserSettings =
  (payload, { showSuccess, showError } = {}) =>
  async (dispatch) => {
    try {
      dispatch(setLoading(true));

      const res = await fetcherUpdate(["/user-setting/update", payload]);

      // FIX: fetcherUpdate already returns res.data
      const settingsData = res?.data || null;
      
      dispatch(setUserSettings(settingsData));
      dispatch(setLoading(false));

      if (typeof showSuccess === 'function') {
        showSuccess("Settings saved successfully!");
      }
      return res;
    } catch (error) {
      dispatch(setLoading(false));
      if (typeof showError === 'function') {
        showError(error?.response?.data?.message || "Failed to save settings.");
      }
      return null;
    }
  };

/* -----------------------------------------------------
 ✅ Delete User Settings (DELETE)
----------------------------------------------------- */
export const deleteUserSettings =
  ({ showSuccess, showError } = {}) =>
  async (dispatch) => {
    try {
      dispatch(setLoading(true));

      const res = await fetcherDelete(["/user-setting/delete"]);

      dispatch(setUserSettings(null));
      dispatch(setLoading(false));

      if (typeof showSuccess === 'function') {
        showSuccess("Settings deleted.");
      }
      return res;
    } catch (error) {
      dispatch(setLoading(false));
      if (typeof showError === 'function') {
        showError(error?.response?.data?.message || "Failed to delete settings.");
      }
      return null;
    }
  };