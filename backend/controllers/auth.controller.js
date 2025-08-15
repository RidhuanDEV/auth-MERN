import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { generateTokenAndSetCookie } from "../utils/generateTokenAndSetCookie.js";
import { sendVerificationEmail } from "../mailtrap/emails.js";
import { sendWelcomeEmail } from "../mailtrap/emails.js";
import crypto from "crypto";
import { sendPasswordResetEmail, sendResetSuccessEmail } from "../mailtrap/emails.js";
import dotenv from "dotenv";

dotenv.config();

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
    const verificationToken = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    const user = new User({
      email,
      password: hashedPassword,
      name,
      verificationToken,
      verificationTokenExpiresAt: Date.now() + 24 * 60 * 60 * 1000,
    });

    await user.save();

    //jwt
    generateTokenAndSetCookie(res, user._id);

    await sendVerificationEmail(user.email, verificationToken)

    res.status(201).json({
      success: true,
      message: "User created Successfully!",
      user: {
        ...user._doc,
        password: undefined,
      },
    });
  } catch (e) {
      res.status(500).json({ success: false, message: e.message });
  }
};

export const verifyEmail = async (req,res) => {
    // 1-2-3-4-5-6
    const { code } = req.body;
    try {
        const user = await User.findOne({
            verificationToken: code,
            verificationTokenExpiresAt: { $gt: Date.now() }, // gt nean greater than (date.now)
        });

        if(!user){
            return res.status(400).json({
                success: false,
                message: "Invalid or expired verification code",
            })
        }
        user.isVerified = true;
        user.verificationToken = undefined;
        user.verificationTokenExpiresAt = undefined;
        await user.save();

        await sendWelcomeEmail(user.email, user.name)
        res.status(200).json({
            success: true,
            message: "Email verified successfully",
            user: {
                ...user._doc,
                password: undefined,
            },
        });
    } catch (error) {
        
    }
};

export const login = async (req, res) => {
  //handle login logic
  const { email, password } = req.body;
  try {
    const user = await User.findOne({
        email
    });
    if(!user) {
        return res.status(400).json({
            success: false,
            message: "Invalid email",
        });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if(!isPasswordValid) {
        return res.status(400).json({
            success : false,
            message : "Invalid Password"
        });
    }

    generateTokenAndSetCookie(res, user._id);

    user.lastLogin = new Date();
    await user.save();

    res.status(200).json({
        success: true,
        message: "Login successful",
        user: {
            ...user._doc,
            password: undefined,
        },
    });
    
  } catch (error) {
    res.status(500).json({
        success: false,
        message: error.message,
    });
  }
};

export const logout = async (req, res) => {
  //handle logout logic
  res.clearCookie("token");
  res.status(200).json({
      success: true,
      message: "Logged out successfully",
  });
};

export const forgotPassword = async (req, res) => {
  const { email} = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // generate reset token
    const resetToken = crypto.randomBytes(20).toString("hex");
    const resetTokenExpiresAt = Date.now() + 15 * 60 * 1000; // 15 minutes

    user.resetPasswordToken = resetToken;
    user.resetPasswordExpiresAt = resetTokenExpiresAt;

    await user.save();

    await sendPasswordResetEmail(user.email, `${process.env.CLIENT_URL}/reset-password/${resetToken}`);
    res.status(200).json({
      success: true,
      message: "Password reset email sent",
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

export const resetPassword = async (req,res) => {
  try {
     const { token } = req.params; // <-- fix here
    const { password } = req.body;

     const user = await User.findOne({
      resetPasswordToken : token,
      resetPasswordExpiresAt: { $gt: Date.now() }, // gt means greater than (date.now)
     })

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
}

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
      user
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error occurred while checking authentication",
      error: error.message, // opsional, bisa dihapus di production
    });
  }
};
