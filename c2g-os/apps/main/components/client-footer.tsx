"use client";

import { usePathname } from "next/navigation";
import { Footer } from "./footer";
import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";

export function ClientFooter() {
  const pathname = usePathname();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const supabase = createClient();
      const { data: { session } } = await supabase.auth.getSession();
      setIsLoggedIn(!!session);
    };
    checkAuth();
  }, [pathname]);
  
  // Hide footer on dashboard, auth, admin, staff and other full-screen app routes
  const hideFooterRoutes = ["/dashboard", "/admin", "/staff", "/agent", "/login", "/signup", "/forgot-password", "/importers/login", "/importers/register"];
  const shouldHide = hideFooterRoutes.some(route => pathname?.startsWith(route));

  if (shouldHide) {
    return null;
  }

  return <Footer hideCta={isLoggedIn} />;
}
