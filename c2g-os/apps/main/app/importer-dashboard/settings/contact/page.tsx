"use client";

import { Save, Phone, ChevronLeft, CreditCard, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getImporterProfile, updateImporterProfile } from "../actions";

export default function ContactPaymentSettings() {
  const router = useRouter();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function load() {
      const { success, importer } = await getImporterProfile();
      if (success) setProfile(importer);
      setLoading(false);
    }
    load();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    const formData = new FormData(e.target as HTMLFormElement);
    const data = {
      whatsapp_number: formData.get("whatsapp_number"),
      support_email: formData.get("support_email"),
      momo_number: formData.get("momo_number"),
    };

    const { success, error } = await updateImporterProfile(data);
    setSaving(false);

    if (success) {
      alert("Contact & Payment settings saved successfully!");
      router.push("/importer-dashboard/settings");
    } else {
      alert("Failed to save settings: " + error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-2xl mx-auto animate-fade-in pb-24">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/importer-dashboard/settings" className="p-2 -ml-2 rounded-full hover:bg-secondary transition-colors">
          <ChevronLeft className="w-6 h-6" />
        </Link>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Contact & Payment</h1>
          <p className="text-sm text-muted-foreground">Manage your communication and payout details.</p>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        <div className="glass-panel p-6 sm:p-8 shadow-lg border-border/50 rounded-2xl">
          <h2 className="text-lg font-bold mb-4 flex items-center gap-2 text-primary">
            <Phone className="w-5 h-5" /> Contact Information
          </h2>
          <div className="space-y-6">
            <div className="grid gap-2">
              <label className="text-sm font-semibold text-muted-foreground">WhatsApp Number</label>
              <input 
                type="tel" 
                name="whatsapp_number"
                defaultValue={profile?.whatsapp_number || ""} 
                className="w-full h-12 px-4 bg-secondary/30 border border-input rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary font-medium"
                required
              />
              <p className="text-xs text-muted-foreground">Customers will use this number to contact your store.</p>
            </div>
            
            <div className="grid gap-2">
              <label className="text-sm font-semibold text-muted-foreground">Support Email</label>
              <input 
                type="email" 
                name="support_email"
                defaultValue={profile?.support_email || ""} 
                className="w-full h-12 px-4 bg-secondary/30 border border-input rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary font-medium"
              />
            </div>
          </div>
        </div>

        <div className="glass-panel p-6 sm:p-8 shadow-lg border-border/50 rounded-2xl">
          <h2 className="text-lg font-bold mb-4 flex items-center gap-2 text-green-500">
            <CreditCard className="w-5 h-5" /> Payment Details
          </h2>
          <div className="space-y-6">
            <div className="grid gap-2">
              <label className="text-sm font-semibold text-muted-foreground">Mobile Money (MoMo) Number</label>
              <input 
                type="tel" 
                name="momo_number"
                defaultValue={profile?.momo_number || ""}
                placeholder="e.g. +233 24 123 4567"
                className="w-full h-12 px-4 bg-secondary/30 border border-input rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary font-medium"
              />
              <p className="text-xs text-muted-foreground">We will process your wallet withdrawals to this number.</p>
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <button type="submit" disabled={saving} className="flex items-center gap-2 px-8 h-12 rounded-xl bg-primary text-primary-foreground font-bold hover:bg-primary/90 transition-all shadow-[0_0_20px_rgba(var(--primary),0.3)] hover:scale-105 w-full sm:w-auto justify-center disabled:opacity-50 disabled:scale-100 disabled:cursor-not-allowed">
            {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
            {saving ? "Saving..." : "Save Details"}
          </button>
        </div>
      </form>
    </div>
  );
}
