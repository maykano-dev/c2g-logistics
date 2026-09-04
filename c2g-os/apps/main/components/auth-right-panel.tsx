import { Globe, PackageCheck, ShoppingBag, Tag, ShieldCheck, Headset, ShoppingCart, Lock } from "lucide-react";
import Link from "next/link";

export function AuthRightPanel() {
  return (
    <div className="hidden lg:flex w-1/2 bg-[#0B1120] p-5 xl:p-8 flex-col justify-between border-l border-border/20 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] mix-blend-overlay" />

      <div className="relative z-10 flex flex-col h-full gap-4 xl:gap-5 animate-fade-in">
        {/* Heading */}
        <h2 className="text-xl xl:text-2xl font-bold tracking-tight text-white leading-tight shrink-0">
          Your China logistics,<br/> <span className="text-blue-500">managed in one place.</span>
        </h2>

        {/* 2x3 Feature Grid — grows to fill space */}
        <div className="grid grid-cols-2 gap-3 xl:gap-4 flex-1 content-start xl:content-center">
          {[
            { Icon: Globe, color: "blue", title: "Access Your Warehouse", desc: "Get your personal China address and shop with any Chinese seller." },
            { Icon: PackageCheck, color: "green", title: "Track Shipments", desc: "Real-time updates from our warehouse to your doorstep in Ghana." },
            { Icon: ShoppingBag, color: "purple", title: "C2G Mall", desc: "Shop thousands of quality products from trusted Chinese suppliers." },
            { Icon: Tag, color: "orange", title: "Best Prices", desc: "Competitive product prices, transparent fees, and no hidden charges." },
            { Icon: ShieldCheck, color: "teal", title: "Secure & Reliable", desc: "Your packages are safe with us. Encrypted, insured and handled with care." },
            { Icon: Headset, color: "pink", title: "24/7 Support", desc: "Our support team is available anytime to help you succeed." },
          ].map(({ Icon, color, title, desc }) => (
            <div key={title} className="flex flex-col p-3 xl:p-5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors group">
              <div className={`w-8 h-8 xl:w-10 xl:h-10 rounded-full bg-${color}-500/10 flex items-center justify-center mb-2 xl:mb-3 group-hover:scale-110 transition-transform shrink-0`}>
                <Icon className={`w-4 h-4 xl:w-5 xl:h-5 text-${color}-500`} />
              </div>
              <h4 className="font-bold text-white mb-1 text-xs xl:text-sm">{title}</h4>
              <p className="text-[10px] xl:text-xs text-muted-foreground leading-snug">{desc}</p>
            </div>
          ))}
        </div>

        {/* Action Banner */}
        <div className="shrink-0 bg-gradient-to-r from-slate-900 to-slate-800 p-4 xl:p-5 rounded-xl border border-white/10 flex items-center gap-4 group hover:border-primary/50 transition-colors relative overflow-hidden">
          <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-primary/10 to-transparent pointer-events-none" />
          <div className="w-10 h-10 xl:w-12 xl:h-12 shrink-0 bg-primary/20 rounded-xl flex items-center justify-center">
            <ShoppingCart className="w-5 h-5 xl:w-6 xl:h-6 text-primary group-hover:scale-110 transition-transform" />
          </div>
          <div>
            <h3 className="text-sm xl:text-base font-bold text-white">Shop More. Ship Smarter.</h3>
            <p className="text-[10px] xl:text-xs text-muted-foreground mt-0.5 mb-1.5 leading-snug">From electronics to fashion, beauty to home essentials C2G Mall brings China closer to you.</p>
            <Link href="/shop" className="text-xs xl:text-sm font-bold text-blue-400 hover:text-blue-300 flex items-center gap-1 group-hover:gap-2 transition-all">
              Start Shopping Now <span aria-hidden="true">&rarr;</span>
            </Link>
          </div>
        </div>

        {/* Trust badge */}
        <div className="shrink-0 flex items-center justify-center gap-2 text-[10px] xl:text-xs text-muted-foreground">
          <Lock className="w-3 h-3" />
          <span>Secure, encrypted login. <span className="text-blue-400 font-medium">Your data is protected.</span></span>
        </div>
      </div>
    </div>
  );
}
