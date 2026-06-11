import { PackagePlus, Info, Zap, Plane, Ship, Store } from "lucide-react";
import Link from "next/link";

export default function RegisterPackagePage() {
  return (
    <div className="space-y-8 animate-fade-in max-w-3xl mx-auto">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Link href="/dashboard/packages" className="text-sm text-muted-foreground hover:text-primary transition-colors">
            Packages
          </Link>
          <span className="text-muted-foreground">/</span>
          <span className="text-sm font-medium">Register</span>
        </div>
        <h1 className="text-3xl font-bold tracking-tight">Register Incoming Package</h1>
        <p className="text-muted-foreground mt-1">Once your supplier ships your item to our China warehouse, add the tracking number here so we know it's coming.</p>
      </div>

      <div className="glass-panel p-6 md:p-8 relative overflow-hidden">
        {/* Decorative background element */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[80px] -mr-20 -mt-20 pointer-events-none" />

        <form className="space-y-6 relative z-10">
          {/* Tracking Number */}
          <div className="space-y-2">
            <label className="text-sm font-semibold flex items-center gap-2">
              <PackagePlus className="w-4 h-4 text-primary" />
              Chinese Tracking Number(s) <span className="text-destructive">*</span>
            </label>
            <input 
              type="text" 
              placeholder="e.g., YT89938221123, 61-4-2992" 
              required
              className="flex h-11 w-full rounded-md border border-input bg-background/50 px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 transition-colors backdrop-blur-sm"
            />
            <div className="mt-2 bg-secondary/30 border border-border/50 rounded-lg p-3 text-xs text-muted-foreground space-y-1">
              <p><span className="font-semibold text-foreground">For Taobao:</span> Use the courier number.</p>
              <p><span className="font-semibold text-foreground">For 1688:</span> Use the 7-digit number in order details (e.g., 61-4-2992).</p>
            </div>
          </div>

          {/* Store / Supplier Name */}
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2">
              <Store className="w-4 h-4 text-muted-foreground" />
              Store / Supplier Name <span className="text-destructive">*</span>
            </label>
            <input 
              type="text" 
              placeholder="e.g., Guangzhou Electronics Store" 
              required 
              className="flex h-11 w-full rounded-md border border-input bg-background/50 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring transition-colors" 
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Item Description <span className="text-destructive">*</span></label>
            <textarea 
              rows={3}
              placeholder="e.g., 5 pairs of Nike Shoes, size 42" 
              required 
              className="flex w-full rounded-md border border-input bg-background/50 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring transition-colors resize-none" 
            />
          </div>

          {/* Shipping Mode */}
          <div className="space-y-3">
            <label className="text-sm font-medium">Shipping Mode <span className="text-destructive">*</span></label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <label className="relative flex cursor-pointer rounded-xl border border-input bg-background/50 p-4 hover:bg-accent hover:text-accent-foreground has-[:checked]:border-primary has-[:checked]:bg-primary/5">
                <input type="radio" name="shipping" value="express" className="peer sr-only" required />
                <div className="flex flex-col gap-1 w-full text-center items-center">
                  <Zap className="w-5 h-5 text-orange-500 mb-1" />
                  <span className="font-semibold text-sm">Air Express</span>
                </div>
              </label>
              <label className="relative flex cursor-pointer rounded-xl border border-input bg-background/50 p-4 hover:bg-accent hover:text-accent-foreground has-[:checked]:border-primary has-[:checked]:bg-primary/5">
                <input type="radio" name="shipping" value="normal" className="peer sr-only" required />
                <div className="flex flex-col gap-1 w-full text-center items-center">
                  <Plane className="w-5 h-5 text-blue-500 mb-1" />
                  <span className="font-semibold text-sm">Air Normal</span>
                </div>
              </label>
              <label className="relative flex cursor-pointer rounded-xl border border-input bg-background/50 p-4 hover:bg-accent hover:text-accent-foreground has-[:checked]:border-primary has-[:checked]:bg-primary/5">
                <input type="radio" name="shipping" value="sea" className="peer sr-only" required />
                <div className="flex flex-col gap-1 w-full text-center items-center">
                  <Ship className="w-5 h-5 text-green-500 mb-1" />
                  <span className="font-semibold text-sm">Sea Freight</span>
                </div>
              </label>
            </div>
          </div>

          {/* Submit */}
          <div className="pt-6 border-t border-border/50 flex justify-end gap-3">
            <button type="button" className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring border border-input bg-background hover:bg-accent hover:text-accent-foreground h-11 px-8">
              Cancel
            </button>
            <button type="button" className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring bg-primary text-primary-foreground hover:bg-primary/90 hover:scale-[1.02] h-11 px-8 shadow-lg shadow-primary/25">
              Register Package
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
