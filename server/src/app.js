// server/src/app.ts
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import apiRoutes from "./routes/api.js";
import { connectDB } from "./config/db.js";
// Load environment variables FIRST
const result = dotenv.config();
if (result.error) {
    console.error("❌ Error loading .env file:", result.error);
    process.exit(1);
}
console.log("✅ Environment variables loaded");
console.log("📝 CLERK_SECRET_KEY:", process.env.CLERK_SECRET_KEY ? "Set ✓" : "Missing ✗");
console.log("📝 MONGODB_URI:", process.env.MONGODB_URI ? "Set ✓" : "Missing ✗");
console.log("📝 PORT:", process.env.PORT || "4000 (default)");
const app = express();
app.use(cors());
app.use(express.json());
app.use("/api", apiRoutes);
const PORT = process.env.PORT || 4000;
connectDB().then(() => {
    app.listen(PORT, () => console.log(`🚀 Server listening on ${PORT}`));
});
//# sourceMappingURL=app.js.map