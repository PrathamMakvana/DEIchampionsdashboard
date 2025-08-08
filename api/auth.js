import { setLoading, setUser } from "@/store/slice/authSlice";
import { persistor } from "@/store/store";
import { fetcherPost } from "@/utils/axios";

export const registerUser =
  (formData, { showSuccess, showError }) =>
  async (dispatch) => {
    // try {
    //   dispatch(setLoading(true));
    //   const data = await fetcherPost(["/users/register", formData]);
    console.log("🚀formData --->", formData);
    //   if (data?.user) {
    //     dispatch(setUser(data.user));
    //   }
    //   dispatch(setLoading(false));
    //   showSuccess("Registration successful!");
    //   return data;
    // } catch (error) {
    //   dispatch(setLoading(false));
    //   showError(error?.response?.data?.message || "Registration failed.");
    //   return null;
    // }
  };

export const loginUser =
  (formData, { showSuccess, showError }) =>
  async (dispatch) => {
    try {
      dispatch(setLoading(true));

      const data = await fetcherPost(["/users/login", formData]);

      if (data?.token) {
        localStorage.setItem("jobportaltoken", data.token);
      }

      if (data?.user) {
        dispatch(setUser(data.user));
      }

      dispatch(setLoading(false));
      showSuccess("Login successful!");
      return data;
    } catch (error) {
      dispatch(setLoading(false));
      showError(error?.response?.data?.message || "Login failed.");
      return null;
    }
  };
export const logoutUser = () => (dispatch) => {
  localStorage.removeItem("jobportaltoken");

  dispatch(setUser(null));
  dispatch(setLoading(false));

  persistor.purge();
};
