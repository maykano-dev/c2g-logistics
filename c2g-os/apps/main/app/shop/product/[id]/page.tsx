import { getProductDetails, getSimilarProducts } from "../../actions";
import {
  ChevronLeft,
  ShieldCheck,
  Truck,
  Plane,
  Ship,
  Store,
  Star,
  CheckCircle2,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { createClient } from "../../../../utils/supabase/server";
import ProductImages from "../../../../components/shop/product-images";
import ProductOptions from "../../../../components/shop/product-options";
import ProductCard from "../../../../components/shop/product-card";
import MobileBottomNav from "../../../../components/shop/mobile-bottom-nav";
import ProductReviews from "../../../../components/shop/product-reviews";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  const { product } = await getProductDetails(resolvedParams.id);

  if (!product) {
    return { title: "Product Not Found | C2G Mall" };
  }

  return {
    title: `${product.name} | C2G Mall`,
    description:
      product.description?.substring(0, 160) ||
      "Buy cheap quality goods from China on C2G Mall.",
  };
}

export default async function ProductPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;
  const storeSlug = typeof resolvedSearchParams.store === 'string' ? resolvedSearchParams.store : null;

  const { product, exchangeRate, error } = await getProductDetails(
    resolvedParams.id
  );

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const isLoggedIn = !!user;

  if (error || !product) {
    return (
      <div className="min-h-screen pt-24 pb-12 flex flex-col items-center justify-center">
        <div className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center mb-5">
          <Store className="w-10 h-10 text-muted-foreground" />
        </div>
        <h1 className="text-2xl font-bold mb-2">Product Not Found</h1>
        <p className="text-muted-foreground mb-8 text-sm">
          The product you're looking for doesn't exist or has been removed.
        </p>
        <Link
          href={storeSlug ? `/store/${storeSlug}` : "/shop"}
          className="inline-flex items-center justify-center rounded-full bg-primary px-8 py-3 text-sm font-bold text-primary-foreground shadow-lg shadow-primary/25 transition-all hover:bg-primary/90 hover:scale-105"
        >
          {storeSlug ? "Back to Store" : "Back to Mall"}
        </Link>
      </div>
    );
  }

  // Parse combination options if any
  const variants = product.product_variants || [];
  const hasVariants = variants.length > 0;

  const optionTypes = new Set<string>();
  const variantImages: any[] = [];
  
  variants.forEach((v: any) => {
    let combo = v.combination || v.variant_options; // Fallback to legacy variant_options
    
    if (typeof combo === 'string') {
      try {
        combo = JSON.parse(combo);
      } catch (e) {
        combo = null;
      }
    }
    
    v.combination = combo; // Mutate for downstream use (ProductOptions)
    
    if (combo && typeof combo === 'object') {
      Object.keys(combo).forEach((k) => optionTypes.add(k));
    }
    
    if (v.image_url) {
      variantImages.push({
        id: `variant-img-${v.id}`,
        image_url: v.image_url,
        is_primary: false,
        media_type: 'image'
      });
    }
  });

  // Merge variant images into product images for the gallery
  const allImages = [...(product.product_images || []), ...variantImages];

  // Fetch similar products
  const { products: similarProducts, exchangeRate: simExRate } =
    await getSimilarProducts(String(product.id), product.category);

  return (
    <div className="bg-background min-h-screen pb-24 md:pb-8">
      <div className="max-w-7xl mx-auto px-4 py-4 md:py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6 overflow-hidden">
          <Link
            href={storeSlug ? `/store/${storeSlug}` : "/shop"}
            className="hover:text-primary transition-colors flex items-center gap-1 shrink-0"
          >
            <ChevronLeft className="w-4 h-4" /> {storeSlug ? "Store Home" : "Mall"}
          </Link>
          <span className="text-border">/</span>
          <span className="capitalize shrink-0">
            {product.category || "General"}
          </span>
          <span className="text-border">/</span>
          <span className="text-foreground truncate max-w-[200px] sm:max-w-md">
            {product.name}
          </span>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          {/* Images Section */}
          <div className="w-full lg:w-1/2 flex-shrink-0">
            <ProductImages images={allImages} />
          </div>

          {/* Details Section */}
          <div className="flex-1 flex flex-col">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mb-3 leading-tight">
              {product.name}
            </h1>

            {/* Rating + Stock */}
            <div className="flex items-center gap-4 mb-6 pb-6 border-b border-border/50 flex-wrap">
              <ProductReviews productId={product.id.toString()} reviews={product.reviews || []} isLoggedIn={isLoggedIn} />
              
              <div className="w-px h-4 bg-border" />
              <span className="text-xs text-muted-foreground">
                {product.sales_count || 0} sold
              </span>
              <div className="w-px h-4 bg-border" />
              <span
                className={`text-xs font-semibold flex items-center gap-1 ${
                  product.stock > 0 || hasVariants
                    ? "text-green-500"
                    : "text-destructive"
                }`}
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                {product.stock > 0 || hasVariants ? "In Stock" : "Out of Stock"}
              </span>
            </div>

            {/* Product Options (Price, Variants, Qty, Add to Cart) */}
            <ProductOptions
              product={product}
              variants={variants}
              exchangeRate={exchangeRate || 1}
              optionTypes={Array.from(optionTypes)}
              isLoggedIn={isLoggedIn}
            />

            {/* Shipping Estimates */}
            <div className="mt-8 pt-6 border-t border-border/50">
              <h3 className="font-bold text-sm mb-4 text-muted-foreground uppercase tracking-wider">
                Estimated Shipping
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="flex items-center gap-3 p-3 rounded-xl bg-orange-500/5 border border-orange-500/20">
                  <Zap className="w-5 h-5 text-orange-500 shrink-0" />
                  <div>
                    <p className="font-bold text-xs">Air Express</p>
                    <p className="text-[10px] text-muted-foreground">
                      3–7 days
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-xl bg-blue-500/5 border border-blue-500/20">
                  <Plane className="w-5 h-5 text-blue-500 shrink-0" />
                  <div>
                    <p className="font-bold text-xs">Air Normal</p>
                    <p className="text-[10px] text-muted-foreground">
                      12–16 days
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/20">
                  <Ship className="w-5 h-5 text-emerald-500 shrink-0" />
                  <div>
                    <p className="font-bold text-xs">Sea Freight</p>
                    <p className="text-[10px] text-muted-foreground">
                      50–60 days
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Guarantees */}
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="flex items-start gap-3 p-3.5 rounded-xl bg-secondary/30 border border-border/50">
                <ShieldCheck className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-xs">Secure Payment</h4>
                  <p className="text-[10px] text-muted-foreground mt-0.5 leading-relaxed">
                    Encrypted payment via Hubtel/Paystack.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3.5 rounded-xl bg-secondary/30 border border-border/50">
                <Truck className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-xs">C2G Managed Shipping</h4>
                  <p className="text-[10px] text-muted-foreground mt-0.5 leading-relaxed">
                    We handle procurement and direct shipping to Ghana.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Product Description */}
        <details className="group mt-12 pt-6 border-t border-border">
          <summary className="flex cursor-pointer list-none items-center justify-between outline-none [&::-webkit-details-marker]:hidden">
            <h2 className="text-xl font-bold">Product Details</h2>
            <span className="transition duration-300 group-open:-rotate-180 text-muted-foreground p-2 rounded-full hover:bg-secondary">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
            </span>
          </summary>
          <div className="prose prose-sm dark:prose-invert max-w-none text-muted-foreground mt-6 animate-in fade-in slide-in-from-top-2 duration-300">
            {product.description ? (
              <div
                dangerouslySetInnerHTML={{
                  __html: product.description.replace(/\n/g, "<br/>"),
                }}
              />
            ) : (
              <p>No detailed description available for this product.</p>
            )}
          </div>
        </details>

        {/* Similar Products */}
        {similarProducts.length > 0 && (
          <div className="mt-12 pt-10 border-t border-border">
            <h2 className="text-xl font-bold mb-5 flex items-center gap-2">
              <span>💡</span> Similar Products
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-4">
              {similarProducts.map((p: any) => (
                <ProductCard
                  key={p.id}
                  product={p}
                  exchangeRate={simExRate || exchangeRate || 1}
                  variant="grid"
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Mobile Bottom Nav */}
      <MobileBottomNav />
    </div>
  );
}
