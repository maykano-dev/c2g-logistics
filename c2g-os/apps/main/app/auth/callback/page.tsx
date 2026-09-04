"use client";
import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { createBrowserClient } from "@supabase/ssr";
import { Loader2 } from "lucide-react";
import Image from "next/image";

function AuthCallbackContent() {
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<"loading" | "error">("loading");
  const [errorMsg, setErrorMsg] = useState<string>("");
  const hasAttempted = React.useRef(false);

  useEffect(() => {
    if (hasAttempted.current) return;
    hasAttempted.current = true;

    const next = searchParams.get("next") || "/dashboard";
    const code = searchParams.get("code");

    if (!code) {
      setErrorMsg("No authentication code found in URL.");
      setStatus("error");
      return;
    }

    // Create a dedicated callback client with detectSessionInUrl:false to prevent
    // any automatic exchange race condition. We do the exchange manually below.
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { auth: { detectSessionInUrl: false, persistSession: true } }
    );

    const doExchange = async () => {
      const { data, error } = await supabase.auth.exchangeCodeForSession(code);

      if (error) {
        setErrorMsg(error.message);
        setStatus("error");
        return;
      }

      const user = data?.user;
      if (!user) {
        setErrorMsg("Session was created but user data is missing.");
        setStatus("error");
        return;
      }

      let hasPhone = !!user.user_metadata?.phone || !!user.phone;

      try {
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
      } catch (dbErr) {
        console.error("Non-critical DB sync error:", dbErr);
      }

      // Hard navigate to bust any Next.js router cache of the unauthenticated state
      window.location.href = hasPhone ? next : "/auth/complete-profile";
    };

    doExchange();
  }, [searchParams]);

  return (
    <div className="z-10 flex flex-col items-center justify-center p-8 sm:p-12 bg-background/80 backdrop-blur-xl border border-border/50 rounded-3xl shadow-2xl animate-fade-in max-w-md w-full text-center">
      <div className="w-20 h-20 sm:w-24 sm:h-24 relative flex items-center justify-center mb-6">
        <Image src="/logo.png" alt="C2G Logistics Logo" fill className="object-contain" />
      </div>

      {status === "error" ? (
        <div className="space-y-4 animate-scale-in">
          <div className="p-4 bg-destructive/10 text-destructive rounded-xl border border-destructive/20 font-medium text-sm">
            {errorMsg}
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
