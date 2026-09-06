"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import ReactCrop, { Crop, PixelCrop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import { Crop as CropIcon, Loader2, X, Search } from "lucide-react";
import { processImageSearch } from "../../app/shop/actions";
import { useModal } from "../providers/modal-provider";

export default function ImageCropSearch({ searchId }: { searchId: string }) {
  const router = useRouter();
  const { showAlert } = useModal();
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [isCropModalOpen, setIsCropModalOpen] = useState(false);
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    // Load the image from sessionStorage on mount
    try {
      const storedImage = sessionStorage.getItem(`c2g_search_image_${searchId}`);
      if (storedImage) {
        setImageBase64(storedImage);
      }
    } catch (e) {
      console.warn("Failed to read image from sessionStorage", e);
    }
  }, [searchId]);

  const getCroppedImg = useCallback(
    async (image: HTMLImageElement, crop: PixelCrop): Promise<string> => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("No 2d context");

      const scaleX = image.naturalWidth / image.width;
      const scaleY = image.naturalHeight / image.height;
      const pixelRatio = window.devicePixelRatio;

      canvas.width = Math.floor(crop.width * scaleX * pixelRatio);
      canvas.height = Math.floor(crop.height * scaleY * pixelRatio);

      ctx.scale(pixelRatio, pixelRatio);
      ctx.imageSmoothingQuality = "high";

      const cropX = crop.x * scaleX;
      const cropY = crop.y * scaleY;

      const centerX = image.naturalWidth / 2;
      const centerY = image.naturalHeight / 2;

      ctx.save();
      ctx.translate(-cropX, -cropY);
      ctx.drawImage(
        image,
        0,
        0,
        image.naturalWidth,
        image.naturalHeight,
        0,
        0,
        image.naturalWidth,
        image.naturalHeight
      );
      ctx.restore();

      return canvas.toDataURL("image/jpeg", 0.9);
    },
    []
  );

  const handleCropSearch = async () => {
    if (!completedCrop || !imgRef.current || !completedCrop.width || !completedCrop.height) {
      return;
    }

    setIsSearching(true);
    try {
      const croppedBase64 = await getCroppedImg(imgRef.current, completedCrop);
      const res = await processImageSearch(croppedBase64);

      if (res.success && res.searchId) {
        // Save the NEW cropped image to sessionStorage so they can crop that one too if they want
        try {
          sessionStorage.setItem(`c2g_search_image_${res.searchId}`, croppedBase64);
        } catch (e) {}
        
        setIsCropModalOpen(false);
        router.push(`/shop?searchId=${res.searchId}`);
      } else {
        showAlert({ title: "Error", message: res.error || "Search failed", type: "danger" });
      }
    } catch (err) {
      console.error(err);
      showAlert({ title: "Error", message: "Failed to process cropped image.", type: "danger" });
    } finally {
      setIsSearching(false);
    }
  };

  if (!imageBase64) return null;

  return (
    <>
      {/* Thumbnail UI */}
      <div className="flex items-center gap-3 mb-6 bg-card p-3 rounded-xl border border-border shadow-sm w-fit">
        <div 
          className="relative w-16 h-16 rounded-md overflow-hidden bg-secondary border border-border cursor-pointer group"
          onClick={() => setIsCropModalOpen(true)}
        >
          <img 
            src={imageBase64} 
            alt="Search Reference" 
            className="w-full h-full object-cover transition-transform group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <CropIcon className="w-5 h-5 text-white" />
          </div>
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-semibold">Visual Search</span>
          <button 
            onClick={() => setIsCropModalOpen(true)}
            className="text-xs text-primary hover:underline flex items-center gap-1 mt-0.5"
          >
            <CropIcon className="w-3 h-3" /> Adjust Crop Area
          </button>
        </div>
      </div>

      {/* Crop Modal */}
      {isCropModalOpen && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 sm:p-6 pb-[calc(1.5rem+env(safe-area-inset-bottom))] md:pb-6">
          <div 
            className="absolute inset-0 bg-background/80 backdrop-blur-sm"
            onClick={() => !isSearching && setIsCropModalOpen(false)}
          />
          <div className="relative bg-card w-full max-w-2xl rounded-2xl shadow-2xl border border-border overflow-hidden flex flex-col max-h-[75dvh]">
            
            <div className="flex items-center justify-between p-4 border-b border-border">
              <h3 className="font-bold flex items-center gap-2">
                <CropIcon className="w-5 h-5 text-primary" /> Adjust Focus Area
              </h3>
              <button 
                onClick={() => !isSearching && setIsCropModalOpen(false)}
                className="p-2 hover:bg-secondary rounded-full transition-colors"
                disabled={isSearching}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-auto p-4 flex items-center justify-center bg-secondary/30 min-h-[300px]">
              <ReactCrop
                crop={crop}
                onChange={(_, percentCrop) => setCrop(percentCrop)}
                onComplete={(c) => setCompletedCrop(c)}
                style={{ width: '100%', display: 'flex', justifyContent: 'center' }}
                className="max-h-[60vh]"
              >
                <img
                  ref={imgRef}
                  src={imageBase64}
                  alt="Crop preview"
                  className="w-full h-auto object-contain rounded-md touch-none"
                  style={{ maxHeight: '60vh', width: '100%' }}
                />
              </ReactCrop>
            </div>

            <div className="p-4 border-t border-border bg-card flex justify-end gap-3">
              <button
                onClick={() => setIsCropModalOpen(false)}
                className="px-4 py-2 rounded-lg font-medium text-sm hover:bg-secondary transition-colors"
                disabled={isSearching}
              >
                Cancel
              </button>
              <button
                onClick={handleCropSearch}
                disabled={isSearching || !completedCrop?.width}
                className="px-6 py-2 rounded-lg font-bold text-sm bg-primary text-primary-foreground hover:opacity-90 transition-opacity flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSearching ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /> Processing...</>
                ) : (
                  <><Search className="w-4 h-4" /> Search Selected Area</>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
