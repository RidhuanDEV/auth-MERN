import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;
const API_BASE = API_URL.replace("/auth", "");

export const uploadFileToCloudinary = async (file, folder = "other") => {
  try {
    if (!file) {
      throw new Error("No file provided");
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", folder);

    const response = await axios.post(`${API_BASE}/upload`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      withCredentials: true,
    });

    if (response.data.success) {
      return {
        success: true,
        url: response.data.data.url,
        publicId: response.data.data.publicId,
      };
    } else {
      throw new Error(response.data.message || "Upload failed");
    }
  } catch (error) {
    console.error("Upload error:", error);
    throw error;
  }
};

// Preview image before upload
export const getImagePreview = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      resolve(e.target.result);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};
