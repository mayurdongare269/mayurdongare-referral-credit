// server/src/app.ts
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import apiRoutes from "./routes/api.js";
import { connectDB } from "./config/db.js";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

app.use("/api", apiRoutes);

const PORT = process.env.PORT || 4000;

connectDB().then(() => {
  app.listen(PORT, () => console.log(`Server listening on ${PORT}`));
});
