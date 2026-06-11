"use client";

import { useState, useMemo } from "react";
import { ShoppingCart, Plus, Minus } from "lucide-react";
import { useCart } from "./cart-context";

export default function ProductOptions({ product, variants, exchangeRate, optionTypes }: { product: any, variants: any[], exchangeRate: number, optionTypes: string[] }) {
  const { addToCart } = useCart();
  
  // State for selected options
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  // Extract all possible values for each option type
  const optionValues = useMemo(() => {
    const vals: Record<string, Set<string>> = {};
    optionTypes.forEach(t => vals[t] = new Set());
    
    variants.forEach(v => {
      if (v.combination) {
        Object.entries(v.combination).forEach(([key, val]) => {
          if (vals[key] && typeof val === 'string') {
            vals[key].add(val);
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
      if (!v.combination) return false;
      return Object.entries(selectedOptions).every(([key, val]) => v.combination[key] === val);
    });
  }, [selectedOptions, variants, optionTypes.length]);

  // Determine current price and stock
  const displayPriceCny = currentVariant?.price_cny !== null && currentVariant?.price_cny !== undefined
    ? parseFloat(currentVariant.price_cny) 
    : currentVariant?.price 
      ? parseFloat(currentVariant.price) * exchangeRate
      : product.price_cny !== null 
        ? parseFloat(product.price_cny)
        : parseFloat(product.price) * exchangeRate;
        
  const displayPriceGhs = displayPriceCny / exchangeRate;
  const currentStock = currentVariant ? currentVariant.stock : product.stock;
  
  // Check if all options are selected (if there are variants)
  const isSelectionComplete = variants.length === 0 || Object.keys(selectedOptions).length === optionTypes.length;
  const isOutOfStock = isSelectionComplete && currentStock <= 0;
  const canAddToCart = isSelectionComplete && !isOutOfStock;

  const handleAddToCart = () => {
    if (!canAddToCart) return;

    const imageUrl = product.product_images?.find((img: any) => img.is_primary)?.image_url 
      || product.product_images?.[0]?.image_url 
      || "https://placehold.co/300x300/e9ecef/6c757d?text=N/A";

    addToCart({
      id: currentVariant ? `${product.id}-${currentVariant.id}` : product.id,
      productId: product.id,
      variantId: currentVariant?.id,
      name: product.name,
      imageUrl,
      priceGhs: displayPriceGhs,
      priceCny: displayPriceCny,
      quantity,
      combination: currentVariant?.combination,
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
        <span className="text-lg text-muted-foreground line-through opacity-70">¥{displayPriceCny.toFixed(2)}</span>
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
        </div>
      </div>
    </div>
  );
}
