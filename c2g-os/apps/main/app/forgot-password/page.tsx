import Link from "next/link";
import Image from "next/image";
import { Metadata } from "next";
import { ForgotPasswordForm } from "./forgot-password-form";
import { ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "Forgot Password | C2G",
  description: "Reset your C2G Logistics password",
};

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen relative flex items-center justify-center overflow-hidden py-12">
      {/* Dynamic Background */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[20%] left-[-10%] w-[50%] h-[50%] bg-destructive/10 blur-[150px] rounded-full animate-drift" />
        <div className="absolute bottom-[10%] right-[-10%] w-[40%] h-[40%] bg-primary/10 blur-[150px] rounded-full animate-drift-slow" />
      </div>

      <div className="z-10 w-full max-w-md p-6">
        <div className="glass-panel p-8 sm:p-10 animate-fade-in relative overflow-hidden bg-background/80 backdrop-blur-xl border border-border/50 shadow-2xl rounded-2xl">
          {/* Subtle top highlight */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-accent to-primary opacity-50" />
          
          {/* Logo & Header */}
          <div className="flex flex-col items-center mb-8 mt-2">
            <div className="w-16 h-16 sm:w-20 sm:h-20 relative flex items-center justify-center mb-4">
              <Image src="/logo.png" alt="C2G Logistics Logo" fill className="object-contain" />
            </div>
            <h1 className="text-2xl font-black tracking-tight text-foreground text-center">Reset Password</h1>
            <p className="text-sm text-muted-foreground mt-2 text-center max-w-[280px]">
              Enter your email to receive a password reset link
            </p>
          </div>

          <ForgotPasswordForm />

          <div className="mt-8 text-center text-sm text-muted-foreground animate-slide-up-3">
            <Link href="/login" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground font-medium transition-colors">
              <ArrowLeft className="w-4 h-4" /> Return to Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
