import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { generateTokenAndSetCookie } from "../utils/generateTokenAndSetCookie.js";
import { sendVerificationEmail } from "../mailtrap/emails.js";
import { sendWelcomeEmail } from "../mailtrap/emails.js";
import crypto from "crypto";
import {
  sendPasswordResetEmail,
  sendResetSuccessEmail,
} from "../mailtrap/emails.js";
import { sanitizeUser } from "../utils/sanitizeUser.js";
import dotenv from "dotenv";

dotenv.config();

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Validates password strength
 * @param {string} password
 * @returns {object} { isValid, errors }
 */
const validatePassword = (password) => {
  const errors = [];
  
  if (password.length < 8) {
    errors.push("Password must be at least 8 characters long");
  }
  if (!/[A-Z]/.test(password)) {
    errors.push("Password must contain at least one uppercase letter");
  }
  if (!/[a-z]/.test(password)) {
    errors.push("Password must contain at least one lowercase letter");
  }
  if (!/[0-9]/.test(password)) {
    errors.push("Password must contain at least one number");
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * Generates a random verification code
 * @returns {string} 6-digit verification code
 */
const generateVerificationCode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

/**
 * Logs auth events for security auditing
 * @param {string} event
 * @param {string} email
 * @param {string} status
 * @param {string} details
 */
const logAuthEvent = (event, email, status, details = "") => {
  const timestamp = new Date().toISOString();
  console.log(`[AUTH] ${timestamp} | ${event} | ${email} | ${status} ${details}`);
};

// ============================================================================
// AUTHENTICATION ENDPOINTS
// ============================================================================

/**
 * POST /auth/signup
 * Register a new user account
 */
export const signup = async (req, res) => {
  const { email, password, name } = req.body;
  
  try {
    // ✅ Input validation
    if (!email || !password || !name) {
      return res.status(400).json({
        success: false,
        message: "Email, password, and name are required",
        code: "MISSING_FIELDS",
      });
    }

    // ✅ Trim and validate inputs
    const trimmedEmail = email.trim().toLowerCase();
    const trimmedName = name.trim();

    if (trimmedEmail.length > 255 || trimmedName.length > 100) {
      return res.status(400).json({
        success: false,
        message: "Email or name is too long",
        code: "INVALID_INPUT",
      });
    }

    // ✅ Validate password strength
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      return res.status(400).json({
        success: false,
        message: "Password does not meet security requirements",
        errors: passwordValidation.errors,
        code: "WEAK_PASSWORD",
      });
    }

    // ✅ Check if user already exists
    const userAlreadyExists = await User.findOne({ email: trimmedEmail });
    if (userAlreadyExists) {
      logAuthEvent("SIGNUP", email, "FAILED", "- user already exists");
      return res.status(409).json({
        success: false,
        message: "Email already registered",
        code: "EMAIL_EXISTS",
      });
    }

    // ✅ Hash password with strong rounds
    const hashedPassword = await bcrypt.hash(password, 12);

    // ✅ Generate secure verification token
    const verificationToken = generateVerificationCode();
    const verificationTokenExpiresAt = Date.now() + 24 * 60 * 60 * 1000; // 24 hours

    // ✅ Create new user
    const user = new User({
      email: trimmedEmail,
      password: hashedPassword,
      name: trimmedName,
      verificationToken,
      verificationTokenExpiresAt,
      // Auto-verify in development mode for testing
      isVerified: process.env.NODE_ENV === "development",
    });

    await user.save();

    // ✅ Set JWT token
    generateTokenAndSetCookie(res, user._id);

    // ✅ Send verification email (non-blocking)
    try {
      if (process.env.NODE_ENV !== "development") {
        await sendVerificationEmail(user.email, verificationToken);
      }
    } catch (emailError) {
      logAuthEvent("SIGNUP", email, "PARTIAL", "- email failed to send");
      console.error("Warning: Failed to send verification email:", emailError.message);
      // Don't fail signup if email fails in development
      if (process.env.NODE_ENV === "production") {
        throw emailError;
      }
    }

    logAuthEvent("SIGNUP", email, "SUCCESS");

    res.status(201).json({
      success: true,
      message: "Account created successfully. Please verify your email.",
      user: sanitizeUser(user),
    });
  } catch (error) {
    logAuthEvent("SIGNUP", email, "ERROR", `- ${error.message}`);
    
    // Handle duplicate key error
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "Email already in use",
        code: "EMAIL_EXISTS",
      });
    }

    console.error("Signup error:", error);

    res.status(500).json({
      success: false,
      message: "An error occurred during signup",
      code: "SIGNUP_ERROR",
    });
  }
};

/**
 * POST /auth/verify-email
 * Verify user's email with verification code
 */
export const verifyEmail = async (req, res) => {
  const { code } = req.body;
  
  try {
    if (!code) {
      return res.status(400).json({
        success: false,
        message: "Verification code is required",
        code: "MISSING_CODE",
      });
    }

    // ✅ Find user with valid token
    const user = await User.findOne({
      verificationToken: code,
      verificationTokenExpiresAt: { $gt: Date.now() },
    });

    if (!user) {
      logAuthEvent("VERIFY_EMAIL", "UNKNOWN", "FAILED", "- invalid or expired code");
      return res.status(400).json({
        success: false,
        message: "Invalid or expired verification code",
        code: "INVALID_CODE",
      });
    }

    // ✅ Mark email as verified
    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpiresAt = undefined;
    await user.save();

    // ✅ Send welcome email
    try {
      await sendWelcomeEmail(user.email, user.name);
    } catch (emailError) {
      console.error("Warning: Failed to send welcome email:", emailError.message);
    }

    logAuthEvent("VERIFY_EMAIL", user.email, "SUCCESS");

    res.status(200).json({
      success: true,
      message: "Email verified successfully",
      user: sanitizeUser(user),
    });
  } catch (error) {
    logAuthEvent("VERIFY_EMAIL", "UNKNOWN", "ERROR", `- ${error.message}`);
    console.error("Email verification error:", error);

    res.status(500).json({
      success: false,
      message: "Error verifying email",
      code: "VERIFY_ERROR",
    });
  }
};

/**
 * POST /auth/login
 * Authenticate user with email and password
 */
export const login = async (req, res) => {
  const { email, password } = req.body;
  
  try {
    // ✅ Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
        code: "MISSING_CREDENTIALS",
      });
    }

    const trimmedEmail = email.trim().toLowerCase();

    // ✅ Find user and verify password
    const user = await User.findOne({ email: trimmedEmail });

    // ✅ Use generic error to prevent user enumeration attacks
    if (!user || !(await bcrypt.compare(password, user.password))) {
      logAuthEvent("LOGIN", email, "FAILED", "- invalid credentials");
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
        code: "INVALID_CREDENTIALS",
      });
    }

    // ✅ Check if email is verified (in production)
    if (!user.isVerified && process.env.NODE_ENV === "production") {
      logAuthEvent("LOGIN", email, "FAILED", "- email not verified");
      return res.status(403).json({
        success: false,
        message: "Please verify your email first",
        code: "EMAIL_NOT_VERIFIED",
      });
    }

    // ✅ Generate and set token
    generateTokenAndSetCookie(res, user._id);
    
    // ✅ Update last login timestamp
    user.lastLogin = new Date();
    await user.save();

    logAuthEvent("LOGIN", email, "SUCCESS");

    res.status(200).json({
      success: true,
      message: "Login successful",
      user: sanitizeUser(user),
    });
  } catch (error) {
    logAuthEvent("LOGIN", email, "ERROR", `- ${error.message}`);
    console.error("Login error:", error);

    res.status(500).json({
      success: false,
      message: "An error occurred during login",
      code: "LOGIN_ERROR",
    });
  }
};

/**
 * POST /auth/logout
 * Logout user and clear authentication cookies
 */
export const logout = async (req, res) => {
  try {
    // ✅ Clear all authentication cookies
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      path: "/",
    });

    res.clearCookie("XSRF-TOKEN", {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      path: "/",
    });

    logAuthEvent("LOGOUT", "SYSTEM", "SUCCESS");

    res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    console.error("Logout error:", error);

    res.status(500).json({
      success: false,
      message: "An error occurred during logout",
      code: "LOGOUT_ERROR",
    });
  }
};

/**
 * POST /auth/forgot-password
 * Request password reset email
 */
export const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
        code: "MISSING_EMAIL",
      });
    }

    const trimmedEmail = email.trim().toLowerCase();
    const user = await User.findOne({ email: trimmedEmail });

    // ✅ SECURITY: Return generic message to prevent user enumeration
    const genericResponse = {
      success: true,
      message: "If an account exists, a password reset email will be sent to your inbox",
    };

    if (!user) {
      logAuthEvent("FORGOT_PASSWORD", email, "NOT_FOUND");
      return res.status(200).json(genericResponse);
    }

    // ✅ Generate secure reset token
    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenExpiresAt = Date.now() + 15 * 60 * 1000; // 15 minutes

    user.resetPasswordToken = resetToken;
    user.resetPasswordExpiresAt = resetTokenExpiresAt;
    await user.save();

    // ✅ Send reset email
    try {
      await sendPasswordResetEmail(
        user.email,
        `${process.env.CLIENT_URL}/reset-password/${resetToken}`
      );
      logAuthEvent("FORGOT_PASSWORD", email, "EMAIL_SENT");
    } catch (emailError) {
      console.error("Warning: Failed to send reset email:", emailError.message);
      // Still return success to not reveal if email exists
    }

    res.status(200).json(genericResponse);
  } catch (error) {
    console.error("Forgot password error:", error);

    res.status(500).json({
      success: true, // Keep true to not reveal errors
      message: "If an account exists, a password reset email will be sent to your inbox",
    });
  }
};

/**
 * POST /auth/reset-password/:token
 * Reset user password with valid reset token
 */
export const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    // ✅ Validate input
    if (!token || !password) {
      return res.status(400).json({
        success: false,
        message: "Reset token and password are required",
        code: "MISSING_DATA",
      });
    }

    // ✅ Validate password strength
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      return res.status(400).json({
        success: false,
        message: "Password does not meet security requirements",
        errors: passwordValidation.errors,
        code: "WEAK_PASSWORD",
      });
    }

    // ✅ Find user with valid reset token
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpiresAt: { $gt: Date.now() },
    });

    if (!user) {
      logAuthEvent("RESET_PASSWORD", "UNKNOWN", "FAILED", "- invalid or expired token");
      return res.status(400).json({
        success: false,
        message: "Invalid or expired reset token",
        code: "INVALID_TOKEN",
      });
    }

    // ✅ Hash new password
    user.password = await bcrypt.hash(password, 12);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpiresAt = undefined;
    
    // ✅ Force re-verification in production
    if (process.env.NODE_ENV === "production") {
      user.isVerified = false;
    }
    
    await user.save();

    // ✅ Send confirmation email
    try {
      await sendResetSuccessEmail(user.email);
    } catch (emailError) {
      console.error("Warning: Failed to send reset confirmation email:", emailError.message);
    }

    logAuthEvent("RESET_PASSWORD", user.email, "SUCCESS");

    res.status(200).json({
      success: true,
      message: "Password reset successfully. Please login with your new password.",
    });
  } catch (error) {
    console.error("Reset password error:", error);

    res.status(500).json({
      success: false,
      message: "An error occurred while resetting password",
      code: "RESET_ERROR",
    });
  }
};

/**
 * GET /auth/check-auth
 * Verify user is authenticated and return user data
 * Requires valid JWT token cookie
 */
export const checkAuth = async (req, res) => {
  try {
    // ✅ Ensure user ID exists (set by verifyToken middleware)
    if (!req.userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized - No valid token",
        code: "NO_TOKEN",
      });
    }

    // ✅ Fetch user with excluded sensitive fields
    const user = await User.findById(req.userId).select(
      "-password -verificationToken -verificationTokenExpiresAt -resetPasswordToken -resetPasswordExpiresAt -__v -updatedAt"
    );

    if (!user) {
      logAuthEvent("CHECK_AUTH", req.userId, "FAILED", "- user not found");
      return res.status(404).json({
        success: false,
        message: "User not found",
        code: "USER_NOT_FOUND",
      });
    }

    res.status(200).json({
      success: true,
      user: sanitizeUser(user),
    });
  } catch (error) {
    console.error("Auth check error:", error);

    res.status(500).json({
      success: false,
      message: "Authentication check failed",
      code: "AUTH_CHECK_ERROR",
    });
    
  }
};
