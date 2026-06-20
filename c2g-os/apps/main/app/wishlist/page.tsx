"use client";

import Link from "next/link";
import { useWishlist } from "../../components/shop/wishlist-context";
import { ShoppingCart, Trash2, HeartCrack, ChevronLeft } from "lucide-react";

import MobileBottomNav from "../../components/shop/mobile-bottom-nav";

export default function WishlistPage() {
  const { items, removeFromWishlist } = useWishlist();

  return (
    <div className="min-h-screen bg-background pb-24 md:pb-12 pt-6 md:pt-10">
      <div className="max-w-5xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <Link href="/shop" className="p-2 -ml-2 rounded-full hover:bg-secondary transition-colors">
            <ChevronLeft className="w-6 h-6" />
          </Link>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">My Wishlist</h1>
          <div className="ml-auto bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-bold">
            {items.length} {items.length === 1 ? 'Item' : 'Items'}
          </div>
        </div>

        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center bg-secondary/30 rounded-3xl border border-border/50">
            <div className="w-20 h-20 bg-secondary rounded-full flex items-center justify-center mb-6">
              <HeartCrack className="w-10 h-10 text-muted-foreground" />
            </div>
            <h2 className="text-xl font-bold mb-2">Your wishlist is empty</h2>
            <p className="text-muted-foreground mb-8 text-sm max-w-[250px]">
              Save items you love here to easily find and buy them later.
            </p>
            <Link 
              href="/shop"
              className="bg-primary text-primary-foreground px-8 py-3 rounded-full font-bold shadow-lg shadow-primary/25 hover:scale-105 transition-transform"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4">
            {items.map(item => (
              <div key={item.id} className="bg-card rounded-xl border border-border overflow-hidden group hover:shadow-xl hover:shadow-primary/10 transition-all flex flex-col relative">
                <Link href={`/shop/product/${item.id}`} className="relative aspect-square block overflow-hidden bg-secondary/50">
                  <img 
                    src={item.imageUrl} 
                    alt={item.name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </Link>
                <button 
                  onClick={(e) => {
                    e.preventDefault();
                    removeFromWishlist(item.id);
                  }}
                  className="absolute top-2 right-2 w-8 h-8 bg-background/80 backdrop-blur-md rounded-full flex items-center justify-center text-muted-foreground hover:bg-destructive hover:text-destructive-foreground transition-all shadow-sm z-10"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                
                <div className="p-3 flex flex-col flex-1">
                  <Link href={`/shop/product/${item.id}`} className="font-semibold text-sm text-foreground line-clamp-2 hover:text-primary transition-colors mb-2 leading-tight">
                    {item.name}
                  </Link>
                  <div className="mt-auto pt-2 flex items-end justify-between">
                    <div className="flex flex-col">
                      <span className="font-extrabold text-primary text-sm sm:text-base">₵{item.priceGhs.toFixed(2)}</span>
                      <span className="text-[10px] text-muted-foreground font-medium">≈ ¥{item.priceCny.toFixed(2)}</span>
                    </div>
                    <Link 
                      href={`/shop/product/${item.id}`}
                      className="w-8 h-8 bg-primary/10 text-primary rounded-lg flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors"
                    >
                      <ShoppingCart className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <MobileBottomNav />
    </div>
  );
}
