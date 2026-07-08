import ShopLayoutWrapper from "../../components/shop/shop-layout-wrapper";
import { Loader2 } from "lucide-react";

export default function ShopLoading() {
  return (
    <div className="bg-background min-h-screen pb-20 md:pb-8 pt-14 md:pt-16">
      {/* Header Skeleton */}
      <div className="h-28 bg-background border-b border-border flex flex-col justify-center px-4 md:px-8">
        <div className="flex items-center justify-between max-w-7xl mx-auto w-full">
          <div className="w-1/3 h-10 bg-secondary/50 animate-pulse rounded-full"></div>
          <div className="w-1/4 h-10 bg-secondary/50 animate-pulse rounded-full"></div>
        </div>
      </div>

      <ShopLayoutWrapper>
        <div className="w-full py-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-secondary/50 animate-pulse" />
            <div className="h-8 w-48 bg-secondary/50 animate-pulse rounded" />
          </div>

          {/* Product Grid Skeleton */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4">
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="flex flex-col gap-2 p-3 border border-border/50 rounded-xl bg-card">
                <div className="w-full aspect-[4/5] bg-secondary/50 animate-pulse rounded-lg flex items-center justify-center">
                  <Loader2 className="w-8 h-8 text-muted-foreground/30 animate-spin" />
                </div>
                <div className="h-4 w-3/4 bg-secondary/50 animate-pulse rounded mt-2" />
                <div className="h-4 w-1/2 bg-secondary/50 animate-pulse rounded" />
                <div className="h-8 w-full bg-secondary/50 animate-pulse rounded-lg mt-2" />
              </div>
            ))}
          </div>
        </div>
      </ShopLayoutWrapper>
    </div>
  );
}
