"use client";

import { useCart } from "./cart-context";
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag, Trash, CreditCard, Smartphone } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function CartClient() {
  const { items, removeFromCart, updateQuantity, cartTotalGhs, cartCount, clearCart } = useCart();
  const router = useRouter();

  if (items.length === 0) {
    return (
      <div className="glass-panel p-16 text-center flex flex-col items-center justify-center border-dashed border-2">
        <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mb-6">
          <ShoppingBag className="w-12 h-12 text-primary" />
        </div>
        <h2 className="text-2xl font-bold mb-3">Your Cart is Empty</h2>
        <p className="text-muted-foreground max-w-md mx-auto mb-8">Looks like you haven't added anything to your cart yet. Browse the C2G Mall for cheap, quality goods.</p>
        <Link href="/shop" className="inline-flex items-center justify-center whitespace-nowrap rounded-full text-base font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring bg-primary text-primary-foreground hover:bg-primary/90 hover:scale-[1.02] h-12 px-8 shadow-lg shadow-primary/25 gap-2">
          Start Shopping <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      {/* Cart Items List */}
      <div className="flex-1 space-y-6">
        <div className="glass-panel p-6">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border/50 pb-4 mb-6">
            <h2 className="text-xl font-bold line-clamp-1">
              Shopping Cart ({cartCount})
            </h2>
            <button 
              onClick={clearCart}
              className="text-sm font-medium text-red-500 hover:text-red-600 flex items-center gap-1.5 bg-red-500/10 hover:bg-red-500/20 px-3 py-1.5 rounded-lg transition-colors shrink-0 whitespace-nowrap"
            >
              <Trash className="w-4 h-4" /> Clear Cart
            </button>
          </div>

          <div className="space-y-6">
            {items.map((item) => (
              <div key={item.id} className="flex flex-col sm:flex-row gap-4 sm:gap-6 pb-6 border-b border-border/50 last:border-0 last:pb-0">
                {/* Image */}
                <Link href={`/shop/product/${item.productId}`} className="w-24 h-24 sm:w-32 sm:h-32 rounded-xl overflow-hidden bg-secondary shrink-0 border border-border group">
                  <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </Link>

                {/* Details */}
                <div className="flex-1 flex flex-col min-w-0">
                  <div className="flex justify-between items-start gap-4 mb-2">
                    <Link href={`/shop/product/${item.productId}`} className="font-bold text-lg hover:text-primary transition-colors truncate block flex-1">
                      {item.name}
                    </Link>
                    <div className="text-right shrink-0">
                      <div className="font-bold text-lg text-primary">₵{(item.priceGhs * item.quantity).toFixed(2)}</div>
                    </div>
                  </div>

                  {/* Combination Options */}
                  {item.combination && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {Object.entries(item.combination).map(([key, val]) => (
                        <span key={key} className="px-2 py-1 bg-secondary text-secondary-foreground rounded-md text-xs font-medium border border-border">
                          {key}: {val}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Controls */}
                  <div className="mt-auto flex items-center justify-between">
                    <div className="flex items-center h-10 bg-secondary rounded-lg border border-border p-1 w-32">
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-8 h-full flex items-center justify-center rounded-md hover:bg-background transition-colors"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="flex-1 text-center font-bold text-sm">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        disabled={item.quantity >= item.stock}
                        className="w-8 h-full flex items-center justify-center rounded-md hover:bg-background disabled:opacity-50 transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>

                    <button 
                      onClick={() => removeFromCart(item.id)}
                      className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 p-2 rounded-lg transition-colors flex items-center gap-1 text-sm font-medium"
                    >
                      <Trash2 className="w-4 h-4" /> <span className="hidden sm:inline">Remove</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Order Summary */}
      <div className="w-full lg:w-80 xl:w-96 shrink-0">
        <div className="glass-panel p-6 sticky top-24">
          <h2 className="text-xl font-bold mb-6 border-b border-border/50 pb-4">Order Summary</h2>
          
          <div className="space-y-4 mb-6 text-sm">
            <div className="flex justify-between text-muted-foreground">
              <span>Subtotal ({cartCount} items)</span>
              <span className="text-foreground font-medium">₵{cartTotalGhs.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-muted-foreground">
              <span>Shipping Fee</span>
              <span className="text-sm">Calculated at checkout</span>
            </div>
            <div className="flex justify-between text-muted-foreground">
              <span>C2G Processing Fee</span>
              <span className="text-sm">Calculated at checkout</span>
            </div>
            <div className="pt-4 border-t border-border/50 flex justify-between items-center">
              <span className="font-bold text-base">Estimated Total</span>
              <span className="font-extrabold text-2xl text-primary">₵{cartTotalGhs.toFixed(2)}</span>
            </div>
          </div>

          <button 
            onClick={() => router.push("/checkout")}
            className="w-full h-14 inline-flex items-center justify-center whitespace-nowrap rounded-xl text-base font-bold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring bg-primary text-primary-foreground hover:bg-primary/90 hover:scale-[1.02] shadow-lg shadow-primary/25 gap-2"
          >
            Proceed to Checkout <ArrowRight className="w-5 h-5" />
          </button>
          
          <div className="mt-6 flex items-center justify-center gap-4 text-muted-foreground opacity-70">
            <div className="flex items-center gap-1.5 text-xs font-semibold">
              <Smartphone className="w-4 h-4" /> MoMo
            </div>
            <div className="flex items-center gap-1.5 text-xs font-semibold">
              <CreditCard className="w-4 h-4" /> Card
            </div>
            <div className="flex items-center gap-1.5 text-xs font-semibold">
              <span className="font-bold border border-current px-1 rounded-sm text-[10px]">VISA</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
