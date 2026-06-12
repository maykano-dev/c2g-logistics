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
    <div className="min-h-screen flex items-center justify-center bg-background p-4 sm:p-8 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 blur-[120px] rounded-full animate-pulse pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent/20 blur-[120px] rounded-full animate-pulse delay-700 pointer-events-none" />
      
      <div className="w-full max-w-[400px] z-10 animate-fade-in">
        <div className="glass-panel p-8 sm:p-10 shadow-2xl">
          {/* Logo & Header */}
          <div className="flex flex-col items-center mb-8">
            <div className="w-20 h-20 relative flex items-center justify-center mb-2">
              <Image src="/logo.png" alt="C2G Logistics Logo" fill className="object-contain" />
            </div>
            <span className="text-3xl font-black bg-clip-text text-transparent bg-gradient-to-r from-[#3b82f6] to-[#ef4444] mb-6 drop-shadow-sm text-center">
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
          <div className="mt-8 pt-6 border-t border-border/50 flex flex-wrap justify-center gap-3">
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
    </div>
  );
}
