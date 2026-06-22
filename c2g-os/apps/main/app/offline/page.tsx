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
        body { margin: 0; font-family: system-ui, -apple-system, sans-serif; background-color: #050505; color: #ffffff; }
        /* Hide all layout elements that might be unstyled */
        header, footer, nav, .footer, .header, #whatsapp-button, .ClientWhatsAppButton { display: none !important; }
        
        .offline-wrapper { 
          min-height: 100vh; 
          display: flex; 
          flex-direction: column; 
          align-items: center; 
          justify-content: center; 
          padding: 2rem; 
          text-align: center;
          background: radial-gradient(circle at center, #111115 0%, #050505 100%);
          position: fixed;
          top: 0; left: 0; right: 0; bottom: 0;
          z-index: 999999;
        }
        
        .icon-pulse {
          width: 100px;
          height: 100px;
          background-color: rgba(239, 68, 68, 0.1);
          border: 1px solid rgba(239, 68, 68, 0.2);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 2.5rem;
          position: relative;
          box-shadow: 0 0 40px rgba(239, 68, 68, 0.15);
        }
        
        .icon-pulse::before {
          content: '';
          position: absolute;
          width: 140%;
          height: 140%;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(239, 68, 68, 0.1) 0%, transparent 70%);
          animation: pulse 2s infinite;
        }
        
        @keyframes pulse {
          0% { transform: scale(0.8); opacity: 0.5; }
          50% { transform: scale(1.2); opacity: 0; }
          100% { transform: scale(0.8); opacity: 0; }
        }

        .icon-svg {
          width: 48px;
          height: 48px;
          color: #ef4444;
          z-index: 2;
        }
        
        .title { 
          font-size: 2.5rem; 
          font-weight: 900; 
          letter-spacing: -0.03em; 
          margin: 0 0 1rem 0;
          background: linear-gradient(to right, #ffffff, #a1a1aa);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        
        .desc { 
          color: #a1a1aa; 
          max-width: 28rem; 
          margin: 0 auto 3rem auto; 
          line-height: 1.6; 
          font-size: 1.1rem; 
        }
        
        .retry-btn { 
          display: inline-flex; 
          align-items: center; 
          gap: 0.75rem; 
          background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
          color: white; 
          padding: 1rem 2.5rem; 
          border-radius: 9999px; 
          font-weight: 700; 
          font-size: 1.1rem;
          text-decoration: none; 
          box-shadow: 0 10px 25px -5px rgba(37, 99, 235, 0.4); 
          transition: all 0.3s ease;
          border: 1px solid rgba(255,255,255,0.1);
        }
        
        .retry-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 15px 30px -5px rgba(37, 99, 235, 0.5); 
        }
        
        .retry-svg { 
          width: 1.25rem; 
          height: 1.25rem; 
        }
      `}} />
      <div className="offline-wrapper">
        <div className="icon-pulse">
          <WifiOff className="icon-svg" strokeWidth={1.5} />
        </div>
        
        <h1 className="title">Connection Lost</h1>
        
        <p className="desc">
          C2G Mall requires an active internet connection to browse products and track shipments. Please check your network and try again.
        </p>

        <Link href="/" className="retry-btn">
          <RefreshCw className="retry-svg" />
          Try Again
        </Link>
      </div>
    </>
  );
}
