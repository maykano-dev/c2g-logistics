"use client";

import { ShoppingCart, ArrowLeft, Heart, User, Search, X } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState, useCallback, useEffect } from "react";
import { useWishlist } from "./wishlist-context";

export default function StoreHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Extract store slug if we are in a store route
  const isStore = pathname.startsWith("/store/");
  const storeSlug = isStore ? pathname.split("/")[2] : null;

  const currentQuery = searchParams.get("query") || "";
  const [query, setQuery] = useState(currentQuery);
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  // Keep internal state in sync with URL
  useEffect(() => {
    setQuery(searchParams.get("query") || "");
  }, [searchParams]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams.toString());
    if (query) params.set("query", query);
    else params.delete("query");
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const clearSearch = () => {
    setQuery("");
    const params = new URLSearchParams(searchParams.toString());
    params.delete("query");
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const { getFilteredWishlist } = useWishlist();
  const storeWishlistCount = storeSlug ? getFilteredWishlist(storeSlug, "store").length : 0;

  return (
    <div className="fixed top-0 inset-x-0 z-[100] bg-background/95 backdrop-blur-xl border-b border-border/50 shadow-lg shadow-black/5 pt-[env(safe-area-inset-top)]">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center gap-3 h-14 md:h-16">
          
          {/* Left: Back / Logo */}
          <Link 
            href={storeSlug ? `/store/${storeSlug}` : "/"} 
            className="flex items-center gap-2 shrink-0 hover:opacity-80 transition-opacity"
          >
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-primary-foreground font-black text-lg">
              S
            </div>
            <span className="font-bold text-lg hidden sm:block">Storefront</span>
          </Link>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="flex-1 relative max-w-2xl mx-2 sm:mx-4 md:mx-auto">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            <input
              type="text"
              placeholder="Search products..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setIsSearchFocused(false)}
              className={`w-full h-9 md:h-11 rounded-full border bg-secondary/50 pl-9 pr-8 md:pl-10 md:pr-10 text-xs md:text-sm focus:outline-none transition-all ${
                isSearchFocused
                  ? "border-primary ring-2 ring-primary/20 bg-background"
                  : "border-border/50"
              }`}
            />
            {query && (
              <button
                type="button"
                onClick={clearSearch}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-secondary transition-colors"
              >
                <X className="w-3 h-3 md:w-3.5 md:h-3.5 text-muted-foreground" />
              </button>
            )}
          </form>

          {/* Right: Actions */}
          <div className="flex items-center gap-1 shrink-0 ml-auto">
            <Link
              href={storeSlug ? `/store/${storeSlug}/wishlist` : "/wishlist"}
              className="relative p-2.5 rounded-full hover:bg-secondary transition-colors"
              title="Store Wishlist"
            >
              <Heart className="w-5 h-5" />
              {storeWishlistCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-rose-500 text-white rounded-full text-[9px] font-bold flex items-center justify-center shadow-lg">
                  {storeWishlistCount}
                </span>
              )}
            </Link>

            <Link
              href={storeSlug ? `/store/${storeSlug}/cart` : "/cart"}
              className="relative p-2.5 rounded-full hover:bg-secondary transition-colors"
              title="Store Cart"
            >
              <ShoppingCart className="w-5 h-5" />
              {/* Isolated mock cart badge for the store */}
              <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-primary text-primary-foreground rounded-full text-[10px] font-bold flex items-center justify-center shadow-lg">
                0
              </span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
