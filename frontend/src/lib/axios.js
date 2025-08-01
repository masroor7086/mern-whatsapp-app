import axios from "axios";

const isDev = import.meta.env.MODE === "development";

const baseURL = isDev
  ? "http://localhost:5001/api" // Dev URL
  : "/api"; // Prod: handled by NGINX reverse proxy

export const axiosInstance = axios.create({
  baseURL,
  withCredentials: false, // Don't send cookies
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token"); // Get token from localStorage
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);
