// db/connectDb.js
import mongoose from "mongoose";

let isConnected = false;

export async function connectDb() {
  if (isConnected) return;
  const uri = process.env.MONGODB_URI || process.env.MONGO_URI; // whichever you use
  if (!uri) {
    throw new Error("Missing MONGODB_URI in environment variables");
  }
  await mongoose.connect(uri, { dbName: process.env.MONGODB_DB });
  isConnected = true;
}
