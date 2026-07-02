import Link from "next/link";
import Image from "next/image";
import { Metadata } from "next";
import { SignupForm } from "./signup-form";
import { ShieldCheck, Users, Globe, PackageCheck } from "lucide-react";

export const metadata: Metadata = {
  title: "Signup | C2G",
  description: "Create your C2G Logistics account",
};

export default function SignupPage() {
  return (
    <div className="min-h-[100dvh] flex items-center justify-center bg-background relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/10 blur-[150px] rounded-full animate-drift" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent/10 blur-[150px] rounded-full animate-drift-slow" />
      </div>
      
      <div className="w-full flex z-10 max-w-6xl mx-auto h-[100dvh] sm:h-auto sm:min-h-[600px] sm:rounded-2xl sm:shadow-2xl overflow-hidden border-border/50 sm:border bg-background/80 backdrop-blur-xl">
        
        {/* Left Column: Form (Visible on all sizes) */}
        <div className="w-full lg:w-1/2 flex flex-col justify-center px-6 py-12 sm:px-12 relative">
          <div className="max-w-[400px] mx-auto w-full space-y-8">
            {/* Logo & Header */}
            <div className="flex flex-col animate-fade-in text-center sm:text-left">
              <div className="w-16 h-16 sm:w-20 sm:h-20 relative flex items-center justify-center sm:justify-start mb-4 mx-auto sm:mx-0">
                <Image src="/logo.png" alt="C2G Logistics Logo" fill className="object-contain" />
              </div>
              <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-foreground mb-2">
                Start Importing
              </h1>
              <p className="text-muted-foreground text-sm sm:text-base">
                Join 450+ importers using C2G to source, ship, and grow.
              </p>
            </div>

            <SignupForm />

            <div className="text-center text-sm text-muted-foreground animate-slide-up-6">
              Already have an account?{" "}
              <Link href="/login" className="text-primary hover:text-primary/80 font-bold transition-colors">
                Sign in
              </Link>
            </div>
            
            {/* Mobile Trust Badges (Only visible on small screens) */}
            <div className="flex lg:hidden pt-4 border-t border-border/50 flex-wrap justify-center gap-3 animate-slide-up-6">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-secondary text-secondary-foreground text-[11px] font-bold uppercase tracking-wider">
                <ShieldCheck className="w-3.5 h-3.5 text-primary" /> Secure
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-secondary text-secondary-foreground text-[11px] font-bold uppercase tracking-wider">
                <Globe className="w-3.5 h-3.5 text-blue-500" /> China Address
              </span>
            </div>
          </div>
        </div>

        {/* Right Column: Value Proposition (Hidden on mobile) */}
        <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-primary/10 via-secondary to-background p-12 flex-col justify-between border-l border-border/50 relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] mix-blend-overlay" />
          <div className="absolute -top-32 -right-32 w-96 h-96 bg-primary/20 rounded-full blur-[100px] animate-pulse" />
          
          <div className="relative z-10 space-y-8 animate-fade-in">
            <h2 className="text-3xl font-bold tracking-tight text-foreground">
              Everything you need to <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-500">import from China</span>
            </h2>
            
            <div className="space-y-6 pt-4">
              <div className="flex items-start gap-4 p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center shrink-0 border border-blue-500/30">
                  <Globe className="w-5 h-5 text-blue-500" />
                </div>
                <div>
                  <h4 className="font-bold text-foreground mb-1">Free China Warehouse Address</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">Shop directly from Taobao, 1688, and Tmall like a local.</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center shrink-0 border border-green-500/30">
                  <PackageCheck className="w-5 h-5 text-green-500" />
                </div>
                <div>
                  <h4 className="font-bold text-foreground mb-1">Consolidation & Shipping</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">We receive, inspect, combine your packages, and ship them safely to Ghana.</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center shrink-0 border border-purple-500/30">
                  <ShieldCheck className="w-5 h-5 text-purple-500" />
                </div>
                <div>
                  <h4 className="font-bold text-foreground mb-1">Secure Tracking & Payments</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">Track every step on your dashboard and pay securely via Mobile Money.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="relative z-10 flex items-center gap-4 bg-background/50 p-4 rounded-xl border border-border/50 backdrop-blur-md animate-slide-up-5">
            <div className="flex -space-x-2">
              <img className="w-8 h-8 rounded-full border-2 border-background" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop" alt="" />
              <img className="w-8 h-8 rounded-full border-2 border-background" src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop" alt="" />
              <img className="w-8 h-8 rounded-full border-2 border-background" src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop" alt="" />
              <div className="w-8 h-8 rounded-full border-2 border-background bg-secondary flex items-center justify-center text-xs font-bold">+450</div>
            </div>
            <p className="text-sm font-medium text-muted-foreground">
              Joined by <span className="text-foreground font-bold">450+ Importers</span> across Ghana
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
