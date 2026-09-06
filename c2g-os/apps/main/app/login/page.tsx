import Link from "next/link";
import Image from "next/image";
import { Metadata } from "next";
import { LoginForm } from "./login-form";
import { Banknote, ShoppingCart, Warehouse, Loader2 } from "lucide-react";
import { Suspense } from "react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { AuthRightPanel } from "@/components/auth-right-panel";
import { createClient } from "@/utils/supabase/server";

export const metadata: Metadata = {
  title: "Login | C2G",
  description: "Sign in to your C2G Logistics dashboard",
};

export default async function LoginPage(
  props: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
  }
) {
  const searchParams = await props.searchParams;
  
  // Fallback: If Supabase misconfigures the redirect and drops the user here with a code, 
  // immediately forward them to the correct callback route to finish logging in.
  if (searchParams?.code) {
    redirect(`/auth/callback?code=${searchParams.code}`);
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (user) {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-[100dvh] lg:h-screen flex items-center justify-center bg-background relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/10 blur-[150px] rounded-full animate-drift" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent/10 blur-[150px] rounded-full animate-drift-slow" />
      </div>
      
      {/* Card container — full height on desktop, scrollable form inside */}
      <div className="w-full flex z-10 max-w-6xl mx-auto h-auto lg:h-[92vh] sm:rounded-2xl sm:shadow-2xl sm:border border-border/50 bg-background/80 backdrop-blur-xl overflow-hidden">
        
        {/* Left Column: Form — scrollable so it never clips */}
        <div className="w-full lg:w-1/2 flex flex-col justify-start lg:justify-center px-5 py-8 sm:px-8 xl:px-12 overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <div className="max-w-[400px] mx-auto w-full space-y-6">
            {/* Logo & Header */}
            <div className="flex flex-col animate-fade-in text-center sm:text-left">
              <div className="w-24 h-24 sm:w-28 sm:h-28 relative flex items-center justify-center sm:justify-start mb-3 mx-auto sm:mx-0">
                <Image src="/logo.png" alt="C2G Logistics Logo" fill className="object-contain" />
              </div>
              <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-foreground mb-2">
                Welcome Back
              </h1>
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-2 mt-1">
                <span className="bg-gradient-to-r from-primary/20 to-accent/20 text-primary border border-primary/30 px-3 py-1 rounded-full text-[10px] sm:text-xs font-black uppercase tracking-widest shadow-sm">
                  Ghana's 1688
                </span>
                <span className="text-sm font-bold text-foreground/90">
                  All you need is a MoMo account
                </span>
              </div>
              <p className="text-muted-foreground text-sm sm:text-base mt-1">
                Sign in to manage your shipments and C2G Mall orders.
              </p>
            </div>

            <Suspense fallback={
              <div className="w-full max-w-sm mx-auto space-y-4 animate-pulse">
                <div className="w-full h-10 bg-secondary/50 rounded-md"></div>
                <div className="relative py-2">
                  <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-border"></span></div>
                </div>
                <div className="space-y-4 w-full">
                  <div className="space-y-2">
                    <div className="w-24 h-4 bg-secondary/50 rounded"></div>
                    <div className="w-full h-11 bg-secondary/30 rounded-md"></div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <div className="w-20 h-4 bg-secondary/50 rounded"></div>
                      <div className="w-24 h-3 bg-secondary/30 rounded"></div>
                    </div>
                    <div className="w-full h-11 bg-secondary/30 rounded-md"></div>
                  </div>
                  <div className="pt-4">
                    <div className="w-full h-12 bg-primary/20 rounded-md"></div>
                  </div>
                </div>
              </div>
            }>
              <LoginForm />
            </Suspense>

            <div className="text-center text-sm text-muted-foreground animate-slide-up-4">
              Don't have an account?{" "}
              <Link href="/signup" className="text-primary hover:text-primary/80 font-bold transition-colors">
                Sign up free
              </Link>
            </div>
            
            {/* Mobile Trust Badges (Only visible on small screens) */}
            <div className="flex lg:hidden pt-4 border-t border-border/50 flex-nowrap justify-center gap-1.5 sm:gap-3 animate-slide-up-5 w-full">
              <span className="inline-flex items-center justify-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1.5 rounded-full bg-secondary text-secondary-foreground text-[9px] sm:text-[11px] font-bold uppercase tracking-wider leading-none h-7 whitespace-nowrap">
                <Banknote className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-primary" /> Buy for me
              </span>
              <span className="inline-flex items-center justify-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1.5 rounded-full bg-secondary text-secondary-foreground text-[9px] sm:text-[11px] font-bold uppercase tracking-wider leading-none h-7 whitespace-nowrap">
                <ShoppingCart className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-primary" /> C2G Mall
              </span>
              <span className="inline-flex items-center justify-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1.5 rounded-full bg-secondary text-secondary-foreground text-[9px] sm:text-[11px] font-bold uppercase tracking-wider leading-none h-7 whitespace-nowrap">
                <Warehouse className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-primary" /> Warehouse Address
              </span>
            </div>
          </div>
        </div>

        {/* Right Column: Value Proposition (Hidden on mobile) */}
        <AuthRightPanel />

      </div>
    </div>
  );
}
