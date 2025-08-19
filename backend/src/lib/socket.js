import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  path: "/socket.io",       // ✅ must match frontend + nginx
  cors: {
    origin: true,           // ✅ reflect request origin
    credentials: true,
    methods: ["GET", "POST"]
  },
  transports: ["websocket", "polling"],
  pingTimeout: 20000,
  pingInterval: 10000,
  serveClient: false,
});

const userSocketMap = {};

export const getReceiverSocketId = (userId) => userSocketMap[userId];
export { io };
export { app };
export { server };

io.on("connection", (socket) => {
  console.log("New connection:", socket.id);

  const userId = socket.handshake.auth?.userId;

  if (userId) {
    if (userSocketMap[userId]) {
      const prevSocket = io.sockets.sockets.get(userSocketMap[userId]);
      if (prevSocket) prevSocket.disconnect(true);
    }
    userSocketMap[userId] = socket.id;
  }

  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  socket.on("disconnect", (reason) => {
    console.log(`Disconnected: ${socket.id} (Reason: ${reason})`);
    if (userId && userSocketMap[userId] === socket.id) {
      delete userSocketMap[userId];
    }
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });

  socket.on("error", (err) => {
    console.error("Socket error:", err.message);
  });
});
