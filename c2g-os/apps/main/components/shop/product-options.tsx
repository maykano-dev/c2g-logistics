"use client";

import { useState, useMemo } from "react";
import { ShoppingCart, Plus, Minus, Heart } from "lucide-react";
import { useCart } from "./cart-context";
import { useWishlist } from "./wishlist-context";
import { useRouter } from "next/navigation";

export default function ProductOptions({ product, variants, exchangeRate, optionTypes, isLoggedIn }: { product: any, variants: any[], exchangeRate: number, optionTypes: string[], isLoggedIn?: boolean }) {
  const { addToCart } = useCart();
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const router = useRouter();
  
  // State for selected options
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const isWishlisted = isInWishlist(product.id);

  // Extract all possible values for each option type
  const optionValues = useMemo(() => {
    const vals: Record<string, Set<string>> = {};
    optionTypes.forEach(t => vals[t] = new Set());
    
    variants.forEach(v => {
      const combo = v.combination || v.variant_options;
      if (combo) {
        Object.entries(combo).forEach(([key, val]) => {
          if (vals[key] && typeof val === 'string') {
            if (val.includes(',')) {
              val.split(',').forEach(s => vals[key]?.add(s.trim()));
            } else {
              vals[key]?.add(val.trim());
            }
          }
        });
      }
    });
    
    const result: Record<string, string[]> = {};
    Object.keys(vals).forEach(k => result[k] = Array.from(vals[k] || []));
    return result;
  }, [variants, optionTypes]);

  const handleOptionSelect = (type: string, value: string) => {
    setSelectedOptions(prev => ({ ...prev, [type]: value }));
    setQuantity(1); // Reset quantity when variant changes
  };

  // Find currently matched variant based on selected options
  const currentVariant = useMemo(() => {
    if (variants.length === 0) return null;
    if (Object.keys(selectedOptions).length !== optionTypes.length) return null; // Not all options selected

    return variants.find(v => {
      const combo = v.combination || v.variant_options;
      if (!combo) return false;
      return Object.entries(selectedOptions).every(([key, val]) => {
        const comboVal = combo[key];
        if (!comboVal || typeof comboVal !== 'string') return false;
        if (comboVal === val) return true;
        return comboVal.split(',').map(s => s.trim()).includes(val);
      });
    });
  }, [selectedOptions, variants, optionTypes.length]);

  // Determine current price and stock
  // Display the actual selling price set by the importer
  const displayPriceGhs = currentVariant?.selling_price_ghs !== null && currentVariant?.selling_price_ghs !== undefined
    ? parseFloat(currentVariant.selling_price_ghs)
    : product.selling_price_ghs !== null && product.selling_price_ghs !== undefined
      ? parseFloat(product.selling_price_ghs)
      : parseFloat(product.price) || 0; // fallback to legacy price

  // Cost reference (Yuan) to show as strikethrough
  const displayPriceCny = currentVariant?.cost_price_cny !== null && currentVariant?.cost_price_cny !== undefined
    ? parseFloat(currentVariant.cost_price_cny) 
    : product.cost_price_cny !== null && product.cost_price_cny !== undefined
      ? parseFloat(product.cost_price_cny)
      : parseFloat(product.price_cny) || 0; // fallback to legacy price_cny
  const currentStock = currentVariant ? currentVariant.stock : product.stock;
  
  // Check if all options are selected (if there are variants)
  const isSelectionComplete = variants.length === 0 || Object.keys(selectedOptions).length === optionTypes.length;
  const isOutOfStock = isSelectionComplete && currentStock <= 0;
  const canAddToCart = isSelectionComplete && !isOutOfStock;

  const handleAddToCart = () => {
    if (!canAddToCart) return;

    const imageUrl = currentVariant?.image_url 
      || product.product_images?.find((img: any) => img.is_primary)?.image_url 
      || product.product_images?.[0]?.image_url 
      || "https://placehold.co/300x300/e9ecef/6c757d?text=N/A";

    addToCart({
      id: currentVariant ? `${product.id}-${currentVariant.id}-${Object.values(selectedOptions).join('-')}` : product.id,
      productId: product.id,
      variantId: currentVariant?.id,
      name: product.name,
      imageUrl,
      priceGhs: displayPriceGhs,
      priceCny: displayPriceCny,
      quantity,
      combination: selectedOptions, // Store exactly what the user selected, not the giant comma string
      stock: currentStock
    });

    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="space-y-8">
      {/* Price */}
      <div className="flex items-baseline gap-2">
        <span className="text-4xl font-extrabold text-primary">₵{displayPriceGhs.toFixed(2)}</span>
      </div>

      {/* Options */}
      {optionTypes.map(type => (
        <div key={type} className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-bold capitalize">{type}</h3>
            <span className="text-sm text-muted-foreground">{selectedOptions[type] || "Select an option"}</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {(optionValues[type] || []).map(val => {
              const isSelected = selectedOptions[type] === val;
              return (
                <button
                  key={val}
                  onClick={() => handleOptionSelect(type, val)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                    isSelected 
                      ? "bg-primary text-primary-foreground shadow-md ring-2 ring-primary ring-offset-2 ring-offset-background" 
                      : "bg-secondary text-foreground hover:bg-secondary/80 border border-border"
                  }`}
                >
                  {val}
                </button>
              );
            })}
          </div>
        </div>
      ))}

      {/* Action Area */}
      <div className="pt-6 border-t border-border/50 space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="font-bold">Quantity</h3>
          <span className="text-sm text-muted-foreground">{isSelectionComplete ? `${currentStock} available` : "Select options first"}</span>
        </div>
        
        <div className="flex items-center gap-4">
          {/* Quantity Selector */}
          <div className="flex items-center h-12 bg-secondary rounded-xl border border-border p-1">
            <button 
              onClick={() => setQuantity(q => Math.max(1, q - 1))}
              disabled={!isSelectionComplete || quantity <= 1}
              className="w-10 h-full flex items-center justify-center rounded-lg hover:bg-background disabled:opacity-50 transition-colors"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="w-12 text-center font-bold">{quantity}</span>
            <button 
              onClick={() => setQuantity(q => Math.min(currentStock, q + 1))}
              disabled={!isSelectionComplete || quantity >= currentStock}
              className="w-10 h-full flex items-center justify-center rounded-lg hover:bg-background disabled:opacity-50 transition-colors"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {/* Add to Cart Button */}
          <button 
            onClick={handleAddToCart}
            disabled={!canAddToCart}
            className={`flex-1 h-12 flex items-center justify-center rounded-xl font-bold transition-all gap-2 ${
              added 
                ? "bg-green-500 text-white shadow-lg shadow-green-500/25"
                : canAddToCart
                  ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25 hover:bg-primary/90 hover:scale-[1.02]"
                  : "bg-secondary text-muted-foreground cursor-not-allowed"
            }`}
          >
            {added ? (
              "Added to Cart!"
            ) : isOutOfStock ? (
              "Out of Stock"
            ) : !isSelectionComplete ? (
              "Select Options"
            ) : (
              <>
                <ShoppingCart className="w-5 h-5" /> Add to Cart
              </>
            )}
          </button>

          {/* Wishlist Button */}
          <button 
            onClick={() => {
              if (isWishlisted) {
                removeFromWishlist(product.id);
              } else {
                addToWishlist({
                  id: product.id,
                  name: product.name,
                  imageUrl: product.product_images?.[0]?.image_url || "https://placehold.co/300",
                  priceGhs: displayPriceGhs,
                  priceCny: displayPriceCny
                });
              }
            }}
            className="w-12 h-12 flex shrink-0 items-center justify-center rounded-xl border border-border bg-card hover:bg-secondary transition-all group"
            aria-label="Add to wishlist"
          >
            <Heart 
              className={`w-5 h-5 transition-colors ${
                isWishlisted 
                  ? "fill-red-500 text-red-500 group-hover:fill-red-600 group-hover:text-red-600" 
                  : "text-muted-foreground group-hover:text-foreground"
              }`} 
            />
          </button>
        </div>
      </div>
    </div>
  );
}
