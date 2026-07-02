import Link from "next/link";
import Image from "next/image";
import { Metadata } from "next";
import { LoginForm } from "./login-form";
import { ShieldCheck, Globe, PackageCheck, Loader2 } from "lucide-react";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Login | C2G",
  description: "Sign in to your C2G Logistics dashboard",
};

export default function LoginPage() {
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
                Welcome Back
              </h1>
              <p className="text-muted-foreground text-sm sm:text-base">
                Sign in to manage your shipments and C2G Mall orders.
              </p>
            </div>

            <Suspense fallback={<div className="flex justify-center p-8"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>}>
              <LoginForm />
            </Suspense>

            <div className="text-center text-sm text-muted-foreground animate-slide-up-4">
              Don't have an account?{" "}
              <Link href="/signup" className="text-primary hover:text-primary/80 font-bold transition-colors">
                Sign up free
              </Link>
            </div>
            
            {/* Mobile Trust Badges (Only visible on small screens) */}
            <div className="flex lg:hidden pt-4 border-t border-border/50 flex-wrap justify-center gap-3 animate-slide-up-5">
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
        <div className="hidden lg:flex w-1/2 bg-gradient-to-bl from-primary/10 via-secondary to-background p-12 flex-col justify-between border-l border-border/50 relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] mix-blend-overlay" />
          <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-primary/20 rounded-full blur-[100px] animate-pulse" />
          
          <div className="relative z-10 space-y-8 animate-fade-in mt-12">
            <h2 className="text-3xl font-bold tracking-tight text-foreground">
              Your China logistics,<br/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-500">managed in one place.</span>
            </h2>
            
            <div className="space-y-6 pt-4">
              <div className="flex items-start gap-4 p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center shrink-0 border border-blue-500/30">
                  <Globe className="w-5 h-5 text-blue-500" />
                </div>
                <div>
                  <h4 className="font-bold text-foreground mb-1">Access Your Warehouse</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">View your China address and send packages to us anytime.</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center shrink-0 border border-green-500/30">
                  <PackageCheck className="w-5 h-5 text-green-500" />
                </div>
                <div>
                  <h4 className="font-bold text-foreground mb-1">Track Shipments</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">Real-time status updates from our warehouse to Ghana.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="relative z-10 flex items-center gap-4 bg-background/50 p-4 rounded-xl border border-border/50 backdrop-blur-md animate-slide-up-5">
            <ShieldCheck className="w-8 h-8 text-green-500" />
            <p className="text-sm font-medium text-muted-foreground">
              Secure, encrypted login.<br/>
              <span className="text-foreground text-xs">Your data is protected.</span>
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
