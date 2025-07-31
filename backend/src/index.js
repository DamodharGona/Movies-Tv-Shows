import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import dotenv from "dotenv";
import movieRoutes from "./routes/movieRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import { initDatabase } from "./config/database.js";

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// Parse JSON requests
app.use(express.json());

// Allow requests from frontend
const allowedOrigins = [
  "http://localhost:5173", // For local development
  "https://favorite-movies-tv-shows.vercel.app", // Your Vercel frontend
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
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
  });
});

// Routes for authentication
app.use("/api/auth", authRoutes);

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
app.listen(PORT, async () => {
  try {
    // Initialize database
    await initDatabase();
    console.log("Database initialized successfully");

    console.log(`Server running on port ${PORT}`);
    console.log(`Health check: http://localhost:${PORT}/health`);
    console.log(`API base: http://localhost:${PORT}/api/movies`);
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
});
