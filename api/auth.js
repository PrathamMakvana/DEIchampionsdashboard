import { setLoading, setUser } from "@/store/slice/authSlice";
import { persistor } from "@/store/store";
import { fetcher, fetcherPost } from "@/utils/axios";

export const registerUser =
  (formData, { showSuccess, showError }) =>
  async (dispatch) => {
    try {
      dispatch(setLoading(true));
      const data = await fetcherPost(["/users/employee/register", formData]);
      if (data?.user) {
        dispatch(setUser(data.user));
      }
      dispatch(setLoading(false));
      showSuccess("Registration successful!");
      return data;
    } catch (error) {
      dispatch(setLoading(false));
      showError(error?.response?.data?.message || "Registration failed.");
      return null;
    }
  };

export const loginUser =
  (formData, { showSuccess, showError }) =>
  async (dispatch) => {
    try {
      dispatch(setLoading(true));

      const data = await fetcherPost(["/users/employee/login", formData]);

      if (data?.serviceToken) {
        localStorage.setItem("jobportaltoken", data.serviceToken);
      }

      if (data?.user) {
        dispatch(setUser(data.user));
        localStorage.setItem("userRole", data.user.roleId);
      }

      dispatch(setLoading(false));
      showSuccess();
      return data;
    } catch (error) {
      dispatch(setLoading(false));
      showError(error?.response?.data?.message || "Login failed.");
      return null;
    }
  };
export const logoutUser = () => (dispatch) => {
  localStorage.removeItem("jobportaltoken");
  localStorage.removeItem("userRole");

  dispatch(setUser(null));
  dispatch(setLoading(false));

  persistor.purge();
};

export const verifyOtpUser =
  (formData, { showSuccess, showError }) =>
  async (dispatch) => {
    try {
      dispatch(setLoading(true));

      const data = await fetcherPost(["/users/employee/verify-otp", formData]);
      console.log("🚀 verifyOtpUser response --->", data);

      if (data?.data?.serviceToken) {
        localStorage.setItem("jobportaltoken", data.data.serviceToken);
      }

      if (data?.data?.user) {
        dispatch(setUser(data.data.user));
        localStorage.setItem("userRole", data.data.user.roleId);
      }

      dispatch(setLoading(false));
      showSuccess(data?.message || "Verification successful!");
      return data;
    } catch (error) {
      dispatch(setLoading(false));
      showError(error?.response?.data?.message || "OTP verification failed.");
      return null;
    }
  };

export const registerJobPoster =
  (formData, { showSuccess, showError }) =>
  async (dispatch) => {
    try {
      dispatch(setLoading(true));
      const data = await fetcherPost([
        "/users/employer/register",
        { ...formData, roleId: 2 },
      ]);
      dispatch(setLoading(false));
      showSuccess("Employer registered successfully!");
      return data;
    } catch (error) {
      dispatch(setLoading(false));
      showError(error?.response?.data?.message || "Registration failed.");
      return null;
    }
  };

export const getuser = () => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const res = await fetcher(`/users/get-one-user`);
    console.log("🚀res --->", res);
    dispatch(setUser(res || null));
    dispatch(setLoading(false));
    return res;
  } catch (error) {
    console.error("Error fetching job:", error);
    dispatch(setLoading(false));
    return null;
  }
};

export const updateEmployersProfile =
  (formData, { showSuccess, showError }) =>
  async (dispatch) => {
    try {
      console.log("🚀formData --->", formData);
      dispatch(setLoading(true));
      const data = await fetcherPost([
        `/users/employers-update-profile`,
        formData,
      ]);
      dispatch(setLoading(false));
      if (data?.data) {
        dispatch(setUser(data.data));
      }
      dispatch(getuser());
      showSuccess("Profile updated successfully!");
      return data;
    } catch (error) {
      dispatch(setLoading(false));
      showError(error?.response?.data?.message || "Failed to update Profile.");
      return null;
    }
  };

export const updateUserProfileWithResume =
  (formData, { showSuccess, showError }) =>
  async (dispatch) => {
    try {
      dispatch(setLoading(true));
      const data = await fetcherPost([
        "/users/update-profile-with-resume",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      ]);

      if (data?.data) {
        dispatch(setUser(data.data));
      }
      dispatch(getuser());
      dispatch(setLoading(false));
      showSuccess("Profile updated successfully!");
      return data;
    } catch (error) {
      dispatch(setLoading(false));
      showError(error?.response?.data?.message || "Failed to update profile.");
      return null;
    }
  };
