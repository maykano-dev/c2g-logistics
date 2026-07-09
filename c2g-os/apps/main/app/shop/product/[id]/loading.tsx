export default function ProductLoading() {
  return (
    <div className="bg-background min-h-screen pb-24 md:pb-8 pt-14 md:pt-16">
      <div className="max-w-7xl mx-auto px-4 py-4 md:py-8">
        {/* Breadcrumb Skeleton */}
        <div className="w-1/3 h-5 bg-secondary/50 animate-pulse rounded mb-6"></div>

        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          {/* Images Section Skeleton */}
          <div className="w-full lg:w-1/2 flex-shrink-0 flex flex-col gap-4">
            <div className="w-full aspect-square bg-secondary/50 animate-pulse rounded-2xl"></div>
            <div className="hidden md:flex gap-2">
               {Array.from({ length: 5 }).map((_, i) => (
                 <div key={i} className="w-16 h-16 bg-secondary/50 animate-pulse rounded-lg shrink-0"></div>
               ))}
            </div>
          </div>

          {/* Details Section Skeleton */}
          <div className="flex-1 flex flex-col">
            <div className="w-3/4 h-10 bg-secondary/50 animate-pulse rounded mb-4"></div>
            
            <div className="flex gap-2 mb-4">
               <div className="w-32 h-6 bg-secondary/50 animate-pulse rounded"></div>
               <div className="w-24 h-6 bg-secondary/50 animate-pulse rounded"></div>
            </div>

            <div className="w-full h-px bg-border/50 my-6"></div>
            
            <div className="w-1/3 h-8 bg-secondary/50 animate-pulse rounded mb-6"></div>

            <div className="space-y-4 mb-8">
               <div className="w-1/4 h-4 bg-secondary/50 animate-pulse rounded"></div>
               <div className="flex gap-2">
                 {Array.from({ length: 4 }).map((_, i) => (
                   <div key={i} className="w-16 h-8 bg-secondary/50 animate-pulse rounded-full"></div>
                 ))}
               </div>
            </div>

            <div className="w-full h-12 bg-secondary/50 animate-pulse rounded-lg mb-6"></div>
          </div>
        </div>

        {/* Description Skeleton */}
        <div className="mt-16 pt-8 border-t border-border">
           <div className="w-1/4 h-8 bg-secondary/50 animate-pulse rounded mb-8"></div>
           <div className="space-y-3">
             <div className="w-full h-4 bg-secondary/50 animate-pulse rounded"></div>
             <div className="w-full h-4 bg-secondary/50 animate-pulse rounded"></div>
             <div className="w-3/4 h-4 bg-secondary/50 animate-pulse rounded"></div>
           </div>
        </div>
      </div>
    </div>
  );
}
