import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const protectRoute = async (req, res, next) => {
  try {
    // Get the Authorization header
    const authHeader = req.headers.authorization;

    // Check if header is missing or doesn't start with 'Bearer '
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Unauthorized - No Token Provided" });
    }

    // Extract the token part from "Bearer <token>"
    const token = authHeader.split(" ")[1];

    // Verify the token using your JWT_SECRET
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // If token is invalid
    if (!decoded) {
      return res.status(401).json({ message: "Unauthorized - Invalid Token" });
    }

    // Find the user in DB and exclude password field
    const user = await User.findById(decoded.userId).select("-password");

    // If no user found
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Attach the user object to req for future use
    req.user = user;

    // Call next middleware or controller
    next();
  } catch (error) {
    console.log("Error in protectRoute middleware:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};
