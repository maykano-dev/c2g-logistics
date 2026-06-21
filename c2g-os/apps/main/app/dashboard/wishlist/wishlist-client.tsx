"use client";

import { useWishlist } from "@/components/shop/wishlist-context";
import { Heart, HeartCrack, ShoppingCart, Loader2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function WishlistClient() {
  const { items, removeFromWishlist, clearWishlist, isLoaded } = useWishlist();
  const router = useRouter();
  const [removingId, setRemovingId] = useState<string | null>(null);
  const [isClearing, setIsClearing] = useState(false);

  const handleRemove = async (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    setRemovingId(id);
    await removeFromWishlist(id);
    setRemovingId(null);
  };

  const handleClear = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!window.confirm("Are you sure you want to clear your entire wishlist?")) return;
    setIsClearing(true);
    await clearWishlist();
    setIsClearing(false);
  };

  const formatGhs = (price: any) => {
    const val = parseFloat(price);
    return isNaN(val) ? "0.00" : val.toFixed(2);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Wishlist</h1>
          <p className="text-muted-foreground mt-1">Products you've saved for later.</p>
        </div>
        <div className="flex items-center gap-3">
          {items.length > 0 && (
            <button
              onClick={handleClear}
              disabled={isClearing}
              className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors border border-destructive/20 bg-destructive/10 text-destructive hover:bg-destructive/20 h-10 px-4 py-2 gap-2 disabled:opacity-50"
            >
              {isClearing ? <Loader2 className="w-4 h-4 animate-spin" /> : <HeartCrack className="w-4 h-4" />}
              Clear Wishlist
            </button>
          )}
          <Link 
            href="/shop" 
            className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 gap-2"
          >
            <ShoppingCart className="w-4 h-4" />
            Continue Shopping
          </Link>
        </div>
      </div>

      {!isLoaded ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : items.length === 0 ? (
        <div className="glass-panel p-12 flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 rounded-full bg-pink-500/10 flex items-center justify-center mb-4">
            <HeartCrack className="w-8 h-8 text-pink-500" />
          </div>
          <h3 className="text-xl font-bold mb-2">Your wishlist is empty</h3>
          <p className="text-muted-foreground mb-6 max-w-sm">
            You haven't saved any products yet. Browse our shop and tap the heart icon to save items here.
          </p>
          <Link 
            href="/shop" 
            className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 shadow-lg shadow-primary/25"
          >
            Browse Products
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4">
          {items.map((item) => (
            <div key={item.id} className="glass-panel group overflow-hidden flex flex-col relative hover:border-primary/50 transition-colors">
              <Link 
                href={item.storeSlug ? `/shop/product/${item.id}?store=${item.storeSlug}` : `/shop/product/${item.id}`} 
                className="flex flex-col h-full w-full"
              >
                <div className="relative aspect-square w-full bg-secondary/30">
                  <Image 
                    src={item.imageUrl} 
                    alt={item.name} 
                    fill 
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {item.storeSlug && (
                    <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-md text-white text-[9px] font-bold px-2 py-1 rounded shadow-lg z-10">
                      Store Item
                    </div>
                  )}
                </div>
                <div className="p-4 flex flex-col flex-1">
                  <h3 className="font-bold text-sm leading-tight mb-2 line-clamp-2 flex-1">{item.name}</h3>
                  <div className="flex items-end justify-between mt-2">
                    <div>
                      <p className="text-lg font-black text-primary">₵{formatGhs(item.priceGhs)}</p>
                      {item.priceCny && (
                        <p className="text-xs text-muted-foreground font-medium">≈ ¥{item.priceCny}</p>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
              <button 
                onClick={(e) => handleRemove(e, item.id)}
                disabled={removingId === item.id}
                className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-white hover:bg-destructive/80 transition-colors disabled:opacity-50 z-10 cursor-pointer"
                title="Remove from wishlist"
              >
                {removingId === item.id ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Heart className="w-4 h-4 fill-white" />
                )}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
