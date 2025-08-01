import axios from "axios";

const isDev = import.meta.env.MODE === "development";

const baseURL = isDev
  ? "http://localhost:5001" // local development
  : "/api"; // production (e.g., proxying through NGINX/K8s Ingress)

export const axiosInstance = axios.create({
  baseURL,
  withCredentials: true,
});

// ✅ Add this interceptor to attach token to every request
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
