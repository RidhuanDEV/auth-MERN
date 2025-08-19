// backend/index.js
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";

import { connectDb } from "./db/connectDb.js";
import authRoutes from "./routes/auth.route.js";

dotenv.config();

const app = express();
app.set("trust proxy", 1);

// ----- CORS -----
const allowedOrigins = (process.env.CLIENT_URL || "")
  .split(",")
  .map(s => s.trim())
  .filter(Boolean);

const corsOptions = {
  origin: allowedOrigins.length ? allowedOrigins : true, // allow all if not set
  credentials: true,
  methods: ["GET","POST","PUT","PATCH","DELETE","OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  optionsSuccessStatus: 204
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions)); // ✅ correct preflight middleware

// ----- Parsers -----
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ----- Health/debug -----
app.get("/debug", (req, res) => {
  res.json({
    message: "Debug API working!",
    timestamp: new Date(),
    headers: req.headers
  });
});

// ----- API routes -----
app.use("/api/auth", authRoutes);

// ----- (Optional) serve SPA if you actually ship built files with the function -----
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, "../frontend/dist")));
app.get(/^\/(?!api).*/, (_req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/dist", "index.html"));
});

// ----- Connect DB once (cache inside your connectDb to avoid re-connecting across invocations) -----
connectDb();

// ❌ Do NOT app.listen on Vercel
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => { ... });

// ✅ Export a handler for Vercel
export default (req, res) => app(req, res);
