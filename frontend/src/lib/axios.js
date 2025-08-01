import axios from "axios";

// Determine if we are in development mode
const isDev = import.meta.env.MODE === "development";

// Set base URL depending on environment
const baseURL = isDev
  ? "http://localhost:5001/api" // Backend running locally
  : "/api"; // Production (NGINX will proxy to backend)

export const axiosInstance = axios.create({
  baseURL,
  withCredentials: false, // We're using JWT in Authorization header, not cookies
});

// Automatically add JWT token to every request if present
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token"); // ✅ Get token from localStorage
    if (token) {
      config.headers.Authorization = `Bearer ${token}`; // ✅ Attach token
    }
    return config;
  },
  (error) => Promise.reject(error)
);
