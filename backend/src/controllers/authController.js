import User from "../models/User.js";
import { authenticateToken } from "../middleware/auth.js";

// Register a new user
export const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Validation
    if (!username || !email || !password) {
      return res.status(400).json({
        error: "Username, email, and password are required",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        error: "Password must be at least 6 characters long",
      });
    }

    if (username.length < 3) {
      return res.status(400).json({
        error: "Username must be at least 3 characters long",
      });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        error: "Please provide a valid email address",
      });
    }

    // Create user
    const result = await User.create({ username, email, password });

    res.status(201).json({
      message: "User registered successfully",
      user: result.user,
      token: result.token,
    });
  } catch (error) {
    // Handle specific error messages
    if (error.message.includes("already exists")) {
      return res.status(400).json({ 
        error: error.message 
      });
    }
    res.status(400).json({ 
      error: "Registration failed. Please try again." 
    });
  }
};

// Login user
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        error: "Email and password are required",
      });
    }

    // Authenticate user
    const result = await User.authenticate(email, password);

    res.json({
      message: "Login successful",
      user: result.user,
      token: result.token,
    });
  } catch (error) {
    // Handle specific authentication errors
    if (error.message.includes("Invalid email or password")) {
      return res.status(401).json({ 
        error: "Invalid email or password. Please check your credentials." 
      });
    }
    res.status(401).json({ 
      error: "Login failed. Please try again." 
    });
  }
};

// Get current user profile
export const getProfile = async (req, res) => {
  try {
    res.json({
      user: req.user,
    });
  } catch (error) {
    res.status(500).json({ error: "Error fetching profile" });
  }
};

// Update user profile
export const updateProfile = async (req, res) => {
  try {
    const { username, email } = req.body;
    const updateData = {};

    if (username !== undefined) updateData.username = username;
    if (email !== undefined) updateData.email = email;

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({
        error: "No valid fields to update",
      });
    }

    // Email validation if email is being updated
    if (email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({
          error: "Please provide a valid email address",
        });
      }
    }

    // Username validation if username is being updated
    if (username && username.length < 3) {
      return res.status(400).json({
        error: "Username must be at least 3 characters long",
      });
    }

    const updatedUser = await User.updateProfile(req.user.id, updateData);

    res.json({
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Change password
export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    // Validation
    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        error: "Current password and new password are required",
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        error: "New password must be at least 6 characters long",
      });
    }

    await User.changePassword(req.user.id, currentPassword, newPassword);

    res.json({
      message: "Password changed successfully",
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete user account
export const deleteAccount = async (req, res) => {
  try {
    await User.deleteAccount(req.user.id);

    res.json({
      message: "Account deleted successfully",
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Verify token (for frontend to check if token is still valid)
export const verifyToken = async (req, res) => {
  try {
    // The authenticateToken middleware already verified the token
    // and added the user to req.user
    res.json({
      valid: true,
      user: req.user,
    });
  } catch (error) {
    res.status(401).json({ valid: false, error: "Invalid token" });
  }
}; 