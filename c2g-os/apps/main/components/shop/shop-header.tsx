"use client";

import { Search, ShoppingCart, User, X, Heart, Loader2, Camera } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useCallback, useTransition, useRef, useEffect } from "react";
import { useCart } from "./cart-context";
import { useWishlist } from "./wishlist-context";
import { processImageSearch } from "../../app/shop/actions";

export default function ShopHeader({ walletBalance }: { walletBalance?: number }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentQuery = searchParams.get("query") || "";
  const [query, setQuery] = useState(currentQuery);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isPending, startTransition] = useTransition();
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
    startTransition(() => {
      router.push("/shop?" + createQueryString("query", query));
    });
  };

  const clearSearch = () => {
    setQuery("");
    startTransition(() => {
      router.push("/shop");
    });
  };

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  const handleFile = (file: File) => {
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
            router.push(`/shop?searchId=${res.searchId}`);
          } else {
            alert(res.error || "Image search failed");
          }
        } catch (err) {
          console.error(err);
          alert("An error occurred while uploading the image.");
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
    <div className="fixed top-0 inset-x-0 z-[100] bg-background/95 backdrop-blur-xl border-t-0 border-x-0 border-b border-border/50 shadow-lg shadow-black/5">
      {/* Safe Area Spacer */}
      <div className="w-full shrink-0" style={{ minHeight: 'env(safe-area-inset-top)' }} />
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
              onBlur={() => setIsSearchFocused(false)}
              className={`w-full h-10 md:h-11 rounded-full border bg-secondary/50 pl-10 pr-20 text-sm focus:outline-none transition-all ${
                isSearchFocused
                  ? "border-primary ring-2 ring-primary/20 bg-background"
                  : "border-border/50"
              }`}
            />
            
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
                onClick={() => fileInputRef.current?.click()}
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
            {typeof walletBalance === 'number' && (
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
