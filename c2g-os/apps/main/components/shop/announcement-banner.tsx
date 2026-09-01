"use client";

import React from 'react';
import { Flame } from 'lucide-react';

export function AnnouncementBanner() {
  return (
    <div className="w-full bg-gradient-to-r from-blue-700 via-primary to-blue-700 text-white overflow-hidden py-1.5 relative z-[60] shadow-md border-b border-white/10">
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 20s linear infinite;
        }
      `}} />
      <div className="whitespace-nowrap animate-marquee flex items-center w-[200%] text-xs sm:text-sm font-black tracking-widest uppercase">
        {/* Repeating enough times to ensure seamless infinite scroll */}
        {[...Array(4)].map((_, i) => (
          <span key={i} className="flex items-center justify-center w-1/2">
            <span className="flex items-center gap-2 mx-4">
              <Flame className="w-4 h-4 text-orange-400" />
              C2G Mall: Africa's Version of 1688 — Shop Wholesale Direct From China!
              <Flame className="w-4 h-4 text-orange-400" />
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}
