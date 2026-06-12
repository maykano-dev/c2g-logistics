import ImporterRegisterClient from "./register-client";
import { Metadata } from "next";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

import Link from "next/link";
import Image from "next/image";
import { CheckCircle2, TrendingUp, Clock, Wallet, Store } from "lucide-react";

export const metadata: Metadata = {
  title: "Become a C2G Importer | Start Your Business",
  description: "Join the C2G Importer Platform. We handle the procurement and logistics, you handle the sales.",
};

export default async function ImporterRegistrationPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // We no longer redirect to /login if there's no user,
  // because Step 1 of the multi-step importer registration creates the auth account.
  let existingApp = null;
  if (user) {
    const { data } = await supabase
      .from('importers')
      .select('status')
      .eq('user_id', user.id)
      .single();
    existingApp = data;
  }

  if (existingApp?.status === 'approved') {
    redirect("/importer-dashboard");
  }

  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row relative overflow-hidden font-sans">
      {/* ── LEFT SIDE: Marketing / Info ── */}
      <div className="relative w-full md:w-1/2 lg:w-5/12 bg-primary/5 p-8 md:p-12 lg:p-16 flex flex-col justify-center border-r border-border/50 hidden md:flex">
        {/* Background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-primary/10 blur-[150px] rounded-full pointer-events-none -z-10" />

        <div className="relative z-10 max-w-lg mx-auto w-full">
          {/* Logo */}
          <Link href="/" className="inline-flex items-center gap-3 mb-12">
            <div className="w-12 h-12 relative flex items-center justify-center">
              <Image src="/logo.png" alt="C2G Logistics Logo" fill className="object-contain" />
            </div>
            <span className="text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-[#3b82f6] to-[#ef4444] drop-shadow-sm">
              C2G Importers
            </span>
          </Link>

          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4 text-balance">
            Turn Your WhatsApp Import Business Into A Real Store
          </h1>
          <p className="text-lg text-muted-foreground mb-10 leading-relaxed">
            Manage orders, track profits, and let C2G handle procurement and shipping while you focus on selling.
          </p>

          <div className="space-y-4 mb-8">
            {[
              { title: "Grow Your Sales", text: "Your products appear in your store and on C2G Mall, exposing them to more buyers.", icon: TrendingUp },
              { title: "Save Time", text: "No more counting WhatsApp orders, calculating totals, or organizing spreadsheets.", icon: Clock },
              { title: "Get Paid", text: "We purchase, ship, and manage logistics while you track profits and request payouts.", icon: Wallet }
            ].map((feature, i) => {
              const Icon = feature.icon;
              return (
                <div key={i} className="flex gap-4 bg-secondary/30 p-4 rounded-xl border border-border/50">
                  <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center shrink-0">
                    <Icon className="w-5 h-5 text-blue-500" />
                  </div>
                  <div>
                    <span className="font-bold block mb-1">{feature.title}</span>
                    <span className="text-sm text-muted-foreground">{feature.text}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Small Trust Section */}
          <div className="space-y-2 mt-4 font-medium text-foreground/80 text-sm">
            <div className="flex gap-2 items-center"><CheckCircle2 className="w-4 h-4 text-green-500" /> Professional Storefront</div>
            <div className="flex gap-2 items-center"><CheckCircle2 className="w-4 h-4 text-green-500" /> Automated Order Management</div>
            <div className="flex gap-2 items-center"><CheckCircle2 className="w-4 h-4 text-green-500" /> Real-Time Profit Tracking</div>
            <div className="flex gap-2 items-center font-bold text-foreground"><CheckCircle2 className="w-4 h-4 text-green-500" /> Procurement &amp; Shipping Handled By C2G</div>
          </div>

          <div className="mt-12 pt-8 border-t border-border/50 text-sm text-muted-foreground">
            Built for Ghanaian mini importers and WhatsApp sellers.
          </div>
        </div>
      </div>

      {/* ── RIGHT SIDE: Form ── */}
      <div className="w-full md:w-1/2 lg:w-7/12 flex flex-col justify-center items-center p-4 sm:p-12 relative">
        <div className="w-full max-w-2xl relative z-10">
          
          {/* Mobile Marketing Toggle (Only visible on mobile) */}
          <div className="md:hidden mb-8 w-full">
            <Link href="/" className="inline-flex items-center justify-center gap-3 mb-8 w-full">
              <div className="w-10 h-10 relative flex items-center justify-center">
                <Image src="/logo.png" alt="C2G Logistics Logo" fill className="object-contain" />
              </div>
              <span className="text-xl font-black bg-clip-text text-transparent bg-gradient-to-r from-[#3b82f6] to-[#ef4444] drop-shadow-sm">
                C2G Importers
              </span>
            </Link>
            
            <details className="group glass-panel rounded-2xl [&_summary::-webkit-details-marker]:hidden border-primary/20 bg-primary/5">
              <summary className="flex cursor-pointer items-center justify-between p-4 font-bold">
                <span className="flex items-center gap-2">
                  <Store className="w-5 h-5 text-primary" />
                  Why join C2G Importers?
                </span>
                <span className="transition duration-300 group-open:-rotate-180 bg-primary/20 p-1.5 rounded-full">
                  <svg fill="none" height="18" shapeRendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" viewBox="0 0 24 24" width="18"><path d="M6 9l6 6 6-6"></path></svg>
                </span>
              </summary>
              <div className="p-4 pt-0 text-sm text-muted-foreground space-y-4">
                <p>Manage orders, track profits, and let C2G handle procurement and shipping while you focus on selling.</p>
                
                <div className="space-y-3">
                  <div className="flex gap-3 bg-secondary/30 p-3 rounded-xl border border-border/50">
                    <TrendingUp className="w-5 h-5 text-blue-500 shrink-0" />
                    <div>
                      <span className="font-bold text-foreground block mb-0.5">Grow Your Sales</span>
                      <span className="text-xs">Your products appear in your store and on C2G Mall.</span>
                    </div>
                  </div>
                  <div className="flex gap-3 bg-secondary/30 p-3 rounded-xl border border-border/50">
                    <Clock className="w-5 h-5 text-blue-500 shrink-0" />
                    <div>
                      <span className="font-bold text-foreground block mb-0.5">Save Time</span>
                      <span className="text-xs">No more counting WhatsApp orders or spreadsheets.</span>
                    </div>
                  </div>
                  <div className="flex gap-3 bg-secondary/30 p-3 rounded-xl border border-border/50">
                    <Wallet className="w-5 h-5 text-blue-500 shrink-0" />
                    <div>
                      <span className="font-bold text-foreground block mb-0.5">Get Paid</span>
                      <span className="text-xs">We purchase and ship while you track profits and payouts.</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2 mt-4 font-medium text-foreground/80 text-xs">
                  <div className="flex gap-2 items-center"><CheckCircle2 className="w-4 h-4 text-green-500" /> Professional Storefront</div>
                  <div className="flex gap-2 items-center"><CheckCircle2 className="w-4 h-4 text-green-500" /> Automated Order Management</div>
                  <div className="flex gap-2 items-center"><CheckCircle2 className="w-4 h-4 text-green-500" /> Real-Time Profit Tracking</div>
                  <div className="flex gap-2 items-center font-bold text-foreground"><CheckCircle2 className="w-4 h-4 text-green-500" /> Procurement &amp; Shipping Handled By C2G</div>
                </div>
              </div>
            </details>
          </div>

          <ImporterRegisterClient />
        </div>
      </div>
    </div>
  );
}
