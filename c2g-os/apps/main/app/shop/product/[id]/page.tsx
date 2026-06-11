import { getProductDetails } from "../../actions";
import { ChevronLeft, Package, ShieldCheck, Truck, ArrowRight } from "lucide-react";
import Link from "next/link";
import ProductImages from "../../../../components/shop/product-images";
import ProductOptions from "../../../../components/shop/product-options";

export async function generateMetadata({ params }: { params: { id: string } }) {
  const { product } = await getProductDetails(params.id);
  
  if (!product) {
    return {
      title: "Product Not Found | C2G Mall",
    };
  }
  
  return {
    title: `${product.name} | C2G Mall`,
    description: product.description?.substring(0, 160) || "Buy cheap quality goods from China on C2G Mall.",
  };
}

export default async function ProductPage({ params }: { params: { id: string } }) {
  const { product, exchangeRate, error } = await getProductDetails(params.id);

  if (error || !product) {
    return (
      <div className="min-h-screen pt-24 pb-12 flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
        <p className="text-muted-foreground mb-8">The product you're looking for doesn't exist or has been removed.</p>
        <Link href="/shop" className="inline-flex items-center justify-center rounded-md bg-primary px-8 py-3 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90">
          Back to Shop
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
      Object.keys(v.combination).forEach(k => optionTypes.add(k));
    }
  });

  return (
    <div className="bg-background min-h-screen pb-24">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Breadcrumb & Back */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
          <Link href="/shop" className="hover:text-primary transition-colors flex items-center gap-1">
            <ChevronLeft className="w-4 h-4" /> Back to Shop
          </Link>
          <span>/</span>
          <span className="capitalize">{product.category || "General"}</span>
          <span>/</span>
          <span className="text-foreground truncate max-wxs sm:max-w-md">{product.name}</span>
        </div>

        <div className="flex flex-col lg:flex-row gap-12">
          {/* Images Section */}
          <div className="w-full lg:w-1/2 flex-shrink-0">
            <ProductImages images={product.product_images} />
          </div>

          {/* Details Section */}
          <div className="flex-1 flex flex-col">
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-2">
              {product.name}
            </h1>
            
            <div className="flex items-center gap-4 mb-6 pb-6 border-b border-border/50">
              <div className="flex items-center gap-1 text-yellow-500">
                {/* Simulated Rating */}
                <span className="font-medium text-foreground mr-1">4.8</span>
                {"★★★★★".split("").map((star, i) => (
                  <span key={i}>{star}</span>
                ))}
                <span className="text-muted-foreground ml-2 text-sm">(124 reviews)</span>
              </div>
              <div className="w-px h-4 bg-border"></div>
              <span className="text-sm text-green-500 font-medium flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" /> {product.stock > 0 || hasVariants ? "In Stock" : "Out of Stock"}
              </span>
            </div>

            <ProductOptions 
              product={product} 
              variants={variants} 
              exchangeRate={exchangeRate || 1} 
              optionTypes={Array.from(optionTypes)} 
            />

            {/* Guarantees */}
            <div className="mt-8 pt-8 border-t border-border/50 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-start gap-3 p-4 rounded-xl bg-secondary/30">
                <ShieldCheck className="w-6 h-6 text-primary shrink-0" />
                <div>
                  <h4 className="font-bold text-sm">Secure Payment</h4>
                  <p className="text-xs text-muted-foreground mt-1">Your payment is encrypted and secure via Paystack.</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 rounded-xl bg-secondary/30">
                <Truck className="w-6 h-6 text-primary shrink-0" />
                <div>
                  <h4 className="font-bold text-sm">C2G Managed Shipping</h4>
                  <p className="text-xs text-muted-foreground mt-1">We handle procurement and direct shipping to Ghana.</p>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Product Description */}
        <div className="mt-16 pt-16 border-t border-border">
          <h2 className="text-2xl font-bold mb-6">Product Details</h2>
          <div className="prose prose-sm sm:prose-base dark:prose-invert max-w-none text-muted-foreground">
            {product.description ? (
              <div dangerouslySetInnerHTML={{ __html: product.description.replace(/\n/g, '<br/>') }} />
            ) : (
              <p>No detailed description available for this product.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Ensure CheckCircle2 is imported, I forgot to import it at the top
import { CheckCircle2 } from "lucide-react";
