"use client";

import { usePathname } from "next/navigation";
import { Footer } from "./footer";

export function ClientFooter() {
  const pathname = usePathname();
  
  // Hide footer on dashboard, auth, and other full-screen app routes
  const hideFooterRoutes = ["/dashboard", "/login", "/signup", "/forgot-password"];
  const shouldHide = hideFooterRoutes.some(route => pathname?.startsWith(route));

  if (shouldHide) {
    return null;
  }

  return <Footer />;
}
