import express from "express";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

console.log(`🚀 Starting minimal test server`);
console.log(`📊 PORT: ${PORT}`);
console.log(`🌍 NODE_ENV: ${process.env.NODE_ENV || "development"}`);

// Basic CORS
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  
  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }
  next();
});

// Health check
app.get("/health", (req, res) => {
  console.log("✅ Health check requested");
  res.json({ status: "ok", port: PORT, timestamp: new Date().toISOString() });
});

// Root
app.get("/", (req, res) => {
  console.log("✅ Root requested");
  res.json({ status: "ok", message: "Minimal server running", port: PORT });
});

// Test API
app.get("/api/test", (req, res) => {
  console.log("✅ API test requested");
  res.json({ status: "ok", message: "API working", port: PORT });
});

// Start server
app.listen(PORT, "0.0.0.0", () => {
  console.log(`✅ Minimal server running on port ${PORT}`);
  console.log(`✅ Health: http://localhost:${PORT}/health`);
  console.log(`✅ Root: http://localhost:${PORT}/`);
  console.log(`✅ API: http://localhost:${PORT}/api/test`);
  console.log(`✅ Host: 0.0.0.0`);
});

export default app; 