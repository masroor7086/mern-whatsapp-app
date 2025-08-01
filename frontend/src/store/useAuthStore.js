import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";
import toast from "react-hot-toast";
import { io } from "socket.io-client";

const BASE_URL =
  import.meta.env.MODE === "development"
    ? "http://localhost:5001"
    : window.location.origin;

export const useAuthStore = create((set, get) => ({
  authUser: null,
  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,
  isCheckingAuth: true,
  onlineUsers: [],
  socket: null,

  // ✅ Check if user is logged in
  checkAuth: async () => {
    try {
      const res = await axiosInstance.get("/auth/check");
      set({ authUser: res.data });
      get().connectSocket();
    } catch (error) {
      console.error("Error in checkAuth:", error);
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  // ✅ Signup function
  signup: async (data) => {
    set({ isSigningUp: true });
    try {
      const res = await axiosInstance.post("/auth/signup", data);
      localStorage.setItem("token", res.data.token);
      set({ authUser: res.data.user });
      toast.success("Account created successfully");
      get().connectSocket();
    } catch (error) {
      const message = error?.response?.data?.message || "Signup failed";
      toast.error(message);
      console.error("Signup error:", error);
    } finally {
      set({ isSigningUp: false });
    }
  },

  // ✅ Login function
  login: async (data) => {
    set({ isLoggingIn: true });
    try {
      const res = await axiosInstance.post("/auth/login", data);
      localStorage.setItem("token", res.data.token);
      set({ authUser: res.data.user });
      toast.success("Logged in successfully");
      get().connectSocket();
    } catch (error) {
      const message = error?.response?.data?.message || "Login failed";
      toast.error(message);
      console.error("Login error:", error);
    } finally {
      set({ isLoggingIn: false });
    }
  },

  // ✅ Logout function
  logout: async () => {
    try {
      await axiosInstance.post("/auth/logout");
      localStorage.removeItem("token");
      set({ authUser: null });
      toast.success("Logged out successfully");
      get().disconnectSocket();
    } catch (error) {
      const message = error?.response?.data?.message || "Logout failed";
      toast.error(message);
      console.error("Logout error:", error);
    }
  },

  // ✅ Profile update
  updateProfile: async (data) => {
    set({ isUpdatingProfile: true });
    try {
      const res = await axiosInstance.put("/auth/update-profile", data);
      set({ authUser: res.data });
      toast.success("Profile updated");
    } catch (error) {
      const message = error?.response?.data?.message || "Update failed";
      toast.error(message);
      console.error("Update error:", error);
    } finally {
      set({ isUpdatingProfile: false });
    }
  },

  // ✅ Connect socket.io
  connectSocket: () => {
    const { authUser, socket } = get();
    if (!authUser || socket?.connected) return;

    const newSocket = io(BASE_URL, {
      query: { userId: authUser._id },
    });

    newSocket.connect();
    set({ socket: newSocket });

    newSocket.on("getOnlineUsers", (userIds) => {
      set({ onlineUsers: userIds });
    });
  },

  // ✅ Disconnect socket
  disconnectSocket: () => {
    const socket = get().socket;
    if (socket?.connected) socket.disconnect();
  },
}));
