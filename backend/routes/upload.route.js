import express from "express";
import { upload } from "../middleware/uploadMiddleware.js";
import { uploadFile } from "../controllers/upload.controller.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

// Upload file to Cloudinary
router.post("/upload", verifyToken, upload.single("file"), uploadFile);

export default router;
