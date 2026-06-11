import Link from "next/link";
import { ShoppingCart } from "lucide-react";

export default function ProductCard({ product, exchangeRate }: { product: any; exchangeRate: number }) {
  const images = product.product_images?.filter((img: any) => img.media_type !== "video") || [];
  const primaryImage = images.find((img: any) => img.is_primary) || images[0] || product.product_images?.[0];
  const imageUrl = primaryImage?.image_url || "https://placehold.co/300x300/e9ecef/6c757d?text=N/A";

  const hasVariants = product.product_variants && product.product_variants.length > 0;
  
  // Use price_cny directly, fallback to GHS converted back to CNY if missing.
  const priceCny = product.price_cny !== null ? parseFloat(product.price_cny) : (parseFloat(product.price) * exchangeRate);
  const priceGhs = priceCny / exchangeRate;

  return (
    <div className="group glass-panel overflow-hidden transition-all duration-300 hover:shadow-xl hover:border-primary/20 hover:-translate-y-1 flex flex-col h-full">
      <Link href={`/shop/product/${product.id}`} className="relative block aspect-square overflow-hidden bg-secondary">
        <img 
          src={imageUrl} 
          alt={product.name} 
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {product.stock <= 0 && !hasVariants && (
          <div className="absolute top-2 right-2 px-2 py-1 bg-destructive/90 text-destructive-foreground text-xs font-bold rounded-md backdrop-blur-sm">
            Out of Stock
          </div>
        )}
      </Link>
      
      <div className="p-4 sm:p-5 flex flex-col flex-grow">
        <Link href={`/shop/product/${product.id}`} className="group-hover:text-primary transition-colors">
          <h3 className="font-semibold text-sm sm:text-base line-clamp-2 mb-2 leading-tight">
            {product.name}
          </h3>
        </Link>
        
        <div className="mt-auto pt-4 flex flex-col">
          <div className="flex items-baseline gap-1.5 mb-3">
            <span className="text-xs text-muted-foreground">{hasVariants ? "From" : ""}</span>
            <span className="font-bold text-lg text-primary">₵{priceGhs.toFixed(2)}</span>
            <span className="text-xs text-muted-foreground ml-1 line-through opacity-70">¥{priceCny.toFixed(2)}</span>
          </div>
          
          <button className={`w-full inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring h-10 px-4 gap-2 ${
            hasVariants 
              ? "border border-input bg-background hover:bg-accent hover:text-accent-foreground" 
              : "bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm"
          }`}>
            {hasVariants ? "See Options" : <><ShoppingCart className="w-4 h-4" /> Add to Cart</>}
          </button>
        </div>
      </div>
    </div>
  );
}
