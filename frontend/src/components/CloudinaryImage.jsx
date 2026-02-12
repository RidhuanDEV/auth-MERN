import React from "react";

const CloudinaryImage = ({
  src,
  alt = "Image",
  width = "auto",
  height = "auto",
  className = "",
  fallback = "No image",
  ...props
}) => {
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState(false);

  if (!src) {
    return (
      <div
        className={`${className} flex items-center justify-center bg-gray-700 rounded`}
      >
        <span className="text-gray-400 text-sm">{fallback}</span>
      </div>
    );
  }

  return (
    <div className="relative">
      {isLoading && (
        <div className={`${className} bg-gray-700 animate-pulse rounded`} />
      )}
      {error && (
        <div
          className={`${className} bg-gray-700 flex items-center justify-center rounded`}
        >
          <span className="text-gray-400 text-sm">Failed to load image</span>
        </div>
      )}
      <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        className={`${className} ${isLoading || error ? "hidden" : ""}`}
        onLoad={() => setIsLoading(false)}
        onError={() => {
          setIsLoading(false);
          setError(true);
        }}
        {...props}
      />
    </div>
  );
};

export default CloudinaryImage;
