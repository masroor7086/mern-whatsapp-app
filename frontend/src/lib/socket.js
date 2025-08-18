import { io } from "socket.io-client";

// ✅ Create single socket instance (singleton)
const socket = io("/", {
  path: "/socket.io",       // must match backend + nginx
  transports: ["websocket", "polling"],
  withCredentials: true,
  autoConnect: false,       // controlled manually
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
  timeout: 20000,
  forceNew: true,
});

// ✅ Function to connect socket with auth
export const connectSocket = (userId) => {
  socket.auth = { userId };

  socket.off("connect_error"); // clear old handlers
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
