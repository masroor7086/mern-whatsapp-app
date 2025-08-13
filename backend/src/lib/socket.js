import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();
const server = http.createServer(app);

// Environment configuration
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";
const PORT = process.env.PORT || 5001;

// Socket.IO Server Configuration
const io = new Server(server, {
  cors: {
    origin: FRONTEND_URL,
    methods: ["GET", "POST"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"]
  },
  transports: ['websocket', 'polling'],
  allowUpgrades: true,
  perMessageDeflate: false
});

// User socket mapping
const userSocketMap = {};

// Get receiver socket ID
export const getReceiverSocketId = (userId) => {
  return userSocketMap[userId];
};

// Connection handler
io.on("connection", (socket) => {
  console.log(`New connection: ${socket.id}`);
  
  const userId = socket.handshake.query.userId;
  if (userId) {
    userSocketMap[userId] = socket.id;
    console.log(`User ${userId} connected with socket ${socket.id}`);
  }

  // Broadcast online users
  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  // Disconnection handler
  socket.on("disconnect", () => {
    console.log(`Disconnected: ${socket.id}`);
    if (userId) {
      delete userSocketMap[userId];
      io.emit("getOnlineUsers", Object.keys(userSocketMap));
    }
  });

  // Error handler
  socket.on("error", (err) => {
    console.error(`Socket error (${socket.id}):`, err);
  });
});

// Health check endpoint
app.get('/healthz', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    connections: Object.keys(userSocketMap).length
  });
});

// Start server only if not in test environment
if (process.env.NODE_ENV !== 'test') {
  server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Socket.IO configured for origin: ${FRONTEND_URL}`);
  });
}

export { app, server, io };
