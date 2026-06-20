import { WifiOff, RefreshCw } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "No Internet Connection | C2G Mall",
  description: "You are currently offline.",
};

export default function OfflinePage() {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        body { margin: 0; font-family: system-ui, -apple-system, sans-serif; background-color: #09090b; color: #fafafa; }
        .offline-container { min-height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 1.5rem; text-align: center; }
        .icon-wrapper { width: 6rem; height: 6rem; background-color: rgba(239, 68, 68, 0.1); border-radius: 9999px; display: flex; align-items: center; justify-content: center; margin-bottom: 2rem; }
        .icon { width: 3rem; height: 3rem; color: #ef4444; }
        .title { font-size: 1.875rem; font-weight: 800; letter-spacing: -0.025em; margin-bottom: 0.75rem; }
        .desc { color: #a1a1aa; max-width: 24rem; margin-bottom: 2.5rem; line-height: 1.5; font-size: 1rem; }
        .retry-btn { display: inline-flex; align-items: center; gap: 0.5rem; background-color: #2563eb; color: white; padding: 0.875rem 2rem; border-radius: 9999px; font-weight: 700; text-decoration: none; box-shadow: 0 10px 15px -3px rgba(37, 99, 235, 0.25); transition: transform 0.2s; }
        .retry-btn svg { width: 1.25rem; height: 1.25rem; }
      `}} />
      <div className="offline-container min-h-screen bg-background flex flex-col items-center justify-center p-6 text-foreground">
        <div className="icon-wrapper w-24 h-24 bg-red-500/10 rounded-full flex items-center justify-center mb-8">
          <WifiOff className="icon w-12 h-12 text-red-500" />
        </div>
        
        <h1 className="title text-3xl font-extrabold tracking-tight mb-3 text-center">
          You're Offline
        </h1>
        
        <p className="desc text-muted-foreground text-center mb-10 max-w-sm">
          It looks like you've lost your internet connection. Please check your network settings and try again. C2G Mall requires an active connection.
        </p>

        <Link 
          href="/"
          className="retry-btn flex items-center gap-2 bg-primary text-primary-foreground px-8 py-3.5 rounded-full font-bold shadow-lg shadow-primary/25 hover:scale-105 transition-all"
        >
          <RefreshCw className="w-5 h-5" />
          Tap to Retry
        </Link>
      </div>
    </>
  );
}
