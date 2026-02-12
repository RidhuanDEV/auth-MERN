import { Proyek } from "../models/proyek.model.js";
import { User } from "../models/user.model.js";
import { uploadToCloudinary } from "../utils/cloudinary.utils.js";

// Get projects for authenticated user
export const getProyek = async (req, res) => {
  try {
    const userId = req.userId; // dari verifyToken middleware
    const proyek = await Proyek.find({ user: userId });
    res.status(200).json({
      success: true,
      data: proyek,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Get projects publicly by email (similar to home endpoint)
export const getPublicProyek = async (req, res) => {
  try {
    const { email } = req.query;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    // Cari user berdasarkan email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Fetch projects untuk user ini
    const proyek = await Proyek.find({ user: user._id });

    res.status(200).json({
      success: true,
      data: proyek,
    });
  } catch (error) {
    console.error("Error fetching projects:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export const createProyek = async (req, res) => {
  try {
    const userId = req.userId; // dari verifyToken middleware
    let projectData = {};

    console.log("Project - Received request body:", req.body);
    console.log("Project - Received files:", req.files);

    // Handle multipart form data
    if (req.body && typeof req.body === "object") {
      projectData.title = req.body.title;
      projectData.description = req.body.description;
      projectData.project_url = req.body.project_url;
    }

    // Handle file upload
    if (req.files && Array.isArray(req.files)) {
      const photoFile = req.files.find((file) => file.fieldname === "photo");
      if (photoFile) {
        const folder = req.body.photo_folder || "projects";
        console.log("Uploading project photo to folder:", folder);
        const result = await uploadToCloudinary(photoFile.path, folder);
        projectData.photo_url = result.url;
        console.log("Project photo uploaded:", result.url);
      }
    }

    console.log("Final project data:", projectData);

    const proyek = new Proyek({
      user: userId,
      ...projectData,
    });

    await proyek.save();
    res.status(201).json({
      success: true,
      message: "Project created successfully",
      data: proyek,
    });
  } catch (error) {
    console.error("Error creating project:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
