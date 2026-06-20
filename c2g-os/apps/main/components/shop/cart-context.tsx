"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export type CartItem = {
  id: string; // unique cart item id (product.id + variant.id)
  productId: string;
  variantId?: string;
  name: string;
  imageUrl: string;
  priceGhs: number;
  priceCny: number;
  quantity: number;
  combination?: Record<string, string>;
  stock: number;
};

type CartContextType = {
  items: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  cartCount: number;
  cartTotalGhs: number;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    async function loadCart() {
      const saved = localStorage.getItem("c2g_mall_cart");
      let localItems: CartItem[] = [];
      if (saved) {
        try {
          localItems = JSON.parse(saved);
        } catch (e) {}
      }

      try {
        const { getDbCart, syncDbCart } = await import("../../app/shop/actions");
        const res = await getDbCart();
        
        if (res.success) {
          // User is logged in
          const dbItems = (res.items || []) as CartItem[];
          if (dbItems.length > 0) {
            // Merge db and local items
            const merged = [...dbItems];
            let changed = false;
            localItems.forEach(localItem => {
              const existing = merged.find(i => i.id === localItem.id);
              if (!existing) {
                merged.push(localItem);
                changed = true;
              }
            });
            setItems(merged);
            localStorage.setItem("c2g_mall_cart", JSON.stringify(merged));
            if (changed) {
              await syncDbCart(merged);
            }
          } else if (localItems.length > 0) {
            // DB is empty, push local items to DB
            setItems(localItems);
            await syncDbCart(localItems);
          } else {
            // Both empty
            setItems([]);
          }
        } else {
          // Not logged in or error
          setItems(localItems);
        }
      } catch (err) {
        setItems(localItems);
      } finally {
        setIsLoaded(true);
      }
    }
    loadCart();
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("c2g_mall_cart", JSON.stringify(items));
      // Fire and forget DB sync (safe to fail if not logged in)
      import("../../app/shop/actions").then(({ syncDbCart }) => {
        syncDbCart(items).catch(() => {});
      });
    }
  }, [items, isLoaded]);

  const addToCart = (item: CartItem) => {
    setItems(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) {
        return prev.map(i => 
          i.id === item.id 
            ? { ...i, quantity: Math.min(i.quantity + item.quantity, i.stock) } 
            : i
        );
      }
      return [...prev, item];
    });
  };

  const removeFromCart = (id: string) => {
    setItems(prev => prev.filter(i => i.id !== id));
  };

  const updateQuantity = (id: string, quantity: number) => {
    setItems(prev => prev.map(i => {
      if (i.id === id) {
        return { ...i, quantity: Math.max(1, Math.min(quantity, i.stock)) };
      }
      return i;
    }));
  };

  const clearCart = () => setItems([]);

  const cartCount = items.reduce((acc, item) => acc + item.quantity, 0);
  const cartTotalGhs = items.reduce((acc, item) => acc + (item.priceGhs * item.quantity), 0);

  return (
    <CartContext.Provider value={{ items, addToCart, removeFromCart, updateQuantity, clearCart, cartCount, cartTotalGhs }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
