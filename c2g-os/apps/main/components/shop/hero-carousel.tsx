"use client";

import { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const BANNERS = [
  {
    id: 1,
    title: "New Arrivals",
    subtitle: "Fresh products just landed from China",
    gradient: "from-violet-600 via-purple-600 to-indigo-700",
    emoji: "✨",
    cta: "Shop Now",
    href: "/shop?sort=newest",
  },
  {
    id: 2,
    title: "Sea Shipment Deals",
    subtitle: "Save big on bulk orders with sea freight",
    gradient: "from-emerald-600 via-teal-600 to-cyan-700",
    emoji: "🚢",
    cta: "Explore Deals",
    href: "/shop?category=home",
  },
  {
    id: 3,
    title: "Trending Products",
    subtitle: "The hottest items everyone is buying right now",
    gradient: "from-orange-500 via-red-500 to-pink-600",
    emoji: "🔥",
    cta: "See Trending",
    href: "/shop?sort=trending",
  },
  {
    id: 4,
    title: "Importer Specials",
    subtitle: "Exclusive deals from top Ghanaian importers",
    gradient: "from-blue-600 via-blue-700 to-indigo-800",
    emoji: "🇬🇭",
    cta: "Browse Specials",
    href: "/shop?sort=popular",
  },
];

export default function HeroCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % BANNERS.length);
  }, []);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + BANNERS.length) % BANNERS.length);
  }, []);

  useEffect(() => {
    if (!isAutoPlaying) return;
    const timer = setInterval(nextSlide, 5000);
    return () => clearInterval(timer);
  }, [isAutoPlaying, nextSlide]);

  return (
    <div
      className="relative w-full overflow-hidden rounded-none md:rounded-2xl"
      onMouseEnter={() => setIsAutoPlaying(false)}
      onMouseLeave={() => setIsAutoPlaying(true)}
    >
      {/* Slides */}
      <div
        className="flex transition-transform duration-700 ease-in-out"
        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
      >
        {BANNERS.map((banner) => (
          <div
            key={banner.id}
            className={`w-full shrink-0 bg-gradient-to-br ${banner.gradient} relative h-[200px] sm:h-[260px] md:h-[340px] flex items-center justify-center`}
          >
            {/* Decorative elements */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-8 left-8 w-32 h-32 rounded-full bg-white/20 blur-3xl" />
              <div className="absolute bottom-8 right-16 w-48 h-48 rounded-full bg-white/10 blur-3xl" />
            </div>

            <div className="relative z-10 text-center px-6 max-w-xl mx-auto">
              <span className="text-4xl md:text-5xl mb-3 block">{banner.emoji}</span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white mb-2 drop-shadow-lg">
                {banner.title}
              </h2>
              <p className="text-white/80 text-sm md:text-base mb-5 max-w-md mx-auto">
                {banner.subtitle}
              </p>
              <a
                href={banner.href}
                className="inline-flex items-center px-6 py-2.5 bg-white text-gray-900 rounded-full font-bold text-sm shadow-xl hover:scale-105 transition-transform"
              >
                {banner.cta}
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* Arrow Buttons */}
      <button
        onClick={prevSlide}
        className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/30 backdrop-blur-md text-white flex items-center justify-center hover:bg-black/50 transition-colors z-10"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/30 backdrop-blur-md text-white flex items-center justify-center hover:bg-black/50 transition-colors z-10"
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      {/* Dots */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 z-10">
        {BANNERS.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentSlide(i)}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              i === currentSlide
                ? "bg-white w-8"
                : "bg-white/40 w-1.5 hover:bg-white/60"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
