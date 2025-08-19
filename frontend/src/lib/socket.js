import { io } from "socket.io-client";

// ✅ Single socket instance, relative path
const socket = io("/", {
  path: "/socket.io",       // must match backend + nginx
  transports: ["websocket", "polling"],
  withCredentials: true,
  autoConnect: false,       // manually controlled
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
  timeout: 20000,
  forceNew: true,
});

// ✅ Connect socket with authUser ID
export const connectSocket = (userId) => {
  if (!userId) return;

  socket.auth = { userId };

  socket.off("connect_error");
  socket.on("connect_error", (err) => {
    console.error("Socket connect_error:", err.message);
    // fallback to polling if websocket fails
    if (err.message.includes("websocket")) {
      socket.io.opts.transports = ["polling", "websocket"];
      socket.connect();
    }
  });

  socket.connect();
};

export default socket;
