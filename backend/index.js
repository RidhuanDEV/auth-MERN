// const express = require('express');
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectDb } from "./db/connectDb.js";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.route.js";
import path from "path";


dotenv.config();

const app = express();

const __dirname = path.resolve();
app.use(cors({
    origin: ["http://localhost:5173", "https://auth-mern-qi69.vercel.app"], // Replace with your frontend URL
    credentials: true,
}));
app.use(express.json()); // Middleware to parse JSON requests
app.use(express.urlencoded({ extended: true })); // Middleware to parse URL-encoded requests
app.use(cookieParser()); // Middleware to parse cookies

app.use("/api/auth", authRoutes);
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "frontend/dist")));

  // Layani semua route non-API ke index.html (SPA)
  app.get(/^\/(?!api).*/, (req, res) => {
    res.sendFile(path.join(__dirname, "frontend", "dist", "index.html"));
  });
}

const PORT = process.env.PORT || 5000;


app.listen(PORT, () => {
  connectDb();
  console.log(`Server is running on port`, PORT);
});
