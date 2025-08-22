import axios from "axios";
// import { API_BASE_URL } from "config";

const axiosServices = axios.create({
  // baseURL: API_BASE_URL,
  // baseURL: "https://dei-backend.onrender.com/api",
  baseURL: "https://test-deibackend-1.onrender.com/api",
  // baseURL: "http://localhost:5000/api",
});

axiosServices.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("jobportaltoken");
    accessToken
      ? (config.headers["Authorization"] = `Bearer ${accessToken}`)
      : (config.headers["Authorization"] = "");
    return config;
  },
  (error) => Promise.reject(error)
);

// Handling response errors such as unauthorized (401)
axiosServices.interceptors.response.use(
  (response) => response,
  (error) => {
    // console.error('Error response:', error.response);
    if (
      error.response?.status === 401 &&
      !window.location.href.includes("/login")
    ) {
      window.location.pathname = "/maintenance/500";
    } else if (error.response?.status === 500) {
      console.error("Internal Server Error:", error);
    }
    return Promise.reject(error);
  }
);

export default axiosServices;

export const fetcher = async (args) => {
  const [url, config] = Array.isArray(args) ? args : [args];
  const res = await axiosServices.get(url, { ...config });
  return res.data;
};

export const fetcherPost = async (args) => {
  const [url, config] = Array.isArray(args) ? args : [args];
  const res = await axiosServices.post(url, { ...config });
  return res.data;
};

export const fetcherUpdate = async (args) => {
  const [url, data, config] = Array.isArray(args) ? args : [args];
  const res = await axiosServices.put(url, data, { ...config });
  return res.data;
};

export const fetcherDelete = async (args) => {
  const [url, config] = Array.isArray(args) ? args : [args];
  const res = await axiosServices.delete(url, { ...config });
  return res.data;
};

// DELETE
// const updatedUser = await fetcherUpdate(['/users/123', { name: 'Bob' }]);
// const deleted = await fetcherDelete('/users/123');
