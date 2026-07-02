import Link from "next/link";
import { LogoutButton } from "../../../components/dashboard/logout-button";
import { logout } from "../../auth/actions";
import { getCustomerProfile } from "./actions";
import ProfileForm from "../../../components/dashboard/profile-form";
import ChangePasswordForm from "./change-password-form";
import DeleteAccountForm from "./delete-account-form";
import SettingsTabs from "../../../components/dashboard/settings-tabs";

export default async function SettingsPage() {
  const { profile, error } = await getCustomerProfile();

  return (
    <div className="space-y-8 animate-fade-in max-w-4xl mx-auto pb-24 md:pb-10">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings & Profile</h1>
        <p className="text-muted-foreground mt-1">Manage your account settings and preferences.</p>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-destructive/10 text-destructive border border-destructive/30 text-sm">
          Failed to load profile: {error}
        </div>
      )}

      <SettingsTabs 
        profileForm={profile ? <ProfileForm profile={profile} /> : null}
        passwordForm={<ChangePasswordForm />}
        deleteForm={<DeleteAccountForm />}
      />

      {/* Mobile Logout Button */}
      <div className="md:hidden pt-8 mt-8 border-t border-border/50">
        <form action={logout}>
          <LogoutButton />
        </form>
      </div>
    </div>
  );
}
