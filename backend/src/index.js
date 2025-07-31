import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import dotenv from "dotenv";
import movieRoutes from "./routes/movieRoutes.js";
// import { initDatabase } from "./config/database.js";

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// Parse JSON requests
app.use(express.json());

// Simplified CORS configuration without authentication
app.use(
  cors({
    origin: [
      "https://movies-tv-shows-flame.vercel.app", // Your Vercel frontend
      "http://localhost:5173", // For local development
      process.env.FRONTEND_URL, // From environment variable
    ].filter(Boolean), // Remove undefined values
    credentials: false, // Since no auth, you don't need credentials
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  })
);

// Add security headers
app.use(helmet());

// Limit how many requests each IP can make
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again later.",
});
app.use(limiter);

// Simple health check endpoint
app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    message: "Server is running",
    timestamp: new Date().toISOString(),
    database: "temporarily disabled for debugging",
  });
});

// Test endpoint that doesn't use database
app.get("/test", (req, res) => {
  res.json({
    status: "ok",
    message: "Test endpoint working",
    cors: "should work now",
  });
});

// Routes for movies
app.use("/api/movies", movieRoutes);

// Handle any errors
app.use((error, req, res, next) => {
  console.error("Server error:", error);
  res.status(500).json({
    success: false,
    message: "Something went wrong on the server",
  });
});

// Start the server
app.listen(PORT, "0.0.0.0", async () => {
  try {
    console.log(`Server running on port ${PORT}`);
    console.log(`Health check: http://localhost:${PORT}/health`);
    console.log(`API base: http://localhost:${PORT}/api/movies`);
    console.log(`Host: 0.0.0.0`);

    // Temporarily comment out database initialization to isolate the issue
    // await initDatabase();
    // console.log("Database initialized successfully");
  } catch (error) {
    console.error("Failed to start server:", error);
    // Don't exit, just log the error
    // process.exit(1);
  }
});
