"use client";

import { useState, useActionState, useEffect } from "react";
import Link from "next/link";
import { login } from "../auth/actions";
import { Loader2, Eye, EyeOff, Mail, Lock, ArrowRight, ShieldAlert } from "lucide-react";
import { useSearchParams } from "next/navigation";

export function LoginForm() {
  const [state, action, isPending] = useActionState(login, null);
  const [showPassword, setShowPassword] = useState(false);
  const searchParams = useSearchParams();
  const verified = searchParams.get("verified");
  
  return (
    <form action={action} className="space-y-4 w-full max-w-sm mx-auto">
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
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors">
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
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors">
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
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
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
  );
}
