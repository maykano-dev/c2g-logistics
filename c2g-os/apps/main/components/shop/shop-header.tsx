"use client";

import { Search, ShoppingCart, User, X, Heart } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useCallback } from "react";
import { useCart } from "./cart-context";
import { useWishlist } from "./wishlist-context";

export default function ShopHeader() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentQuery = searchParams.get("query") || "";
  const [query, setQuery] = useState(currentQuery);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const { cartCount } = useCart();
  const { wishlistCount } = useWishlist();

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(name, value);
      } else {
        params.delete(name);
      }
      return params.toString();
    },
    [searchParams]
  );

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    router.push("/shop?" + createQueryString("query", query));
  };

  const clearSearch = () => {
    setQuery("");
    router.push("/shop");
  };

  return (
    <div className="fixed top-0 inset-x-0 z-[100] bg-background/95 backdrop-blur-xl border-b border-border/50 shadow-lg shadow-black/5">
      {/* Top bar: Logo + Search + Cart */}
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center gap-3 h-14 md:h-16">
          {/* Logo */}
          <Link href="/shop" className="flex items-center gap-2 shrink-0">
            <div className="w-8 h-8 relative flex items-center justify-center">
              <Image src="/logo.png" alt="C2G Mall Logo" fill sizes="32px" className="object-contain" />
            </div>
            <span className="font-bold text-lg hidden sm:block">C2G Mall</span>
          </Link>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="flex-1 relative max-w-2xl mx-auto">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-muted-foreground pointer-events-none" />
            <input
              type="text"
              placeholder="Search products, categories..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setIsSearchFocused(false)}
              className={`w-full h-10 md:h-11 rounded-full border bg-secondary/50 pl-10 pr-10 text-sm focus:outline-none transition-all ${
                isSearchFocused
                  ? "border-primary ring-2 ring-primary/20 bg-background"
                  : "border-border/50"
              }`}
            />
            {query && (
              <button
                type="button"
                onClick={clearSearch}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-secondary transition-colors"
              >
                <X className="w-3.5 h-3.5 text-muted-foreground" />
              </button>
            )}
          </form>

          {/* Cart + Wishlist + Account */}
          <div className="flex items-center gap-1">
            <Link
              href="/wishlist"
              className="relative p-2.5 rounded-full hover:bg-secondary transition-colors hidden sm:flex"
              title="Wishlist"
            >
              <Heart className="w-5 h-5" />
              {wishlistCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-primary text-primary-foreground rounded-full text-[10px] font-bold flex items-center justify-center shadow-lg animate-in zoom-in-50">
                  {wishlistCount > 99 ? "99+" : wishlistCount}
                </span>
              )}
            </Link>
            <Link
              href="/cart"
              className="relative p-2.5 rounded-full hover:bg-secondary transition-colors"
              title="Cart"
            >
              <ShoppingCart className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-primary text-primary-foreground rounded-full text-[10px] font-bold flex items-center justify-center shadow-lg animate-in zoom-in-50">
                  {cartCount > 99 ? "99+" : cartCount}
                </span>
              )}
            </Link>
            <Link
              href="/dashboard"
              className="p-2.5 rounded-full hover:bg-secondary transition-colors hidden sm:flex"
              title="Account"
            >
              <User className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
