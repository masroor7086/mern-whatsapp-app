import { io } from "socket.io-client";

// Single socket instance
const socket = io("/", {
  path: "/socket.io",
  transports: ["websocket", "polling"],
  withCredentials: true,
  autoConnect: false,
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
  timeout: 20000,
  forceNew: true,
});

// Connect socket with authUser ID
export const connectSocket = (userId, setOnlineUsers) => {
  if (!userId) return;

  socket.auth = { userId };

  socket.off("connect_error");
  socket.on("connect_error", (err) => {
    console.error("Socket connect_error:", err.message);
    if (err.message.includes("websocket")) {
      socket.io.opts.transports = ["polling", "websocket"];
      socket.connect();
    }
  });

  // ✅ Listen for online users updates
  socket.off("getOnlineUsers");
  socket.on("getOnlineUsers", (userIds) => {
    setOnlineUsers(userIds);
  });

  socket.connect();
};

export default socket;
