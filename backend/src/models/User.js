import mysql from "mysql2/promise";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

// Create a pool of database connections
const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "movie_app",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// User class to handle user database operations
class User {
  // Create a new user account
  static async create(userData) {
    try {
      // Hash the password for security
      const hashedPassword = await bcrypt.hash(userData.password, 10);

      // Insert the new user into database
      const [result] = await pool.execute(
        `INSERT INTO users (name, email, password) VALUES (?, ?, ?)`,
        [userData.name, userData.email, hashedPassword]
      );

      return {
        id: result.insertId,
        name: userData.name,
        email: userData.email,
      };
    } catch (error) {
      throw new Error(`Error creating user: ${error.message}`);
    }
  }

  // Find a user by their email
  static async findByEmail(email) {
    try {
      const [rows] = await pool.execute("SELECT * FROM users WHERE email = ?", [
        email,
      ]);
      return rows[0] || null;
    } catch (error) {
      throw new Error(`Error finding user: ${error.message}`);
    }
  }

  // Find a user by their ID
  static async findById(id) {
    try {
      const [rows] = await pool.execute("SELECT * FROM users WHERE id = ?", [
        parseInt(id),
      ]);
      return rows[0] || null;
    } catch (error) {
      throw new Error(`Error finding user: ${error.message}`);
    }
  }

  // Check if an email is already registered
  static async emailExists(email) {
    try {
      const [rows] = await pool.execute(
        "SELECT id FROM users WHERE email = ?",
        [email]
      );
      return rows.length > 0;
    } catch (error) {
      throw new Error(`Error checking email: ${error.message}`);
    }
  }

  // Check if a password matches the stored hash
  static async verifyPassword(password, hashedPassword) {
    try {
      return await bcrypt.compare(password, hashedPassword);
    } catch (error) {
      throw new Error(`Error verifying password: ${error.message}`);
    }
  }
}

export default User;
