import express from "express";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import dotenv from "dotenv";
import movieRoutes from "./routes/movieRoutes.js";
import { initDatabase } from "./config/database.js";

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Log the port being used
console.log(`Using PORT: ${PORT}`);
console.log(`Environment: ${process.env.NODE_ENV || "development"}`);
console.log(`Railway PORT: ${process.env.PORT || "not set"}`);
console.log(`Dynamic PORT: ${process.env.PORT || "fallback to 3000"}`);

// Parse JSON requests
app.use(express.json());

// CORS configuration - written from scratch
app.use((req, res, next) => {
  // Define allowed origins
  const allowedOrigins = [
    "https://movies-tv-shows-flame.vercel.app",
    "http://localhost:5173",
    process.env.FRONTEND_URL,
  ].filter(Boolean);

  const origin = req.headers.origin;

  // Check if origin is allowed
  if (allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }

  // Set CORS headers
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Access-Control-Allow-Credentials", "false");

  // Handle preflight requests
  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  next();
});

// Add security headers
app.use(helmet());

// Limit how many requests each IP can make
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again later.",
});
app.use(limiter);

// Simple health check endpoint for Railway
app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    message: "Server is running",
    timestamp: new Date().toISOString(),
    port: process.env.PORT || "not set",
    environment: process.env.NODE_ENV || "development",
  });
});

// Root endpoint for Railway health check
app.get("/", (req, res) => {
  res.json({
    status: "ok",
    message: "Movie API is running",
    timestamp: new Date().toISOString(),
    port: process.env.PORT || "not set",
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

// Start the server for Railway
app.listen(PORT, "0.0.0.0", async () => {
  try {
    console.log(`✅ Server running on port ${PORT}`);
    console.log(`✅ Health check: http://localhost:${PORT}/health`);
    console.log(`✅ API base: http://localhost:${PORT}/api/movies`);
    console.log(`✅ Host: 0.0.0.0`);
    console.log(`✅ Railway deployment successful!`);

    // Initialize database with Railway MySQL
    try {
      await initDatabase();
      console.log("✅ Database initialized successfully");
    } catch (error) {
      console.log("❌ Database initialization failed:", error.message);
    }
  } catch (error) {
    console.error("❌ Failed to start server:", error);
  }
});
