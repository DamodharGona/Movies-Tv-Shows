import jwt from "jsonwebtoken";
import User from "../models/User.js";

// Secret key for checking tokens
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

// Middleware to check if user is logged in
export const authenticateToken = async (req, res, next) => {
  try {
    // Get the token from the request header
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1]; // Bearer TOKEN

    // Check if token exists
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Access token required",
      });
    }

    // Check if token is valid
    const decoded = jwt.verify(token, JWT_SECRET);

    // Get user from database
    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid token",
      });
    }

    // Add user info to request
    req.user = {
      id: user.id,
      name: user.name,
      email: user.email,
    };

    next();
  } catch (error) {
    console.error("Auth middleware error:", error);
    return res.status(401).json({
      success: false,
      message: "Invalid token",
    });
  }
};
