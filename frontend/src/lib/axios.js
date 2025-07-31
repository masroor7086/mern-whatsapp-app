import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: "/api", // ✅ Let nginx proxy /api → backend
  withCredentials: true,
});
