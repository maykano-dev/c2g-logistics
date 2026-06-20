'use client';

import { useState, useEffect, useRef, ReactNode } from 'react';
import { RefreshCw } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface PullToRefreshProps {
  children: ReactNode;
  className?: string;
}

export default function PullToRefresh({ children, className = "" }: PullToRefreshProps) {
  const [startY, setStartY] = useState(0);
  const [currentY, setCurrentY] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isPulling, setIsPulling] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const PULL_THRESHOLD = 80;

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const handleTouchStart = (e: TouchEvent) => {
      if (el.scrollTop === 0 && e.touches[0]) {
        setStartY(e.touches[0].clientY);
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (el.scrollTop > 0 || startY === 0 || !e.touches[0]) return;
      
      const y = e.touches[0].clientY;
      const pullDistance = y - startY;

      if (pullDistance > 0) {
        setIsPulling(true);
        setCurrentY(Math.min(pullDistance * 0.5, PULL_THRESHOLD + 20)); // Add resistance
      }
    };

    const handleTouchEnd = async () => {
      if (!isPulling) return;

      if (currentY >= PULL_THRESHOLD) {
        setIsRefreshing(true);
        setCurrentY(PULL_THRESHOLD);
        
        // Trigger refresh
        router.refresh();
        
        // Fake delay to show spinner
        setTimeout(() => {
          setIsRefreshing(false);
          setCurrentY(0);
          setStartY(0);
          setIsPulling(false);
        }, 1000);
      } else {
        setCurrentY(0);
        setStartY(0);
        setIsPulling(false);
      }
    };

    el.addEventListener('touchstart', handleTouchStart, { passive: true });
    el.addEventListener('touchmove', handleTouchMove, { passive: true });
    el.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      el.removeEventListener('touchstart', handleTouchStart);
      el.removeEventListener('touchmove', handleTouchMove);
      el.removeEventListener('touchend', handleTouchEnd);
    };
  }, [startY, currentY, isPulling, router]);

  return (
    <div 
      ref={containerRef}
      className={`relative overflow-y-auto overflow-x-hidden overscroll-y-contain ${className}`}
    >
      {/* Refresh Indicator */}
      <div 
        className="absolute top-0 left-0 right-0 flex justify-center items-center z-50 pointer-events-none transition-transform duration-200"
        style={{ 
          transform: `translateY(${isRefreshing ? PULL_THRESHOLD / 2 : currentY / 2}px)`,
          opacity: Math.min(currentY / PULL_THRESHOLD, 1)
        }}
      >
        <div className="bg-background shadow-lg rounded-full p-2 border border-border/50">
          <RefreshCw 
            className={`w-5 h-5 text-primary ${isRefreshing ? 'animate-spin' : ''}`} 
            style={{ transform: `rotate(${currentY * 2}deg)` }}
          />
        </div>
      </div>

      {/* Content wrapper that slides down when pulled */}
      <div 
        className="flex-1 flex flex-col w-full transition-transform duration-200"
        style={{ transform: `translateY(${isRefreshing ? PULL_THRESHOLD / 2 : currentY / 2}px)` }}
      >
        {children}
      </div>
    </div>
  );
}
