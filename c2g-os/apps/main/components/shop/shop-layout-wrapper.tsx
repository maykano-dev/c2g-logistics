"use client";

import { useState, useEffect } from "react";
import { Filter, X } from "lucide-react";
import ShopSidebar from "./shop-sidebar";
import { usePathname, useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";

export default function ShopLayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Close mobile filters when navigation occurs
  useEffect(() => {
    setIsMobileFiltersOpen(false);
  }, [pathname, searchParams]);

  // Lock body scroll when mobile filters are open
  useEffect(() => {
    if (isMobileFiltersOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMobileFiltersOpen]);

  return (
    <div className="max-w-7xl mx-auto px-4 w-full">
      {/* Mobile Filter Toggle Button (Rendered only on mobile) */}
      <div className="md:hidden py-4 flex justify-end sticky top-[56px] z-40 bg-background/95 backdrop-blur-md border-b border-border/50 -mx-4 px-4">
        <button
          onClick={() => setIsMobileFiltersOpen(true)}
          className="flex items-center gap-2 bg-secondary text-secondary-foreground px-4 py-2 rounded-full text-sm font-semibold hover:bg-secondary/80 transition-colors"
        >
          <Filter className="w-4 h-4" />
          Filters & Categories
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-8 py-6 md:py-8">
        {/* Desktop Sidebar (Hidden on mobile) */}
        <div className="hidden md:block w-64 shrink-0 sticky top-[80px] h-[calc(100vh-100px)] overflow-y-auto custom-scrollbar pr-4">
          <ShopSidebar />
        </div>

        {/* Mobile Filter Drawer */}
        <AnimatePresence>
          {isMobileFiltersOpen && (
            <>
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsMobileFiltersOpen(false)}
                className="fixed inset-0 bg-background/80 backdrop-blur-sm z-[110] md:hidden"
              />
              {/* Drawer */}
              <motion.div
                initial={{ x: "-100%" }}
                animate={{ x: 0 }}
                exit={{ x: "-100%" }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                className="fixed inset-y-0 left-0 w-[280px] sm:w-[320px] bg-background border-r border-border shadow-2xl z-[120] md:hidden flex flex-col"
              >
                <div className="flex items-center justify-between p-4 border-b border-border">
                  <h2 className="font-bold text-lg flex items-center gap-2">
                    <Filter className="w-5 h-5" /> Filters
                  </h2>
                  <button
                    onClick={() => setIsMobileFiltersOpen(false)}
                    className="p-2 rounded-full hover:bg-secondary transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
                  <ShopSidebar />
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Main Content Area */}
        <div className="flex-1 min-w-0">
          {children}
        </div>
      </div>
    </div>
  );
}
