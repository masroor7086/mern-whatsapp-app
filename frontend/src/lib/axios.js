import axios from "axios";

const isDev = import.meta.env.MODE === "development";

const baseURL = isDev
  ? "http://localhost:5001" // when running locally
  : "/api"; // proxy to backend-service via Ingress or NGINX in Kubernetes

export const axiosInstance = axios.create({
  baseURL,
  withCredentials: true,
});
