"use client";

import { useEffect } from "react";

/**
 * CookieGuard — prevents HTTP 400 errors caused by cookie bloat.
 * 
 * Supabase auth tokens are chunked across multiple cookies (e.g. sb-xxx-auth-token.0, .1, .2, etc).
 * On flaky mobile networks, failed token refreshes can leave orphaned/duplicate cookie chunks
 * that accumulate over time. Once total cookie size exceeds the server's header limit (~8KB),
 * the server rejects the request with a raw HTTP 400 — a terrible UX dead-end.
 * 
 * This component runs on every page load and:
 * 1. Measures total cookie size for the domain
 * 2. If it exceeds a safe threshold (6KB, well under the 8KB server limit), 
 *    it clears all Supabase auth cookies to prevent the 400 error
 * 3. The user simply gets logged out and can sign back in cleanly
 */

const COOKIE_SIZE_LIMIT = 6000; // 6KB — safe buffer before 8KB server rejection

function getCookieSizeBytes(): number {
  return new Blob([document.cookie]).size;
}

function clearSupabaseCookies() {
  const allCookies = document.cookie.split(";");
  
  for (const cookie of allCookies) {
    const name = cookie.split("=")[0]?.trim();
    if (!name) continue;
    
    // Only clear Supabase auth-related cookies (sb-* pattern)
    if (name.startsWith("sb-")) {
      // Clear with multiple path variants to ensure deletion
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=${window.location.hostname}`;
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=.${window.location.hostname}`;
    }
  }
}

export default function CookieGuard() {
  useEffect(() => {
    try {
      const size = getCookieSizeBytes();
      
      if (size > COOKIE_SIZE_LIMIT) {
        console.warn(
          `[CookieGuard] Cookie size (${size} bytes) exceeds safe limit (${COOKIE_SIZE_LIMIT} bytes). Clearing auth cookies to prevent HTTP 400.`
        );
        clearSupabaseCookies();
        
        // If we're on a protected page, reload to trigger a clean redirect to login
        const path = window.location.pathname;
        const isProtected = path.startsWith("/dashboard") || path.startsWith("/admin") || path.startsWith("/finance") || path.startsWith("/employee") || path.startsWith("/agent") || path.startsWith("/checkout");
        
        if (isProtected) {
          window.location.reload();
        }
      }
    } catch (e) {
      // Silently fail — this is a defensive safeguard, not a critical feature
    }
  }, []);

  return null;
}
