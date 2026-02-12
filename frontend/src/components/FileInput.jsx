import React, { useState } from "react";
import { Upload, X } from "lucide-react";
import { getImagePreview } from "../utils/fileUpload";
import toast from "react-hot-toast";

const FileInput = ({
  label,
  onFileSelect,
  accept = "image/*",
  maxSize = 10, // MB
  existingImage = null, // URL of existing image to preview
}) => {
  const [preview, setPreview] = useState(existingImage);
  const fileInputRef = React.useRef(null);

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size
    if (file.size > maxSize * 1024 * 1024) {
      toast.error(`File size must be less than ${maxSize}MB`);
      return;
    }

    // Show preview
    if (accept === "image/*") {
      try {
        const previewUrl = await getImagePreview(file);
        setPreview(previewUrl);
      } catch (error) {
        console.error("Preview error:", error);
        toast.error("Failed to preview file: " + error.message);
        return;
      }
    } else {
      // For non-image files, just show file info
      setPreview(file);
    }

    // Return file object to parent instead of uploading
    if (onFileSelect) {
      onFileSelect(file);
    }
  };

  const handleClear = () => {
    setPreview(existingImage); // Reset to existing image if available
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    // Notify parent that file was cleared
    if (onFileSelect) {
      onFileSelect(null);
    }
  };

  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-gray-300">
          {label}
        </label>
      )}

      {preview ? (
        <div className="relative group border-2 border-gray-600 rounded-lg overflow-hidden">
          {accept === "image/*" ? (
            <img
              src={preview}
              alt="Preview"
              className="w-full h-40 object-cover"
            />
          ) : (
            <div className="w-full h-40 bg-gray-800 flex items-center justify-center">
              <div className="text-center text-gray-400">
                <Upload size={32} className="mx-auto mb-2" />
                <p className="text-sm">File selected</p>
                <p className="text-xs text-gray-500 mt-1">
                  {preview.name || "Unknown file"}
                </p>
              </div>
            </div>
          )}
          <button
            type="button"
            onClick={handleClear}
            className="absolute top-2 right-2 p-1 bg-red-600 rounded-full text-white hover:bg-red-700 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <X size={16} />
          </button>
          <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs p-2">
            Click to change {accept === "image/*" ? "image" : "file"}
          </div>
        </div>
      ) : (
        <label className="border-2 border-dashed border-gray-600 rounded-lg p-8 cursor-pointer hover:border-green-500 hover:bg-gray-800 transition-all duration-200 block">
          <input
            ref={fileInputRef}
            type="file"
            accept={accept}
            onChange={handleFileChange}
            className="hidden"
          />
          <div className="text-center">
            <Upload className="mx-auto mb-3 text-gray-400" size={32} />
            <p className="text-gray-300 text-sm font-medium mb-1">
              Click to upload or drag and drop
            </p>
            <p className="text-gray-500 text-xs">
              {accept === "image/*" ? "PNG, JPG, GIF, WebP" : "All files"} up to{" "}
              {maxSize}MB
            </p>
          </div>
        </label>
      )}
    </div>
  );
};

export default FileInput;
