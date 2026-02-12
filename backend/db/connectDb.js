// db/connectDb.js
import mongoose from "mongoose";

let isConnected = false;

export async function connectDb() {
  if (isConnected) return;

  const uri = process.env.MONGODB_URI || process.env.MONGO_URI;
  if (!uri) {
    throw new Error("Missing MONGODB_URI or MONGO_URI in environment variables");
  }

  console.log("🔌 Connecting to MongoDB...");

  try {
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 10000, // 10 detik
    });

    isConnected = true;
    console.log(" MongoDB connected");
  } catch (err) {
    console.error(" MongoDB connection error:");
    console.error(err);
    throw err;
  }
}
