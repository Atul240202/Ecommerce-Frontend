import { useState, useEffect } from "react";

interface ProductGalleryProps {
  images: string[];
  thumbnail: string;
  youtubeVid?: string;
  youtubeId?: string;
}

export function ProductGallery({
  images,
  thumbnail,
  youtubeVid,
  youtubeId,
}: ProductGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  const hasVideo = !!youtubeVid;
  const allItems = hasVideo
    ? [thumbnail, ...images, "__youtube__"]
    : [thumbnail, ...images];

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="flex gap-4">
      {/* Thumbnails */}
      <div className="flex flex-col gap-2">
        {allItems.map((item, index) => (
          <button
            key={index}
            className={`border-2 rounded-lg overflow-hidden ${
              selectedIndex === index ? "border-primary" : "border-gray-200"
            } ${isMobile ? "w-12 h-12" : "w-20 h-20"}`}
            onClick={() => setSelectedIndex(index)}
          >
            {item === "__youtube__" ? (
              <img
                src={`https://img.youtube.com/vi/${youtubeId}/mqdefault.jpg`}
                alt="Video thumbnail"
                className="object-cover w-full h-full"
              />
            ) : (
              <img
                src={item || "/placeholder.svg"}
                alt={`Product view ${index}`}
                className="object-cover w-full h-full"
              />
            )}
          </button>
        ))}
      </div>

      {/* Main Viewer */}
      <div className="flex-1 relative aspect-square rounded-lg overflow-hidden border border-gray-200">
        {hasVideo && allItems[selectedIndex] === "__youtube__" ? (
          <iframe
            src={`https://www.youtube.com/embed/${youtubeId}`}
            title="Product video"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full h-full"
          ></iframe>
        ) : (
          <img
            src={allItems[selectedIndex] || "/placeholder.svg"}
            alt="Product view"
            className="w-full h-full object-contain"
          />
        )}
      </div>
    </div>
  );
}
