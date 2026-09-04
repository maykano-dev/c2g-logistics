"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { Loader2 } from "lucide-react";
import Image from "next/image";

export default function AuthCallback() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const handleAuth = async () => {
      const code = searchParams.get("code");
      const next = searchParams.get("next") || "/dashboard";

      if (!code) {
        if (mounted) setError("No authentication code found.");
        return;
      }

      const supabase = createClient();
      const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);

      if (exchangeError) {
        if (mounted) {
          setError(exchangeError.message);
          setTimeout(() => {
            router.push(`/login?error=${encodeURIComponent(exchangeError.message)}`);
          }, 3000);
        }
        return;
      }

      // Sync customer record
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase.from("customers").insert({
          id: user.id,
          email: user.email,
          name: user.user_metadata?.full_name || "Customer",
          phone: user.user_metadata?.phone || null,
          status: "active"
        }).select("id").maybeSingle();

        let hasPhone = !!user.user_metadata?.phone || !!user.phone;

        if (!hasPhone) {
          const { data: customer } = await supabase
            .from("customers")
            .select("phone")
            .eq("id", user.id)
            .single();

          if (customer?.phone) {
            hasPhone = true;
            await supabase.auth.updateUser({ data: { phone: customer.phone } });
          }
        }

        if (mounted) {
          router.push(hasPhone ? next : "/auth/complete-profile");
        }
      }
    };

    handleAuth();

    return () => {
      mounted = false;
    };
  }, [router, searchParams]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/10 blur-[150px] rounded-full animate-drift" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent/10 blur-[150px] rounded-full animate-drift-slow" />
      </div>
      
      <div className="z-10 flex flex-col items-center justify-center p-8 sm:p-12 bg-background/80 backdrop-blur-xl border border-border/50 rounded-3xl shadow-2xl animate-fade-in max-w-md w-full text-center">
        <div className="w-20 h-20 sm:w-24 sm:h-24 relative flex items-center justify-center mb-6">
          <Image src="/logo.png" alt="C2G Logistics Logo" fill className="object-contain" />
        </div>
        
        {error ? (
          <div className="space-y-4 animate-scale-in">
            <div className="p-4 bg-destructive/10 text-destructive rounded-xl border border-destructive/20 font-medium">
              {error}
            </div>
            <p className="text-muted-foreground text-sm">Redirecting back to login...</p>
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
    </div>
  );
}
