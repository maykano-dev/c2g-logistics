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
    // Load from local storage
    const saved = localStorage.getItem("c2g_mall_cart");
    if (saved) {
      try {
        setItems(JSON.parse(saved));
      } catch (e) {}
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("c2g_mall_cart", JSON.stringify(items));
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
