import mongoose from "mongoose";

mongoose.set("strictQuery", true);

const aboutSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
      unique: true,
      index: true,
    },
    self_description: {
      type: [String],
      required: true,
      trim: true,
    },
    people_title: {
      type: [String],
      required: true,
      trim: true,
    },
    people_opinion: {
      type: [String],
      required: true,
      trim: true,
    },
    people_url: {
      type: [String],
      required: true,
      trim: true,
    },
    experience_title: {
      type: [String],
      required: true,
      trim: true,
    },
    experience_location: {
      type: [String],
      required: true,
      trim: true,
    },
    experience_desc: {
      type: [String],
      required: true,
      trim: true,
    },
    experience_time: {
      type: [String],
      required: true,
      trim: true,
    },
    tools_name: {
      type: [String],
      required: true,
      trim: true,
    },
    tools_icon: {
      type: [String],
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const About = mongoose.model("about", aboutSchema);

export { About };

// Note: For Cloudinary integration:
// - people_url: stores Cloudinary image URLs for testimonial photos
// - tools_icon: stores Cloudinary icon/image URLs for tools & skills
