"use client";

import { Search, ShoppingCart, User, X, Heart, Loader2, Camera, TrendingUp } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useCallback, useTransition, useRef, useEffect } from "react";
import { useCart } from "./cart-context";
import { useWishlist } from "./wishlist-context";
import { processImageSearch, processUrlParse, getSearchSuggestions } from "../../app/shop/actions";
import { useModal } from "../providers/modal-provider";

export default function ShopHeader({ walletBalance, isLoggedIn }: { walletBalance?: number, isLoggedIn?: boolean }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentQuery = searchParams.get("query") || "";
  const [query, setQuery] = useState(currentQuery);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const { cartCount } = useCart();
  const { wishlistCount } = useWishlist();
  const { showAlert } = useModal();

  const [suggestions, setSuggestions] = useState<string[]>([]);
  
  // Debounced search suggestions
  useEffect(() => {
    if (!query || query.trim().length < 2) {
      setSuggestions([]);
      return;
    }
    const timer = setTimeout(async () => {
      // Don't fetch if it looks like a URL
      if (/^https?:\/\//i.test(query) || query.includes('detail.1688.com') || query.includes('taobao.com')) {
        setSuggestions([]);
        return;
      }
      try {
        const res = await getSearchSuggestions(query);
        setSuggestions(res.suggestions || []);
      } catch (e) {
        console.error("Failed to fetch suggestions", e);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [query]);

  // Pre-cached popular search terms — clicking these costs 0 credits after first load
  const POPULAR_SEARCHES = [
    'Shoes', 'Dresses', 'Electronics', 'Beauty', 'Sneakers', 
    'Earbuds', 'Watches', 'Bags', 'Phone Cases', 'Jewelry',
    'Skincare', 'Fitness', 'Home Decor'
  ];

  const handleQuickSearch = (term: string) => {
    setQuery(term);
    setIsPending(true);
    const params = new URLSearchParams(searchParams.toString());
    params.set("query", term);
    params.delete("searchId");
    router.push("/shop?" + params.toString());
    setTimeout(() => setIsPending(false), 1000);
  };

  useEffect(() => {
    setQuery(searchParams.get("query") || "");
  }, [searchParams]);

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

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query) return;

    setIsPending(true);

    // Basic URL detection for Chinese marketplaces
    const isUrl = /^https?:\/\//i.test(query.trim()) || 
                  /^(?:m\.|detail\.)?(1688\.com|taobao\.com|weidian\.com|tmall\.com)/i.test(query.trim());

    if (isUrl) {
      let urlToParse = query.trim();
      if (!/^https?:\/\//i.test(urlToParse)) {
        urlToParse = `https://${urlToParse}`;
      }

      try {
        const res = await processUrlParse(urlToParse);
        if (res.success && res.productId) {
          router.push(`/shop/product/${res.productId}?channel=${res.channel || '1688'}`);
          setTimeout(() => setIsPending(false), 1000);
          return;
        } else {
          showAlert({ title: 'Link Error', message: res.error || "Could not extract a product from this link. Try searching by keywords instead.", type: 'danger' });
          setIsPending(false);
          return;
        }
      } catch (err) {
        console.error(err);
        showAlert({ title: 'Error', message: "Failed to parse product link.", type: 'danger' });
        setIsPending(false);
        return;
      }
    }

    const params = new URLSearchParams(searchParams.toString());
    params.set("query", query);
    // Clear visual search when performing a text search
    params.delete("searchId");
    router.push("/shop?" + params.toString());
    // Reset pending after a short delay since navigation will unmount or resolve
    setTimeout(() => setIsPending(false), 1000);
  };

  const clearSearch = () => {
    setQuery("");
    setIsPending(true);
    const params = new URLSearchParams(searchParams.toString());
    params.delete("query");
    params.delete("searchId");
    router.push("/shop?" + params.toString());
    setTimeout(() => setIsPending(false), 1000);
  };

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  const handleFile = (file: File) => {
    if (!isLoggedIn) {
      showAlert({ title: 'Login Required', message: 'Please log in or create an account to use the Image Search feature.', type: 'info' });
      return;
    }
    if (isUploadingImage) return;
    setIsUploadingImage(true);
    
    // Resize image client-side to save bandwidth
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new window.Image();
      img.onload = async () => {
        const canvas = document.createElement("canvas");
        const MAX_DIM = 600;
        let width = img.width;
        let height = img.height;

        if (width > height && width > MAX_DIM) {
          height *= MAX_DIM / width;
          width = MAX_DIM;
        } else if (height > MAX_DIM) {
          width *= MAX_DIM / height;
          height = MAX_DIM;
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx?.drawImage(img, 0, 0, width, height);

        const base64Data = canvas.toDataURL("image/jpeg", 0.7);

        try {
          const res = await processImageSearch(base64Data);
          if (res.success && res.searchId) {
            // Save the base64 image to sessionStorage before navigating
            try {
              sessionStorage.setItem(`c2g_search_image_${res.searchId}`, base64Data);
            } catch (storageError) {
              console.warn("Failed to save image to sessionStorage", storageError);
            }
            router.push(`/shop?searchId=${res.searchId}`);
          } else {
            showAlert({ title: 'Error', message: res.error || "Image search failed", type: 'danger' });
          }
        } catch (err) {
          console.error(err);
          showAlert({ title: 'Error', message: "An error occurred while uploading the image.", type: 'danger' });
        } finally {
          setIsUploadingImage(false);
          if (fileInputRef.current) fileInputRef.current.value = "";
        }
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  useEffect(() => {
    const handleGlobalPaste = (e: ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (!items) return;
      for (let i = 0; i < items.length; i++) {
        if (items[i]?.type.indexOf("image") !== -1) {
          e.preventDefault();
          const file = items[i]?.getAsFile();
          if (file) handleFile(file);
          break;
        }
      }
    };

    const handleGlobalDragOver = (e: DragEvent) => {
      e.preventDefault();
    };

    const handleGlobalDrop = (e: DragEvent) => {
      const items = e.dataTransfer?.items;
      if (!items) return;
      let hasImage = false;
      for (let i = 0; i < items.length; i++) {
        if (items[i]?.type.indexOf("image") !== -1) {
          hasImage = true;
          break;
        }
      }
      if (hasImage) {
        e.preventDefault();
        for (let i = 0; i < items.length; i++) {
          if (items[i]?.type.indexOf("image") !== -1) {
            const file = items[i]?.getAsFile();
            if (file) handleFile(file);
            break;
          }
        }
      }
    };

    window.addEventListener('paste', handleGlobalPaste);
    window.addEventListener('dragover', handleGlobalDragOver);
    window.addEventListener('drop', handleGlobalDrop);

    return () => {
      window.removeEventListener('paste', handleGlobalPaste);
      window.removeEventListener('dragover', handleGlobalDragOver);
      window.removeEventListener('drop', handleGlobalDrop);
    };
  }, [isUploadingImage]);

  return (
    <div className="sticky top-0 inset-x-0 z-[100] w-full bg-background/95 backdrop-blur-xl border-t-0 border-x-0 border-b border-border/50 shadow-lg shadow-black/5 pt-[env(safe-area-inset-top)]">
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
            {isPending ? (
              <Loader2 className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-primary animate-spin pointer-events-none" />
            ) : (
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-muted-foreground pointer-events-none" />
            )}
            
            <input
              type="text"
              placeholder="Search products, categories..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => {
                // Delay hiding so clicks on suggestions register before blur
                setTimeout(() => setIsSearchFocused(false), 200);
              }}
              className={`w-full h-10 md:h-11 rounded-full border bg-secondary/50 pl-10 pr-20 text-sm focus:outline-none transition-all ${
                isSearchFocused
                  ? "border-primary ring-2 ring-primary/20 bg-background"
                  : "border-border/50"
              }`}
            />
            
            {/* Auto-suggest Dropdown */}
            {isSearchFocused && suggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-background border border-border/50 rounded-xl shadow-xl shadow-black/5 overflow-hidden z-50">
                <div className="py-2">
                  <div className="px-4 py-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                    <TrendingUp className="w-3.5 h-3.5" /> Trending Searches
                  </div>
                  {suggestions.map((sug, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleQuickSearch(sug)}
                      className="w-full text-left px-4 py-2.5 text-sm hover:bg-secondary/50 transition-colors flex items-center gap-3 group"
                    >
                      <Search className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                      <span className="truncate">{sug}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
            
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
              {query && !isPending && (
                <button
                  type="button"
                  onClick={clearSearch}
                  className="p-1.5 rounded-full hover:bg-secondary transition-colors"
                >
                  <X className="w-3.5 h-3.5 text-muted-foreground" />
                </button>
              )}
              <button
                type="button"
                onClick={() => {
                  if (!isLoggedIn) {
                    showAlert({ title: 'Login Required', message: 'Please log in or create an account to use the Image Search feature.', type: 'info' });
                    return;
                  }
                  fileInputRef.current?.click();
                }}
                disabled={isUploadingImage}
                className="p-1.5 rounded-full hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground"
                title="Search by Image"
              >
                {isUploadingImage ? (
                  <Loader2 className="w-4 h-4 animate-spin text-primary" />
                ) : (
                  <Camera className="w-4 h-4" />
                )}
              </button>
            </div>
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              className="hidden"
              onChange={handleImageUpload}
            />
          </form>

          {/* Cart + Wishlist + Account */}
          <div className="flex items-center gap-1">
            {typeof walletBalance === 'number' && isLoggedIn && (
              <Link href="/dashboard/wallet" className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-tr from-primary/10 to-accent/10 border border-border hover:bg-white/10 transition-colors shadow-sm mr-2 min-w-0 max-w-[160px]">
                <span className="text-sm font-bold tracking-tight text-primary truncate">₵{new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(walletBalance)}</span>
              </Link>
            )}
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
            {isLoggedIn ? (
              <Link
                href="/dashboard"
                className="p-2.5 rounded-full hover:bg-secondary transition-colors hidden sm:flex"
                title="Account"
              >
                <User className="w-5 h-5" />
              </Link>
            ) : (
              <div className="hidden sm:flex items-center gap-2 ml-2">
                <Link
                  href="/login"
                  className="text-sm font-medium hover:text-primary transition-colors px-2"
                >
                  Log In
                </Link>
                <Link
                  href="/signup"
                  className="text-sm font-medium bg-primary text-primary-foreground px-4 py-1.5 rounded-full hover:bg-primary/90 transition-colors"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Popular Searches — only show when not actively searching */}
      {!currentQuery && (
        <div className="max-w-7xl mx-auto px-4 pb-2">
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide py-1">
            <TrendingUp className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
            {POPULAR_SEARCHES.map((term) => (
              <button
                key={term}
                type="button"
                onClick={() => handleQuickSearch(term.toLowerCase())}
                className="shrink-0 px-3 py-1 rounded-full text-xs font-medium bg-secondary/70 hover:bg-primary/10 hover:text-primary border border-border/50 hover:border-primary/30 transition-all whitespace-nowrap"
              >
                {term}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
