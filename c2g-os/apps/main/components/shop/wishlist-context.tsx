"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export type WishlistItem = {
  id: string; // product id
  name: string;
  imageUrl: string;
  priceGhs: number;
  priceCny: number;
};

type WishlistContextType = {
  items: WishlistItem[];
  addToWishlist: (item: WishlistItem) => void;
  removeFromWishlist: (id: string) => void;
  isInWishlist: (id: string) => boolean;
  wishlistCount: number;
};

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Load from local storage
    const saved = localStorage.getItem("c2g_mall_wishlist");
    if (saved) {
      try {
        setItems(JSON.parse(saved));
      } catch (e) {}
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("c2g_mall_wishlist", JSON.stringify(items));
    }
  }, [items, isLoaded]);

  const addToWishlist = (item: WishlistItem) => {
    setItems(prev => {
      if (prev.find(i => i.id === item.id)) return prev;
      return [...prev, item];
    });
  };

  const removeFromWishlist = (id: string) => {
    setItems(prev => prev.filter(i => i.id !== id));
  };

  const isInWishlist = (id: string) => {
    return items.some(i => i.id === id);
  };

  const wishlistCount = items.length;

  return (
    <WishlistContext.Provider value={{ items, addToWishlist, removeFromWishlist, isInWishlist, wishlistCount }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return context;
}
