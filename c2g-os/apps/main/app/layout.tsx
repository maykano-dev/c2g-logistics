import type { Metadata, Viewport } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import { ClientFooter } from "../components/client-footer";
import { CartProvider } from "../components/shop/cart-context";
import { WishlistProvider } from "../components/shop/wishlist-context";
import OfflineIndicator from "../components/offline-indicator";
import ServiceWorkerRegister from "../components/sw-register";
import { ClientWhatsAppButton } from "../components/client-whatsapp-button";
import NextTopLoader from 'nextjs-toploader';

const outfit = Outfit({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "C2G Logistics | Shop, Import & Ship From China to Ghana",
    template: "%s | C2G Logistics",
  },
  description: "C2G Logistics is Ghana's trusted platform for shopping, importing, and shipping products from China. Buy For Me, Warehouse Address, Air & Sea Freight.",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "C2G Logistics",
  },
  formatDetection: {
    telephone: false,
  },
};

export const viewport: Viewport = {
  themeColor: "#000000",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css"
          crossOrigin="anonymous"
        />
      </head>
      <body className={outfit.className}>
        <NextTopLoader color="#3b82f6" showSpinner={false} shadow="0 0 10px #3b82f6,0 0 5px #3b82f6" />
        <CartProvider>
          <WishlistProvider>
            <div className="min-h-[100dvh] bg-background text-foreground flex flex-col w-full overflow-x-hidden">
              <ServiceWorkerRegister />
              <OfflineIndicator />
              {children}
              <ClientFooter />
            </div>
          </WishlistProvider>
        </CartProvider>
        <ClientWhatsAppButton />
      </body>
    </html>
  );
}
