"use client";

import { useActionState, useEffect } from "react";
import { completeProfile } from "../actions";
import { PhoneInput } from "@/components/phone-input";
import { Loader2, ArrowRight, ShieldAlert } from "lucide-react";

export function CompleteProfileForm() {
  const [state, action, isPending] = useActionState(completeProfile, null);

  useEffect(() => {
    if (state?.success) {
      window.location.href = "/dashboard";
    }
  }, [state]);

  return (
    <form action={action} className="space-y-4 w-full max-w-sm mx-auto">
      {state?.error && (
        <div className="p-3 text-sm font-medium bg-destructive/10 text-destructive rounded-md border border-destructive/20 animate-fade-in flex items-start gap-2">
          <ShieldAlert className="w-5 h-5 shrink-0" />
          <span>{state.error}</span>
        </div>
      )}

      <div className="space-y-2 animate-slide-up-1">
        <label className="text-sm font-medium leading-none">
          WhatsApp Number <span className="text-destructive">*</span>
        </label>
        <p className="text-xs text-muted-foreground mb-2">
          We need this to contact you for deliveries and logistics updates.
        </p>
        <PhoneInput />
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
              Saving...
            </>
          ) : (
            <>
              Continue to Dashboard
              <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </>
          )}
        </button>
      </div>
    </form>
  );
}
