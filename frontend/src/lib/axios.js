import axios from "axios";

const isDev = import.meta.env.MODE === "development";

const baseURL = isDev
  ? "http://localhost:5001/api" // ✅ Dev environment base URL
  : "/api";                     // ✅ Prod (NGINX reverse proxy will route it)

export const axiosInstance = axios.create({
  baseURL,
  withCredentials: false, // ✅ Correct: Bearer token does NOT require cookies
});

// ✅ Attach Bearer token to each request
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token"); // ✅ Looks in localStorage for token
    if (token) {
      config.headers.Authorization = `Bearer ${token}`; // ✅ Sets Authorization header
    }
    return config;
  },
  (error) => Promise.reject(error)
);
