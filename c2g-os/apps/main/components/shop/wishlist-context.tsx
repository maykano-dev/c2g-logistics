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
    // Sync with DB if possible
    async function syncDb() {
      try {
        const { getDbWishlist } = await import("../../app/shop/actions");
        const res = await getDbWishlist();
        if (res.success && res.items) {
          setItems(res.items);
          localStorage.setItem("c2g_mall_wishlist", JSON.stringify(res.items));
        } else {
          // Load from local storage fallback
          const saved = localStorage.getItem("c2g_mall_wishlist");
          if (saved) {
            try { setItems(JSON.parse(saved)); } catch (e) {}
          }
        }
      } catch (err) {
        // Fallback
        const saved = localStorage.getItem("c2g_mall_wishlist");
        if (saved) {
          try { setItems(JSON.parse(saved)); } catch (e) {}
        }
      } finally {
        setIsLoaded(true);
      }
    }
    syncDb();
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("c2g_mall_wishlist", JSON.stringify(items));
    }
  }, [items, isLoaded]);

  const addToWishlist = async (item: WishlistItem) => {
    setItems(prev => {
      if (prev.find(i => i.id === item.id)) return prev;
      return [...prev, item];
    });
    try {
      const { addDbWishlist } = await import("../../app/shop/actions");
      await addDbWishlist(item.id);
    } catch (err) {}
  };

  const removeFromWishlist = async (id: string) => {
    setItems(prev => prev.filter(i => i.id !== id));
    try {
      const { removeDbWishlist } = await import("../../app/shop/actions");
      await removeDbWishlist(id);
    } catch (err) {}
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
