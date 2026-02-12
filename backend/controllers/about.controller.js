import { About } from "../models/about.model.js";
import { User } from "../models/user.model.js";
import { uploadToCloudinary } from "../utils/cloudinary.utils.js";

// Get about data for authenticated user
export const getAbout = async (req, res) => {
  try {
    const userId = req.userId; // dari verifyToken middleware
    const about = await About.findOne({ user: userId });
    if (!about) {
      return res
        .status(404)
        .json({ success: false, message: "About not found" });
    }
    res.status(200).json({ success: true, data: about });
  } catch (error) {
    console.error("Error fetching about:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Get about data publicly by email
export const getPublicAbout = async (req, res) => {
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

    // Fetch about untuk user ini
    const about = await About.findOne({ user: user._id });

    if (!about) {
      return res.status(404).json({
        success: false,
        message: "About data not found",
      });
    }

    res.status(200).json({
      success: true,
      data: about,
    });
  } catch (error) {
    console.error("Error fetching public about:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// Create or update about data
export const createOrUpdateAbout = async (req, res) => {
  try {
    const userId = req.userId; // dari verifyToken middleware
    let updateData = {};

    console.log("About - Received request body:", req.body);
    console.log("About - Received files:", req.files);

    // Handle multipart form data
    if (req.body && typeof req.body === "object") {
      // Parse JSON strings back to objects
      if (req.body.self_description) {
        updateData.self_description = JSON.parse(req.body.self_description);
      }
      if (req.body.people_title) {
        updateData.people_title = JSON.parse(req.body.people_title);
      }
      if (req.body.people_opinion) {
        updateData.people_opinion = JSON.parse(req.body.people_opinion);
      }
      if (req.body.experience_title) {
        updateData.experience_title = JSON.parse(req.body.experience_title);
      }
      if (req.body.experience_location) {
        updateData.experience_location = JSON.parse(
          req.body.experience_location
        );
      }
      if (req.body.experience_desc) {
        updateData.experience_desc = JSON.parse(req.body.experience_desc);
      }
      if (req.body.experience_time) {
        updateData.experience_time = JSON.parse(req.body.experience_time);
      }
      if (req.body.tools_name) {
        updateData.tools_name = JSON.parse(req.body.tools_name);
      }
    }

    // Initialize arrays if not present
    updateData.people_url = updateData.people_url || [];
    updateData.tools_icon = updateData.tools_icon || [];

    // Handle file uploads
    if (req.files && Array.isArray(req.files)) {
      // Upload testimonial images
      const peopleImages = req.files.filter((file) =>
        file.fieldname.startsWith("people_image_")
      );
      for (const file of peopleImages) {
        const index = parseInt(file.fieldname.replace("people_image_", ""));
        const folder = req.body[`${file.fieldname}_folder`] || "testimonials";

        console.log(`Uploading testimonial image ${index} to folder:`, folder);
        const result = await uploadToCloudinary(file.path, folder);
        updateData.people_url[index] = result.url;
        console.log(`Testimonial image ${index} uploaded:`, result.url);
      }

      // Upload tool icons
      const toolIcons = req.files.filter((file) =>
        file.fieldname.startsWith("tool_icon_")
      );
      for (const file of toolIcons) {
        const index = parseInt(file.fieldname.replace("tool_icon_", ""));
        const folder = req.body[`${file.fieldname}_folder`] || "tools";

        console.log(`Uploading tool icon ${index} to folder:`, folder);
        const result = await uploadToCloudinary(file.path, folder);
        updateData.tools_icon[index] = result.url;
        console.log(`Tool icon ${index} uploaded:`, result.url);
      }
    }

    console.log("Final updateData:", updateData);

    // Create or update about data
    const about = await About.findOneAndUpdate({ user: userId }, updateData, {
      new: true,
      upsert: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      message: "About data saved successfully",
      data: about,
    });
  } catch (error) {
    console.error("Error saving about:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
