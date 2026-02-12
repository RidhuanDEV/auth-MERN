import cloudinary from "../config/cloudinary.config.js";
import fs from "fs";

export const uploadToCloudinary = async (filePath, folder = "portfolio") => {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder: `auth-mern/${folder}`,
      resource_type: "auto", // Auto-detect file type
    });

    // Delete the file from server after upload
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    return {
      success: true,
      url: result.secure_url,
      publicId: result.public_id,
    };
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    // Delete the file if upload fails
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
    throw new Error(`Upload failed: ${error.message}`);
  }
};

export const deleteFromCloudinary = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return {
      success: true,
      result,
    };
  } catch (error) {
    console.error("Cloudinary delete error:", error);
    throw new Error(`Delete failed: ${error.message}`);
  }
};
