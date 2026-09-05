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
import { PromoSection } from "../../components/shop/promo-section";
import { AnnouncementBanner } from "../../components/shop/announcement-banner";
import { Search, ShoppingBag, ArrowRight, ArrowLeft, Flame, Sparkles, Trophy } from "lucide-react";
import Link from "next/link";
import { getSecureWalletBalance } from "../dashboard/wallet/shared-actions";

export const metadata = {
  title: "C2G Mall | Best Online Shop in Ghana",
  description:
    "Buy cheap quality goods from China at C2G Mall. Fast shipping from China to Ghana.",
};

export const dynamic = 'force-dynamic';

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; query?: string; sort?: string; minPrice?: string; maxPrice?: string; page?: string; searchId?: string }>;
}) {
  const resolvedParams = await searchParams;
  const suspenseKey = JSON.stringify(resolvedParams);

  // Fast local DB fetch, won't noticeably block navigation
  const walletRes = await getSecureWalletBalance();

  return (
    <div className="bg-background min-h-screen pb-20 md:pb-8 pt-20 md:pt-24">
      {/* Fixed Shop Header + Announcement Banner */}
      <div className="fixed top-0 left-0 right-0 z-50">
        <AnnouncementBanner />
        <Suspense fallback={<div className="h-20 bg-background border-b border-border/50" />}>
          <ShopHeader walletBalance={walletRes.available_balance} />
        </Suspense>
      </div>

      <ShopLayoutWrapper>
        {/* Suspense boundary with a key tied to search parameters.
            This ensures that when a user clicks a category (changing searchParams),
            Next.js instantly updates the URL, instantly re-renders this layout shell 
            (updating the active sidebar tab), and throws away the old content to show 
            this fallback skeleton while fetching new data in the background. */}
        <Suspense key={suspenseKey} fallback={<ShopInnerLoading />}>
          <ShopContent resolvedParams={resolvedParams} />
        </Suspense>
      </ShopLayoutWrapper>


      {/* Mobile Bottom Nav */}
      <MobileBottomNav />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// Async Content Component
// ═══════════════════════════════════════════════════════════════════
async function ShopContent({
  resolvedParams,
}: {
  resolvedParams: { category?: string; query?: string; sort?: string; minPrice?: string; maxPrice?: string; page?: string; searchId?: string };
}) {
  const paramsForProducts = {
    ...resolvedParams,
    imageId: resolvedParams.searchId,
    page: resolvedParams.page ? parseInt(resolvedParams.page, 10) : undefined
  };

  // Fetch all data in parallel
  const [allProductsResult, topPurchasedResult, trendingResult, newArrivalsResult, bestSellersResult] =
    await Promise.all([
      getShopProducts(paramsForProducts),
      getTopPurchasedProducts(5),
      getTrendingProducts(),
      getNewArrivals(),
      getBestSellers(),
    ]);

  const { products, exchangeRate, currentPage, totalPages } = allProductsResult;
  const { products: topPurchasedProducts } = topPurchasedResult;
  const { products: trendingProducts } = trendingResult;
  const { products: newProducts } = newArrivalsResult;
  const { products: bestProducts } = bestSellersResult;

  const isSearching = !!(resolvedParams.query || resolvedParams.searchId || (resolvedParams.category && resolvedParams.category !== "all") || resolvedParams.sort);
  const isFirstPage = !currentPage || currentPage === 1;
  const showHeroAndSections = !isSearching && isFirstPage;
  const hasProducts = products && products.length > 0;

  return (
    <>
      {/* ═══════════ HOMEPAGE VIEW (no search/category active) ═══════════ */}
      {!isSearching ? (
        <div className="space-y-8 md:space-y-12">
          {showHeroAndSections && (
            <>
              {/* Promotional Bento Box Grid */}
              <PromoSection />

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
                {resolvedParams.searchId
                  ? "Visual Search Results"
                  : resolvedParams.query
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
    </>
  );
}

// ═══════════════════════════════════════════════════════════════════
// Skeletons & Empty States
// ═══════════════════════════════════════════════════════════════════
function ShopInnerLoading() {
  return (
    <div className="w-full py-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-full bg-secondary/50 animate-pulse" />
        <div className="h-8 w-48 bg-secondary/50 animate-pulse rounded" />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4">
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={i} className="flex flex-col gap-2 p-3 border border-border/50 rounded-xl bg-card">
            <div className="w-full aspect-[4/5] bg-secondary/50 animate-pulse rounded-lg"></div>
            <div className="h-4 w-3/4 bg-secondary/50 animate-pulse rounded mt-2" />
            <div className="h-4 w-1/2 bg-secondary/50 animate-pulse rounded" />
            <div className="h-8 w-full bg-secondary/50 animate-pulse rounded-lg mt-2" />
          </div>
        ))}
      </div>
    </div>
  );
}

function EmptyProducts() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center mb-5">
        <ShoppingBag className="w-10 h-10 text-muted-foreground" />
      </div>
      <h3 className="text-xl font-bold mb-2">Search the Global Market</h3>
      <p className="text-muted-foreground text-sm max-w-sm mb-6">
        Search above to instantly browse millions of products from verified global suppliers. 
      </p>
      <Link
        href="/dashboard/link-orders/new"
        className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-2.5 rounded-full font-bold text-sm shadow-lg shadow-primary/25 hover:scale-105 transition-transform"
      >
        Paste a Link Instead <ArrowRight className="w-4 h-4" />
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
