import Link from "next/link";
import Image from "next/image";
import { Metadata } from "next";
import { LoginForm } from "./login-form";

export const metadata: Metadata = {
  title: "Login | C2G",
  description: "Sign in to your C2G Logistics dashboard",
};

export default function LoginPage() {
  return (
    <div className="min-h-[100dvh] flex items-center justify-center bg-background p-0 sm:p-8 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 blur-[120px] rounded-full animate-pulse pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent/20 blur-[120px] rounded-full animate-pulse delay-700 pointer-events-none" />
      
      <div className="w-full h-[100dvh] sm:h-auto sm:max-w-[400px] z-10 animate-fade-in flex flex-col justify-center px-6 py-12">
          {/* Logo & Header */}
          <div className="flex flex-col items-center mb-6 sm:mb-8">
            <div className="w-16 h-16 sm:w-20 sm:h-20 relative flex items-center justify-center mb-2">
              <Image src="/logo.png" alt="C2G Logistics Logo" fill className="object-contain" />
            </div>
            <span className="text-2xl sm:text-3xl font-black bg-clip-text text-transparent bg-gradient-to-r from-[#3b82f6] to-[#ef4444] mb-2 sm:mb-6 drop-shadow-sm text-center">
              C2G Logistics
            </span>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">Welcome Back</h1>
            <p className="text-sm text-muted-foreground mt-2 text-center">
              Sign in to your C2G Logistics account
            </p>
          </div>

          <LoginForm />

          <div className="mt-6 text-center text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Link href="/signup" className="text-primary hover:text-primary/80 font-medium transition-colors">
              Sign up
            </Link>
          </div>

          {/* Badges */}
          <div className="hidden sm:flex mt-8 pt-6 border-t border-border/50 flex-wrap justify-center gap-3">
            <span className="inline-flex items-center px-3 py-1 rounded-full bg-white/5 border border-white/5 text-muted-foreground/60 text-[11px] font-bold uppercase tracking-wider">
              Affordable
            </span>
            <span className="inline-flex items-center px-3 py-1 rounded-full bg-white/5 border border-white/5 text-muted-foreground/60 text-[11px] font-bold uppercase tracking-wider">
              Fast
            </span>
            <span className="inline-flex items-center px-3 py-1 rounded-full bg-white/5 border border-white/5 text-muted-foreground/60 text-[11px] font-bold uppercase tracking-wider">
              Reliable
            </span>
          </div>
      </div>
    </div>
  );
}
