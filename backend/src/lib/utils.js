import jwt from "jsonwebtoken";

export const generateToken = (userId, res, options = {}) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  const cookieOptions = {
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    httpOnly: true,
    sameSite: options.sameSite || "strict",
    secure: options.secure || process.env.NODE_ENV === "production",
    ...options
  };

  res.cookie("jwt", token, cookieOptions);
  return token;
};
