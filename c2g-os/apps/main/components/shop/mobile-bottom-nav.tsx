"use client";

import { Home, ShoppingCart, Package, User, Heart } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "./cart-context";
import { useWishlist } from "./wishlist-context";
import { motion } from "framer-motion";

const NAV_ITEMS = [
  { href: "/shop", label: "Home", icon: Home },
  { href: "/dashboard/mall-orders", label: "Orders", icon: Package },
  { href: "/cart", label: "Cart", icon: ShoppingCart, badge: "cart" },
  { href: "/wishlist", label: "Wishlist", icon: Heart, badge: "wishlist" },
  { href: "/dashboard", label: "Account", icon: User },
];

export default function MobileBottomNav() {
  const pathname = usePathname();
  const { cartCount } = useCart();
  const { wishlistCount } = useWishlist();

  return (
    <nav className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] w-[calc(100%-2rem)] max-w-[380px]">
      {/* Outer fully-pill liquid glass shell */}
      <div
        className="relative flex items-center justify-between rounded-full p-2"
        style={{
          background: "rgba(20, 25, 40, 0.45)",
          backdropFilter: "blur(32px) saturate(200%)",
          WebkitBackdropFilter: "blur(32px) saturate(200%)",
          border: "1px solid rgba(255,255,255,0.15)",
          boxShadow: "0 20px 40px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.2)",
        }}
      >
        {/* Top-edge ambient highlight */}
        <div
          className="absolute top-0 left-[15%] right-[15%] h-px rounded-full pointer-events-none"
          style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)" }}
        />

        {NAV_ITEMS.map((link) => {
          const isActive =
            link.href === "/shop"
              ? pathname === "/shop"
              : pathname.startsWith(link.href) && !pathname.includes('?'); // Simplified active check
              
          // Better active check taking search params into account conceptually:
          // Since we can't cleanly check query params from `usePathname()`, we'll just check base path.
          // For actual query params, Next.js 'useSearchParams' could be used, but for now we stick to pathname.

          const Icon = link.icon;
          const shortName = link.label.split(" ")[0];

          return (
            <Link
              key={link.label}
              href={link.href}
              className={`relative flex items-center justify-center h-12 rounded-full transition-all duration-300 ease-out z-10 ${
                isActive ? "px-5" : "w-12 px-0 hover:bg-white/5"
              }`}
            >
              {/* Animated sliding liquid glass active pill */}
              {isActive && (
                <motion.div
                  layoutId="active-shop-nav-pill"
                  className="absolute inset-0 rounded-full"
                  style={{
                    background: "rgba(255,255,255,0.15)",
                    border: "1px solid rgba(255,255,255,0.2)",
                    boxShadow: "inset 0 1px 0 rgba(255,255,255,0.3), 0 4px 12px rgba(0,0,0,0.2)",
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 400,
                    damping: 30,
                  }}
                />
              )}

              {/* Icon & Text Container */}
              <div className="relative z-20 flex items-center gap-2">
                <div className="relative">
                  <Icon
                    className={`shrink-0 transition-colors duration-300 ${
                      isActive ? "text-white" : "text-white/60"
                    }`}
                    style={{ width: "22px", height: "22px", strokeWidth: isActive ? 2.5 : 2 }}
                  />
                  {link.badge === "cart" && cartCount > 0 && (
                    <span className="absolute -top-1.5 -right-2.5 min-w-[16px] h-4 bg-primary text-primary-foreground rounded-full text-[9px] font-bold flex items-center justify-center px-1 shadow-lg animate-in zoom-in-50">
                      {cartCount > 99 ? "99+" : cartCount}
                    </span>
                  )}
                  {link.badge === "wishlist" && wishlistCount > 0 && (
                    <span className="absolute -top-1.5 -right-2.5 min-w-[16px] h-4 bg-rose-500 text-white rounded-full text-[9px] font-bold flex items-center justify-center px-1 shadow-lg animate-in zoom-in-50">
                      {wishlistCount > 99 ? "99+" : wishlistCount}
                    </span>
                  )}
                </div>
                
                {isActive && (
                  <motion.span
                    initial={{ opacity: 0, width: 0, scale: 0.8 }}
                    animate={{ opacity: 1, width: "auto", scale: 1 }}
                    exit={{ opacity: 0, width: 0, scale: 0.8 }}
                    transition={{
                      type: "spring",
                      stiffness: 400,
                      damping: 30,
                      opacity: { duration: 0.2 },
                    }}
                    className="text-white font-semibold text-[13px] whitespace-nowrap overflow-hidden"
                  >
                    {shortName}
                  </motion.span>
                )}
              </div>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
