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

// ✅ FIXED CORS Configuration
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        console.log(`✅ Allowed origin: ${origin || "none"}`);
        return callback(null, true);
      }
      console.warn(`❌ Blocked origin: ${origin}`);
      return callback(new Error("CORS policy violation"));
    },
    credentials: true, // ✅ ADDED: Allow credentials
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allowedHeaders: [
      "Origin",
      "X-Requested-With", 
      "Content-Type",
      "Accept",
      "Authorization",
      "Cache-Control",
      "Pragma"
    ], // ✅ ADDED: Explicit headers
    optionsSuccessStatus: 200, // ✅ ADDED: Some browsers need this
  })
);

// ✅ ADDED: Handle preflight requests explicitly
app.options("*", cors());

app.use((req, res, next) => {
  console.log(
    `${req.method} ${req.originalUrl} from ${req.get("Origin") || "unknown"}`
  );
  next();
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

app.listen(PORT, "0.0.0.0", async () => {
  console.log(`Server running at http://localhost:${PORT}`);
  console.log(`API available at /api/movies`);
  console.log(`Accepting requests from: ${allowedOrigins.join(", ")}`);

  try {
    await initDatabase();
    console.log("Database initialized");
  } catch (err) {
    console.warn("Database initialization failed:", err.message);
  }
});
