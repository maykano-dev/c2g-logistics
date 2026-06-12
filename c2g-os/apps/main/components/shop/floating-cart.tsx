"use client";

import { ShoppingCart } from "lucide-react";
import Link from "next/link";
import { useCart } from "./cart-context";

export default function FloatingCart() {
  const { cartCount, cartTotalGhs } = useCart();

  if (cartCount === 0) return null;

  return (
    <Link
      href="/cart"
      className="fixed bottom-20 right-4 md:bottom-6 md:right-6 z-50 group hidden md:flex"
    >
      <div className="relative flex items-center gap-2 bg-primary text-primary-foreground pl-4 pr-5 py-3 rounded-full shadow-2xl shadow-primary/30 hover:shadow-primary/50 hover:scale-105 transition-all">
        <div className="relative">
          <ShoppingCart className="w-5 h-5" />
          <span className="absolute -top-2.5 -right-2.5 w-5 h-5 bg-white text-primary rounded-full text-[10px] font-extrabold flex items-center justify-center shadow-sm">
            {cartCount > 99 ? "99+" : cartCount}
          </span>
        </div>
        <span className="font-bold text-sm">₵{cartTotalGhs.toFixed(2)}</span>
      </div>
    </Link>
  );
}
