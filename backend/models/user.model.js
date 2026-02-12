import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    username: {
      type: String,
      unique: true,
      sparse: true, // Allows multiple null values
    },
    password: {
      type: String,
      required: function () {
        return !this.ssoId;
      }, // Required ONLY if not SSO
    },
    name: {
      type: String,
      required: true,
    },
    ssoId: {
      type: String,
      default: null,
    },
    ssoProvider: {
      type: String,
      default: null,
    },
    lastLogin: {
      type: Date,
      default: Date.now,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    resetPasswordToken: String,
    resetPasswordExpiresAt: Date,
    verificationToken: String,
    verificationTokenExpiresAt: Date,
  },
  { timestamps: true },
);

export const User = mongoose.model("user", userSchema);
