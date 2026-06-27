import { Suspense } from "react";
import {
  getShopProducts,
  getTopPurchasedProducts,
  getTrendingProducts,
  getNewArrivals,
  getBestSellers,
} from "./actions";
import ProductCard from "../../components/shop/product-card";
import ShopHeader from "../../components/shop/shop-header";
import HeroCarousel from "../../components/shop/hero-carousel";
import ProductSection from "../../components/shop/product-section";
import MobileBottomNav from "../../components/shop/mobile-bottom-nav";
import FloatingCart from "../../components/shop/floating-cart";
import ShopLayoutWrapper from "../../components/shop/shop-layout-wrapper";
import { Search, ShoppingBag, ArrowRight, ArrowLeft, Flame, Sparkles, Trophy } from "lucide-react";
import Link from "next/link";
import { getSecureWalletBalance } from "../dashboard/wallet/shared-actions";

export const metadata = {
  title: "C2G Mall | Best Online Shop in Ghana",
  description:
    "Buy cheap quality goods from China at C2G Mall. Fast shipping from China to Ghana.",
};

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; query?: string; sort?: string; minPrice?: string; maxPrice?: string; page?: string }>;
}) {
  const resolvedParams = await searchParams;

  const paramsForProducts = {
    ...resolvedParams,
    page: resolvedParams.page ? parseInt(resolvedParams.page, 10) : undefined
  };

  // Fetch all data in parallel
  const [allProductsResult, topPurchasedResult, trendingResult, newArrivalsResult, bestSellersResult, walletRes] =
    await Promise.all([
      getShopProducts(paramsForProducts),
      getTopPurchasedProducts(5),
      getTrendingProducts(),
      getNewArrivals(),
      getBestSellers(),
      getSecureWalletBalance(),
    ]);

  const { products, exchangeRate, error, currentPage, totalPages } = allProductsResult;
  const { products: topPurchasedProducts } = topPurchasedResult;
  const { products: trendingProducts } = trendingResult;
  const { products: newProducts } = newArrivalsResult;
  const { products: bestProducts } = bestSellersResult;

  const isSearching = !!(resolvedParams.query || (resolvedParams.category && resolvedParams.category !== "all") || resolvedParams.sort);
  const isFirstPage = !currentPage || currentPage === 1;
  const showHeroAndSections = !isSearching && isFirstPage;
  const hasProducts = products && products.length > 0;

  return (
    <div className="bg-background min-h-screen pb-20 md:pb-8 pt-14 md:pt-16">
      {/* Fixed Shop Header (Search + Category Chips) */}
      <Suspense fallback={<div className="h-28 bg-background" />}>
        <ShopHeader walletBalance={walletRes.available_balance} />
      </Suspense>

      <ShopLayoutWrapper>
        {/* ═══════════ HOMEPAGE VIEW (no search/category active) ═══════════ */}
        {!isSearching ? (
          <div className="space-y-8 md:space-y-12">
            {showHeroAndSections && (
              <>
                {/* Hero Banner Carousel */}
                {topPurchasedProducts.length > 0 && (
                  <section className="w-full">
                    <HeroCarousel products={topPurchasedProducts} />
                  </section>
                )}

                {/* 🔥 Trending Products */}
                {trendingProducts.length > 0 && (
                  <section className="w-full">
                    <ProductSection title="Trending Now" icon={<Flame className="w-5 h-5 text-orange-500" />} href="/shop?sort=trending">
                    {trendingProducts.map((product: any) => (
                      <ProductCard
                        key={product.id}
                        product={product}
                        exchangeRate={exchangeRate || 1}
                        variant="scroll"
                      />
                    ))}
                    </ProductSection>
                  </section>
                )}

                {/* 🆕 New Arrivals */}
                {newProducts.length > 0 && (
                  <section className="w-full">
                    <ProductSection title="New Arrivals" icon={<Sparkles className="w-5 h-5 text-yellow-500" />} href="/shop?sort=newest">
                    {newProducts.map((product: any) => (
                      <ProductCard
                        key={product.id}
                        product={product}
                        exchangeRate={exchangeRate || 1}
                        variant="scroll"
                      />
                    ))}
                    </ProductSection>
                  </section>
                )}

                {/* 🏆 Best Sellers */}
                {bestProducts.length > 0 && (
                  <section className="w-full">
                    <ProductSection title="Best Sellers" icon={<Trophy className="w-5 h-5 text-yellow-600" />}>
                    {bestProducts.map((product: any) => (
                      <ProductCard
                        key={product.id}
                        product={product}
                        exchangeRate={exchangeRate || 1}
                        variant="scroll"
                      />
                    ))}
                    </ProductSection>
                  </section>
                )}
              </>
            )}

            {/* All Products Grid */}
            <section className="w-full">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-lg sm:text-xl font-bold flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5 text-primary" /> All Products
                </h2>
            </div>

            {hasProducts ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4">
                {products!.map((product: any) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    exchangeRate={exchangeRate || 1}
                    variant="grid"
                  />
                ))}
              </div>
            ) : (
              <EmptyProducts />
            )}

            {/* Pagination Controls */}
            {hasProducts && totalPages && totalPages > 1 && (
              <div className="flex items-center justify-center gap-4 mt-8">
                {currentPage! > 1 ? (
                  <Link
                    href={`/shop?${new URLSearchParams({ ...resolvedParams, page: String(currentPage! - 1) }).toString()}`}
                    className="px-4 py-2 border border-border rounded-lg bg-card hover:bg-secondary text-sm font-medium transition-colors"
                  >
                    Previous
                  </Link>
                ) : (
                  <button disabled className="px-4 py-2 border border-border rounded-lg bg-secondary/50 text-muted-foreground text-sm font-medium opacity-50 cursor-not-allowed">
                    Previous
                  </button>
                )}
                <span className="text-sm font-medium text-muted-foreground">
                  Page {currentPage} of {totalPages}
                </span>
                {currentPage! < totalPages! ? (
                  <Link
                    href={`/shop?${new URLSearchParams({ ...resolvedParams, page: String(currentPage! + 1) }).toString()}`}
                    className="px-4 py-2 border border-border rounded-lg bg-card hover:bg-secondary text-sm font-medium transition-colors"
                  >
                    Next
                  </Link>
                ) : (
                  <button disabled className="px-4 py-2 border border-border rounded-lg bg-secondary/50 text-muted-foreground text-sm font-medium opacity-50 cursor-not-allowed">
                    Next
                  </button>
                )}
              </div>
            )}
          </section>
        </div>
        ) : (
          /* ═══════════ SEARCH / CATEGORY VIEW ═══════════ */
          <div className="w-full py-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-3">
            <div className="flex items-center gap-4">
              <Link
                href="/shop"
                className="flex items-center justify-center w-10 h-10 rounded-full bg-secondary hover:bg-secondary/80 transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-foreground" />
              </Link>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
                {resolvedParams.query
                  ? `Results for "${resolvedParams.query}"`
                  : resolvedParams.category && resolvedParams.category !== "all"
                  ? `${resolvedParams.category.charAt(0).toUpperCase() + resolvedParams.category.slice(1)}`
                  : resolvedParams.sort === 'trending'
                  ? 'Trending Now'
                  : resolvedParams.sort === 'newest'
                  ? 'New Arrivals'
                  : resolvedParams.sort === 'popular'
                  ? 'Best Sellers'
                  : "All Products"}
              </h2>
            </div>
          </div>

          {error && (
            <div className="p-4 rounded-xl bg-destructive/10 text-destructive border border-destructive/30 mb-6 text-sm">
              Failed to load products: {error}
            </div>
          )}

          {hasProducts ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4">
              {products!.map((product: any) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  exchangeRate={exchangeRate || 1}
                  variant="grid"
                />
              ))}
            </div>
          ) : (
            <EmptySearch query={resolvedParams.query} />
            )}

          {/* Pagination Controls for Search/Category View */}
          {hasProducts && totalPages && totalPages > 1 && (
            <div className="flex items-center justify-center gap-4 mt-8">
              {currentPage! > 1 ? (
                <Link
                  href={`/shop?${new URLSearchParams({ ...resolvedParams, page: String(currentPage! - 1) }).toString()}`}
                  className="px-4 py-2 border border-border rounded-lg bg-card hover:bg-secondary text-sm font-medium transition-colors"
                >
                  Previous
                </Link>
              ) : (
                <button disabled className="px-4 py-2 border border-border rounded-lg bg-secondary/50 text-muted-foreground text-sm font-medium opacity-50 cursor-not-allowed">
                  Previous
                </button>
              )}
              <span className="text-sm font-medium text-muted-foreground">
                Page {currentPage} of {totalPages}
              </span>
              {currentPage! < totalPages! ? (
                <Link
                  href={`/shop?${new URLSearchParams({ ...resolvedParams, page: String(currentPage! + 1) }).toString()}`}
                  className="px-4 py-2 border border-border rounded-lg bg-card hover:bg-secondary text-sm font-medium transition-colors"
                >
                  Next
                </Link>
              ) : (
                <button disabled className="px-4 py-2 border border-border rounded-lg bg-secondary/50 text-muted-foreground text-sm font-medium opacity-50 cursor-not-allowed">
                  Next
                </button>
              )}
            </div>
          )}
          </div>
        )}
      </ShopLayoutWrapper>

      {/* Floating Cart (Desktop) */}
      <FloatingCart />

      {/* Mobile Bottom Nav */}
      <MobileBottomNav />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// Empty States
// ═══════════════════════════════════════════════════════════════════
function EmptyProducts() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center mb-5">
        <ShoppingBag className="w-10 h-10 text-muted-foreground" />
      </div>
      <h3 className="text-xl font-bold mb-2">No Products Yet</h3>
      <p className="text-muted-foreground text-sm max-w-sm mb-6">
        Products are being added by importers. Check back soon for amazing deals!
      </p>
      <Link
        href="/dashboard/link-orders/new"
        className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-2.5 rounded-full font-bold text-sm shadow-lg shadow-primary/25 hover:scale-105 transition-transform"
      >
        Request an Item <ArrowRight className="w-4 h-4" />
      </Link>
    </div>
  );
}

function EmptySearch({ query }: { query?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center mb-5">
        <Search className="w-10 h-10 text-muted-foreground" />
      </div>
      <h3 className="text-xl font-bold mb-2">No products found</h3>
      <p className="text-muted-foreground text-sm max-w-sm mb-6">
        {query
          ? `We couldn't find anything matching "${query}". Try a different search.`
          : "Try adjusting your filters to find what you're looking for."}
      </p>
      <Link
        href="/shop"
        className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-2.5 rounded-full font-bold text-sm shadow-lg shadow-primary/25 hover:scale-105 transition-transform"
      >
        Browse All Products
      </Link>
    </div>
  );
}
