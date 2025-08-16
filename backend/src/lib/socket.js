import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*", // Temporary for debugging
    credentials: true,
    methods: ["GET", "POST"]
  },
  pingTimeout: 20000,
  pingInterval: 10000,
  transports: ["websocket", "polling"],
  allowEIO3: true,
  connectionStateRecovery: {
    maxDisconnectionDuration: 2 * 60 * 1000,
    skipMiddlewares: true
  },
  cookie: false,
  maxHttpBufferSize: 1e7,
  serveClient: false,
  allowRequest: (req, callback) => {
    callback(null, true);
  }
});

const userSocketMap = {};

export const getReceiverSocketId = (userId) => userSocketMap[userId];
export { io };

io.on("connection", (socket) => {
  console.log("New connection:", socket.id);

  const userId = socket.handshake.query.userId;
  if (userId) {
    if (userSocketMap[userId]) {
      const prevSocket = io.sockets.sockets.get(userSocketMap[userId]);
      if (prevSocket) {
        prevSocket.disconnect(true);
      }
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
