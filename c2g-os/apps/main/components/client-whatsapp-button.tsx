"use client";

import { usePathname } from "next/navigation";

export function ClientWhatsAppButton() {
  const pathname = usePathname();
  
  // Hide whatsapp button on admin and auth pages
  const hideRoutes = ["/admin", "/login", "/signup", "/forgot-password"];
  const shouldHide = hideRoutes.some(route => pathname?.startsWith(route));

  if (shouldHide) {
    return null;
  }

  return (
    <a
      href="https://wa.me/233241465282"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-[100px] md:bottom-6 right-4 md:right-6 z-50 w-14 h-14 rounded-full bg-green-500 text-white flex items-center justify-center shadow-lg shadow-green-500/40 hover:bg-green-600 hover:scale-110 transition-all"
    >
      <i className="fab fa-whatsapp text-2xl" />
    </a>
  );
}
