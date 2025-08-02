import express from "express";
import {
  register,
  login,
  getProfile,
  updateProfile,
  changePassword,
  deleteAccount,
  verifyToken,
} from "../controllers/authController.js";
import { authenticateToken } from "../middleware/auth.js";

const router = express.Router();

// Public routes
router.post("/register", register);
router.post("/login", login);

// Protected routes (require authentication)
router.get("/profile", authenticateToken, getProfile);
router.put("/profile", authenticateToken, updateProfile);
router.put("/change-password", authenticateToken, changePassword);
router.delete("/account", authenticateToken, deleteAccount);
router.get("/verify", authenticateToken, verifyToken);

export default router; 