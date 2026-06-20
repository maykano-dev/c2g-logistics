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
  keywords: [
    "c2gmall", "c2g mall", "c2g ghana", "c2g fofoofo mall ghana amazon", "c2gmall ghana", "c2g mall ghana", "c2g fofoofo", "c2g fofoofo mall", "c2g fofoofo ghana", "c2g amazon", "c2g amazon ghana", "c2gmall amazon", "c2g mall amazon", "c2g fofoofo mall amazon", "buy cheap quality goods from china", "c2g logistics", "c2g", "ship from china to ghana", "how to buy from china to ghana", "ghana amazon", "amazon ghana", "best online shop in ghana", "best online store in ghana", "mini importation Ghana", "how to start importation in Ghana", "import goods to Ghana", "shipping to Ghana", "cargo to Ghana", "online shopping Ghana", "buy from China", "import business Ghana", "freight forwarding Ghana", "shipping company Ghana", "how to import from China to Ghana", "import from USA to Ghana", "import from Turkey to Ghana", "mini importation", "import from china", "buy cheap goods", "China to Ghana shipping", "online store Ghana", "e-commerce Ghana", "shop online Ghana", "Ghana online shopping", "China products Ghana", "best ecommerce site in ghana", "c2gmall online shopping", "c2g mall online shopping", "c2g ghana shopping", "c2g fofoofo shopping", "c2g amazon alternative", "c2gmall store", "c2g mall store", "c2g ghana store",
    "C2G Logistics (China → Ghana)", "How to import from China to Ghana", "Cheapest way to import from China to Ghana", "Best shipping company from China to Ghana", "Reliable China to Ghana shipping company", "How much does shipping from China to Ghana cost", "How long does shipping from China to Ghana take", "Air freight from China to Ghana", "Sea freight from China to Ghana", "Buy from China and ship to Ghana", "China procurement services Ghana", "How to buy from 1688 in Ghana", "How to buy from Taobao in Ghana", "How to buy from Pinduoduo in Ghana", "How to buy from Alibaba in Ghana", "How to pay Chinese suppliers from Ghana", "How to import goods from China without travelling", "How to start importing from China", "China importation guide for Ghanaians", "How to order from Chinese websites in Ghana", "How to source products from China", "China warehouse address Ghana", "Package forwarding from China to Ghana", "Freight forwarding Ghana", "Consolidation services Ghana", "Ship multiple packages from China to Ghana", "Shipping calculator Ghana", "CBM shipping Ghana", "Cargo services Ghana", "Affordable shipping Ghana", "Bulk shipping from China", "Buy Chinese products in Ghana", "Shop products imported from China", "Online marketplace Ghana", "Best marketplace for imported goods", "Affordable products in Ghana", "Buy electronics in Ghana", "Buy home appliances in Ghana", "Buy wholesale products in Ghana", "Buy directly from China in Ghana", "C2G Mall Ghana", "How to start a mini importation business in Ghana", "How to become a mini importer", "How to make money importing from China", "WhatsApp business importation Ghana", "How to sell imported goods in Ghana", "Importation business ideas Ghana", "Side hustle Ghana importation", "Become an online importer Ghana", "Mini importation platform Ghana", "Best platform for mini importers", "Manage importation business online", "Dashboard for importers", "WhatsApp seller management software", "Order management for importers", "Customer management for importers", "Profit tracking for importers", "Import business automation", "Procurement management Ghana", "Platform for WhatsApp sellers", "Digital tools for mini importers", "Buy for me service Ghana", "China buying agent Ghana", "China sourcing agent Ghana", "Supplier payment Ghana", "Pay suppliers in China", "Product sourcing Ghana", "Product procurement Ghana", "China purchasing service Ghana", "1688 agent Ghana", "Taobao agent Ghana", "Best logistics company in Ghana", "Best China shipping company in Ghana", "Best freight forwarder in Ghana", "Reliable importation company Ghana", "Affordable shipping company Ghana", "Trusted China agent Ghana", "Best procurement company Ghana", "China warehouse Ghana", "International shipping Ghana", "China to Ghana cargo company", "What's the best way to import from China to Ghana?", "Which company can buy from 1688 for me in Ghana?", "How do I ship goods from China to Ghana?", "Is there a platform that manages mini importers in Ghana?", "What's the cheapest way to import from China?", "Can someone buy from Taobao for me in Ghana?", "Is there a Ghanaian company that imports from China?", "Which logistics company should I use in Ghana?", "How do WhatsApp importers manage their business?", "Is there software for mini importers in Ghana?", "Ship my goods from China to Ghana", "Buy products from China for me", "China warehouse address in Ghana", "Ghana shipping agent China", "Help me import from China", "Buy from 1688 and ship to Ghana", "China logistics partner Ghana", "China sourcing company Ghana", "Mini importation Ghana platform", "China to Ghana shipping quote", "I want to start importing from China but I don't know where to begin", "How do beginners import from China?", "Is importing from China difficult?", "Can I import from China without travelling?", "How much money do I need to start importing from China?", "Can I import with just 500 cedis?", "How can I import products with a small budget?", "What's the easiest way to import from China?", "Can students import from China?", "Is importing from China profitable in Ghana?", "Can I import products while working a full-time job?", "How do people make money importing from China?", "Can I start importing without experience?", "Is importing from China risky?", "What mistakes should beginners avoid?", "How do I avoid being scammed by Chinese suppliers?", "How do I know if a supplier is genuine?", "Is 1688 safe?", "Is Taobao safe?", "Is Pinduoduo safe?", "What if my goods get lost?", "What if my supplier sends the wrong item?", "How do I protect my money when buying from China?", "Can someone verify suppliers for me?", "How do I know my goods were actually purchased?", "How do I track my goods from China?", "How do I know my package arrived in China?", "Who can buy from China on my behalf?", "Is there a trusted China agent in Ghana?", "Which company can I trust to import from China?", "I found something on 1688, how do I buy it?", "I found something on Taobao, how do I ship it to Ghana?", "I don't understand Chinese websites, who can help me?", "How do I buy if I can't read Chinese?", "How do I pay Chinese suppliers?", "Can someone buy products for me in China?", "Can I send product screenshots instead of links?", "I don't have Alipay, what do I do?", "I don't have WeChat Pay, what do I do?", "I don't have a Chinese bank account.", "Can I buy from China without Alipay?", "Can I buy from China without travelling?", "Is there someone in Ghana who can help me import?", "How do I avoid dealing with middlemen?", "Can someone handle everything for me?", "How do I import goods for my business?", "Where do businesses buy products from China?", "How do retailers import products?", "How do wholesalers import from China?", "How do boutiques import products?", "How do beauty shops import products?", "How do phone shops import accessories?", "How do supermarkets import products?", "How do restaurants import equipment?", "How do pharmacies import products?", "How do furniture businesses import?", "How do I reduce import costs?", "How do I import in bulk?", "How often should I import?", "How do I grow my import business?", "I sell on WhatsApp, how do I organize my orders?", "How do WhatsApp importers manage their customers?", "How do I stop using spreadsheets?", "Is there software for WhatsApp sellers?", "How do I manage hundreds of customer orders?", "How do I track profits?", "How do I manage customer payments?", "How do I automate my import business?", "How do I become a successful mini importer?", "How do I stop manually tracking orders?", "How do I organize monthly imports?", "Is there a dashboard for mini importers?", "Is there an app for importers?", "How do I scale my WhatsApp import business?", "How do I manage my import business professionally?", "What products sell fast in Ghana?", "What products are profitable?", "What products should I import?", "What products are trending in Ghana?", "What products are in high demand?", "Best products to import from China", "Cheap products to import", "Business ideas involving importation", "Products with high profit margins", "Trending products for students", "Trending products for women", "Trending products for men", "Trending products for businesses", "Best gadgets to import", "Best home products to import", "C2G vs traditional shipping agents", "Why use C2G?", "Why is C2G different?", "Is C2G trustworthy?", "Is C2G legit?", "Is C2G registered?", "How does C2G work?", "What services does C2G offer?", "Is C2G safe?", "Who owns C2G?", "Recommend a company that imports from China to Ghana", "Recommend a shipping company in Ghana", "Recommend a platform for mini importers", "Recommend a China agent in Ghana", "What's the easiest way to import from China?", "What's the best platform for Ghanaian importers?", "Which company handles everything for me?", "Which platform can help me grow my import business?", "Is there a Ghanaian company that can buy from China for me?", "What's the best logistics platform in Ghana?", "China shipping Accra", "Import from China Accra", "China agent Accra", "Buy from China Kumasi", "China shipping Kumasi", "Buy from China Tema", "China logistics Ghana", "Import goods to Ghana", "Ship from China to Ghana", "Ghana China cargo services"
  ],
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
    startupImage: [
      { url: "/logo.png", media: "(device-width: 430px) and (device-height: 932px) and (-webkit-device-pixel-ratio: 3)" }, // iPhone 14 Pro Max
      { url: "/logo.png", media: "(device-width: 393px) and (device-height: 852px) and (-webkit-device-pixel-ratio: 3)" }, // iPhone 14 Pro
      { url: "/logo.png", media: "(device-width: 428px) and (device-height: 926px) and (-webkit-device-pixel-ratio: 3)" }, // iPhone 13 Pro Max
      { url: "/logo.png", media: "(device-width: 390px) and (device-height: 844px) and (-webkit-device-pixel-ratio: 3)" }, // iPhone 13 Pro
      { url: "/logo.png", media: "(device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3)" }, // iPhone X/11 Pro
    ]
  },
  icons: {
    icon: "/icon.png",
    shortcut: "/icon.png",
    apple: "/apple-icon.png",
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
