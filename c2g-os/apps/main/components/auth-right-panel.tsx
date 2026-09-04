import { Globe, PackageCheck, ShoppingBag, Tag, ShieldCheck, Headset, ShoppingCart, Shield, Truck, ThumbsUp, Lock } from "lucide-react";
import Link from "next/link";

export function AuthRightPanel() {
  return (
    <div className="hidden lg:flex w-1/2 bg-[#0B1120] p-6 xl:p-10 flex-col justify-between border-l border-border/20 relative overflow-hidden">
      {/* Dynamic Background Noise & Glows */}
      <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] mix-blend-overlay" />
      <div className="relative z-10 space-y-4 xl:space-y-6 animate-fade-in flex-1">
        <h2 className="text-2xl xl:text-3xl font-bold tracking-tight text-white leading-tight">
          Your China logistics,<br/> <span className="text-blue-500">managed in one place.</span>
        </h2>
        
        {/* 2x3 Grid */}
        <div className="grid grid-cols-2 gap-3 xl:gap-4">
          <div className="flex flex-col p-3 xl:p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors group">
            <div className="w-8 h-8 xl:w-10 xl:h-10 rounded-full bg-blue-500/10 flex items-center justify-center mb-2 xl:mb-3 group-hover:scale-110 transition-transform">
              <Globe className="w-4 h-4 xl:w-5 xl:h-5 text-blue-500" />
            </div>
            <h4 className="font-bold text-white mb-1 text-xs xl:text-sm">Access Your Warehouse</h4>
            <p className="text-[10px] xl:text-[11px] text-muted-foreground leading-snug">Get your personal China address and shop with any Chinese seller.</p>
          </div>

          <div className="flex flex-col p-3 xl:p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors group">
            <div className="w-8 h-8 xl:w-10 xl:h-10 rounded-full bg-green-500/10 flex items-center justify-center mb-2 xl:mb-3 group-hover:scale-110 transition-transform">
              <PackageCheck className="w-4 h-4 xl:w-5 xl:h-5 text-green-500" />
            </div>
            <h4 className="font-bold text-white mb-1 text-xs xl:text-sm">Track Shipments</h4>
            <p className="text-[10px] xl:text-[11px] text-muted-foreground leading-snug">Real-time updates from our warehouse to your doorstep in Ghana.</p>
          </div>

          <div className="flex flex-col p-3 xl:p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors group">
            <div className="w-8 h-8 xl:w-10 xl:h-10 rounded-full bg-purple-500/10 flex items-center justify-center mb-2 xl:mb-3 group-hover:scale-110 transition-transform">
              <ShoppingBag className="w-4 h-4 xl:w-5 xl:h-5 text-purple-500" />
            </div>
            <h4 className="font-bold text-white mb-1 text-xs xl:text-sm">C2G Mall</h4>
            <p className="text-[10px] xl:text-[11px] text-muted-foreground leading-snug">Shop thousands of quality products from trusted Chinese suppliers.</p>
          </div>

          <div className="flex flex-col p-3 xl:p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors group">
            <div className="w-8 h-8 xl:w-10 xl:h-10 rounded-full bg-orange-500/10 flex items-center justify-center mb-2 xl:mb-3 group-hover:scale-110 transition-transform">
              <Tag className="w-4 h-4 xl:w-5 xl:h-5 text-orange-500" />
            </div>
            <h4 className="font-bold text-white mb-1 text-xs xl:text-sm">Best Prices</h4>
            <p className="text-[10px] xl:text-[11px] text-muted-foreground leading-snug">Competitive product prices, transparent fees, and no hidden charges.</p>
          </div>

          <div className="flex flex-col p-3 xl:p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors group">
            <div className="w-8 h-8 xl:w-10 xl:h-10 rounded-full bg-teal-500/10 flex items-center justify-center mb-2 xl:mb-3 group-hover:scale-110 transition-transform">
              <ShieldCheck className="w-4 h-4 xl:w-5 xl:h-5 text-teal-500" />
            </div>
            <h4 className="font-bold text-white mb-1 text-xs xl:text-sm">Secure & Reliable</h4>
            <p className="text-[10px] xl:text-[11px] text-muted-foreground leading-snug">Your packages are safe with us. Encrypted, insured and handled with care.</p>
          </div>

          <div className="flex flex-col p-3 xl:p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors group">
            <div className="w-8 h-8 xl:w-10 xl:h-10 rounded-full bg-pink-500/10 flex items-center justify-center mb-2 xl:mb-3 group-hover:scale-110 transition-transform">
              <Headset className="w-4 h-4 xl:w-5 xl:h-5 text-pink-500" />
            </div>
            <h4 className="font-bold text-white mb-1 text-xs xl:text-sm">24/7 Support</h4>
            <p className="text-[10px] xl:text-[11px] text-muted-foreground leading-snug">Our support team is available anytime to help you succeed.</p>
          </div>
        </div>

        {/* Action Banner */}
        <div className="bg-gradient-to-r from-slate-900 to-slate-800 p-4 xl:p-5 rounded-xl border border-white/10 flex items-center gap-4 xl:gap-5 group hover:border-primary/50 transition-colors relative overflow-hidden mt-4 xl:mt-6">
          <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-primary/10 to-transparent pointer-events-none" />
          <div className="w-10 h-10 xl:w-12 xl:h-12 shrink-0 bg-primary/20 rounded-xl flex items-center justify-center">
             <ShoppingCart className="w-5 h-5 xl:w-6 xl:h-6 text-primary group-hover:scale-110 transition-transform" />
          </div>
          <div>
            <h3 className="text-sm xl:text-base font-bold text-white">Shop More. Ship Smarter.</h3>
            <p className="text-[10px] xl:text-[11px] text-muted-foreground mt-0.5 mb-1.5 xl:mb-2 leading-snug">From electronics to fashion, beauty to home essentials — C2G Mall brings China closer to you.</p>
            <Link href="/shop" className="text-xs font-bold text-blue-400 hover:text-blue-300 flex items-center gap-1 group-hover:gap-2 transition-all">
              Start Shopping Now <span aria-hidden="true">&rarr;</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Footer / Trust Badges */}
      <div className="relative z-10 mt-8 space-y-6 animate-slide-up-5">
        <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
          <Lock className="w-3 h-3" />
          <span>Secure, encrypted login. <span className="text-blue-400 font-medium">Your data is protected.</span></span>
        </div>
      </div>

    </div>
  );
}
