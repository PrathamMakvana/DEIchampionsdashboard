import {
  setLoading,
  setProfileCompletion,
  setUser,
} from "@/store/slice/authSlice";
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

export const loginEmployer =
  (formData, { showSuccess, showError }) =>
  async (dispatch) => {
    try {
      dispatch(setLoading(true));

      const data = await fetcherPost(["/users/employee/login", formData]);
      console.log("🚀 Employer Login API response --->", data);

      // Only set token and user if it's a full login (not OTP verification required)
      if (data?.data?.serviceToken && !data?.data?.requiresOtpVerification) {
        localStorage.setItem("jobportaltoken", data.data.serviceToken);
      }

      if (data?.data?.user && !data?.data?.requiresOtpVerification) {
        dispatch(setUser(data.data.user));
        localStorage.setItem("userRole", data.data.user.roleId);
      }

      dispatch(setLoading(false));

      // Pass appropriate message based on whether OTP is required
      if (data?.data?.requiresOtpVerification) {
        showSuccess(data?.message || "OTP sent for verification!");
      } else {
        showSuccess(data?.message || "Login successful!");
      }

      return data;
    } catch (error) {
      dispatch(setLoading(false));
      showError(error?.response?.data?.message || "Login failed.");
      return null;
    }
  };
export const logoutUser = () => async (dispatch) => {
  localStorage.removeItem("jobportaltoken");
  localStorage.removeItem("userRole");
  const res = await fetcher("/users/auth/logout");

  dispatch(setUser(null));
  dispatch(setLoading(false));

  persistor.purge();
  return res.data;
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

export const getuserbyid = (id) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const res = await fetcher(`/users/get-one/${id}`);
    dispatch(setLoading(false));
    return res;
  } catch (error) {
    console.error("Error fetching job:", error);
    dispatch(setLoading(false));
    return null;
  }
};

export const getAuthUser = () => async (dispatch) => {
  try {
    const res = await fetcher("/users/auth/me");
    console.log("🚀 res.data --->", res.user);
    dispatch(setUser(res?.user || null));
    return res.data;
  } catch (error) {
    console.log("Error fetching auth user:", error);

    const errorData = error.response?.data;

    if (
      errorData?.code === "TOKEN_EXPIRED" ||
      errorData?.code === "INVALID_TOKEN"
    ) {
      console.log("Authentication error, logging out user...");
      await dispatch(logoutUser());
    }

    return null;
  }
};

export const getVerifyEmail = async (token) => {
  try {
    const res = await fetcher(`/users/verify-email/${token}`);
    return res;
  } catch (error) {
    console.error("Error fetching departments:", error);
    return null;
  }
};

export const getuserProfileCompletionData = () => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const res = await fetcher(`/users/profile/percentage`);
    console.log("🚀res --->", res);
    dispatch(setProfileCompletion(res?.data || null));
    dispatch(setLoading(false));
    return res;
  } catch (error) {
    console.error("Error fetching job:", error);
    dispatch(setLoading(false));
    return null;
  }
};

export const getResendVerifyEmail = async () => {
  try {
    const res = await fetcher(`/users/resend-email`);
    return res;
  } catch (error) {
    console.error("Error fetching departments:", error);
    return null;
  }
};

//forgot password

export const forgotPassword = async (formData, { showSuccess, showError }) => {
  try {
    console.log("🚀formData --->", formData);
    const response = await fetcherPost(["/users/forgot-password", formData]);

    if (response && response.success) {
      showSuccess(
        response.message || "Password reset link has been sent to your email"
      );
      return response;
    } else {
      showError(response?.message || "Failed to send reset link");
      return response;
    }
  } catch (error) {
    const errorMessage =
      error?.response?.data?.message ||
      error?.message ||
      "Network error. Please check your connection and try again.";

    showError(errorMessage);
    throw error;
  }
};

export const resetPassword = async (formData, { showSuccess, showError }) => {
  try {
    console.log("🚀formData --->", formData);
    const response = await fetcherPost(["/users/reset-password", formData]);

    if (response && response.success) {
      showSuccess(response.message || "Password has been reset successfully");
      return response;
    } else {
      showError(response?.message || "Failed to reset password");
      return response;
    }
  } catch (error) {
    const errorMessage =
      error?.response?.data?.message ||
      error?.message ||
      "Network error. Please check your connection and try again.";

    showError(errorMessage);
    throw error;
  }
};

// API function for updating password
export const updatePassword = async (formData, { showSuccess, showError }) => {
  try {
    console.log("🚀 formData --->", formData);
    const response = await fetcherPost(["/users/change-password", formData]);

    if (response && response.success) {
      showSuccess(response.message || "Password has been changed successfully");
      return response;
    } else {
      showError(response?.message || "Failed to change password");
      return response;
    }
  } catch (error) {
    const errorMessage =
      error?.response?.data?.message ||
      error?.message ||
      "Network error. Please check your connection and try again.";

    showError(errorMessage);
    throw error;
  }
};
