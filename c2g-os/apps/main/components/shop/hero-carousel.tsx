"use client";

import { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import Link from "next/link";
import Image from "next/image";

export default function HeroCarousel({ products }: { products: any[] }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const nextSlide = useCallback(() => {
    if (!products?.length) return;
    setCurrentSlide((prev) => (prev + 1) % products.length);
  }, [products]);

  const prevSlide = useCallback(() => {
    if (!products?.length) return;
    setCurrentSlide((prev) => (prev - 1 + products.length) % products.length);
  }, [products]);

  useEffect(() => {
    if (!isAutoPlaying || !products?.length) return;
    const timer = setInterval(nextSlide, 5000);
    return () => clearInterval(timer);
  }, [isAutoPlaying, nextSlide, products]);

  if (!products || products.length === 0) return null;

  return (
    <div
      className="relative w-full overflow-hidden rounded-[2rem] shadow-2xl"
      onMouseEnter={() => setIsAutoPlaying(false)}
      onMouseLeave={() => setIsAutoPlaying(true)}
    >
      {/* Slides */}
      <div
        className="flex transition-transform duration-700 ease-in-out"
        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
      >
        {products.map((product, index) => {
          const images = product.product_images?.filter((img: any) => img.media_type !== "video") || [];
          const primaryImage = images.find((img: any) => img.is_primary) || images[0] || product.product_images?.[0];
          const imageUrl = primaryImage?.image_url || "https://placehold.co/400x400/1a1a2e/6c757d?text=No+Image";

          return (
            <Link
              key={product.id}
              href={`/shop/product/${product.id}`}
              className="w-full shrink-0 relative h-[180px] sm:h-[300px] md:h-[360px] flex items-center justify-between px-2 sm:px-16 overflow-hidden group"
            >
              {/* Dynamic Dominant Color Background */}
              <div className="absolute inset-0 w-full h-full z-0 overflow-hidden">
                {/* Scaled & massively blurred image to bleed colors natively */}
                <Image 
                  src={imageUrl} 
                  alt="" 
                  fill 
                  className="object-cover scale-[2] blur-3xl opacity-70"
                />
                {/* Black to Transparent gradient to ensure text readability */}
                <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/70 to-background/20" />
              </div>
              {/* Decorative elements */}
              <div className="absolute inset-0 opacity-20 z-0">
                <div className="absolute top-8 left-8 w-32 h-32 rounded-full bg-white/20 blur-3xl" />
                <div className="absolute bottom-8 right-16 w-48 h-48 rounded-full bg-white/10 blur-3xl" />
              </div>

              <div className="relative z-10 w-3/5 sm:max-w-lg flex-1 py-4 sm:py-8 pl-4 sm:pl-0">
                <span className="inline-block px-2 sm:px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-white text-[10px] sm:text-xs font-bold uppercase tracking-wider mb-2 sm:mb-4 border border-white/30">
                  #{index + 1} Best Seller
                </span>
                <h2 className="text-xl sm:text-3xl md:text-5xl font-black text-white mb-2 sm:mb-4 drop-shadow-lg leading-tight line-clamp-2 sm:line-clamp-3">
                  {product.name}
                </h2>
                <div className="inline-flex items-center px-4 sm:px-6 py-2 sm:py-3 bg-white text-gray-900 rounded-full font-black text-xs sm:text-sm shadow-xl group-hover:scale-105 transition-transform">
                  Shop Now
                </div>
              </div>

              <div className="relative z-10 w-2/5 sm:w-1/3 h-full flex items-center justify-center py-4 pr-4 sm:p-8 ml-auto">
                <div className="relative w-full aspect-square max-w-[120px] sm:max-w-[280px] rounded-xl sm:rounded-2xl overflow-hidden shadow-2xl transform rotate-3 group-hover:rotate-0 transition-transform duration-500 border-2 sm:border-4 border-white/20">
                  <Image src={imageUrl} alt={product.name} fill className="object-cover" />
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Arrow Buttons */}
      <button
        onClick={prevSlide}
        className="hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 backdrop-blur-md text-white items-center justify-center hover:bg-black/60 transition-colors z-10 border border-white/10"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      <button
        onClick={nextSlide}
        className="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 backdrop-blur-md text-white items-center justify-center hover:bg-black/60 transition-colors z-10 border border-white/10"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Dots */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 z-10">
        {products.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentSlide(i)}
            className={`h-2 rounded-full transition-all duration-300 ${
              i === currentSlide
                ? "bg-white w-8"
                : "bg-white/40 w-2 hover:bg-white/60"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
