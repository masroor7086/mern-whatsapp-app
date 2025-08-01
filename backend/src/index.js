import dotenv from "dotenv";
dotenv.config(); // ✅ Must come first before using process.env

import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";

import { connectDB } from "./lib/db.js";
import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import { app, server } from "./lib/socket.js";

// ✅ Define __dirname manually for ES module
const __dirname = path.resolve();

// ✅ Middleware
app.use(express.json());
app.use(cookieParser());

// ✅ Enable CORS (adjust origin in prod)
app.use(
  cors({
    origin: process.env.NODE_ENV === "development"
      ? "http://localhost:5173"
      : true, // Accepts frontend origin in production (e.g. NGINX/K8s Ingress)
    credentials: true,
  })
);

// ✅ Route prefixing
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

// ✅ Serve static frontend in production
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
  });
}

// ✅ Start server
const PORT = process.env.PORT || 5001;
server.listen(PORT, () => {
  console.log(`✅ Server is running on PORT: ${PORT}`);
  connectDB();
});
