import mongoose from "mongoose";

const homeSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
      unique: true,
      index: true,
    },
    hobbies: {
      type: [String],
      enum: [
        "UI/UX Designer",
        "Frontend Developer",
        "Backend Developer",
        "AI Engineer",
        "Mobile Developer",
        "Web Developer",
      ],
      default: [],
    },
    intro: { type: String, required: true, trim: true, default: null },
    profile_picture_url: {
      type: String,
      required: true,
      trim: true,
      default: null,
    },
    download_cv: { type: String, required: true, trim: true, default: null },
    facebook_url: { type: String, required: true, trim: true, default: null },
    instagram_url: { type: String, required: true, trim: true, default: null },
    linkedin_url: { type: String, required: true, trim: true, default: null },
    github_url: { type: String, required: true, trim: true, default: null },
    offer_title: {
      type: String,
      required: true,
      trim: true,
      default: null,
    },
    // Array of offers with image and description
    offers: {
      type: [
        {
          image_url: { type: String, required: true },
          description: { type: String, required: true },
        },
      ],
      validate: {
        validator: function (v) {
          return v.length <= 3;
        },
        message: "Offers hanya boleh berisi maksimal 3 item!",
      },
      default: [],
    },
    // Keep for backward compatibility
    offer_url: {
      type: [String],
      default: [],
    },
    description: { type: String, default: null },
  },
  { timestamps: true }
);

export const Home = mongoose.model("home", homeSchema);

// Note: For Cloudinary integration:
// - profile_picture_url: stores Cloudinary image URL
// - download_cv: stores Cloudinary PDF/file URL
// - offers[].image_url: stores Cloudinary image URL for each offer
// - All URLs (facebook_url, instagram_url, github_url, linkedin_url) remain as social media links
