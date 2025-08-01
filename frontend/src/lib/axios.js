import axios from "axios";

const isDev = import.meta.env.MODE === "development";

const baseURL = isDev
  ? "http://localhost:5001/api"
  : "/api";

export const axiosInstance = axios.create({
  baseURL,
  withCredentials: true, // ✅ Enables cookie-based auth
});
