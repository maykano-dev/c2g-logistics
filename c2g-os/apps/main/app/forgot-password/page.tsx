import Link from "next/link";
import Image from "next/image";
import { Metadata } from "next";
import { resetPassword } from "../auth/actions";
import { ArrowLeft, Loader2, Mail } from "lucide-react";

export const metadata: Metadata = {
  title: "Forgot Password | C2G",
  description: "Reset your C2G Logistics password",
};

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen relative flex items-center justify-center overflow-hidden py-12">
      {/* Dynamic Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[20%] left-[-10%] w-[50%] h-[50%] bg-destructive/10 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[10%] right-[-10%] w-[40%] h-[40%] bg-primary/20 blur-[150px] rounded-full animate-pulse delay-700" />
      </div>

      <div className="z-10 w-full max-w-md p-6">
        <div className="glass-panel p-8 animate-fade-in relative overflow-hidden">
          {/* Subtle top highlight */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-accent to-primary opacity-50" />
          
          {/* Logo & Header */}
          <div className="flex flex-col items-center mb-8 mt-2">
            <div className="w-20 h-20 relative flex items-center justify-center mb-2">
              <Image src="/logo.png" alt="C2G Logistics Logo" fill className="object-contain" />
            </div>
            <span className="text-3xl font-black bg-clip-text text-transparent bg-gradient-to-r from-[#3b82f6] to-[#ef4444] mb-6 drop-shadow-sm text-center">
              C2G Logistics
            </span>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">Reset Password</h1>
            <p className="text-sm text-muted-foreground mt-2 text-center">
              Enter your email to receive a password reset link
            </p>
          </div>

          <form action={resetPassword} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="m@example.com"
                required
                className="flex h-11 w-full rounded-md border border-input bg-background/50 px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-colors backdrop-blur-sm"
              />
            </div>

            <button
              type="submit"
              className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 hover:scale-[1.02] h-11 px-8 py-2 w-full mt-6 shadow-lg shadow-primary/25"
            >
              Send Reset Link
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-muted-foreground flex flex-col gap-2">
            <Link href="/login" className="text-primary hover:text-primary/80 font-medium transition-colors">
              Return to Sign In
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
