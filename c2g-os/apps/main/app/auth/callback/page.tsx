"use client";
import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { Loader2 } from "lucide-react";
import Image from "next/image";

function AuthCallbackContent() {
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);
  const hasAttempted = React.useRef(false);

  useEffect(() => {
    if (hasAttempted.current) return;
    hasAttempted.current = true;

    const next = searchParams.get("next") || "/dashboard";
    const supabase = createClient();

    // Let Supabase handle PKCE exchange automatically via detectSessionInUrl (default).
    // We just listen for the resulting SIGNED_IN event and then redirect.
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "SIGNED_IN" && session?.user) {
        subscription.unsubscribe();

        const user = session.user;
        let hasPhone = !!user.user_metadata?.phone || !!user.phone;

        try {
          // Upsert customer record
          await supabase.from("customers").insert({
            id: user.id,
            email: user.email,
            name: user.user_metadata?.full_name || "Customer",
            phone: user.user_metadata?.phone || null,
            status: "active"
          }).select("id").maybeSingle();

          if (!hasPhone) {
            const { data: customer } = await supabase
              .from("customers")
              .select("phone")
              .eq("id", user.id)
              .maybeSingle();

            if (customer?.phone) {
              hasPhone = true;
              await supabase.auth.updateUser({ data: { phone: customer.phone } });
            }
          }
        } catch (dbError) {
          console.error("Non-critical DB sync error:", dbError);
        }

        // Hard navigate to bypass Next.js router cache
        window.location.href = hasPhone ? next : "/auth/complete-profile";

      } else if (event === "SIGNED_OUT" || event === "TOKEN_REFRESHED") {
        // Ignore these events on callback page
      }
    });

    // Fallback: if nothing fires within 10 seconds, show error
    const timeout = setTimeout(() => {
      subscription.unsubscribe();
      setError("Authentication timed out. Please try again.");
    }, 10000);

    return () => {
      subscription.unsubscribe();
      clearTimeout(timeout);
    };
  }, [searchParams]);

  return (
    <div className="z-10 flex flex-col items-center justify-center p-8 sm:p-12 bg-background/80 backdrop-blur-xl border border-border/50 rounded-3xl shadow-2xl animate-fade-in max-w-md w-full text-center">
      <div className="w-20 h-20 sm:w-24 sm:h-24 relative flex items-center justify-center mb-6">
        <Image src="/logo.png" alt="C2G Logistics Logo" fill className="object-contain" />
      </div>

      {error ? (
        <div className="space-y-4 animate-scale-in">
          <div className="p-4 bg-destructive/10 text-destructive rounded-xl border border-destructive/20 font-medium">
            {error}
          </div>
          <button
            onClick={() => { window.location.href = "/login"; }}
            className="text-sm font-bold text-primary hover:underline"
          >
            Back to Login
          </button>
        </div>
      ) : (
        <div className="space-y-6 flex flex-col items-center animate-fade-in">
          <Loader2 className="w-10 h-10 animate-spin text-primary" />
          <div className="space-y-2">
            <h2 className="text-2xl font-black tracking-tight">Authenticating</h2>
            <p className="text-muted-foreground">Securing your session, please wait...</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default function AuthCallback() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4 relative overflow-hidden">
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/10 blur-[150px] rounded-full animate-drift" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent/10 blur-[150px] rounded-full animate-drift-slow" />
      </div>

      <Suspense fallback={
        <div className="z-10 flex flex-col items-center justify-center p-8 sm:p-12 bg-background/80 backdrop-blur-xl border border-border/50 rounded-3xl shadow-2xl max-w-md w-full text-center">
          <Loader2 className="w-10 h-10 animate-spin text-primary mx-auto" />
        </div>
      }>
        <AuthCallbackContent />
      </Suspense>
    </div>
  );
}
