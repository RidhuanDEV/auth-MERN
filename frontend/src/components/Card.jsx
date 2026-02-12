import React from "react";

/**
 * Minimal Card component: hanya gambar dan deskripsi.
 * Props:
 * - imageSrc: string (required) - URL gambar
 * - imageAlt: string (optional)
 * - description: string (optional)
 *
 * No links, no title, no children — sesuai permintaan.
 */
const Card = ({ imageSrc, imageAlt = "image", description = "" }) => {
  return (
    <div className="bg-gray-800 rounded-lg overflow-hidden shadow-md max-w-md w-full">
      {imageSrc && (
        <div className="w-full h-32 lg:h-56 bg-gray-100 overflow-hidden">
          <img
            src={imageSrc}
            alt={imageAlt}
            className="object-cover w-full h-full"
            loading="lazy"
          />
        </div>
      )}

      {description ? (
        <div className="py-4 px-2 text-center">
          <p className="text-green-400 text-sm font-medium">{description}</p>
        </div>
      ) : null}
    </div>
  );
};

export default Card;
