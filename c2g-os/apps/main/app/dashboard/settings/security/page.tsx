import Link from "next/link";
import { User, Lock, Bell, Shield, ArrowLeft, Laptop } from "lucide-react";
import { createClient } from "@/utils/supabase/server";
import MfaSetup from "./mfa-setup";

export default async function SecuritySettingsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return null;

  // Check if MFA is currently enabled
  const { data: factorsData } = await supabase.auth.mfa.listFactors();
  const hasTotp = factorsData?.totp && factorsData.totp.length > 0;

  // Fetch active sessions
  const { data: sessions } = await supabase
    .from("user_sessions")
    .select("*")
    .eq("user_id", user.id)
    .order("last_active_at", { ascending: false })
    .limit(5);

  return (
    <div className="space-y-8 animate-fade-in max-w-4xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings & Profile</h1>
        <p className="text-muted-foreground mt-1">Manage your account settings and preferences.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Navigation Sidebar (Desktop) */}
        <div className="hidden md:flex flex-col gap-2">
          <Link href="/dashboard/settings" className="flex items-center gap-3 px-4 py-3 rounded-lg text-muted-foreground hover:bg-secondary hover:text-foreground font-medium text-left transition-colors">
            <User className="w-4 h-4" /> Profile Details
          </Link>
          <button disabled className="flex items-center gap-3 px-4 py-3 rounded-lg text-muted-foreground hover:bg-secondary hover:text-foreground font-medium text-left transition-colors opacity-50 cursor-not-allowed">
            <Lock className="w-4 h-4" /> Password
          </button>
          <button disabled className="flex items-center gap-3 px-4 py-3 rounded-lg text-muted-foreground hover:bg-secondary hover:text-foreground font-medium text-left transition-colors opacity-50 cursor-not-allowed">
            <Bell className="w-4 h-4" /> Notifications
          </button>
          <Link href="/dashboard/settings/security" className="flex items-center gap-3 px-4 py-3 rounded-lg bg-primary/10 text-primary font-medium text-left transition-colors">
            <Shield className="w-4 h-4" /> Security & 2FA
          </Link>
        </div>

        {/* Content Area */}
        <div className="md:col-span-2 space-y-6">
          <div className="md:hidden mb-4">
            <Link href="/dashboard/settings" className="text-sm text-primary hover:underline flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" /> Back to Profile
            </Link>
          </div>

          <div className="glass-panel p-6">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Shield className="w-5 h-5 text-primary" /> Two-Factor Authentication
            </h2>
            <p className="text-muted-foreground text-sm mb-6">
              Add an extra layer of security to your account. When enabled, you'll need to enter a 6-digit code from your authenticator app when logging in.
            </p>
            
            <MfaSetup hasTotp={!!hasTotp} />
          </div>

          <div className="glass-panel p-6">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Laptop className="w-5 h-5 text-primary" /> Recent Login Activity
            </h2>
            <p className="text-muted-foreground text-sm mb-6">
              These are the most recent devices and locations that have accessed your account.
            </p>

            <div className="space-y-4">
              {sessions && sessions.length > 0 ? (
                sessions.map((session, i) => (
                  <div key={session.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border border-border/50 bg-secondary/20 gap-4">
                    <div>
                      <p className="font-semibold">{session.ip_address}</p>
                      <p className="text-xs text-muted-foreground line-clamp-1">{session.user_agent}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Last active: {new Date(session.last_active_at).toLocaleString()}
                      </p>
                    </div>
                    {i === 0 && (
                      <span className="px-3 py-1 bg-green-500/10 text-green-500 rounded-full text-xs font-bold whitespace-nowrap self-start sm:self-auto">
                        Current Session
                      </span>
                    )}
                  </div>
                ))
              ) : (
                <div className="p-4 rounded-xl border border-border/50 bg-secondary/20 text-center text-muted-foreground text-sm">
                  No session history found.
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
