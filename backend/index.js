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

// Enable CORS for all routes (allows requests from any origin)
app.use(cors("https://auth-mern-wan-fe.vercel.app"));

// reverse proxy trust (agar secure cookie & sameSite:none bekerja di host HTTPS)
app.set("trust proxy", 1);

// ===== Body & Cookie parsers =====
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ===== API routes =====
app.use("/api/auth", authRoutes);

// ===== Static SPA (opsional, jika kamu juga host FE di server yang sama) =====

app.use(express.static(path.join(__dirname, "frontend/dist")));

// Layani semua route non-API ke index.html (SPA)
app.get(/^\/(?!api).*/, (req, res) => {
  res.sendFile(path.join(__dirname, "frontend", "dist", "index.html"));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  connectDb();
  console.log(`Server is running on port`, PORT);
});
