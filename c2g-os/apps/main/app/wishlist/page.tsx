"use client";

import Link from "next/link";
import { useWishlist } from "../../components/shop/wishlist-context";
import { ShoppingCart, Trash2, HeartCrack, ChevronLeft } from "lucide-react";

export default function WishlistPage() {
  const { items, removeFromWishlist } = useWishlist();

  return (
    <div className="min-h-screen bg-background pb-24 md:pb-12 pt-24">
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
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
            {items.map(item => (
              <div key={item.id} className="bg-card rounded-2xl border border-border overflow-hidden group hover:shadow-xl hover:shadow-primary/5 transition-all flex flex-col">
                <Link href={`/shop/product/${item.id}`} className="relative aspect-square block overflow-hidden bg-secondary">
                  <img 
                    src={item.imageUrl} 
                    alt={item.name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <button 
                    onClick={(e) => {
                      e.preventDefault();
                      removeFromWishlist(item.id);
                    }}
                    className="absolute top-3 right-3 w-10 h-10 bg-white/90 dark:bg-black/50 backdrop-blur-md rounded-full flex items-center justify-center text-red-500 hover:bg-red-500 hover:text-white transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </Link>
                
                <div className="p-4 flex flex-col flex-1">
                  <Link href={`/shop/product/${item.id}`} className="font-bold text-foreground line-clamp-2 hover:text-primary transition-colors mb-2">
                    {item.name}
                  </Link>
                  <div className="mt-auto pt-4 flex items-center justify-between border-t border-border/50">
                    <div className="flex flex-col">
                      <span className="font-extrabold text-primary">₵{item.priceGhs.toFixed(2)}</span>
                      <span className="text-[10px] text-muted-foreground line-through">¥{item.priceCny.toFixed(2)}</span>
                    </div>
                    <Link 
                      href={`/shop/product/${item.id}`}
                      className="w-10 h-10 bg-primary/10 text-primary rounded-xl flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors"
                    >
                      <ShoppingCart className="w-5 h-5" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
