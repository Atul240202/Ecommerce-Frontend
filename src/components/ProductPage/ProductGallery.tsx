"use client";

import type React from "react";

import { useState, useEffect, useRef } from "react";

interface ProductGalleryProps {
  images: string[];
  thumbnail: string;
  youtubeVid?: string;
  youtubeId?: string;
  zoomLevel?: number;
}

export function ProductGallery({
  images,
  thumbnail,
  youtubeVid,
  youtubeId,
  zoomLevel = 2.5,
}: ProductGalleryProps) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [showZoom, setShowZoom] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });
  const [isMobile, setIsMobile] = useState(false);

  const imageContainerRef = useRef<HTMLDivElement>(null);
  const zoomRef = useRef<HTMLDivElement>(null);

  const allImages = images;
  const hasVideo = !!youtubeVid || !!youtubeId;

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!imageContainerRef.current) return;

    const { left, top, width, height } =
      imageContainerRef.current.getBoundingClientRect();

    // Calculate relative position within the image container
    const x = (e.clientX - left) / width;
    const y = (e.clientY - top) / height;

    // Ensure values are within bounds (0 to 1)
    const boundedX = Math.max(0, Math.min(1, x));
    const boundedY = Math.max(0, Math.min(1, y));

    setZoomPosition({ x: boundedX, y: boundedY });
  };

  // Check if the current selected item is a video
  const isVideoSelected = hasVideo && selectedImage === allImages.length;

  return (
    <div className="flex gap-4">
      {/* Thumbnails */}
      <div className="flex flex-col gap-2">
        {allImages.map((image, index) => (
          <button
            key={index}
            className={`border-2 rounded-lg overflow-hidden w-20 h-20 ${
              selectedImage === index ? "border-primary" : "border-gray-200"
            }`}
            onClick={() => setSelectedImage(index)}
          >
            <img
              src={image || "/placeholder.svg"}
              alt={`Product view ${index + 1}`}
              width={80}
              height={80}
              className="object-cover w-full h-full"
            />
          </button>
        ))}

        {hasVideo && (
          <button
            className={`border-2 rounded-lg overflow-hidden w-20 h-20 ${
              selectedImage === allImages.length
                ? "border-primary"
                : "border-gray-200"
            }`}
            onClick={() => setSelectedImage(allImages.length)}
          >
            <div className="relative w-full h-full bg-gray-100 flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-gray-600"
              >
                <polygon points="5 3 19 12 5 21 5 3"></polygon>
              </svg>
            </div>
          </button>
        )}
      </div>

      {/* Main Image with Zoom */}
      <div className="flex-1 relative">
        <div
          ref={imageContainerRef}
          className="relative aspect-square rounded-lg overflow-hidden border border-gray-200"
          onMouseEnter={() => setShowZoom(true)}
          onMouseLeave={() => setShowZoom(false)}
          onMouseMove={handleMouseMove}
        >
          {isVideoSelected ? (
            <iframe
              src={`https://www.youtube.com/embed/${youtubeId}`}
              title="Product video"
              className="w-full h-full"
              allowFullScreen
            ></iframe>
          ) : (
            <img
              src={allImages[selectedImage] || "/placeholder.svg"}
              alt="Product main view"
              className="absolute inset-0 w-full h-full object-contain"
            />
          )}
        </div>

        {/* Zoom View (Fixed position) */}
        {showZoom && !isVideoSelected && !isMobile && (
          <div
            ref={zoomRef}
            className="fixed top-1/2 left-3/4 transform -translate-x-1/2 -translate-y-1/2 z-50 w-[500px] h-[500px] bg-white border border-gray-300 rounded-lg shadow-xl"
            style={{
              backgroundImage: `url(${
                allImages[selectedImage] || "/placeholder.svg"
              })`,
              backgroundPosition: `${zoomPosition.x * 100}% ${
                zoomPosition.y * 100
              }%`,
              backgroundSize: `${zoomLevel * 100}%`,
              backgroundRepeat: "no-repeat",
            }}
          >
            <button
              className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-md"
              onClick={() => setShowZoom(false)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
