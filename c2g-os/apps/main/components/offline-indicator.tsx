"use client";

import { useEffect, useState } from "react";
import { WifiOff, RefreshCw } from "lucide-react";

export default function OfflineIndicator() {
  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    // Initial check
    setIsOffline(!navigator.onLine);

    const handleOffline = () => setIsOffline(true);
    const handleOnline = () => setIsOffline(false);

    window.addEventListener("offline", handleOffline);
    window.addEventListener("online", handleOnline);

    return () => {
      window.removeEventListener("offline", handleOffline);
      window.removeEventListener("online", handleOnline);
    };
  }, []);

  if (!isOffline) return null;

  return (
    <div className="fixed inset-0 z-[9999] bg-background/95 backdrop-blur-xl flex flex-col items-center justify-center p-6 animate-in fade-in duration-300">
      <div className="w-24 h-24 bg-red-500/10 rounded-full flex items-center justify-center mb-8 animate-pulse">
        <WifiOff className="w-12 h-12 text-red-500" />
      </div>
      
      <h1 className="text-3xl font-extrabold tracking-tight mb-3 text-center">
        No Internet Connection
      </h1>
      
      <p className="text-muted-foreground text-center mb-10 max-w-sm">
        It looks like you're offline. Please check your network settings and try again. C2G Mall requires an active connection to browse products.
      </p>

      <button 
        onClick={() => window.location.reload()}
        className="flex items-center gap-2 bg-primary text-primary-foreground px-8 py-3.5 rounded-full font-bold shadow-lg shadow-primary/25 hover:scale-105 transition-all"
      >
        <RefreshCw className="w-5 h-5" />
        Retry Connection
      </button>
    </div>
  );
}
