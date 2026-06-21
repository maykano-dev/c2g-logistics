"use client";

import { Save, Shield, ChevronLeft, AlertTriangle, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { updatePassword } from "../actions";

export default function SecuritySettings() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const newPassword = formData.get("new_password") as string;
    const confirmPassword = formData.get("confirm_password") as string;

    if (newPassword !== confirmPassword) {
      alert("New passwords do not match.");
      return;
    }

    if (newPassword.length < 8) {
      alert("Password must be at least 8 characters.");
      return;
    }

    setSaving(true);
    const { success, error } = await updatePassword(newPassword);
    setSaving(false);

    if (success) {
      alert("Security settings updated successfully! Your password has been changed.");
      router.push("/importer-dashboard/settings");
    } else {
      alert("Failed to update password: " + error);
    }
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto animate-fade-in pb-24">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/importer-dashboard/settings" className="p-2 -ml-2 rounded-full hover:bg-secondary transition-colors">
          <ChevronLeft className="w-6 h-6" />
        </Link>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Security</h1>
          <p className="text-sm text-muted-foreground">Update your password and secure your account.</p>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        <div className="glass-panel p-6 sm:p-8 shadow-lg border-border/50 rounded-2xl">
          <h2 className="text-lg font-bold mb-4 flex items-center gap-2 text-purple-500">
            <Shield className="w-5 h-5" /> Change Password
          </h2>
          <div className="space-y-6">
            <div className="bg-amber-500/10 border border-amber-500/20 text-amber-500 p-4 rounded-xl flex gap-3 text-sm font-medium">
              <AlertTriangle className="w-5 h-5 shrink-0" />
              <p>For your security, you will be logged out of all other devices once your password is changed.</p>
            </div>

            <div className="grid gap-2">
              <label className="text-sm font-semibold text-muted-foreground">Current Password</label>
              <input 
                type="password" 
                name="current_password"
                required
                className="w-full h-12 px-4 bg-secondary/30 border border-input rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary font-medium font-mono tracking-widest"
              />
            </div>
            
            <div className="grid gap-2">
              <label className="text-sm font-semibold text-muted-foreground">New Password</label>
              <input 
                type="password" 
                name="new_password"
                required
                minLength={8}
                className="w-full h-12 px-4 bg-secondary/30 border border-input rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary font-medium font-mono tracking-widest"
              />
              <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Must be at least 8 characters</p>
            </div>

            <div className="grid gap-2">
              <label className="text-sm font-semibold text-muted-foreground">Confirm New Password</label>
              <input 
                type="password" 
                name="confirm_password"
                required
                minLength={8}
                className="w-full h-12 px-4 bg-secondary/30 border border-input rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary font-medium font-mono tracking-widest"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <button type="submit" disabled={saving} className="flex items-center gap-2 px-8 h-12 rounded-xl bg-purple-500 hover:bg-purple-600 text-white font-bold transition-all shadow-[0_0_20px_rgba(168,85,247,0.3)] hover:scale-105 w-full sm:w-auto justify-center disabled:opacity-50 disabled:scale-100 disabled:cursor-not-allowed">
            {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
            {saving ? "Updating..." : "Update Password"}
          </button>
        </div>
      </form>
    </div>
  );
}
