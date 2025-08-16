import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST"]
  },
  // Connection recovery settings
  connectionStateRecovery: {
    maxDisconnectionDuration: 2 * 60 * 1000,
    skipMiddlewares: true
  },
  // Transport settings
  transports: ["websocket", "polling"],
  allowEIO3: true,
  // Timeout settings
  pingTimeout: 30000,  // Reduced from 60s to 30s
  pingInterval: 15000, // Reduced from 25s to 15s
  // Security settings
  cookie: false,
  maxHttpBufferSize: 1e7, // Reduced from 100MB to 10MB
  // Performance settings
  serveClient: false,
  allowRequest: (req, callback) => {
    // Add any auth checks here if needed
    callback(null, true);
  }
});

// User socket mapping
const userSocketMap = {};

export const getReceiverSocketId = (userId) => userSocketMap[userId];

io.on("connection", (socket) => {
  console.log("New connection:", socket.id);

  const userId = socket.handshake.query.userId;
  if (userId) {
    // Disconnect previous connection if same user connects again
    if (userSocketMap[userId]) {
      const prevSocket = io.sockets.sockets.get(userSocketMap[userId]);
      if (prevSocket) {
        prevSocket.disconnect(true); // Force disconnect
      }
    }
    userSocketMap[userId] = socket.id;
  }

  // Broadcast online users
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

export { app, server, io };
