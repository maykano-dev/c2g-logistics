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
import { ModalProvider } from "../components/providers/modal-provider";

const outfit = Outfit({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "C2G Logistics - Your Gateway to China, Delivered to Ghana",
    template: "%s | C2G Logistics",
  },
  description: "Import stuff from China to Ghana with C2G Logistics. We help you import goods from other countries aswell. Shipping, clearing, and delivery made easy. Shop at C2G Mall - buy cheap quality goods from China. Best online shopping store in Ghana.",
  keywords: "c2gmall, c2g mall, c2g ghana, c2g fofoofo mall ghana amazon, c2gmall ghana, c2g mall ghana, c2g fofoofo, c2g fofoofo mall, c2g fofoofo ghana, c2g amazon, c2g amazon ghana, c2gmall amazon, c2g mall amazon, c2g fofoofo mall amazon, buy cheap quality goods from china, c2g mall, c2g logistics, c2g, ship from china to ghana, how to buy from china to ghana, ghana amazon, amazon ghana, best online shop in ghana, best online store in ghana, mini importation Ghana, how to start importation in Ghana, import goods to Ghana, shipping to Ghana, cargo to Ghana, online shopping Ghana, buy from China, import business Ghana, freight forwarding Ghana, shipping company Ghana, how to import from China to Ghana, import from USA to Ghana, import from Turkey to Ghana, mini importation, import from china, buy cheap goods, China to Ghana shipping, online store Ghana, e-commerce Ghana, shop online Ghana, Ghana online shopping, China products Ghana, best ecommerce site in ghana, c2gmall online shopping, c2g mall online shopping, c2g ghana shopping, c2g fofoofo shopping, c2g amazon alternative, c2gmall store, c2g mall store, c2g ghana store",
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "Importation From China To Ghana | Start Import Business with C2G Logistics",
    description: "Start your importing today. C2G Logistics makes importation to Ghana simple, fast and reliable.",
    url: "https://c2g-logistics.com",
    siteName: "C2G Logistics",
    images: [
      {
        url: "https://c2g-logistics.com/images/seo-cover.jpg",
        width: 1200,
        height: 630,
        alt: "C2G Logistics Cover",
      },
    ],
    locale: "en_GH",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Mini Importation to Ghana | Start Import Business with C2G Logistics",
    description: "Ship, clear and deliver goods to Ghana easily with C2G Logistics.",
    images: ["https://c2g-logistics.com/images/seo-cover.jpg"],
  },
  verification: {
    google: "FSHYnt2pmKqZwx-kP83KgobCcZo8SIQZSaQC72jG2D4",
  },
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "C2G Logistics",
              "alternateName": "C2G Mall",
              "url": "https://c2g-logistics.com",
              "logo": "https://c2g-logistics.com/logo.png",
              "contactPoint": {
                "@type": "ContactPoint",
                "telephone": "+233241465282",
                "contactType": "customer service",
                "areaServed": "GH",
                "availableLanguage": "en"
              },
              "sameAs": [
                "https://www.facebook.com/c2glogistics",
                "https://www.instagram.com/c2glogistics"
              ]
            })
          }}
        />
      </head>
      <body className={outfit.className}>
        <NextTopLoader color="#3b82f6" showSpinner={false} shadow="0 0 10px #3b82f6,0 0 5px #3b82f6" />
        <ModalProvider>
          <CartProvider>
            <WishlistProvider>
              <div className="min-h-[100dvh] bg-background text-foreground flex flex-col w-full">
                <ServiceWorkerRegister />
              <OfflineIndicator />
              {children}
              <ClientFooter />
            </div>
          </WishlistProvider>
        </CartProvider>
        </ModalProvider>
        <ClientWhatsAppButton />
      </body>
    </html>
  );
}
