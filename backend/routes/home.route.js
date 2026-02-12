import express from "express";
import { getHome, updateHome } from "../controllers/home.controller.js";
import { verifyToken } from "../middleware/verifyToken.js";
import { upload } from "../middleware/uploadMiddleware.js";

const router = express.Router();

// GET /api/home - public, tanpa autentikasi
router.get("/", getHome);

// PUT /api/home - perlu autentikasi untuk edit
// Now handles multipart/form-data for file uploads
router.put("/", verifyToken, upload.any(), updateHome);

export default router;
