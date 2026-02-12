import mongoose from "mongoose";

mongoose.set("strictQuery", true);

const proyekSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
      index: true,
    },
    photo_url: {
      type: String,
      required: true,
      trim: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    project_url: {
      type: String,
      default: "",
      trim: true,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Proyek = mongoose.model("proyek", proyekSchema);

export { Proyek };

// Note: For Cloudinary integration:
// - photo_url: stores Cloudinary image URL for project preview/thumbnail
