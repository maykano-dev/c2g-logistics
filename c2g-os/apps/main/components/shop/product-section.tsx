"use client";

import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { useRef } from "react";

export default function ProductSection({
  title,
  emoji,
  href,
  children,
}: {
  title: string;
  emoji: string;
  href?: string;
  children: React.ReactNode;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 300, behavior: "smooth" });
    }
  };

  return (
    <section className="relative">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-4 px-1">
        <h2 className="text-lg sm:text-xl font-bold flex items-center gap-2">
          <span className="text-xl">{emoji}</span>
          {title}
        </h2>
        {href && (
          <Link
            href={href}
            className="text-xs sm:text-sm font-semibold text-primary hover:text-primary/80 flex items-center gap-0.5 transition-colors"
          >
            See All <ChevronRight className="w-4 h-4" />
          </Link>
        )}
      </div>

      {/* Horizontal Scroll Container */}
      <div className="relative group">
        <div
          ref={scrollRef}
          className="flex gap-3 md:gap-4 overflow-x-auto pb-2 scrollbar-hide snap-x snap-mandatory"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {children}
        </div>

        {/* Scroll Arrow (desktop) */}
        <button
          onClick={scrollRight}
          className="absolute right-0 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-background/90 border border-border shadow-xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10 hidden md:flex hover:bg-secondary"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </section>
  );
}
