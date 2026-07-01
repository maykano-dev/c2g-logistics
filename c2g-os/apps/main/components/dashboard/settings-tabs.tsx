"use client";

import { useState } from "react";
import { User, Lock, ShieldAlert, ChevronRight, ArrowLeft, MapPin } from "lucide-react";
import Link from "next/link";

export default function SettingsTabs({ 
  profileForm, 
  passwordForm, 
  deleteForm 
}: { 
  profileForm: React.ReactNode;
  passwordForm: React.ReactNode;
  deleteForm: React.ReactNode;
}) {
  const [activeTab, setActiveTab] = useState<"menu" | "profile" | "password" | "delete">("menu");

  // On desktop, we always show profile by default and layout is side-by-side.
  // We'll use CSS media queries to handle the responsive behavior.
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
      {/* Navigation Menu */}
      <div className={`flex-col gap-2 ${activeTab !== "menu" ? "hidden md:flex" : "flex"}`}>
        <button 
          onClick={() => setActiveTab("profile")}
          className={`flex items-center justify-between md:justify-start gap-3 px-4 py-4 md:py-3 rounded-lg md:rounded-xl border md:border-transparent transition-all text-left font-medium ${activeTab === "profile" || activeTab === "menu" ? "md:bg-primary/10 md:text-primary bg-secondary/30" : "text-muted-foreground hover:bg-secondary hover:text-foreground"}`}
        >
          <div className="flex items-center gap-3">
            <User className="w-5 h-5 md:w-4 md:h-4" /> Profile Details
          </div>
          <ChevronRight className="w-5 h-5 text-muted-foreground md:hidden" />
        </button>
        
        <button 
          onClick={() => setActiveTab("password")}
          className={`flex items-center justify-between md:justify-start gap-3 px-4 py-4 md:py-3 rounded-lg md:rounded-xl border md:border-transparent transition-all text-left font-medium ${activeTab === "password" ? "md:bg-primary/10 md:text-primary bg-secondary/30" : "text-muted-foreground hover:bg-secondary hover:text-foreground"}`}
        >
          <div className="flex items-center gap-3">
            <Lock className="w-5 h-5 md:w-4 md:h-4" /> Change Password
          </div>
          <ChevronRight className="w-5 h-5 text-muted-foreground md:hidden" />
        </button>
        
        <button 
          onClick={() => setActiveTab("delete")}
          className={`flex items-center justify-between md:justify-start gap-3 px-4 py-4 md:py-3 rounded-lg md:rounded-xl border md:border-transparent transition-all text-left font-medium ${activeTab === "delete" ? "md:bg-destructive/10 md:text-destructive text-destructive bg-destructive/5" : "text-destructive/70 hover:bg-destructive/10 hover:text-destructive"}`}
        >
          <div className="flex items-center gap-3">
            <ShieldAlert className="w-5 h-5 md:w-4 md:h-4" /> Danger Zone
          </div>
          <ChevronRight className="w-5 h-5 text-muted-foreground md:hidden" />
        </button>

        {/* Mobile only: Warehouse Address Link */}
        <Link 
          href="/dashboard/warehouse"
          className="md:hidden flex items-center justify-between gap-3 px-4 py-4 rounded-lg border border-transparent transition-all text-left font-medium text-muted-foreground hover:bg-secondary hover:text-foreground mt-4"
        >
          <div className="flex items-center gap-3">
            <MapPin className="w-5 h-5" /> Warehouse Address
          </div>
          <ChevronRight className="w-5 h-5 text-muted-foreground" />
        </Link>
      </div>

      {/* Content Area */}
      <div className={`md:col-span-2 space-y-6 ${activeTab === "menu" ? "hidden md:block" : "block"}`}>
        {/* Mobile Back Button */}
        <button 
          onClick={() => setActiveTab("menu")}
          className="md:hidden flex items-center gap-2 text-muted-foreground hover:text-foreground mb-4 font-medium px-2"
        >
          <ArrowLeft className="w-5 h-5" /> Back to Settings
        </button>

        {/* Content based on tab (desktop shows profile if menu is active) */}
        <div className={activeTab === "profile" || (activeTab === "menu" && "hidden md:block") ? "block animate-in fade-in slide-in-from-bottom-4 duration-300" : "hidden"}>
          {profileForm}
        </div>
        
        <div className={activeTab === "password" ? "block animate-in fade-in slide-in-from-bottom-4 duration-300" : "hidden"}>
          {passwordForm}
        </div>
        
        <div className={activeTab === "delete" ? "block animate-in fade-in slide-in-from-bottom-4 duration-300" : "hidden"}>
          {deleteForm}
        </div>
      </div>
    </div>
  );
}
