import { User, Mail, Phone, Lock, Bell, Shield, ShieldAlert, LogOut } from "lucide-react";
import { logout } from "../../auth/actions";
import { getCustomerProfile } from "./actions";
import ProfileForm from "../../../components/dashboard/profile-form";

export default async function SettingsPage() {
  const { profile, error } = await getCustomerProfile();

  return (
    <div className="space-y-8 animate-fade-in max-w-4xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings & Profile</h1>
        <p className="text-muted-foreground mt-1">Manage your account settings and preferences.</p>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-destructive/10 text-destructive border border-destructive/30 text-sm">
          Failed to load profile: {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Navigation Sidebar (Desktop) */}
        <div className="hidden md:flex flex-col gap-2">
          <button className="flex items-center gap-3 px-4 py-3 rounded-lg bg-primary/10 text-primary font-medium text-left transition-colors">
            <User className="w-4 h-4" /> Profile Details
          </button>
          <button className="flex items-center gap-3 px-4 py-3 rounded-lg text-muted-foreground hover:bg-secondary hover:text-foreground font-medium text-left transition-colors">
            <Lock className="w-4 h-4" /> Password
          </button>
          <button className="flex items-center gap-3 px-4 py-3 rounded-lg text-muted-foreground hover:bg-secondary hover:text-foreground font-medium text-left transition-colors">
            <Bell className="w-4 h-4" /> Notifications
          </button>
          <button className="flex items-center gap-3 px-4 py-3 rounded-lg text-muted-foreground hover:bg-secondary hover:text-foreground font-medium text-left transition-colors">
            <Shield className="w-4 h-4" /> Two-Factor Auth
          </button>
        </div>

        {/* Content Area */}
        <div className="md:col-span-2 space-y-6">
          {profile && <ProfileForm profile={profile} />}

          {/* Delete Account */}
          <div className="glass-panel p-6 border-l-4 border-l-destructive">
            <h3 className="text-lg font-bold text-destructive mb-2 flex items-center gap-2">
              <ShieldAlert className="w-5 h-5" /> Danger Zone
            </h3>
            <p className="text-sm text-muted-foreground mb-6">Permanently delete your C2G Logistics account and all of your data.</p>
            <button className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring bg-destructive text-destructive-foreground hover:bg-destructive/90 h-10 px-4 py-2">
              Delete Account
            </button>
          </div>

          {/* Mobile Logout Button */}
          <div className="md:hidden pt-4 pb-8">
            <form action={logout}>
              <button className="w-full inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring border border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground h-12 px-4 gap-2">
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
