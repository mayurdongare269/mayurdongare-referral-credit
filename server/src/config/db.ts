// // server/src/config/db.ts
// import mongoose from "mongoose";
// import dotenv from "dotenv";
// dotenv.config();

// const MONGO_URI = process.env.MONGO_URI || "";

// export const connectDB = async () => {
//   try {
//     await mongoose.connect(MONGO_URI);
//     console.log("MongoDB connected");
//   } catch (err) {
//     console.error("MongoDB connection error:", err);
//     process.exit(1);
//   }
// };

// server/src/config/db.ts
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const MONGO_URI = process.env.MONGO_URI || "";

export const connectDB = async (): Promise<void> => {
  if (!MONGO_URI) {
    console.error("MONGO_URI not set in environment");
    process.exit(1);
  }
  try {
    await mongoose.connect(MONGO_URI, {
      // options omitted for Atlas+modern drivers, mongoose will pick sensible defaults
    });
    console.log("✅ MongoDB connected");
  } catch (err) {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  }
};

