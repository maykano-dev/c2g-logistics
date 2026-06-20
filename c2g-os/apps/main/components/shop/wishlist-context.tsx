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
  clearWishlist: () => void;
  isInWishlist: (id: string) => boolean;
  wishlistCount: number;
  isLoaded: boolean;
};

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Sync with DB if possible
    async function syncDb() {
      const saved = localStorage.getItem("c2g_mall_wishlist");
      let localItems: WishlistItem[] = [];
      if (saved) {
        try { localItems = JSON.parse(saved); } catch (e) {}
      }
      
      // Unblock UI immediately with local data
      setItems(localItems);
      setIsLoaded(true);

      try {
        const { getDbWishlist, addDbWishlist } = await import("../../app/shop/actions");
        const res = await getDbWishlist();
        
        if (res.success) {
          const dbItems = (res.items || []).filter(Boolean) as WishlistItem[];
          if (dbItems.length > 0) {
            const merged = [...dbItems];
            for (const localItem of localItems) {
              if (!merged.find(i => i.id === localItem.id)) {
                merged.push(localItem);
                addDbWishlist(localItem.id).catch(() => {});
              }
            }
            setItems(merged);
            localStorage.setItem("c2g_mall_wishlist", JSON.stringify(merged));
          } else if (localItems.length > 0) {
            setItems(localItems);
            for (const item of localItems) {
              addDbWishlist(item.id).catch(() => {});
            }
          } else {
            setItems([]);
          }
        } else {
          // Fallback or not logged in
          setItems(localItems);
        }
      } catch (err) {
        setItems(localItems);
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

  const clearWishlist = async () => {
    setItems([]);
    try {
      const { clearDbWishlist } = await import("../../app/shop/actions");
      await clearDbWishlist();
    } catch (err) {}
  };

  const isInWishlist = (id: string) => {
    return items.some(i => i.id === id);
  };

  const wishlistCount = items.length;

  return (
    <WishlistContext.Provider value={{ items, addToWishlist, removeFromWishlist, clearWishlist, isInWishlist, wishlistCount, isLoaded }}>
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
