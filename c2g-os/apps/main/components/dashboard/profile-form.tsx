"use client";

import { useState } from "react";
import { User, Mail, Phone, Send } from "lucide-react";
import { updateCustomerProfile } from "../../app/dashboard/settings/actions";

type ProfileProps = {
  profile: {
    name: string;
    email: string;
    phone: string;
    customer_unique_id: string;
    telegram_chat_id: string;
    telegram_notifications_enabled: boolean;
  };
};

export default function ProfileForm({ profile }: ProfileProps) {
  const [isPending, setIsPending] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  async function handleSubmit(formData: FormData) {
    setIsPending(true);
    setMessage({ type: "", text: "" });
    
    // Add boolean value manually since unchecked checkboxes aren't submitted
    formData.set("telegram_notifications_enabled", formData.get("telegram_notifications_enabled") === "on" ? "true" : "false");

    const result = await updateCustomerProfile(formData);
    
    if (result.success) {
      setMessage({ type: "success", text: "Profile updated successfully!" });
    } else {
      setMessage({ type: "error", text: result.error || "Failed to update profile." });
    }
    setIsPending(false);
  }

  return (
    <div className="glass-panel p-6 md:p-8">
      <h2 className="text-xl font-bold mb-6">Profile Details</h2>
      
      <form action={handleSubmit} className="space-y-6">
        <div className="flex items-center gap-6 mb-8">
          <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-primary to-accent border-4 border-background shadow-md flex items-center justify-center text-primary-foreground font-bold text-3xl">
            {profile.name?.substring(0, 2).toUpperCase() || "C2G"}
          </div>
          <div>
            <button type="button" className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-4 disabled:opacity-50">
              Change Avatar
            </button>
            <p className="text-xs text-muted-foreground mt-2">JPG, GIF or PNG. Max size of 800K</p>
          </div>
        </div>

        {message.text && (
          <div className={`p-4 rounded-xl text-sm ${message.type === "success" ? "bg-green-500/10 text-green-500 border border-green-500/20" : "bg-destructive/10 text-destructive border border-destructive/30"}`}>
            {message.text}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium">Full Name</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input type="text" name="name" defaultValue={profile.name} required className="flex h-11 w-full rounded-md border border-input bg-background/50 pl-9 pr-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 transition-colors" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input type="email" defaultValue={profile.email} disabled className="flex h-11 w-full rounded-md border border-input bg-secondary/50 pl-9 pr-3 py-2 text-sm cursor-not-allowed text-muted-foreground" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">WhatsApp Phone Number</label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input type="tel" name="phone" defaultValue={profile.phone} required className="flex h-11 w-full rounded-md border border-input bg-background/50 pl-9 pr-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 transition-colors" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Customer ID</label>
            <input type="text" defaultValue={profile.customer_unique_id} disabled className="flex h-11 w-full rounded-md border border-input bg-secondary/50 px-3 py-2 text-sm cursor-not-allowed font-mono text-muted-foreground" />
          </div>
        </div>

        <div className="pt-6 border-t border-border/50">
          <h3 className="text-lg font-bold mb-4">Telegram Notifications</h3>
          <p className="text-sm text-muted-foreground mb-4">Get instant updates on your orders and shipments via Telegram.</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">Telegram Chat ID</label>
              <div className="relative">
                <Send className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input type="text" name="telegram_chat_id" defaultValue={profile.telegram_chat_id} placeholder="e.g. 123456789" className="flex h-11 w-full rounded-md border border-input bg-background/50 pl-9 pr-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 transition-colors" />
              </div>
            </div>
            
            <div className="space-y-2 pt-8">
              <label className="flex items-center gap-3 p-3 rounded-lg border border-border hover:border-primary/40 cursor-pointer transition-colors bg-background/50">
                <input type="checkbox" name="telegram_notifications_enabled" defaultChecked={profile.telegram_notifications_enabled} className="w-4 h-4 rounded accent-primary" />
                <span className="text-sm font-medium">Enable Notifications</span>
              </label>
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-border/50 flex justify-end">
          <button type="submit" disabled={isPending} className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-all bg-primary text-primary-foreground hover:bg-primary/90 h-11 px-8 shadow-lg shadow-primary/25 disabled:opacity-50">
            {isPending ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}
