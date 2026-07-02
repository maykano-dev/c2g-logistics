"use client";

import { useActionState } from "react";
import { resetPassword } from "../auth/actions";
import { Loader2, Mail, ArrowRight, ShieldAlert, CheckCircle2 } from "lucide-react";

export function ForgotPasswordForm() {
  const [state, action, isPending] = useActionState(resetPassword, null);

  if (state?.success) {
    return (
      <div className="text-center space-y-4 animate-scale-in py-6">
        <div className="mx-auto w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mb-4">
          <CheckCircle2 className="w-8 h-8 text-green-500" />
        </div>
        <h3 className="text-xl font-bold">Check your email</h3>
        <p className="text-muted-foreground text-sm">
          If an account exists with this email, we've sent instructions to reset your password.
        </p>
      </div>
    );
  }

  return (
    <form action={action} className="space-y-4 w-full">
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
            className="flex h-11 w-full rounded-md border border-input bg-background/50 pl-10 pr-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:border-primary transition-all backdrop-blur-sm"
          />
        </div>
      </div>

      <div className="pt-4 animate-slide-up-2">
        <button
          type="submit"
          disabled={isPending}
          className="group inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-bold ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 hover:scale-[1.02] h-12 px-8 w-full shadow-lg shadow-primary/25"
        >
          {isPending ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Sending...
            </>
          ) : (
            <>
              Send Reset Link
              <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </>
          )}
        </button>
      </div>
    </form>
  );
}
