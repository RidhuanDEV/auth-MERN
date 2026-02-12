// backend/index.js
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectDb } from "./db/connectDb.js";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.route.js";
import homeRoutes from "./routes/home.route.js";
import proyekRoutes from "./routes/proyek.route.js";
import aboutRoutes from "./routes/about.route.js";
import uploadRoutes from "./routes/upload.route.js";
import { csrfMiddleware } from "./middleware/csrfMiddleware.js";
import path from "path";
import {
  securityHeaders,
  generalLimiter,
  authLimiter,
} from "./middleware/securityMiddleware.js";

dotenv.config();

const app = express();
const __dirname = path.resolve();

// ===== Security Headers =====
app.use(securityHeaders);

// ===== CORS Configuration =====
app.use(
  cors({
    origin: process.env.CLIENT_URL, // FE URL
    credentials: true,
  })
);

// ===== Trust proxy for HTTPS =====
app.set("trust proxy", 1);

// ===== Rate Limiting =====
app.use(generalLimiter);

// ===== Body & Cookie parsers with size limits =====
app.use(express.json({ limit: "50mb" })); // Allow Cloudinary upload URLs
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(cookieParser());

// ===== CSRF protection (double-submit) =====
// Validates that state-changing requests include x-xsrf-token header matching XSRF-TOKEN cookie
app.use(csrfMiddleware);

// ===== API routes =====
app.use("/api/auth", authLimiter, authRoutes);
app.use("/api/home", homeRoutes);
app.use("/api/projects", proyekRoutes);
app.use("/api/about", aboutRoutes);
app.use("/api", uploadRoutes); // Upload route: /api/upload

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
