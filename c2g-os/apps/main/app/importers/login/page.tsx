import Link from "next/link";
import Image from "next/image";
import { Metadata } from "next";
import { ArrowRight, CheckCircle2, Package, TrendingUp, Truck, Store } from "lucide-react";
import { LoginForm } from "../../login/login-form";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Importer Login | C2G Logistics",
  description: "Log in to your C2G Importer Dashboard",
};

export default function ImporterLoginPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row relative overflow-hidden font-sans">
      {/* ── LEFT SIDE: Marketing / Illustration ── */}
      <div className="relative w-full md:w-1/2 lg:w-5/12 bg-primary/5 p-8 md:p-12 lg:p-16 flex flex-col justify-center border-r border-border/50 hidden md:flex">
        {/* Background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-primary/10 blur-[150px] rounded-full pointer-events-none -z-10" />

        <div className="relative z-10 max-w-lg mx-auto w-full">
          {/* Logo */}
          <Link href="/" className="inline-flex items-center gap-3 mb-12">
            <div className="w-12 h-12 relative flex items-center justify-center">
              <Image src="/logo.png" alt="C2G Logistics Logo" fill className="object-contain" />
            </div>
            <span className="text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-[#3b82f6] to-[#ef4444] drop-shadow-sm">
              C2G Importers
            </span>
          </Link>

          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4 text-balance">
            Welcome Back
          </h1>
          <p className="text-lg text-muted-foreground mb-10 leading-relaxed">
            Continue managing your products, orders, profits, and shipments all in one place.
          </p>



          <div className="space-y-4">
            {[
              { text: "Track Orders", icon: Package },
              { text: "Monitor Profits", icon: TrendingUp },
              { text: "View Shipments", icon: Truck },
              { text: "Manage Your Store", icon: Store }
            ].map((feature, i) => {
              const Icon = feature.icon;
              return (
                <div key={i} className="flex items-center gap-4 bg-secondary/30 p-4 rounded-xl border border-border/50">
                  <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center shrink-0">
                    <Icon className="w-4 h-4 text-blue-500" />
                  </div>
                  <span className="font-semibold text-[15px]">{feature.text}</span>
                </div>
              );
            })}
          </div>

          <div className="mt-12 pt-8 border-t border-border/50 text-sm text-muted-foreground">
            Built for Ghanaian mini importers and WhatsApp sellers.
          </div>
        </div>
      </div>

      {/* ── RIGHT SIDE: Form ── */}
      <div className="w-full md:w-1/2 lg:w-7/12 flex flex-col justify-center items-center p-6 sm:p-12 relative">
        <div className="w-full max-w-md relative z-10">
          
          {/* Mobile Marketing Toggle (Only visible on mobile) */}
          <div className="md:hidden mb-8 w-full">
            <Link href="/" className="inline-flex items-center justify-center gap-3 mb-8 w-full">
              <div className="w-10 h-10 relative flex items-center justify-center">
                <Image src="/logo.png" alt="C2G Logistics Logo" fill className="object-contain" />
              </div>
              <span className="text-xl font-black bg-clip-text text-transparent bg-gradient-to-r from-[#3b82f6] to-[#ef4444] drop-shadow-sm">
                C2G Importers
              </span>
            </Link>
            
            <details className="group glass-panel rounded-2xl [&_summary::-webkit-details-marker]:hidden border-primary/20 bg-primary/5">
              <summary className="flex cursor-pointer items-center justify-between p-4 font-bold">
                <span className="flex items-center gap-2">
                  <Store className="w-5 h-5 text-primary" />
                  Why join C2G Importers?
                </span>
                <span className="transition duration-300 group-open:-rotate-180 bg-primary/20 p-1.5 rounded-full">
                  <svg fill="none" height="18" shapeRendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" viewBox="0 0 24 24" width="18"><path d="M6 9l6 6 6-6"></path></svg>
                </span>
              </summary>
              <div className="p-4 pt-0 text-sm text-muted-foreground space-y-3">
                <p>Manage orders, track profits, and let C2G handle procurement and shipping while you focus on selling.</p>
                <ul className="space-y-2 mt-4 font-medium text-foreground/80">
                  <li className="flex gap-2 items-center"><CheckCircle2 className="w-4 h-4 text-blue-500" /> Track Orders</li>
                  <li className="flex gap-2 items-center"><CheckCircle2 className="w-4 h-4 text-blue-500" /> Monitor Profits</li>
                  <li className="flex gap-2 items-center"><CheckCircle2 className="w-4 h-4 text-blue-500" /> View Shipments</li>
                  <li className="flex gap-2 items-center"><CheckCircle2 className="w-4 h-4 text-blue-500" /> Manage Your Store</li>
                </ul>
              </div>
            </details>
          </div>

          <div className="glass-panel p-8 sm:p-10 shadow-2xl relative overflow-hidden">
            {/* Subtle top highlight */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-blue-500 to-primary opacity-70" />
            
            <div className="mb-8">
              <h2 className="text-2xl font-bold tracking-tight mb-2">Importer Login</h2>
              <p className="text-muted-foreground text-sm">Access your business dashboard</p>
            </div>

            <Suspense fallback={<div className="flex justify-center p-8"><div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" /></div>}>
              <LoginForm />
            </Suspense>

            <div className="mt-6 text-center text-sm text-muted-foreground">
              Don't have a store yet?{" "}
              <Link href="/importers/register" className="text-primary hover:text-primary/80 font-bold transition-colors">
                Apply as Importer
              </Link>
            </div>
            
            {/* Badges */}
            <div className="mt-8 pt-6 border-t border-border/50 flex justify-center gap-2 sm:gap-3">
              <span className="inline-flex items-center px-2 sm:px-3 py-1 rounded-full bg-white/5 border border-white/5 text-muted-foreground/60 text-[9px] sm:text-[11px] font-bold uppercase tracking-wider whitespace-nowrap">
                Automated
              </span>
              <span className="inline-flex items-center px-2 sm:px-3 py-1 rounded-full bg-white/5 border border-white/5 text-muted-foreground/60 text-[9px] sm:text-[11px] font-bold uppercase tracking-wider whitespace-nowrap">
                Secure
              </span>
              <span className="inline-flex items-center px-2 sm:px-3 py-1 rounded-full bg-white/5 border border-white/5 text-muted-foreground/60 text-[9px] sm:text-[11px] font-bold uppercase tracking-wider whitespace-nowrap">
                Profitable
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
