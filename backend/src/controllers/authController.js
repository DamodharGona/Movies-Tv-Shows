import User from "../models/User.js";
import jwt from "jsonwebtoken";

// Secret key for creating tokens
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

// Create a token for a user
const generateToken = (userId) => {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: "7d" });
};

// Register a new user
export const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Make sure all fields are provided
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Name, email, and password are required",
      });
    }

    // Check if email is already used
    const emailExists = await User.emailExists(email);
    if (emailExists) {
      return res.status(400).json({
        success: false,
        message: "Email already registered",
      });
    }

    // Create the new user
    const newUser = await User.create({ name, email, password });

    // Create a token for the user
    const token = generateToken(newUser.id);

    // Send back the user data and token
    res.status(201).json({
      success: true,
      data: {
        user: {
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
        },
        token,
      },
      message: "User registered successfully",
    });
  } catch (error) {
    console.error("Error in signup:", error);
    res.status(500).json({
      success: false,
      message: "Failed to register user",
      errors: [error.message],
    });
  }
};

// Login user
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Make sure email and password are provided
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    // Find the user by email
    const user = await User.findByEmail(email);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Check if password is correct
    const isPasswordValid = await User.verifyPassword(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Create a token for the user
    const token = generateToken(user.id);

    // Send back the user data and token
    res.json({
      success: true,
      data: {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
        },
        token,
      },
      message: "Login successful",
    });
  } catch (error) {
    console.error("Error in login:", error);
    res.status(500).json({
      success: false,
      message: "Failed to login",
      errors: [error.message],
    });
  }
};

// Get current user profile
export const getProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.json({
      success: true,
      data: {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
        },
      },
      message: "Profile retrieved successfully",
    });
  } catch (error) {
    console.error("Error getting profile:", error);
    res.status(500).json({
      success: false,
      message: "Failed to get profile",
      errors: [error.message],
    });
  }
};
