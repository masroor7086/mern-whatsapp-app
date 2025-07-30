import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: import.meta.env.MODE === "development"
    ? "http://localhost:5001/api"       // dev mode: use backend directly
    : "http://localhost:5001/api",      // production: use backend on host machine
  withCredentials: true,
});
