import {
  setUserSettings,
  setLoading,
} from "@/store/slice/userSettingsSlice";

import { fetcher, fetcherPost, fetcherUpdate, fetcherDelete } from "@/utils/axios";

/* -----------------------------------------------------
 ✅ Create User Settings (POST)
----------------------------------------------------- */
export const createUserSettings =
  (payload, { showSuccess, showError } = {}) =>
  async (dispatch) => {
    try {
      dispatch(setLoading(true));

      const res = await fetcherPost(["/user-setting/add", payload]);

      dispatch(setUserSettings(res?.data || null));
      dispatch(setLoading(false));

      if (showSuccess) showSuccess("User settings created!");
      return res;
    } catch (error) {
      dispatch(setLoading(false));
      if (showError) showError(error?.response?.data?.message || "Failed to create user settings.");
      return null;
    }
  };

/* -----------------------------------------------------
 ✅ Get settings (GET)
----------------------------------------------------- */
export const getMyUserSettings = () => async (dispatch) => {
  try {
    dispatch(setLoading(true));

    const res = await fetcher("/user-setting/get-my");

    dispatch(setUserSettings(res?.data || null));
    dispatch(setLoading(false));

    return res;
  } catch (error) {
    dispatch(setLoading(false));
    console.error("Error fetching user settings:", error);
    return null;
  }
};

/* -----------------------------------------------------
 ✅ Update User Settings (PUT)
----------------------------------------------------- */
export const updateUserSettings =
  (payload, { showSuccess, showError } = {}) =>
  async (dispatch) => {
    try {
      dispatch(setLoading(true));

      const res = await fetcherUpdate(["/user-setting/update", payload]);

      dispatch(setUserSettings(res?.data || null));
      dispatch(setLoading(false));

      if (showSuccess) showSuccess("Settings updated!");
      return res;
    } catch (error) {
      dispatch(setLoading(false));
      if (showError) showError(error?.response?.data?.message || "Failed to update settings.");
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

      if (showSuccess) showSuccess("Settings deleted.");
      return res;
    } catch (error) {
      dispatch(setLoading(false));
      if (showError) showError(error?.response?.data?.message || "Failed to delete settings.");
      return null;
    }
  };
