// server/src/app.ts
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import fs from "fs";
import apiRoutes from "./routes/api.js";
import { connectDB } from "./config/db.js";

// Load .env file only if it exists (for local development)
if (fs.existsSync(".env")) {
  dotenv.config();
}

console.log("✅ Environment variables loaded");
console.log("📝 CLERK_SECRET_KEY:", process.env.CLERK_SECRET_KEY ? "Set ✓" : "Missing ✗");
console.log("📝 MONGODB_URI:", process.env.MONGODB_URI ? "Set ✓" : "Missing ✗");
console.log("📝 PORT:", process.env.PORT || "4000 (default)");

const app = express();

// CORS configuration for production
const corsOptions = {
  origin: process.env.CORS_ORIGIN || '*',
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json());

console.log("🔒 CORS Origin:", process.env.CORS_ORIGIN || "* (all origins)");

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({ status: "OK", timestamp: new Date().toISOString() });
});

app.use("/api", apiRoutes);

const PORT = process.env.PORT || 4000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server listening on ${PORT}`);
    console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  });
}).catch((error) => {
  console.error('❌ Failed to start server:', error);
  process.exit(1);
});
