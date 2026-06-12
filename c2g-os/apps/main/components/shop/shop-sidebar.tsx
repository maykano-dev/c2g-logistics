"use client";

import {
  LayoutGrid,
  Smartphone,
  Shirt,
  Sparkles,
  Home,
  Car,
  Baby,
  Watch,
  Utensils,
  Footprints,
  Gamepad2,
  Headphones,
  Laptop,
  Check,
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useState } from "react";

export const CATEGORIES = [
  { id: "all", label: "All Products", icon: LayoutGrid },
  { id: "electronics", label: "Electronics", icon: Smartphone },
  { id: "fashion", label: "Fashion", icon: Shirt },
  { id: "beauty", label: "Beauty", icon: Sparkles },
  { id: "home", label: "Home & Garden", icon: Home },
  { id: "automotive", label: "Automotive", icon: Car },
  { id: "kids", label: "Kids & Toys", icon: Baby },
  { id: "accessories", label: "Accessories", icon: Watch },
  { id: "kitchenware", label: "Kitchenware", icon: Utensils },
  { id: "sneakers", label: "Sneakers", icon: Footprints },
  { id: "gaming", label: "Gaming", icon: Gamepad2 },
  { id: "audio", label: "Audio", icon: Headphones },
  { id: "laptops", label: "Laptops", icon: Laptop },
  { id: "smartphones", label: "Smartphones", icon: Smartphone },
];

export default function ShopSidebar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentCategory = searchParams.get("category") || "all";
  
  const [minPrice, setMinPrice] = useState(searchParams.get("minPrice") || "");
  const [maxPrice, setMaxPrice] = useState(searchParams.get("maxPrice") || "");

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value && value !== "all") {
        params.set(name, value);
      } else {
        params.delete(name);
      }
      return params.toString();
    },
    [searchParams]
  );

  const handleCategoryClick = (categoryId: string) => {
    router.push("/shop?" + createQueryString("category", categoryId));
  };

  const applyPriceFilter = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams.toString());
    
    if (minPrice) params.set("minPrice", minPrice);
    else params.delete("minPrice");
    
    if (maxPrice) params.set("maxPrice", maxPrice);
    else params.delete("maxPrice");

    router.push("/shop?" + params.toString());
  };

  const clearPriceFilter = () => {
    setMinPrice("");
    setMaxPrice("");
    const params = new URLSearchParams(searchParams.toString());
    params.delete("minPrice");
    params.delete("maxPrice");
    router.push("/shop?" + params.toString());
  };

  return (
    <aside className="w-full h-full flex flex-col gap-6">
      {/* Categories */}
      <div className="space-y-3">
        <h3 className="font-semibold text-sm text-foreground uppercase tracking-wider">Categories</h3>
        <nav className="flex flex-col space-y-1">
          {CATEGORIES.map((cat) => {
            const isActive = currentCategory === cat.id;
            const Icon = cat.icon;
            return (
              <button
                key={cat.id}
                onClick={() => handleCategoryClick(cat.id)}
                className={`flex items-center justify-between w-full px-3 py-2 text-sm rounded-lg transition-colors ${
                  isActive
                    ? "bg-primary/10 text-primary font-medium"
                    : "text-muted-foreground hover:bg-white/5 dark:hover:bg-black/10 hover:text-foreground"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4" />
                  <span>{cat.label}</span>
                </div>
                {isActive && <Check className="w-4 h-4" />}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Price Filter */}
      <div className="space-y-3 border-t border-border/50 pt-6">
        <h3 className="font-semibold text-sm text-foreground uppercase tracking-wider">Price Range (¥)</h3>
        <form onSubmit={applyPriceFilter} className="space-y-3">
          <div className="flex items-center gap-2">
            <input
              type="number"
              placeholder="Min"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              className="w-full bg-background border border-input rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
              min="0"
            />
            <span className="text-muted-foreground">-</span>
            <input
              type="number"
              placeholder="Max"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              className="w-full bg-background border border-input rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
              min="0"
            />
          </div>
          <div className="flex gap-2">
            <button
              type="submit"
              className="flex-1 bg-primary text-primary-foreground text-sm font-semibold rounded-md py-2 hover:opacity-90 transition-opacity"
            >
              Apply
            </button>
            {(searchParams.has("minPrice") || searchParams.has("maxPrice")) && (
              <button
                type="button"
                onClick={clearPriceFilter}
                className="flex-1 bg-secondary text-secondary-foreground text-sm font-semibold rounded-md py-2 hover:bg-secondary/80 transition-colors"
              >
                Clear
              </button>
            )}
          </div>
        </form>
      </div>
    </aside>
  );
}
