"use client";

import { useState, useMemo, useEffect } from "react";
import { ShoppingCart, Plus, Minus, Heart, Check, Layers, ListChecks } from "lucide-react";
import { useCart } from "./cart-context";
import { useWishlist } from "./wishlist-context";
import { useRouter } from "next/navigation";

export default function ProductOptions({ product, variants, exchangeRate, optionTypes, isLoggedIn }: { product: any, variants: any[], exchangeRate: number, optionTypes: string[], isLoggedIn?: boolean }) {
  const { addToCart } = useCart();
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();
  
  const filterOptionTypes = useMemo(() => optionTypes.slice(0, -1), [optionTypes]);
  const listOptionType = useMemo(() => optionTypes.length > 0 ? optionTypes[optionTypes.length - 1] : null, [optionTypes]);

  const [selectedFilters, setSelectedFilters] = useState<Record<string, string>>({});
  const [quantities, setQuantities] = useState<Record<string, number>>({});
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

  // Auto-select the first available filter values on mount
  useEffect(() => {
    if (filterOptionTypes.length > 0 && Object.keys(selectedFilters).length === 0) {
      const initialFilters: Record<string, string> = {};
      filterOptionTypes.forEach(type => {
        if (optionValues[type] && optionValues[type].length > 0) {
          initialFilters[type] = optionValues[type]?.[0] || "";
        }
      });
      setSelectedFilters(initialFilters);
      
      // Try to emit image for first selected primary filter if it exists
      if (filterOptionTypes.length > 0) {
        const primaryType = filterOptionTypes[0] as string;
        const primaryValue = initialFilters[primaryType];
        if (primaryValue) {
          const variantWithImage = variants.find(v => {
            const combo = v.combination || v.variant_options;
            return combo && combo[primaryType] === primaryValue && !!v.image_url;
          });
          if (variantWithImage?.image_url) {
            window.dispatchEvent(new CustomEvent('update-product-image', { detail: variantWithImage.image_url }));
          }
        }
      }
    }
  }, [filterOptionTypes, optionValues, variants, selectedFilters]);

  const handleFilterSelect = (type: string, value: string) => {
    setSelectedFilters(prev => ({ ...prev, [type]: value }));
    
    // Update main image based on selection
    const variantWithImage = variants.find(v => {
      const combo = v.combination || v.variant_options;
      return combo && combo[type] === value && !!v.image_url;
    });

    if (variantWithImage?.image_url) {
      window.dispatchEvent(new CustomEvent('update-product-image', { detail: variantWithImage.image_url }));
    }
  };

  // Get variants that match the current selected filters
  const displayedVariants = useMemo(() => {
    if (variants.length === 0) return [];
    if (filterOptionTypes.length === 0) return variants; // Show all in list if no filters

    return variants.filter(v => {
      const combo = v.combination || v.variant_options;
      if (!combo) return false;
      return filterOptionTypes.every(type => {
        const comboVal = combo[type];
        const selectedVal = selectedFilters[type];
        if (!comboVal || !selectedVal) return false;
        return comboVal === selectedVal || (typeof comboVal === 'string' && comboVal.split(',').map((s:string) => s.trim()).includes(selectedVal));
      });
    });
  }, [variants, filterOptionTypes, selectedFilters]);

  const updateQuantity = (id: string, delta: number, max: number) => {
    setQuantities(prev => {
      const current = prev[id] || 0;
      const moq = product.min_order_quantity || 1;
      let next = current + delta;
      
      if (delta > 0 && current === 0) {
        next = moq; // Jump from 0 to MOQ
      } else if (delta < 0 && current === moq) {
        next = 0; // Jump from MOQ to 0
      }
      
      next = Math.max(0, Math.min(max, next));
      if (next === 0) {
        const newQ = { ...prev };
        delete newQ[id];
        return newQ;
      }
      return { ...prev, [id]: next };
    });
  };
  
  const setQuantityDirect = (id: string, val: number, max: number) => {
    setQuantities(prev => {
      const moq = product.min_order_quantity || 1;
      let next = Math.max(0, Math.min(max, val));
      
      if (next > 0 && next < moq) {
        next = moq; // Snap to MOQ if they try to manually enter a smaller number
      }
      
      if (next === 0) {
        const newQ = { ...prev };
        delete newQ[id];
        return newQ;
      }
      return { ...prev, [id]: next };
    });
  }

  const totalSelectedQuantity = Object.values(quantities).reduce((a, b) => a + b, 0);
  
  // Base product price logic
  const baseDisplayPriceGhs = product.selling_price_ghs !== null && product.selling_price_ghs !== undefined
      ? parseFloat(product.selling_price_ghs)
      : parseFloat(product.price) || 0;
  
  const baseDisplayPriceCny = product.cost_price_cny !== null && product.cost_price_cny !== undefined
      ? parseFloat(product.cost_price_cny)
      : parseFloat(product.price_cny) || 0;

  const handleAddToCart = () => {
    let addedCount = 0;

    if (variants.length === 0) {
      const qty = quantities['base'] || 0;
      if (qty > 0) {
        addToCart({
          id: product.id,
          productId: product.id,
          name: product.name,
          imageUrl: product.images?.[0] || product.image_url || "https://placehold.co/300x300/e9ecef/6c757d?text=N/A",
          priceGhs: baseDisplayPriceGhs,
          priceCny: baseDisplayPriceCny,
          quantity: qty,
          combination: undefined,
          stock: product.stock,
          moq: product.min_order_quantity || 1
        });
        addedCount++;
      }
    } else {
      Object.entries(quantities).forEach(([variantId, qty]) => {
        if (qty > 0) {
          const v = variants.find(val => val.id === variantId);
          if (v) {
            const priceGhs = v.selling_price_ghs !== null && v.selling_price_ghs !== undefined
              ? parseFloat(v.selling_price_ghs) : baseDisplayPriceGhs;
            const priceCny = v.cost_price_cny !== null && v.cost_price_cny !== undefined
              ? parseFloat(v.cost_price_cny) : baseDisplayPriceCny;
            
            const combo = v.combination || v.variant_options;
            
            addToCart({
              id: `${product.id}-${v.id}`,
              productId: product.id,
              variantId: v.id,
              name: product.name,
              imageUrl: v.image_url || product.images?.[0] || product.image_url || "https://placehold.co/300x300/e9ecef/6c757d?text=N/A",
              priceGhs,
              priceCny,
              quantity: qty,
              combination: combo,
              stock: v.stock,
              moq: product.min_order_quantity || 1
            });
            addedCount++;
          }
        }
      });
    }

    if (addedCount > 0) {
      setAdded(true);
      setQuantities({});
      setTimeout(() => setAdded(false), 2000);
    }
  };

  const renderPrice = () => {
    if (variants.length > 0) {
      const prices = variants
        .map((v: any) => parseFloat(v.selling_price_ghs || v.price || 0))
        .filter((p: number) => !isNaN(p) && p > 0);
        
      if (prices.length > 0) {
        const minPrice = Math.min(...prices);
        const maxPrice = Math.max(...prices);
        if (minPrice === maxPrice) {
          return `₵${minPrice.toFixed(2)}`;
        }
        return `₵${minPrice.toFixed(2)} - ₵${maxPrice.toFixed(2)}`;
      }
    }
    
    return `₵${baseDisplayPriceGhs.toFixed(2)}`;
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Price & MOQ */}
      <div className="flex flex-col gap-2">
        <div className="flex items-baseline gap-2">
          <span className="text-4xl font-extrabold text-primary font-sans tracking-tight">{renderPrice()}</span>
        </div>
        <div>
          {(product.min_order_quantity || 1) <= 1 ? (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-bold bg-green-500/10 text-green-600 border border-green-500/20">
              MOQ: 1
            </span>
          ) : (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-bold bg-amber-500/10 text-amber-600 border border-amber-500/20">
              Wholesale MOQ: {product.min_order_quantity}+
            </span>
          )}
        </div>
      </div>

      {/* Primary Filters (Thumbnail Grids) */}
      {filterOptionTypes.map(type => (
        <div key={type} className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 mb-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20 shadow-sm">
                <Layers className="w-5 h-5 text-primary" />
              </div>
              <h3 className="text-xl font-extrabold capitalize tracking-tight text-foreground">{type}</h3>
            </div>
            <span className="text-xs sm:text-sm font-medium text-primary bg-primary/10 px-3 py-1 rounded-full border border-primary/20 truncate max-w-full sm:max-w-[200px] w-fit shadow-sm">{selectedFilters[type] || "Select an option"}</span>
          </div>
          <div className="grid grid-rows-2 grid-flow-col sm:grid-rows-none sm:grid-flow-row sm:grid-cols-4 gap-3 overflow-x-auto sm:overflow-x-visible pb-4 sm:pb-0 pr-4 sm:pr-0 custom-scrollbar snap-x snap-mandatory" style={{ gridAutoColumns: '38%' }}>
            {(optionValues[type] || []).map(val => {
              const isSelected = selectedFilters[type] === val;
              
              const variantWithImg = variants.find(v => {
                const combo = v.combination || v.variant_options;
                return combo && combo[type] === val && !!v.image_url;
              });

              return (
                <button
                  key={val}
                  onClick={() => handleFilterSelect(type, val)}
                  className={`group relative overflow-hidden rounded-2xl border-2 transition-all duration-300 snap-start ${
                    isSelected 
                      ? "border-primary bg-primary/5 shadow-md shadow-primary/20" 
                      : "border-border/50 bg-secondary/20 hover:border-primary/40 hover:bg-secondary/40 hover:-translate-y-0.5"
                  }`}
                >
                  {variantWithImg?.image_url ? (
                    <div className="flex flex-col h-full">
                      <div className="w-full aspect-square bg-white overflow-hidden p-1 rounded-t-xl">
                        <img 
                          src={variantWithImg.image_url} 
                          alt={val} 
                          className="w-full h-full object-cover rounded-lg group-hover:scale-110 transition-transform duration-700 ease-out" 
                        />
                      </div>
                      <div className={`w-full py-2.5 px-2 text-xs sm:text-sm font-semibold text-center flex-1 flex items-center justify-center transition-colors capitalize ${isSelected ? "text-primary" : "text-muted-foreground group-hover:text-foreground"}`}>
                        <span className="line-clamp-2 leading-snug">{val}</span>
                      </div>
                      {isSelected && (
                        <div className="absolute top-2 right-2 bg-primary text-white rounded-full p-0.5 shadow-sm">
                          <Check className="w-3 h-3" />
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className={`px-4 py-3 text-sm font-medium w-full text-center ${isSelected ? "text-primary" : "text-muted-foreground group-hover:text-foreground"}`}>
                      {val}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      ))}

      {/* Secondary List (The List) */}
      <div className="pt-8 border-t border-border/50 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 mb-5">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20 shadow-sm">
              <ListChecks className="w-5 h-5 text-primary" />
            </div>
            <h3 className="text-xl font-extrabold capitalize tracking-tight text-foreground">{listOptionType || 'Quantity'}</h3>
          </div>
          <span className="text-xs sm:text-sm font-medium text-muted-foreground bg-secondary/80 px-3 py-1 rounded-full border border-border shrink-0 w-fit shadow-sm">Select quantities</span>
        </div>

        <div className="flex flex-col gap-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
          {variants.length === 0 ? (
            <div className="flex items-center justify-between p-4 rounded-2xl bg-secondary/20 border-2 border-border/50">
              <div className="flex flex-col">
                <span className="font-bold text-foreground">Standard</span>
                <span className="text-xs text-muted-foreground mt-0.5">{product.stock} pieces available</span>
                <span className="font-bold text-primary text-lg mt-1 tracking-tight">₵{baseDisplayPriceGhs.toFixed(2)}</span>
              </div>
              <div className="flex items-center h-11 bg-background rounded-xl border border-border shadow-sm p-1">
                <button 
                  onClick={() => updateQuantity('base', -1, product.stock)}
                  disabled={(quantities['base'] || 0) <= 0}
                  className="w-10 h-full flex items-center justify-center rounded-lg hover:bg-secondary disabled:opacity-50 transition-colors"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <input 
                  type="number"
                  value={quantities['base'] || 0}
                  onChange={(e) => setQuantityDirect('base', parseInt(e.target.value) || 0, product.stock)}
                  className="w-12 text-center font-bold bg-transparent text-sm outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  min="0"
                  max={product.stock}
                />
                <button 
                  onClick={() => updateQuantity('base', 1, product.stock)}
                  disabled={(quantities['base'] || 0) >= product.stock}
                  className="w-10 h-full flex items-center justify-center rounded-lg hover:bg-secondary disabled:opacity-50 transition-colors text-primary"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            displayedVariants.map(v => {
              const combo = v.combination || v.variant_options;
              const listValue = listOptionType && combo ? combo[listOptionType] : 'Standard';
              
              const vPriceGhs = v.selling_price_ghs !== null && v.selling_price_ghs !== undefined
                ? parseFloat(v.selling_price_ghs) : baseDisplayPriceGhs;
                
              const stock = v.stock;
              const qty = quantities[v.id] || 0;

              return (
                <div key={v.id} className={`flex flex-row items-center justify-between gap-2 p-3 sm:p-4 rounded-xl sm:rounded-2xl border-2 transition-all duration-300 ${qty > 0 ? 'bg-primary/5 border-primary shadow-sm shadow-primary/10' : 'bg-secondary/20 border-border/50 hover:border-border'}`}>
                  <div className="flex flex-col pr-1 flex-1 min-w-0">
                    <span className="font-bold text-sm text-foreground line-clamp-2 leading-tight">{listValue}</span>
                    <span className="text-[10px] sm:text-xs text-muted-foreground mt-0.5">{stock} available</span>
                    <span className="font-bold text-primary text-base sm:text-lg mt-0.5 tracking-tight">₵{vPriceGhs.toFixed(2)}</span>
                  </div>
                  
                  <div className="flex items-center justify-end shrink-0">
                    {stock > 0 ? (
                      <div className="flex items-center h-9 sm:h-11 bg-background rounded-lg sm:rounded-xl border border-border shadow-sm p-1">
                        <button 
                          onClick={() => updateQuantity(v.id, -1, stock)}
                          disabled={qty <= 0}
                          className="w-8 sm:w-10 h-full flex items-center justify-center rounded-md sm:rounded-lg hover:bg-secondary disabled:opacity-50 transition-colors"
                        >
                          <Minus className="w-3 h-3 sm:w-4 sm:h-4" />
                        </button>
                        <input 
                          type="number"
                          value={qty}
                          onChange={(e) => setQuantityDirect(v.id, parseInt(e.target.value) || 0, stock)}
                          className="w-10 sm:w-12 text-center font-bold bg-transparent text-sm outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                          min="0"
                          max={stock}
                        />
                        <button 
                          onClick={() => updateQuantity(v.id, 1, stock)}
                          disabled={qty >= stock}
                          className="w-8 sm:w-10 h-full flex items-center justify-center rounded-md sm:rounded-lg hover:bg-secondary disabled:opacity-50 transition-colors text-primary"
                        >
                          <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
                        </button>
                      </div>
                    ) : (
                      <span className="text-xs sm:text-sm font-bold text-red-500 px-2 sm:px-3 py-1 sm:py-1.5 bg-red-500/10 rounded-lg">Out of Stock</span>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Fixed Actions Area */}
      <div className="fixed bottom-0 inset-x-0 bg-background/95 backdrop-blur-xl p-4 pb-safe border-t border-border shadow-[0_-10px_40px_rgba(0,0,0,0.1)] dark:shadow-[0_-10px_40px_rgba(0,0,0,0.5)] z-50 md:static md:bg-transparent md:p-0 md:border-t md:border-border/50 md:pt-6 md:pb-0 md:shadow-none flex items-center gap-3 sm:gap-4">
        <button 
          onClick={() => {
            if (isWishlisted) {
              removeFromWishlist(product.id);
            } else {
              addToWishlist({
                id: product.id,
                name: product.name,
                imageUrl: product.images?.[0] || product.image_url || "https://placehold.co/300",
                priceGhs: baseDisplayPriceGhs,
                priceCny: baseDisplayPriceCny
              });
            }
          }}
          className="w-12 sm:w-14 h-12 sm:h-14 flex shrink-0 items-center justify-center rounded-xl border border-border bg-card hover:bg-secondary transition-all group shadow-sm"
          aria-label="Add to wishlist"
        >
          <Heart 
            className={`w-5 h-5 sm:w-6 sm:h-6 transition-colors ${
              isWishlisted 
                ? "fill-red-500 text-red-500 group-hover:fill-red-600 group-hover:text-red-600" 
                : "text-muted-foreground group-hover:text-foreground"
            }`} 
          />
        </button>

        <button 
          onClick={handleAddToCart}
          disabled={totalSelectedQuantity === 0}
          className={`flex-1 h-12 sm:h-14 flex items-center justify-center rounded-xl font-bold transition-all gap-2 text-base sm:text-lg ${
            added 
              ? "bg-green-500 text-white shadow-lg shadow-green-500/25"
              : totalSelectedQuantity > 0
                ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25 hover:bg-primary/90 hover:scale-[1.02]"
                : "bg-secondary text-muted-foreground cursor-not-allowed"
          }`}
        >
          {added ? (
            "Added to Cart!"
          ) : totalSelectedQuantity === 0 ? (
            "Select Quantity"
          ) : (
            <>
              <ShoppingCart className="w-5 h-5 sm:w-6 sm:h-6" /> Add to Cart ({totalSelectedQuantity})
            </>
          )}
        </button>
      </div>
    </div>
  );
}
