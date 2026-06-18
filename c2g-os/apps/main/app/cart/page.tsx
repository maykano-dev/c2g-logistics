import CartClient from "../../components/shop/cart-client";
import MobileBottomNav from "../../components/shop/mobile-bottom-nav";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export const metadata = {
  title: "Shopping Cart | C2G Mall",
  description: "Review your selected items and proceed to secure checkout.",
};

export default function CartPage() {
  return (
    <div className="bg-background min-h-screen pb-24">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <Link href="/shop" className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-6 font-medium">
          <ChevronLeft className="w-5 h-5" /> Back to Shop
        </Link>
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">Your Shopping Cart</h1>
          <p className="text-muted-foreground mt-2">Review your items, adjust quantities, and proceed to checkout to secure your C2G Mall order.</p>
        </div>

        <CartClient />
      </div>
      <MobileBottomNav />
    </div>
  );
}
