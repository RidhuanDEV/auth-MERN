// backend/index.js
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

app.use(
  cors({
    origin: process.env.CLIENT_URL, // FE URL
    credentials: true,
  })
);

// reverse proxy trust (agar secure cookie & sameSite:none bekerja di host HTTPS)
app.set("trust proxy", 1);

// ===== Body & Cookie parsers =====
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/debug", (req, res) => {
  res.json({
    message: "Debug API working!",
    timestamp: new Date(),
    headers: req.headers,
  });
});

// ===== API routes =====
app.use("/api/auth", authRoutes);

// ===== Static SPA (opsional, jika kamu juga host FE di server yang sama) =====

app.use(express.static(path.join(__dirname, "frontend/dist")));

// Layani semua route non-API ke index.html (SPA)
app.get(/^\/(?!api).*/, (req, res) => {
  res.sendFile(path.join(__dirname, "frontend", "dist", "index.html"));
});

const PORT = process.env.PORT || 5000; // bisa dari env atau default 5000

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

connectDb();
export default (req, res) => app(req, res);
