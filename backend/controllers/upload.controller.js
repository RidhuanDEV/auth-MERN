import { uploadToCloudinary } from "../utils/cloudinary.utils.js";

export const uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded",
      });
    }

    const folder = req.body.folder || "other";

    const uploadResult = await uploadToCloudinary(req.file.path, folder);

    res.status(200).json({
      success: true,
      message: "File uploaded successfully",
      data: {
        url: uploadResult.url,
        publicId: uploadResult.publicId,
      },
    });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to upload file",
    });
  }
};
