import express from "express";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import dotenv from "dotenv";
import cors from "cors";
import movieRoutes from "./routes/movieRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import { initDatabase } from "./config/database.js";

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Add error handling for uncaught exceptions
process.on("uncaughtException", (error) => {
  console.error("Uncaught Exception:", error);
  // Don't exit, let Railway handle it
});

process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
  // Don't exit, let Railway handle it
});

// Log startup information
console.log(`Starting server on port ${PORT}`);
console.log(`Environment: ${process.env.NODE_ENV || "development"}`);
console.log(`Railway PORT: ${process.env.PORT || "not set"}`);

app.use(express.json());
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
    crossOriginEmbedderPolicy: false,
  })
);

app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 1000,
    message: {
      success: false,
      message: "Too many requests from this IP, please try again later.",
    },
    standardHeaders: true,
    legacyHeaders: false,
  })
);

const allowedOrigins = [
  "http://localhost:5173", // Local frontend
  "https://movies-tv-shows-flame.vercel.app", // Vercel frontend
];

// CORS configuration
const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      console.log(`Allowed origin: ${origin || "none"}`);
      return callback(null, true);
    }
    console.warn(`Blocked origin: ${origin}`);
    return callback(new Error("CORS policy violation"));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
  allowedHeaders: [
    "Origin",
    "X-Requested-With",
    "Content-Type",
    "Accept",
    "Authorization",
    "Cache-Control",
    "Pragma",
  ],
  optionsSuccessStatus: 200,
};

// Use CORS configuration for all requests
app.use(cors(corsOptions));

// Use same CORS configuration for preflight requests
app.options("*", cors(corsOptions));

// Check for allowed origins
if (allowedOrigins.length === 0) {
  console.warn("WARNING: No allowed CORS origins set.");
}

app.use((req, res, next) => {
  console.log(
    `${req.method} ${req.originalUrl} from Origin: ${
      req.get("Origin") || "unknown"
    } | Referer: ${req.get("Referer") || "none"} | Host: ${req.get("Host")}`
  );
  next();
});

// Simple health check (no database dependency)
app.get("/", (req, res) => {
  res.json({
    status: "ok",
    message: "Server is running",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development",
  });
});

app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    environment: process.env.NODE_ENV || "development",
    timestamp: new Date().toISOString(),
  });
});

app.get("/test", (req, res) => {
  res.json({
    message: "Test route works!",
    origin: req.get("Origin") || "none",
  });
});

// Authentication routes
app.use("/api/auth", authRoutes);

// Movie routes (require authentication)
app.use("/api/movies", movieRoutes);

app.use("*", (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.originalUrl} not found`,
  });
});

app.use((error, req, res, next) => {
  console.error("Server Error:", error.message);

  if (error.message.includes("CORS")) {
    return res.status(403).json({
      success: false,
      message: "Blocked by CORS",
    });
  }

  res.status(500).json({
    success: false,
    message: "Server error",
    error: process.env.NODE_ENV === "development" ? error.message : undefined,
  });
});

// Start server
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running at http://localhost:${PORT}`);
  console.log(`Auth API available at /api/auth`);
  console.log(`Movies API available at /api/movies`);
  console.log(`Accepting requests from: ${allowedOrigins.join(", ")}`);
  console.log(`Railway deployment successful!`);

  // Initialize database
  initDatabase()
    .then(() => {
      console.log("Database initialized successfully");
    })
    .catch((err) => {
      console.log("Database initialization failed:", err.message);
      console.log("Server will continue running without database");
    });
});
