import { create } from "zustand"; // ✅ Make sure this import exists
import { axiosInstance } from "../lib/axios"; // ✅ Your axios instance (should have baseURL and headers)
import { toast } from "react-hot-toast";

export const useAuthStore = create((set) => ({
  authUser: null,
  isLoggingIn: false,
  isCheckingAuth: true, // ✅ show loader until auth is verified

  login: async ({ email, password }) => {
    set({ isLoggingIn: true });
    try {
      const res = await axiosInstance.post("/auth/login", { email, password });
      const { token, user } = res.data;

      localStorage.setItem("token", token); // ✅ save token
      set({ authUser: user, isLoggingIn: false });
    } catch (error) {
      toast.error(error?.response?.data?.message || "Login failed");
      set({ isLoggingIn: false });
    }
  },

  logout: () => {
    localStorage.removeItem("token");
    set({ authUser: null });
  },

  checkAuth: async () => {
    try {
      const res = await axiosInstance.get("/auth/check");
      set({ authUser: res.data.user, isCheckingAuth: false });
    } catch (error) {
      console.error("Error in checkAuth:", error);
      localStorage.removeItem("token");
      set({ authUser: null, isCheckingAuth: false });
    }
  }
}));
