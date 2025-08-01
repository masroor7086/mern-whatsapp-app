// src/lib/axios.js
import axios from "axios";

const isDev = import.meta.env.MODE === "development";

const baseURL = isDev
  ? "http://localhost:5001/api" // Dev
  : "/api";                     // Prod (handled by NGINX or Ingress)

export const axiosInstance = axios.create({
  baseURL,
  withCredentials: false, // ❌ Not needed for Bearer tokens
});

// ✅ Automatically attach token to each request
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`; // ✅ Attach here
    }
    return config;
  },
  (error) => Promise.reject(error)
);
