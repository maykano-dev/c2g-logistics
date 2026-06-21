"use client";

import { Save, Store, Image as ImageIcon, ChevronLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getImporterProfile, updateImporterProfile } from "../actions";

export default function StoreProfileSettings() {
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
      business_name: formData.get("business_name"),
      store_description: formData.get("store_description"),
    };

    const { success, error } = await updateImporterProfile(data);
    setSaving(false);

    if (success) {
      alert("Profile settings saved successfully!");
      router.push("/importer-dashboard/settings");
    } else {
      alert("Failed to save profile: " + error);
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
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Store Profile</h1>
          <p className="text-sm text-muted-foreground">Manage your brand identity and appearance.</p>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        <div className="glass-panel p-6 sm:p-8 shadow-lg border-border/50 rounded-2xl">
          <div className="space-y-6">
            <div className="grid gap-2">
              <label className="text-sm font-semibold text-muted-foreground">Business Name</label>
              <input 
                type="text" 
                name="business_name"
                defaultValue={profile?.business_name || ""} 
                className="w-full h-12 px-4 bg-secondary/30 border border-input rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary font-medium"
                required
              />
            </div>
            
            <div className="grid gap-2">
              <label className="text-sm font-semibold text-muted-foreground">Store Description</label>
              <textarea 
                rows={4}
                name="store_description"
                defaultValue={profile?.store_description || ""}
                className="w-full p-4 bg-secondary/30 border border-input rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary resize-none font-medium"
              />
            </div>

            <div className="grid gap-2">
              <label className="text-sm font-semibold text-muted-foreground">Store Logo</label>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <div className="w-24 h-24 rounded-full bg-secondary/50 border-2 border-dashed border-border flex items-center justify-center shrink-0 overflow-hidden">
                  {profile?.store_logo_url ? (
                    <img src={profile.store_logo_url} alt="Store Logo" className="w-full h-full object-cover" />
                  ) : (
                    <ImageIcon className="w-8 h-8 text-muted-foreground opacity-50" />
                  )}
                </div>
                <div className="space-y-2">
                  <button type="button" onClick={() => alert("Logo upload triggered")} className="px-5 py-2.5 bg-secondary hover:bg-secondary/80 text-sm font-bold rounded-xl transition-colors">
                    Upload Logo
                  </button>
                  <p className="text-xs text-muted-foreground">Recommended size: 512x512px. JPG, PNG.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <button type="submit" disabled={saving} className="flex items-center gap-2 px-8 h-12 rounded-xl bg-primary text-primary-foreground font-bold hover:bg-primary/90 transition-all shadow-[0_0_20px_rgba(var(--primary),0.3)] hover:scale-105 w-full sm:w-auto justify-center disabled:opacity-50 disabled:scale-100 disabled:cursor-not-allowed">
            {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
            {saving ? "Saving..." : "Save Profile"}
          </button>
        </div>
      </form>
    </div>
  );
}
