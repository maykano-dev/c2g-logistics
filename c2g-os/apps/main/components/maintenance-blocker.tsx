"use client";

import { usePathname } from "next/navigation";
import { AlertTriangle } from "lucide-react";

export function MaintenanceBlocker({ settings, children }: { settings: any, children: React.ReactNode }) {
  const pathname = usePathname();

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
        <p className="text-zinc-400 max-w-md mx-auto">
          We are currently performing scheduled maintenance on the platform. Please check back shortly.
        </p>
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
        <p className="text-zinc-400 max-w-md mx-auto">
          This section of the platform is currently undergoing updates and is temporarily unavailable. Other parts of the site are working normally.
        </p>
      </div>
    );
  }

  return <>{children}</>;
}
