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
import dotenv from "dotenv";

dotenv.config();

// Feature flag: when true, users must verify email to activate account.
// When false, signup will auto-verify the user but password-reset endpoints
// are disabled (per project requirement).
const EMAIL_VERIFICATION_ENABLED =
  process.env.EMAIL_VERIFICATION_ENABLED !== undefined
    ? process.env.EMAIL_VERIFICATION_ENABLED === "true"
    : true;

export const signup = async (req, res) => {
  const { email, password, name } = req.body;
  try {
    if (!email || !password || !name) {
      throw new Error("All fields are required");
    }

    const userAlreadyExists = await User.findOne({ email });
    if (userAlreadyExists) {
      return res
        .status(400)
        .json({ success: false, messsage: "User Already Exists!" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // If email verification is enabled, create a verification token and
    // mark user as unverified. If disabled, auto-verify the account and
    // do not generate/send verification token.
    let userPayload = {
      email,
      password: hashedPassword,
      name,
      isVerified: !EMAIL_VERIFICATION_ENABLED, // auto-verify when feature is off
    };

    if (EMAIL_VERIFICATION_ENABLED) {
      const verificationToken = Math.floor(
        100000 + Math.random() * 900000,
      ).toString();
      userPayload.verificationToken = verificationToken;
      userPayload.verificationTokenExpiresAt = Date.now() + 24 * 60 * 60 * 1000;
    }

    const user = new User(userPayload);
    await user.save();

    // jwt cookie
    generateTokenAndSetCookie(res, user._id);

    // Send verification email only when feature enabled
    if (EMAIL_VERIFICATION_ENABLED) {
      try {
        await sendVerificationEmail(user.email, user.verificationToken);
      } catch (emailError) {
        console.warn(
          "Warning: verification email failed to send:",
          emailError.message,
        );
      }
    }

    // Remove verificationToken fields from response if verification disabled
    let userResponse = { ...user._doc, password: undefined };
    if (!EMAIL_VERIFICATION_ENABLED) {
      userResponse.isVerified = true;
      userResponse.verificationToken = undefined;
      userResponse.verificationTokenExpiresAt = undefined;
    }
    res.status(201).json({
      success: true,
      message: EMAIL_VERIFICATION_ENABLED
        ? "Account created — please verify your email."
        : "Account created (email verification disabled, you are already verified).",
      user: userResponse,
    });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};

export const verifyEmail = async (req, res) => {
  if (!EMAIL_VERIFICATION_ENABLED) {
    return res.status(400).json({
      success: false,
      message: "Email verification is disabled by configuration",
    });
  }

  const { code } = req.body;
  try {
    const user = await User.findOne({
      verificationToken: code,
      verificationTokenExpiresAt: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired verification code",
      });
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpiresAt = undefined;
    await user.save();

    await sendWelcomeEmail(user.email, user.name);
    res.status(200).json({
      success: true,
      message: "Email verified successfully",
      user: { ...user._doc, password: undefined },
    });
  } catch (error) {
    console.error("verifyEmail error:", error);
    res.status(500).json({ success: false, message: "Verification failed" });
  }
};

export const login = async (req, res) => {
  // handle login logic
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ success: false, message: "Invalid email" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid Password" });
    }

    // Enforce email verification only when feature is enabled
    if (EMAIL_VERIFICATION_ENABLED && !user.isVerified) {
      return res.status(403).json({
        success: false,
        message: "Please verify your email before logging in",
      });
    }

    generateTokenAndSetCookie(res, user._id);

    user.lastLogin = new Date();
    await user.save();

    res.status(200).json({
      success: true,
      message: "Login successful",
      user: { ...user._doc, password: undefined },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const logout = async (req, res) => {
  //handle logout logic
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // HTTPS di production
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    path: "/", // path wajib sama seperti saat set cookie
  });

  res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
};

export const forgotPassword = async (req, res) => {
  // Password reset is disabled when email verification feature is off
  if (!EMAIL_VERIFICATION_ENABLED) {
    return res.status(403).json({
      success: false,
      message:
        "Password reset is disabled because email verification is turned off",
    });
  }

  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // generate reset token
    const resetToken = crypto.randomBytes(20).toString("hex");
    const resetTokenExpiresAt = Date.now() + 15 * 60 * 1000; // 15 minutes

    user.resetPasswordToken = resetToken;
    user.resetPasswordExpiresAt = resetTokenExpiresAt;

    await user.save();

    await sendPasswordResetEmail(
      user.email,
      `${process.env.CLIENT_URL}/reset-password/${resetToken}`,
    );
    res
      .status(200)
      .json({ success: true, message: "Password reset email sent" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const resetPassword = async (req, res) => {
  // Disallow reset when email verification is off
  if (!EMAIL_VERIFICATION_ENABLED) {
    return res.status(403).json({
      success: false,
      message:
        "Password reset is disabled because email verification is turned off",
    });
  }

  try {
    const { token } = req.params; // <-- fix here
    const { password } = req.body;

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpiresAt: { $gt: Date.now() }, // gt means greater than (date.now)
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired reset token",
      });
    }

    user.password = await bcrypt.hash(password, 10);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpiresAt = undefined;
    await user.save();

    await sendResetSuccessEmail(user.email);

    res.status(200).json({
      success: true,
      message: "Password reset successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const checkAuth = async (req, res) => {
  try {
    // Pastikan req.userId sudah ada (misal lewat middleware auth)
    if (!req.userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: No user ID found",
      });
    }

    const user = await User.findById(req.userId).select("-password");
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error occurred while checking authentication",
      error: error.message, // opsional, bisa dihapus di production
    });
  }
};
