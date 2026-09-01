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
  FileText,
  Lightbulb,
} from "lucide-react";
import Link from "next/link";
import { createClient } from "../../../../utils/supabase/server";
import ProductImages from "../../../../components/shop/product-images";
import ProductOptions from "../../../../components/shop/product-options";
import ProductCard from "../../../../components/shop/product-card";
import ShopHeader from "../../../../components/shop/shop-header";
import { Suspense } from "react";
import { getSecureWalletBalance } from "../../../dashboard/wallet/shared-actions";

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

  const { product: rawProduct, exchangeRate, error } = await getProductDetails(
    resolvedParams.id
  );
  
  const product: any = rawProduct;

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const isLoggedIn = !!user;

  // Fast local DB fetch, won't noticeably block navigation
  const walletRes = await getSecureWalletBalance();

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
  const variants = product.variants || [];
  const hasVariants = variants.length > 0;

  const optionTypes = new Set<string>();
  const variantImages: any[] = [];
  
  variants.forEach((v: any) => {
    let combo = v.combination || v.variant_options; 
    
    if (typeof combo === 'string') {
      try {
        combo = JSON.parse(combo);
      } catch (e) {
        // Just use it as string if it's not JSON
      }
    }
    
    v.combination = combo; // Mutate for downstream use (ProductOptions)
    
    // For Alibaba Dropshipping, combinations often come as "Color:Red / Size:XL"
    // Let's parse that into object if it's a slash-separated string
    if (typeof combo === 'string' && combo.includes(':')) {
       const parsedCombo: any = {};
       combo.split(' / ').forEach(part => {
          const [k, val] = part.split(':');
          if (k && val) {
             parsedCombo[k.trim()] = val.trim();
             optionTypes.add(k.trim());
          }
       });
       v.combination = parsedCombo;
    } else if (combo && typeof combo === 'object') {
      Object.keys(combo).forEach((k) => optionTypes.add(k));
    }
    
    if (v.image_url && !variantImages.some(img => img.image_url === v.image_url)) {
      variantImages.push({
        id: `variant-img-${v.id}`,
        image_url: v.image_url,
        is_primary: false,
        media_type: 'image'
      });
    }
  });

  // Map Alibaba raw images to the shape ProductImages expects
  const mainGalleryImages = (product.images || []).map((imgUrl: any, idx: number) => ({
    id: `main-img-${idx}`,
    image_url: imgUrl,
    is_primary: idx === 0,
    media_type: 'image'
  }));

  // Merge variant images into product images for the gallery
  const rawImages = [...mainGalleryImages, ...variantImages];
  
  // Fully deduplicate all images by URL
  const allImages = rawImages.filter((img, index, self) => 
    index === self.findIndex((t) => t.image_url === img.image_url)
  );

  // Fetch similar products
  const { products: similarProducts, exchangeRate: simExRate } =
    await getSimilarProducts(String(product.id), product.category);

  return (
    <div className="bg-background min-h-screen pb-24 md:pb-8 pt-14 md:pt-16">
      {/* Fixed Shop Header */}
      <Suspense fallback={<div className="h-28 bg-background" />}>
        <ShopHeader walletBalance={walletRes.available_balance} />
      </Suspense>

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
            {(product as any).category || "General"}
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
                    Encrypted payment via Hubtel.
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
        <div className="mt-16 pt-8 border-t border-border">
          <details className="group bg-secondary/20 rounded-3xl border border-border/50 shadow-sm relative overflow-hidden transition-all duration-300">
            {/* Decorative background accent */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
            
            <summary className="p-6 sm:p-10 cursor-pointer flex items-center justify-between list-none [&::-webkit-details-marker]:hidden">
              <h2 className="text-xl sm:text-2xl font-black flex items-center gap-3 m-0">
                <span className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                  <FileText className="w-4 h-4" />
                </span>
                Product Details & Specifications
              </h2>
              <span className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center group-open:rotate-180 transition-transform duration-300 shrink-0">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
              </span>
            </summary>
            
            <div className="px-6 pb-6 sm:px-10 sm:pb-10 pt-0 prose prose-sm sm:prose-base dark:prose-invert max-w-none text-muted-foreground leading-relaxed relative z-10 border-t border-border/20 mt-[-10px]">
              {product.description ? (
                <div
                  className="[&>p]:mb-4 [&>br]:hidden [&>div]:mb-4 [&_.c2g-specs]:grid [&_.c2g-specs]:grid-cols-1 [&_.c2g-specs]:sm:grid-cols-2 [&_.c2g-specs]:gap-4 [&_.c2g-specs]:mb-8 [&_.c2g-specs>li]:bg-background/50 [&_.c2g-specs>li]:p-3 [&_.c2g-specs>li]:rounded-lg [&_.c2g-specs>li]:border [&_.c2g-specs>li]:border-border/40 [&_.c2g-specs>li>strong]:text-foreground [&_.c2g-specs>li]:text-sm"
                  dangerouslySetInnerHTML={{
                    __html: product.description
                      .replace(/<img[^>]*>/gi, '') // Strip images
                      .replace(/<video[^>]*>[\s\S]*?<\/video>/gi, '') // Strip videos
                      .replace(/<iframe[^>]*>[\s\S]*?<\/iframe>/gi, '') // Strip iframes
                      .replace(/<div class="detailmodule_image">[\s\S]*?<\/div>/gi, '') // Strip AE image wrappers
                      .replace(/\bstyle\s*=\s*(["'])(?:(?!\1).)*\1/gi, '') // Strip massive inline styles
                      .replace(/<div[^>]*>\s*<\/div>/gi, '') // Strip empty divs
                      .replace(/\n/g, "<br/>"),
                  }}
                />
              ) : (
                <p className="italic text-muted-foreground/70">No detailed description available for this product.</p>
              )}
            </div>
          </details>
        </div>

        {/* Similar Products */}
        {similarProducts.length > 0 && (
          <div className="mt-12 pt-10 border-t border-border">
            <h2 className="text-xl font-bold mb-5 flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-yellow-500" /> Similar Products
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
    </div>
  );
}
