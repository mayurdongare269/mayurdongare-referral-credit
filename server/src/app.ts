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

// Root endpoint - Welcome message
app.get("/", (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>EduShare API</title>
      <style>
        body {
          margin: 0;
          padding: 0;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 100vh;
          color: white;
        }
        .container {
          text-align: center;
          padding: 2rem;
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          border-radius: 20px;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          max-width: 600px;
        }
        h1 {
          font-size: 2.5rem;
          margin: 0 0 1rem 0;
          font-weight: 700;
        }
        p {
          font-size: 1.2rem;
          margin: 0.5rem 0;
          opacity: 0.9;
        }
        .status {
          display: inline-block;
          padding: 0.5rem 1rem;
          background: rgba(16, 185, 129, 0.2);
          border: 2px solid #10b981;
          border-radius: 50px;
          margin: 1rem 0;
          font-weight: 600;
        }
        .links {
          margin-top: 2rem;
          display: flex;
          gap: 1rem;
          justify-content: center;
          flex-wrap: wrap;
        }
        .link {
          padding: 0.75rem 1.5rem;
          background: white;
          color: #667eea;
          text-decoration: none;
          border-radius: 10px;
          font-weight: 600;
          transition: transform 0.2s;
        }
        .link:hover {
          transform: translateY(-2px);
        }
        .emoji {
          font-size: 3rem;
          margin-bottom: 1rem;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="emoji">🚀</div>
        <h1>EduShare API</h1>
        <div class="status">✅ Running Successfully</div>
        <p>Referral Credit System Backend</p>
        <p style="font-size: 0.9rem; opacity: 0.7;">Developed by Mayur Dongare</p>
        <div class="links">
          <a href="/health" class="link">Health Check</a>
          <a href="https://mayurdongare-referral-credit.vercel.app" class="link" target="_blank">Visit Frontend</a>
        </div>
      </div>
    </body>
    </html>
  `);
});

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({
    status: "OK",
    timestamp: new Date().toISOString(),
    service: "EduShare API",
    version: "1.0.0"
  });
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
