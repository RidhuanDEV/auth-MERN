import express from "express";
import {
  signup,
  login,
  logout,
  verifyEmail,
  forgotPassword,
  resetPassword,
  checkAuth
} from "../controllers/auth.controller.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

router.get("/check-auth", verifyToken, checkAuth);
router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);

router.post("/verify-email", verifyEmail);
router.post("/forgot-password", forgotPassword);

// ✅ token harus di-decode agar aman dari karakter aneh
router.post("/reset-password/:token", (req, res, next) => {
  req.params.token = decodeURIComponent(req.params.token);
  next();
}, resetPassword);

export default router;
