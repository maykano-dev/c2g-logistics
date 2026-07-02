"use client";

import { useFormStatus } from "react-dom";
import { LogOut, Loader2 } from "lucide-react";

export function LogoutButton() {
  const { pending } = useFormStatus();

  return (
    <button 
      type="submit" 
      disabled={pending}
      className="w-full inline-flex items-center justify-center whitespace-nowrap rounded-xl text-sm font-bold transition-all border-2 border-destructive/30 text-destructive hover:bg-destructive hover:text-destructive-foreground h-12 px-4 gap-2 shadow-sm relative z-50 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {pending ? (
        <Loader2 className="w-5 h-5 animate-spin" />
      ) : (
        <LogOut className="w-5 h-5" />
      )}
      {pending ? "Signing Out..." : "Sign Out"}
    </button>
  );
}
