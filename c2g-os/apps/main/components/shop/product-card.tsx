"use client";

import Link from "next/link";
import { Heart, ShoppingCart, Eye, Flame, TrendingUp } from "lucide-react";
import { useState } from "react";
import { useCart } from "./cart-context";

function DemandBadge({ label }: { label: string }) {
  if (label === "high") {
    return (
      <span className="absolute top-2.5 left-2.5 flex items-center gap-1 px-2 py-0.5 bg-red-500/90 text-white text-[10px] font-bold rounded-md backdrop-blur-sm z-10 shadow-lg">
        <Flame className="w-3 h-3" /> Hot
      </span>
    );
  }
  if (label === "medium") {
    return (
      <span className="absolute top-2.5 left-2.5 flex items-center gap-1 px-2 py-0.5 bg-amber-500/90 text-white text-[10px] font-bold rounded-md backdrop-blur-sm z-10 shadow-lg">
        <TrendingUp className="w-3 h-3" /> Trending
      </span>
    );
  }
  return null;
}

export default function ProductCard({
  product,
  exchangeRate,
  variant = "grid",
}: {
  product: any;
  exchangeRate: number;
  variant?: "grid" | "scroll";
}) {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const { addToCart } = useCart();

  const images =
    product.product_images?.filter(
      (img: any) => img.media_type !== "video"
    ) || [];
  const primaryImage =
    images.find((img: any) => img.is_primary) ||
    images[0] ||
    product.product_images?.[0];
  const imageUrl =
    primaryImage?.image_url ||
    "https://placehold.co/400x400/1a1a2e/6c757d?text=No+Image";

  const hasVariants =
    product.product_variants && product.product_variants.length > 0;

  const priceCny =
    product.price_cny !== null && product.price_cny !== undefined
      ? parseFloat(product.price_cny)
      : parseFloat(product.price) * exchangeRate;
  const priceGhs = priceCny / exchangeRate;

  const salesCount = product.sales_count || 0;
  const viewCount = product.view_count || 0;
  const demandLabel = product.demandLabel || "low";

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (hasVariants) return;
    addToCart({
      id: String(product.id),
      productId: String(product.id),
      name: product.name,
      imageUrl,
      priceGhs,
      priceCny,
      quantity: 1,
      stock: product.stock || 10,
    });
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsWishlisted(!isWishlisted);
  };

  const isScroll = variant === "scroll";

  return (
    <div
      className={`group relative bg-card border border-border/50 overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-primary/5 hover:border-primary/20 hover:-translate-y-0.5 flex flex-col h-full ${
        isScroll
          ? "w-[160px] sm:w-[180px] md:w-[220px] shrink-0 snap-start rounded-xl"
          : "rounded-xl"
      }`}
    >
      {/* Image Area */}
      <Link
        href={`/shop/product/${product.id}`}
        className="relative block aspect-square overflow-hidden bg-secondary/30"
      >
        <img
          src={imageUrl}
          alt={product.name}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-108"
        />

        {/* Demand Badge */}
        <DemandBadge label={demandLabel} />

        {/* Out of Stock */}
        {product.stock <= 0 && !hasVariants && (
          <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px] flex items-center justify-center">
            <span className="bg-destructive text-destructive-foreground px-3 py-1 rounded-md text-xs font-bold">
              Sold Out
            </span>
          </div>
        )}

        {/* Wishlist Heart */}
        <button
          onClick={handleWishlist}
          className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-black/30 backdrop-blur-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all z-10 hover:scale-110"
        >
          <Heart
            className={`w-4 h-4 transition-colors ${
              isWishlisted
                ? "fill-red-500 text-red-500"
                : "text-white"
            }`}
          />
        </button>

        {/* Quick View overlay */}
        <div className="absolute inset-x-0 bottom-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300 bg-gradient-to-t from-black/60 to-transparent p-3 pt-8 hidden md:block">
          <div className="flex items-center justify-center gap-2">
            <span className="flex items-center gap-1 text-white text-xs font-medium">
              <Eye className="w-3.5 h-3.5" /> Quick View
            </span>
          </div>
        </div>
      </Link>

      {/* Card Body */}
      <div className="p-3 sm:p-3.5 flex flex-col flex-grow">
        <Link
          href={`/shop/product/${product.id}`}
          className="group-hover:text-primary transition-colors"
        >
          <h3 className="font-medium text-xs sm:text-sm line-clamp-2 mb-1.5 leading-snug">
            {product.name}
          </h3>
        </Link>

        {/* Social Proof Row */}
        {salesCount > 0 && (
          <p className="text-[10px] text-muted-foreground mb-2">
            {salesCount > 100
              ? `${Math.floor(salesCount / 100) * 100}+ sold`
              : `${salesCount} sold`}
          </p>
        )}

        {/* Price Area */}
        <div className="mt-auto pt-2">
          <div className="flex items-baseline gap-1.5 mb-2.5">
            <span className="font-extrabold text-base sm:text-lg text-primary leading-none">
              ₵{priceGhs.toFixed(2)}
            </span>
            <span className="text-[10px] text-muted-foreground line-through opacity-60">
              ¥{priceCny.toFixed(0)}
            </span>
          </div>

          {/* Add to Cart */}
          <button
            onClick={hasVariants ? undefined : handleQuickAdd}
            className={`w-full h-8 sm:h-9 flex items-center justify-center rounded-lg text-xs font-semibold transition-all gap-1.5 ${
              hasVariants
                ? "border border-border bg-secondary/50 text-foreground hover:bg-secondary"
                : "bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground"
            }`}
          >
            {hasVariants ? (
              "See Options"
            ) : (
              <>
                <ShoppingCart className="w-3.5 h-3.5" /> Add
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
