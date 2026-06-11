import { Search } from "lucide-react";
import { getShopProducts, getShopPromotions } from "./actions";
import ProductCard from "../../components/shop/product-card";
import ShopClientFilters from "../../components/shop/shop-filters";

export const metadata = {
  title: "C2G Mall | Best Online Shop in Ghana",
  description: "Buy cheap quality goods from China at C2G Mall. Fast shipping from China to Ghana.",
};

export default async function ShopPage({
  searchParams,
}: {
  searchParams: { category?: string; query?: string };
}) {
  const [{ products, exchangeRate, error }, { promotions }] = await Promise.all([
    getShopProducts(searchParams),
    getShopPromotions(),
  ]);

  return (
    <div className="bg-background min-h-screen pb-24">
      {/* Hero Banner Area */}
      <section className="relative w-full max-w-7xl mx-auto md:py-6 md:px-4">
        <div className="relative overflow-hidden rounded-none md:rounded-3xl h-[300px] md:h-[400px] bg-gradient-to-tr from-primary/90 to-primary/60 shadow-xl group">
          <img 
            src={promotions?.[0]?.media_url || "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?q=80&w=2070&auto=format&fit=crop"} 
            alt="C2G Mall Promotions" 
            className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-60 group-hover:scale-105 transition-transform duration-700" 
          />
          <div className="absolute inset-0 bg-black/30 backdrop-blur-[2px]"></div>
          <div className="relative h-full flex flex-col items-center justify-center text-center px-4">
            <span className="px-4 py-1.5 rounded-full bg-white/20 backdrop-blur-md text-white border border-white/30 text-sm font-medium mb-6 animate-fade-in-up">
              Welcome to C2G Mall
            </span>
            <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-4 animate-fade-in-up" style={{ animationDelay: "100ms" }}>
              Buy Cheap Quality Goods <br className="hidden md:block" /> From China
            </h1>
            <p className="text-white/90 text-sm md:text-lg max-w-2xl animate-fade-in-up" style={{ animationDelay: "200ms" }}>
              Direct from the factory to your doorstep in Ghana. No hidden fees.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 py-8 flex flex-col lg:flex-row gap-8">
        
        {/* Sidebar Filters */}
        <aside className="w-full lg:w-64 flex-shrink-0">
          <ShopClientFilters />
        </aside>

        {/* Product Grid */}
        <main className="flex-1">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
            <h2 className="text-2xl font-bold tracking-tight">
              {searchParams.query ? `Results for "${searchParams.query}"` : searchParams.category ? `${searchParams.category.charAt(0).toUpperCase() + searchParams.category.slice(1)} Products` : "All Products"}
            </h2>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">{products?.length || 0} items found</span>
              <select className="flex h-10 w-[180px] rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50">
                <option>Default Sorting</option>
                <option>Newest Arrivals</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
              </select>
            </div>
          </div>

          {error && (
            <div className="p-4 rounded-xl bg-destructive/10 text-destructive border border-destructive/30 mb-8">
              Failed to load products: {error}
            </div>
          )}

          {!products || products.length === 0 ? (
            <div className="glass-panel p-16 text-center flex flex-col items-center justify-center border-dashed border-2">
              <Search className="w-12 h-12 text-muted-foreground mb-4" />
              <h3 className="text-xl font-bold mb-2">No products found</h3>
              <p className="text-muted-foreground">Try adjusting your search or filters to find what you're looking for.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} exchangeRate={exchangeRate || 1} />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
