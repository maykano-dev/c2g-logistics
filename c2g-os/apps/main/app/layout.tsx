import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import { ClientFooter } from "../components/client-footer";
import { CartProvider } from "../components/shop/cart-context";

const outfit = Outfit({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "C2G Logistics — Shop, Import & Ship From China to Ghana",
    template: "%s | C2G Logistics",
  },
  description: "C2G Logistics is Ghana's trusted platform for shopping, importing, and shipping products from China. Buy For Me, Warehouse Address, Air & Sea Freight.",
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
        <CartProvider>
          <div className="min-h-screen bg-background text-foreground flex flex-col">
            {children}
            <ClientFooter />
          </div>
        </CartProvider>
        {/* Global WhatsApp Float Button */}
        <a
          href="https://wa.me/233241465282"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Chat on WhatsApp"
          className="fixed bottom-[100px] md:bottom-6 right-4 md:right-6 z-50 w-14 h-14 rounded-full bg-green-500 text-white flex items-center justify-center shadow-lg shadow-green-500/40 hover:bg-green-600 hover:scale-110 transition-all"
        >
          <i className="fab fa-whatsapp text-2xl" />
        </a>
      </body>
    </html>
  );
}
