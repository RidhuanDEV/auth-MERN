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

// ===== CORS setup =====
const allowedOrigins = [
  process.env.CLIENT_URL,       // ex: https://auth-mern-hqzw.vercel.app (SET di env backend Vercel)
  "https://auth-mern-wan-fe.vercel.app"       // untuk development lokal
].filter(Boolean);

// Kalau kamu ingin mengizinkan semua preview domain vercel untuk project yang sama,
// aktifkan regex ini. (Kalau tidak mau terlalu longgar, hapus blok regex di bawah.)
function isVercelPreview(origin) {
  return /^https:\/\/[a-z0-9-]+\.vercel\.app$/.test(origin || "");
}

const corsOptions = {
  origin(origin, cb) {
    // izinkan tools tanpa Origin (Postman) + whitelist exact
    if (!origin || allowedOrigins.includes(origin)) return cb(null, true);
    // izinkan preview deployment vercel (opsional)
    if (isVercelPreview(origin)) return cb(null, true);
    return cb(new Error("Not allowed by CORS: " + origin));
  },
  credentials: true,
  methods: ["GET","POST","PUT","PATCH","DELETE","OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  exposedHeaders: ["set-cookie"],
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));
// penting: layani preflight ke semua path
app.options("*", cors(corsOptions));

// reverse proxy trust (agar secure cookie & sameSite:none bekerja di host HTTPS)
app.set("trust proxy", 1);

// ===== Body & Cookie parsers =====
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ===== API routes =====
app.use("/api/auth", authRoutes);

// ===== Static SPA (opsional, jika kamu juga host FE di server yang sama) =====
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
