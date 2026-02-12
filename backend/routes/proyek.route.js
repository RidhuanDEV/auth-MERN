import express from "express";
import {
  getProyek,
  getPublicProyek,
  createProyek,
} from "../controllers/proyek.controller.js";
import { verifyToken } from "../middleware/verifyToken.js";
import { upload } from "../middleware/uploadMiddleware.js";

const router = express.Router();

// Public route - get projects by email
router.get("/", getPublicProyek);

// Authenticated routes
router.get("/authenticated", verifyToken, getProyek);
router.post("/", verifyToken, upload.any(), createProyek);

export default router;
