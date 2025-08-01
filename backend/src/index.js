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

// Prevent unexpected process exits
process.on("uncaughtException", (error) => {
  console.error("Uncaught Exception:", error);
  // Don't exit, let Railway handle it
});

process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
  // Don't exit, let Railway handle it
});

// Log the port being used
console.log(`Using PORT: ${PORT}`);
console.log(`Environment: ${process.env.NODE_ENV || "development"}`);
console.log(`Railway PORT: ${process.env.PORT || "not set"}`);
console.log(`Dynamic PORT: ${process.env.PORT || "fallback to 3000"}`);

// Parse JSON requests
app.use(express.json());

// ✅ IMPROVED CORS Configuration
const allowedOrigins = [
  "http://localhost:5173", // Local development
  "http://localhost:3000", // Local development alternative
  "http://localhost:4173", // Vite preview
  "https://movies-tv-shows-flame.vercel.app", // Your Vercel deployment
  "https://movies-tv-shows-production.up.railway.app", // Your Railway deployment
  "https://movies-tv-shows-frontend.vercel.app", // Alternative frontend URL
];

// CORS configuration
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, curl, Postman, etc.)
    if (!origin) {
      console.log("✅ Allowing request with no origin");
      return callback(null, true);
    }

    // Check if origin is in allowed list
    if (allowedOrigins.includes(origin)) {
      console.log(`✅ Allowing origin: ${origin}`);
      return callback(null, true);
    }

    // For development, be more lenient
    if (process.env.NODE_ENV !== "production") {
      console.log(`✅ Development mode - allowing origin: ${origin}`);
      return callback(null, true);
    }

    console.log(`❌ CORS blocked origin: ${origin}`);
    return callback(new Error(`Not allowed by CORS: ${origin}`));
  },
  credentials: true, // Allow cookies/credentials
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
  allowedHeaders: [
    "Origin",
    "X-Requested-With",
    "Content-Type",
    "Accept",
    "Authorization",
    "Cache-Control",
    "Pragma",
    "X-API-Key",
  ],
  optionsSuccessStatus: 200, // Some legacy browsers (IE11, various SmartTVs) choke on 204
  preflightContinue: false,
  maxAge: 86400, // Cache preflight for 24 hours
};

// Apply CORS middleware
app.use(cors(corsOptions));

// Handle preflight requests explicitly for all routes
app.options("*", cors(corsOptions));

// Add security headers (but allow CORS)
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
    crossOriginEmbedderPolicy: false,
  })
);

// Limit how many requests each IP can make
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // Increased limit for development
  message: {
    success: false,
    message: "Too many requests from this IP, please try again later.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

// Add request logging middleware
app.use((req, res, next) => {
  console.log(
    `${new Date().toISOString()} - ${req.method} ${req.path} - Origin: ${
      req.get("Origin") || "none"
    }`
  );
  next();
});

// Simple health check endpoint for Railway
app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    message: "Server is running",
    timestamp: new Date().toISOString(),
    port: process.env.PORT || "not set",
    environment: process.env.NODE_ENV || "development",
    cors: "enabled",
  });
});

// Root endpoint for Railway health check
app.get("/", (req, res) => {
  res.json({
    status: "ok",
    message: "Movie API is running",
    timestamp: new Date().toISOString(),
    port: process.env.PORT || "not set",
    cors: "configured for Vercel frontend",
  });
});

// Test endpoint that doesn't use database
app.get("/test", (req, res) => {
  res.json({
    status: "ok",
    message: "Test endpoint working",
    cors: "should work now",
    origin: req.get("Origin"),
    method: req.method,
  });
});

// Routes for movies
app.use("/api/movies", movieRoutes);

// Handle 404 errors
app.use("*", (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.originalUrl} not found`,
  });
});

// Handle any errors
app.use((error, req, res, next) => {
  console.error("Server error:", error);

  // CORS error handling
  if (error.message && error.message.includes("CORS")) {
    return res.status(403).json({
      success: false,
      message: "CORS policy violation",
      error: error.message,
      allowedOrigins: allowedOrigins,
    });
  }

  res.status(500).json({
    success: false,
    message: "Something went wrong on the server",
    error: process.env.NODE_ENV === "development" ? error.message : undefined,
  });
});

// Start the server for Railway
app.listen(PORT, "0.0.0.0", async () => {
  try {
    console.log(`✅ Server running on port ${PORT}`);
    console.log(`✅ Health check: http://localhost:${PORT}/health`);
    console.log(`✅ API base: http://localhost:${PORT}/api/movies`);
    console.log(`✅ Test endpoint: http://localhost:${PORT}/test`);
    console.log(`✅ Host: 0.0.0.0`);
    console.log(`✅ CORS configured for origins:`, allowedOrigins);
    console.log(`✅ Railway deployment successful!`);

    // Initialize database with Railway MySQL (non-blocking)
    initDatabase()
      .then(() => {
        console.log("✅ Database initialized successfully");
      })
      .catch((error) => {
        console.log("❌ Database initialization failed:", error.message);
        console.log("⚠️  Server will continue running without database");
      });
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    // Don't exit the process, let Railway handle it
  }
});
