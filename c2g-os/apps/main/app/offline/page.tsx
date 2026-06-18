import { WifiOff, RefreshCw } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "No Internet Connection | C2G Mall",
  description: "You are currently offline.",
};

export default function OfflinePage() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-foreground">
      <div className="w-24 h-24 bg-red-500/10 rounded-full flex items-center justify-center mb-8">
        <WifiOff className="w-12 h-12 text-red-500" />
      </div>
      
      <h1 className="text-3xl font-extrabold tracking-tight mb-3 text-center">
        You're Offline
      </h1>
      
      <p className="text-muted-foreground text-center mb-10 max-w-sm">
        It looks like you've lost your internet connection. Please check your network settings and try again. C2G Mall requires an active connection.
      </p>

      <Link 
        href="/"
        className="flex items-center gap-2 bg-primary text-primary-foreground px-8 py-3.5 rounded-full font-bold shadow-lg shadow-primary/25 hover:scale-105 transition-all"
      >
        <RefreshCw className="w-5 h-5" />
        Tap to Retry
      </Link>
    </div>
  );
}
