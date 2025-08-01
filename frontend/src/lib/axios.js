import axios from "axios";

// Detect if running in development or production
const isDev = import.meta.env.MODE === "development";

// Set baseURL accordingly
const baseURL = isDev
  ? "http://localhost:5001/api" // Backend runs on port 5001 in dev
  : "/api"; // In production, proxied via NGINX or Ingress

// Create axios instance
export const axiosInstance = axios.create({
  baseURL,
  withCredentials: false, // ✅ no need if using Authorization header
});

// Interceptor: Automatically attach token to each request
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);
