"use client";

import { usePathname } from "next/navigation";
import { AlertTriangle, ArrowRight } from "lucide-react";
import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import Link from "next/link";

export function MaintenanceBlocker({ settings, children }: { settings: any, children: React.ReactNode }) {
  const pathname = usePathname();
  const [session, setSession] = useState<any>(null);
  const [loadingAuth, setLoadingAuth] = useState(true);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoadingAuth(false);
    });
  }, []);

  // Check if we are in development mode, bypass maintenance
  if (process.env.NODE_ENV === 'development') {
    return <>{children}</>;
  }

  // Parse maintenance pages if it's a string, or use directly if object
  const maintPages = typeof settings?.maintenance_pages === 'string' 
    ? JSON.parse(settings.maintenance_pages) 
    : (settings?.maintenance_pages || {});

  // Check global maintenance mode
  if (settings?.maintenance_mode === true && !pathname.startsWith('/admin') && !pathname.startsWith('/staff') && !pathname.startsWith('/agent')) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center min-h-[60vh]">
        <div className="w-20 h-20 bg-orange-500/10 text-orange-500 rounded-full flex items-center justify-center mb-6">
          <AlertTriangle className="w-10 h-10" />
        </div>
        <h1 className="text-3xl font-bold text-white mb-4">Down for Maintenance</h1>
        <p className="text-zinc-400 max-w-md mx-auto mb-8">
          We are currently performing scheduled maintenance on the platform. Please check back shortly.
        </p>

        {!loadingAuth && (
          <div className="mt-4">
            {session ? (
              <Link href="/dashboard" className="inline-flex items-center justify-center gap-2 rounded-full text-base font-semibold bg-primary text-primary-foreground hover:bg-primary/90 h-12 px-8 shadow-lg shadow-primary/30 transition-all">
                Go to Dashboard <ArrowRight className="w-4 h-4" />
              </Link>
            ) : (
              <Link href="/login" className="inline-flex items-center justify-center gap-2 rounded-full text-base font-semibold border border-input glass hover:bg-secondary h-12 px-8 transition-all">
                Login <ArrowRight className="w-4 h-4" />
              </Link>
            )}
          </div>
        )}
      </div>
    );
  }

  // Check route-specific maintenance
  const isShopBlocked = maintPages?.shop && pathname.startsWith('/shop');
  const isCartBlocked = maintPages?.cart && pathname === '/cart';
  const isCheckoutBlocked = maintPages?.checkout && pathname === '/checkout';
  const isDashboardBlocked = maintPages?.dashboard && pathname.startsWith('/dashboard');

  if (isShopBlocked || isCartBlocked || isCheckoutBlocked || isDashboardBlocked) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center min-h-[60vh]">
        <div className="w-20 h-20 bg-orange-500/10 text-orange-500 rounded-full flex items-center justify-center mb-6">
          <AlertTriangle className="w-10 h-10" />
        </div>
        <h1 className="text-3xl font-bold text-white mb-4">Section Under Maintenance</h1>
        <p className="text-zinc-400 max-w-md mx-auto mb-8">
          This section of the platform is currently undergoing updates and is temporarily unavailable. Other parts of the site are working normally.
        </p>

        {!loadingAuth && (
          <div className="mt-4">
            {session ? (
              <Link href="/dashboard" className="inline-flex items-center justify-center gap-2 rounded-full text-base font-semibold bg-primary text-primary-foreground hover:bg-primary/90 h-12 px-8 shadow-lg shadow-primary/30 transition-all">
                Return to Dashboard <ArrowRight className="w-4 h-4" />
              </Link>
            ) : (
              <Link href="/login" className="inline-flex items-center justify-center gap-2 rounded-full text-base font-semibold border border-input glass hover:bg-secondary h-12 px-8 transition-all">
                Login <ArrowRight className="w-4 h-4" />
              </Link>
            )}
          </div>
        )}
      </div>
    );
  }

  return <>{children}</>;
}
