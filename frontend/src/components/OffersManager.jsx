import React, { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import FileInput from "./FileInput";
import toast from "react-hot-toast";

const OffersManager = ({ offers = [], onChange, maxOffers = 3 }) => {
  const [localOffers, setLocalOffers] = useState(
    offers.map((offer, idx) => ({
      id: idx,
      image_url: offer.image_url || "",
      description: offer.description || "",
      image_file: null,
      image_preview: offer.image_url || null,
    }))
  );

  const handleAddOffer = () => {
    if (localOffers.length >= maxOffers) {
      toast.error(`Maximum ${maxOffers} offers allowed`);
      return;
    }

    const newOffer = {
      id: Date.now(),
      image_url: "",
      description: "",
      image_file: null,
      image_preview: null,
    };

    const updated = [...localOffers, newOffer];
    setLocalOffers(updated);
    onChange(updated);
  };

  const handleRemoveOffer = (id) => {
    const updated = localOffers.filter((offer) => offer.id !== id);
    setLocalOffers(updated);
    onChange(updated);
  };

  const handleImageSelect = (id, fileData) => {
    if (!fileData) {
      // Clear image
      const updated = localOffers.map((offer) =>
        offer.id === id
          ? { ...offer, image_file: null, image_preview: null }
          : offer
      );
      setLocalOffers(updated);
      onChange(updated);
      return;
    }

    // Create preview for the selected file
    const reader = new FileReader();
    reader.onload = (event) => {
      const previewUrl = event.target.result;
      const updated = localOffers.map((offer) =>
        offer.id === id
          ? {
              ...offer,
              image_file: fileData.file,
              image_preview: previewUrl,
            }
          : offer
      );
      setLocalOffers(updated);
      onChange(updated);
    };
    reader.onerror = () => {
      toast.error("Failed to read file");
    };
    reader.readAsDataURL(fileData.file);
  };

  const handleDescriptionChange = (id, description) => {
    const updated = localOffers.map((offer) =>
      offer.id === id ? { ...offer, description } : offer
    );
    setLocalOffers(updated);
    onChange(updated);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <label className="block text-white font-medium">
          Offers ({localOffers.length}/{maxOffers})
        </label>
        <button
          type="button"
          onClick={handleAddOffer}
          disabled={localOffers.length >= maxOffers}
          className="flex items-center gap-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-600 cursor-pointer"
        >
          <Plus size={16} />
          Add Offer
        </button>
      </div>

      {localOffers.length === 0 ? (
        <p className="text-gray-400 text-sm">No offers added yet</p>
      ) : (
        <div className="space-y-4">
          {localOffers.map((offer, index) => (
            <div
              key={offer.id}
              className="bg-gray-800 p-4 rounded-lg border border-gray-700"
            >
              <div className="flex justify-between items-start mb-4">
                <h4 className="text-white font-medium">Offer {index + 1}</h4>
                <button
                  type="button"
                  onClick={() => handleRemoveOffer(offer.id)}
                  className="p-2 bg-red-600 text-white rounded-lg hover:bg-red-700 cursor-pointer"
                >
                  <Trash2 size={16} />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Image Upload */}
                <div>
                  {offer.image_preview ? (
                    <div className="relative">
                      <img
                        src={offer.image_preview}
                        alt={`Offer ${index + 1}`}
                        className="w-full h-40 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => handleImageSelect(offer.id, null)}
                        className="absolute top-2 right-2 px-2 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700"
                      >
                        Clear
                      </button>
                    </div>
                  ) : (
                    <div className="border-2 border-dashed border-gray-600 rounded-lg p-4">
                      <FileInput
                        label={`Offer Image ${index + 1}`}
                        onUpload={(url) => {
                          // File already uploaded to Cloudinary, just update offer with URL
                          const updated = localOffers.map((o) =>
                            o.id === offer.id
                              ? {
                                  ...o,
                                  image_url: url,
                                  image_preview: url, // Show the Cloudinary URL as preview
                                }
                              : o
                          );
                          setLocalOffers(updated);
                          onChange(updated);
                        }}
                        folder="offers"
                        accept="image/*"
                      />
                    </div>
                  )}
                </div>

                {/* Description */}
                <div>
                  <label className="block text-gray-300 font-medium mb-2">
                    Description
                  </label>
                  <textarea
                    value={offer.description}
                    onChange={(e) =>
                      handleDescriptionChange(offer.id, e.target.value)
                    }
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-green-500 resize-none"
                    rows="4"
                    placeholder="Describe this offer..."
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OffersManager;
