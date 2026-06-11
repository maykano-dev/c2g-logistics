"use client";

import { Search, Filter } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useCallback } from "react";

export default function ShopClientFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const currentCategory = searchParams.get("category") || "all";
  const currentQuery = searchParams.get("query") || "";

  const [query, setQuery] = useState(currentQuery);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

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

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    router.push("/shop?" + createQueryString("query", query));
  };

  const handleCategoryClick = (category: string) => {
    router.push("/shop?" + createQueryString("category", category));
  };

  const categories = [
    { id: "all", name: "All Categories" },
    { id: "smartphones", name: "Smartphones" },
    { id: "laptops", name: "Laptops & Computers" },
    { id: "fashion", name: "Fashion" },
    { id: "kitchenware", name: "Kitchenware" },
    { id: "home", name: "Home" },
    { id: "audio", name: "Audio & Earbuds" },
    { id: "sneakers", name: "Sneakers" },
    { id: "gaming", name: "Gaming" },
    { id: "other", name: "Other" },
  ];

  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <form onSubmit={handleSearch} className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <input 
          type="text" 
          placeholder="Search products..." 
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex h-12 w-full rounded-full border border-input bg-background/50 pl-10 pr-4 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 shadow-sm transition-shadow"
        />
      </form>

      {/* Categories */}
      <div className="glass-panel p-5 overflow-hidden">
        <h3 className="font-bold mb-4 flex items-center gap-2 text-foreground">
          <Filter className="w-4 h-4" /> Categories
        </h3>
        <ul className="space-y-1">
          {categories.map((cat) => (
            <li key={cat.id}>
              <button 
                onClick={() => handleCategoryClick(cat.id)}
                className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                  currentCategory === cat.id 
                    ? "bg-primary text-primary-foreground font-medium" 
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                }`}
              >
                {cat.name}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Price Filter */}
      <div className="glass-panel p-5 overflow-hidden">
        <h3 className="font-bold mb-4 flex items-center gap-2 text-foreground">
          Price Range (₵)
        </h3>
        <div className="flex items-center gap-2 mb-4">
          <input 
            type="number" 
            placeholder="Min" 
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
          />
          <span className="text-muted-foreground">-</span>
          <input 
            type="number" 
            placeholder="Max" 
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
          />
        </div>
        <button className="w-full inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2">
          Apply Filter
        </button>
      </div>
    </div>
  );
}
