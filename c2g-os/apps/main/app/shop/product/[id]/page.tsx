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
import ProductImages from "../../../../components/shop/product-images";
import ProductOptions from "../../../../components/shop/product-options";
import ProductCard from "../../../../components/shop/product-card";
import MobileBottomNav from "../../../../components/shop/mobile-bottom-nav";

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
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  const { product, exchangeRate, error } = await getProductDetails(
    resolvedParams.id
  );

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
          href="/shop"
          className="inline-flex items-center justify-center rounded-full bg-primary px-8 py-3 text-sm font-bold text-primary-foreground shadow-lg shadow-primary/25 transition-all hover:bg-primary/90 hover:scale-105"
        >
          Back to Mall
        </Link>
      </div>
    );
  }

  // Parse combination options if any
  const variants = product.product_variants || [];
  const hasVariants = variants.length > 0;

  // Extract unique options
  const optionTypes = new Set<string>();
  variants.forEach((v: any) => {
    if (v.combination) {
      Object.keys(v.combination).forEach((k) => optionTypes.add(k));
    }
  });

  // Fetch similar products
  const { products: similarProducts, exchangeRate: simExRate } =
    await getSimilarProducts(String(product.id), product.category);

  return (
    <div className="bg-background min-h-screen pb-24 md:pb-8">
      <div className="max-w-7xl mx-auto px-4 py-4 md:py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6 overflow-hidden">
          <Link
            href="/shop"
            className="hover:text-primary transition-colors flex items-center gap-1 shrink-0"
          >
            <ChevronLeft className="w-4 h-4" /> Mall
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
            <ProductImages images={product.product_images} />
          </div>

          {/* Details Section */}
          <div className="flex-1 flex flex-col">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mb-3 leading-tight">
              {product.name}
            </h1>

            {/* Rating + Stock */}
            <div className="flex items-center gap-4 mb-6 pb-6 border-b border-border/50 flex-wrap">
              <div className="flex items-center gap-1 text-yellow-500">
                <span className="font-medium text-foreground mr-1 text-sm">
                  4.8
                </span>
                {"★★★★★".split("").map((star, i) => (
                  <Star
                    key={i}
                    className="w-3.5 h-3.5 fill-yellow-500 text-yellow-500"
                  />
                ))}
                <span className="text-muted-foreground ml-2 text-xs">
                  (124)
                </span>
              </div>
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
                      3–5 days
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-xl bg-blue-500/5 border border-blue-500/20">
                  <Plane className="w-5 h-5 text-blue-500 shrink-0" />
                  <div>
                    <p className="font-bold text-xs">Air Normal</p>
                    <p className="text-[10px] text-muted-foreground">
                      10–14 days
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/20">
                  <Ship className="w-5 h-5 text-emerald-500 shrink-0" />
                  <div>
                    <p className="font-bold text-xs">Sea Freight</p>
                    <p className="text-[10px] text-muted-foreground">
                      30–45 days
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
        <div className="mt-12 pt-10 border-t border-border">
          <h2 className="text-xl font-bold mb-5">Product Details</h2>
          <div className="prose prose-sm dark:prose-invert max-w-none text-muted-foreground">
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
        </div>

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
