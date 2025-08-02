import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { pool } from "../config/database.js";

// User class to handle database operations
class User {
  // Create a new user
  static async create(userData) {
    try {
      // Hash the password
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(userData.password, saltRounds);

      const [result] = await pool.execute(
        "INSERT INTO users (username, email, password) VALUES (?, ?, ?)",
        [userData.username, userData.email, hashedPassword]
      );

      const newUser = {
        id: result.insertId,
        username: userData.username,
        email: userData.email,
      };

      // Generate JWT token
      const token = jwt.sign(
        { userId: newUser.id, username: newUser.username },
        process.env.JWT_SECRET || "your-secret-key",
        { expiresIn: "7d" }
      );

      return { user: newUser, token };
    } catch (error) {
      if (error.code === "ER_DUP_ENTRY") {
        if (error.message.includes("username")) {
          throw new Error("Username already exists");
        } else if (error.message.includes("email")) {
          throw new Error("Email already exists");
        }
      }
      throw new Error(`Error creating user: ${error.message}`);
    }
  }

  // Find user by email
  static async findByEmail(email) {
    try {
      const [rows] = await pool.execute(
        "SELECT * FROM users WHERE email = ?",
        [email]
      );
      return rows[0] || null;
    } catch (error) {
      throw new Error(`Error finding user: ${error.message}`);
    }
  }

  // Find user by username
  static async findByUsername(username) {
    try {
      const [rows] = await pool.execute(
        "SELECT * FROM users WHERE username = ?",
        [username]
      );
      return rows[0] || null;
    } catch (error) {
      throw new Error(`Error finding user: ${error.message}`);
    }
  }

  // Find user by ID
  static async findById(id) {
    try {
      const [rows] = await pool.execute(
        "SELECT id, username, email, created_at FROM users WHERE id = ?",
        [parseInt(id)]
      );
      return rows[0] || null;
    } catch (error) {
      throw new Error(`Error finding user: ${error.message}`);
    }
  }

  // Authenticate user (login)
  static async authenticate(email, password) {
    try {
      const user = await this.findByEmail(email);
      if (!user) {
        throw new Error("Invalid email or password");
      }

      // Compare password
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        throw new Error("Invalid email or password");
      }

      // Generate JWT token
      const token = jwt.sign(
        { userId: user.id, username: user.username },
        process.env.JWT_SECRET || "your-secret-key",
        { expiresIn: "7d" }
      );

      return {
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
        },
        token,
      };
    } catch (error) {
      throw new Error(`Authentication error: ${error.message}`);
    }
  }

  // Verify JWT token
  static verifyToken(token) {
    try {
      return jwt.verify(token, process.env.JWT_SECRET || "your-secret-key");
    } catch (error) {
      throw new Error("Invalid token");
    }
  }

  // Update user profile
  static async updateProfile(userId, updateData) {
    try {
      const allowedFields = ["username", "email"];
      const updates = [];
      const values = [];

      for (const [key, value] of Object.entries(updateData)) {
        if (allowedFields.includes(key) && value !== undefined) {
          updates.push(`${key} = ?`);
          values.push(value);
        }
      }

      if (updates.length === 0) {
        throw new Error("No valid fields to update");
      }

      values.push(parseInt(userId));

      const [result] = await pool.execute(
        `UPDATE users SET ${updates.join(", ")} WHERE id = ?`,
        values
      );

      if (result.affectedRows === 0) {
        throw new Error("User not found");
      }

      return await this.findById(userId);
    } catch (error) {
      throw new Error(`Error updating user: ${error.message}`);
    }
  }

  // Change password
  static async changePassword(userId, currentPassword, newPassword) {
    try {
      // Get current user with password
      const [rows] = await pool.execute(
        "SELECT * FROM users WHERE id = ?",
        [parseInt(userId)]
      );

      if (rows.length === 0) {
        throw new Error("User not found");
      }

      const user = rows[0];

      // Verify current password
      const isCurrentPasswordValid = await bcrypt.compare(
        currentPassword,
        user.password
      );

      if (!isCurrentPasswordValid) {
        throw new Error("Current password is incorrect");
      }

      // Hash new password
      const saltRounds = 10;
      const hashedNewPassword = await bcrypt.hash(newPassword, saltRounds);

      // Update password
      await pool.execute(
        "UPDATE users SET password = ? WHERE id = ?",
        [hashedNewPassword, parseInt(userId)]
      );

      return { success: true };
    } catch (error) {
      throw new Error(`Error changing password: ${error.message}`);
    }
  }

  // Delete user account
  static async deleteAccount(userId) {
    try {
      const [result] = await pool.execute(
        "DELETE FROM users WHERE id = ?",
        [parseInt(userId)]
      );

      if (result.affectedRows === 0) {
        throw new Error("User not found");
      }

      return { success: true };
    } catch (error) {
      throw new Error(`Error deleting user: ${error.message}`);
    }
  }
}

export default User; 