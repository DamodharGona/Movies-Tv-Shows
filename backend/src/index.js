import express from "express";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import dotenv from "dotenv";
import cors from "cors";
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

// ✅ Allow only Vercel frontend in production; allow localhost in dev
const allowedOrigins = [
  "http://localhost:5173", // for local frontend
  "https://movies-tv-shows-flame.vercel.app", // replace with your actual deployed Vercel URL
];

app.use(
  cors({
    origin: function (origin, callback) {
      // allow requests with no origin (like curl/postman)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        return callback(new Error("Not allowed by CORS"));
      }
    },
    optionsSuccessStatus: 200,
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
