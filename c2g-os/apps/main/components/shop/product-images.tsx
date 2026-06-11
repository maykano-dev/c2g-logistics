"use client";

import { useState } from "react";

export default function ProductImages({ images }: { images: any[] }) {
  const displayImages = images?.length > 0 
    ? images 
    : [{ image_url: "https://placehold.co/600x600/e9ecef/6c757d?text=No+Image" }];
    
  const primaryIndex = displayImages.findIndex(img => img.is_primary);
  const [activeIndex, setActiveIndex] = useState(primaryIndex >= 0 ? primaryIndex : 0);

  return (
    <div className="flex flex-col gap-4 sticky top-24">
      {/* Main Image */}
      <div className="aspect-square bg-secondary rounded-2xl overflow-hidden border border-border relative group">
        <img 
          src={displayImages[activeIndex]?.image_url} 
          alt="Product Image" 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>

      {/* Thumbnails */}
      {displayImages.length > 1 && (
        <div className="grid grid-cols-5 gap-3">
          {displayImages.map((img, idx) => (
            <button 
              key={idx}
              onClick={() => setActiveIndex(idx)}
              className={`aspect-square rounded-xl overflow-hidden border-2 transition-all ${
                activeIndex === idx ? "border-primary scale-105 shadow-md" : "border-transparent opacity-70 hover:opacity-100"
              }`}
            >
              <img src={img.image_url} alt="Thumbnail" className="w-full h-full object-cover bg-secondary" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
