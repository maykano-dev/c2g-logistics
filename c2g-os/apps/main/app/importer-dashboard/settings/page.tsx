"use client";

import { Store, Phone, Shield, ChevronRight } from "lucide-react";
import Link from "next/link";

export default function SettingsMenuPage() {
  const menuItems = [
    {
      title: "Store Profile",
      description: "Manage brand identity, name, and banners.",
      icon: Store,
      href: "/importer-dashboard/settings/profile",
      color: "text-blue-500",
      bg: "bg-blue-500/10",
    },
    {
      title: "Contact & Payment",
      description: "Manage phone, email, and MoMo numbers.",
      icon: Phone,
      href: "/importer-dashboard/settings/contact",
      color: "text-green-500",
      bg: "bg-green-500/10",
    },
    {
      title: "Security",
      description: "Update passwords and secure your account.",
      icon: Shield,
      href: "/importer-dashboard/settings/security",
      color: "text-purple-500",
      bg: "bg-purple-500/10",
    },
  ];

  return (
    <div className="space-y-6 max-w-2xl mx-auto animate-fade-in pb-24">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground mt-1">Manage your store preferences and account details.</p>
      </div>

      <div className="flex flex-col gap-3">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link 
              key={item.href}
              href={item.href}
              className="glass-panel p-4 flex items-center justify-between group hover:bg-secondary/50 transition-colors border border-border/50 rounded-2xl"
            >
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${item.bg} ${item.color}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-base sm:text-lg">{item.title}</h3>
                  <p className="text-xs sm:text-sm text-muted-foreground">{item.description}</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors" />
            </Link>
          );
        })}
      </div>
    </div>
  );
}
