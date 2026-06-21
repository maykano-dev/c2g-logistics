"use client";

import { useState, useMemo, useEffect, Suspense } from "react";
import { Search, Package, ChevronLeft, ChevronRight, SlidersHorizontal } from "lucide-react";
import ProductCard from "./product-card";
import { useSearchParams, useRouter, usePathname } from "next/navigation";

interface StorefrontClientProps {
  products: any[];
  exchangeRate: number;
}

function StorefrontClientContent({ products, exchangeRate }: StorefrontClientProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  
  const searchQuery = searchParams.get("query") || "";
  
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [sortOrder, setSortOrder] = useState<string>("newest");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(15);

  useEffect(() => {
    const handleResize = () => {
      setItemsPerPage(window.innerWidth < 640 ? 10 : 15);
    };
    handleResize(); // Initial check
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Extract unique categories
  const categories = useMemo(() => {
    const cats = new Set<string>();
    products.forEach((p) => {
      if (p.category) cats.add(p.category);
    });
    return ["All", ...Array.from(cats)];
  }, [products]);

  // Filter and Sort
  const filteredAndSortedProducts = useMemo(() => {
    let result = products;

    // 1. Search Filter
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (product) =>
          product.name.toLowerCase().includes(q) ||
          product.id.toString().toLowerCase().includes(q) ||
          (product.sku && product.sku.toLowerCase().includes(q))
      );
    }

    // 2. Category Filter
    if (activeCategory !== "All") {
      result = result.filter((product) => product.category === activeCategory);
    }

    // 3. Sort
    result = [...result].sort((a, b) => {
      if (sortOrder === "price-low") return a.price - b.price;
      if (sortOrder === "price-high") return b.price - a.price;
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime(); // Newest
    });

    return result;
  }, [products, searchQuery, activeCategory, sortOrder]);

  // Pagination
  const totalPages = Math.ceil(filteredAndSortedProducts.length / itemsPerPage);
  const currentProducts = filteredAndSortedProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Reset page when filters change
  const handleSearchChange = (val: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (val) params.set("query", val);
    else params.delete("query");
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
    setCurrentPage(1);
  };

  const handleCategoryChange = (cat: string) => {
    setActiveCategory(cat);
    setCurrentPage(1);
  };

  const handleSortChange = (sort: string) => {
    setSortOrder(sort);
    setCurrentPage(1);
  };

  // If search query changes externally, reset page to 1
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  return (
    <>
      {/* Categories & Sorting Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 mt-4 sm:mt-0">
        <div className="flex-1 overflow-x-auto pb-2 sm:pb-0 hide-scrollbar flex items-center gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => handleCategoryChange(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                activeCategory === cat
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "bg-secondary text-foreground hover:bg-secondary/80 border border-border"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground bg-secondary px-3 py-2 rounded-xl border border-border">
            <SlidersHorizontal className="w-4 h-4" />
            <select
              value={sortOrder}
              onChange={(e) => handleSortChange(e.target.value)}
              className="bg-transparent border-none outline-none text-foreground font-semibold cursor-pointer"
            >
              <option value="newest">Newest First</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* Products Grid Header */}
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">
          {searchQuery ? "Search Results" : activeCategory !== "All" ? activeCategory : "All Products"}
        </h2>
        <span className="text-sm font-medium text-muted-foreground">
          Showing {currentProducts.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0}-
          {Math.min(currentPage * itemsPerPage, filteredAndSortedProducts.length)} of {filteredAndSortedProducts.length}
        </span>
      </div>

      {filteredAndSortedProducts.length === 0 ? (
        <div className="glass-panel p-16 text-center flex flex-col items-center justify-center border-dashed border-2">
          <div className="w-20 h-20 bg-secondary rounded-full flex items-center justify-center mb-6">
            <Package className="w-10 h-10 text-muted-foreground" />
          </div>
          <h3 className="text-2xl font-bold mb-2">No Products Found</h3>
          <p className="text-muted-foreground max-w-md mx-auto">
            {searchQuery 
              ? `No products match your search for "${searchQuery}".`
              : "No products available in this category."}
          </p>
          {(searchQuery || activeCategory !== "All") && (
            <button 
              onClick={() => { handleSearchChange(""); handleCategoryChange("All"); }}
              className="mt-6 text-primary font-bold hover:underline"
            >
              Clear Filters
            </button>
          )}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
            {currentProducts.map((product) => (
              <ProductCard key={product.id} product={product} exchangeRate={exchangeRate} />
            ))}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="mt-12 flex items-center justify-center gap-2">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-2 rounded-xl border border-border bg-background hover:bg-secondary disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              
              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`w-10 h-10 rounded-xl font-bold text-sm transition-colors ${
                      currentPage === i + 1
                        ? "bg-primary text-primary-foreground shadow-md"
                        : "border border-border bg-background hover:bg-secondary"
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>

              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="p-2 rounded-xl border border-border bg-background hover:bg-secondary disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </>
      )}
    </>
  );
}

export default function StorefrontClient({ products, exchangeRate }: StorefrontClientProps) {
  return (
    <Suspense fallback={
      <div className="flex flex-col gap-6">
        <div className="h-12 bg-secondary animate-pulse rounded-xl w-full" />
        <div className="h-10 bg-secondary animate-pulse rounded-full w-[300px]" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="h-48 bg-secondary animate-pulse rounded-xl" />
          <div className="h-48 bg-secondary animate-pulse rounded-xl" />
          <div className="h-48 bg-secondary animate-pulse rounded-xl" />
          <div className="h-48 bg-secondary animate-pulse rounded-xl" />
        </div>
      </div>
    }>
      <StorefrontClientContent products={products} exchangeRate={exchangeRate} />
    </Suspense>
  );
}
