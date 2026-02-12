import express from "express";
import {
  getAbout,
  getPublicAbout,
  createOrUpdateAbout,
} from "../controllers/about.controller.js";
import { verifyToken } from "../middleware/verifyToken.js";
import { upload } from "../middleware/uploadMiddleware.js";

const router = express.Router();

// Public route - get about by email
router.get("/", getPublicAbout);

// Authenticated routes
router.get("/about", verifyToken, getAbout);
router.post("/", verifyToken, upload.any(), createOrUpdateAbout);

export default router;
