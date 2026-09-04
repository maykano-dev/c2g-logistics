"use client";

import { useState, useActionState, useEffect, useTransition } from "react";
import Link from "next/link";
import { login } from "../auth/actions";
import { Loader2, Eye, EyeOff, Mail, Lock, ArrowRight, ShieldAlert } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { createClient } from '@/utils/supabase/client';

export function LoginForm() {
  const [state, action, isPending] = useActionState(login, null);
  const [showPassword, setShowPassword] = useState(false);
  const [isGoogleLoading, startGoogleTransition] = useTransition();
  const searchParams = useSearchParams();
  const verified = searchParams.get("verified");
  
  const handleGoogleLogin = () => {
    window.location.href = '/api/auth/google';
  };

  return (
    <div className="w-full max-w-sm mx-auto space-y-4">
      {/* Google Login Button */}
      <form action={handleGoogleLogin}>
        <button
          type="submit"
          disabled={isGoogleLoading}
          className="w-full flex items-center justify-center gap-2 h-11 rounded-md border border-input bg-background/50 hover:bg-secondary transition-all text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isGoogleLoading ? (
            <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
          ) : (
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              <path d="M1 1h22v22H1z" fill="none" />
            </svg>
          )}
          {isGoogleLoading ? "Connecting to Google..." : "Continue with Google"}
        </button>
      </form>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-border" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Or continue with email
          </span>
        </div>
      </div>

      <form action={action} className="space-y-4 w-full">
        {verified && !state?.error && (
        <div className="p-3 text-sm font-medium bg-green-500/10 text-green-500 rounded-md border border-green-500/20 animate-fade-in flex items-start gap-2">
          <span>Account verified successfully! Please sign in.</span>
        </div>
      )}

      {!!state?.error && typeof state.error === 'string' && (
        <div className="p-3 text-sm font-medium bg-destructive/10 text-destructive rounded-md border border-destructive/20 animate-fade-in flex items-start gap-2">
          <ShieldAlert className="w-5 h-5 shrink-0" />
          <span>{state.error}</span>
        </div>
      )}

      <div className="space-y-2 animate-slide-up-1">
        <label htmlFor="email" className="text-sm font-medium leading-none">
          Email Address
        </label>
        <div className="relative group">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/60 group-focus-within:text-primary transition-colors">
            <Mail className="w-4 h-4" />
          </div>
          <input
            id="email"
            name="email"
            type="email"
            placeholder="m@example.com"
            required
            defaultValue={state?.email || ""}
            className="flex h-11 w-full rounded-md border border-input bg-background/50 pl-10 pr-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:border-primary transition-all backdrop-blur-sm"
          />
        </div>
      </div>
      
      <div className="space-y-2 animate-slide-up-2">
        <div className="flex items-center justify-between">
          <label htmlFor="password" className="text-sm font-medium leading-none">
            Password
          </label>
          <Link href="/forgot-password" className="text-xs font-bold text-primary hover:text-primary/80 transition-colors">
            Forgot password?
          </Link>
        </div>
        <div className="relative group">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/60 group-focus-within:text-primary transition-colors">
            <Lock className="w-4 h-4" />
          </div>
          <input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            required
            placeholder="Enter your password"
            className="flex h-11 w-full rounded-md border border-input bg-background/50 pl-10 pr-10 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:border-primary transition-all backdrop-blur-sm"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground/60 hover:text-foreground transition-colors"
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
      </div>

      <div className="pt-4 animate-slide-up-3">
        <button
          type="submit"
          disabled={isPending}
          className="group inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-bold ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 hover:scale-[1.02] h-12 px-8 w-full shadow-lg shadow-primary/25"
        >
          {isPending ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Signing In...
            </>
          ) : (
            <>
              Sign In to Dashboard
              <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </>
          )}
        </button>
      </div>
      </form>
    </div>
  );
}
