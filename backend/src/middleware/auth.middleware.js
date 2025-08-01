// backend/middleware/auth.middleware.js
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const protectRoute = async (req, res, next) => {
  try {
    // ✅ Check for Authorization header
    const authHeader = req.headers.authorization;

    // ✅ Ensure header is in "Bearer <token>" format
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Unauthorized - No token provided" });
    }

    // ✅ Extract token from header
    const token = authHeader.split(" ")[1];

    // ✅ Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // ✅ Fetch user (without password)
    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // ✅ Attach user to request
    req.user = user;

    next(); // Proceed to route handler
  } catch (error) {
    console.error("Error in protectRoute middleware:", error.message);

    if (error.name === "JsonWebTokenError" || error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Unauthorized - Invalid or expired token" });
    }

    res.status(500).json({ message: "Internal server error" });
  }
};
