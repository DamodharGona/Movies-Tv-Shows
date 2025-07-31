import express from "express";
import { login, signup, getProfile } from "../controllers/authController.js";

const router = express.Router();

// Route to register a new user
router.post("/signup", signup);

// Route to login user
router.post("/login", login);

// Route to get user profile (protected)
router.get("/profile", getProfile);

export default router;
