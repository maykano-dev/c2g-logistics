"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  HelpCircle, 
  X, 
  PlaneTakeoff, 
  ClipboardList, 
  Package, 
  Info,
  ChevronRight
} from "lucide-react";
import Link from "next/link";

export default function FloatingGuide() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  // Close guide on route change
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  const getContent = () => {
    if (pathname.includes("/dashboard/reservations")) {
      return {
        title: "How Reservations Work",
        icon: PlaneTakeoff,
        color: "text-blue-500",
        bg: "bg-blue-500/10",
        steps: [
          {
            title: "Select Items",
            desc: "Pick packages or orders from your warehouse inventory that you want to ship."
          },
          {
            title: "Choose Shipping Method",
            desc: "Select between Air Normal (12-16 Days), Air Express (3-7 Days), or Sea Freight (50-60 Days)."
          },
          {
            title: "Shipping Advance",
            desc: "Review the required deposit to reserve space. This amount is held safely in your wallet."
          },
          {
            title: "Final Settlement",
            desc: "Once your items arrive, the held deposit is settled against your final shipping invoice. If the fee is less than the deposit, you get a refund."
          }
        ]
      };
    }
    
    if (pathname.includes("/dashboard/orders")) {
      return {
        title: "How Link Orders Work",
        icon: ClipboardList,
        color: "text-purple-500",
        bg: "bg-purple-500/10",
        steps: [
          {
            title: "Find a Product",
            desc: "Copy the link to an item from 1688, Taobao, Alibaba, or any Chinese supplier."
          },
          {
            title: "Submit Details",
            desc: "Paste the link, enter the product name, price in RMB/USD, quantity, and variations (size/color)."
          },
          {
            title: "Pay Instantly",
            desc: "The cost is automatically converted to GHS. Pay directly from your C2G wallet."
          },
          {
            title: "We Handle the Rest",
            desc: "Our team will purchase the item on your behalf and notify you when it arrives at our warehouse."
          }
        ]
      };
    }

    if (pathname.includes("/dashboard/packages")) {
      return {
        title: "How Packages Work",
        icon: Package,
        color: "text-emerald-500",
        bg: "bg-emerald-500/10",
        steps: [
          {
            title: "Get Your Address",
            desc: "Go to the 'Warehouse Address' tab and copy your personalized C2G delivery address."
          },
          {
            title: "Shop & Ship",
            desc: "Use this exact address at checkout on your favorite Chinese platforms or give it to your supplier."
          },
          {
            title: "Get Tracking Info",
            desc: "Once your supplier ships the goods, they will provide a local Chinese tracking number."
          },
          {
            title: "Register Package",
            desc: "Enter the tracking number here. Pay a small registration fee so our warehouse team expects your package."
          }
        ]
      };
    }

    // Default overview for other pages (dashboard home, etc.)
    return {
      title: "C2G Logistics Guide",
      icon: Info,
      color: "text-primary",
      bg: "bg-primary/10",
      isOverview: true,
      description: "Welcome to C2G Logistics! Here is a quick overview of what you can do:",
      links: [
        { title: "Buy For Me", desc: "Use Orders to have us purchase goods for you via links.", href: "/dashboard/orders", icon: ClipboardList },
        { title: "Ship For Me", desc: "Use your Warehouse Address to buy items yourself and send them to us.", href: "/dashboard/warehouse", icon: Package },
        { title: "Tracking & Shipping", desc: "Register Packages and reserve shipment space via Reservations.", href: "/dashboard/reservations", icon: PlaneTakeoff }
      ]
    };
  };

  const content = getContent();
  const Icon = content.icon;

  return (
    <>
      {/* Floating Action Button */}
      <div className="fixed bottom-24 right-4 md:bottom-8 md:right-8 z-[60]">
        <button
          onClick={() => setIsOpen(true)}
          className={`w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center shadow-2xl transition-transform hover:scale-110 active:scale-95 border border-white/20 backdrop-blur-md relative overflow-hidden group ${isOpen ? 'bg-zinc-800' : 'bg-primary'}`}
        >
          {/* Subtle pulse animation for the FAB when closed */}
          {!isOpen && (
            <span className="absolute inset-0 rounded-full bg-white opacity-20 animate-ping group-hover:hidden" style={{ animationDuration: '3s' }}></span>
          )}
          
          <AnimatePresence mode="wait">
            {isOpen ? (
              <motion.div
                key="close"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <X className="w-6 h-6 text-white" />
              </motion.div>
            ) : (
              <motion.div
                key="help"
                initial={{ rotate: 90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: -90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <HelpCircle className="w-6 h-6 text-white" />
              </motion.div>
            )}
          </AnimatePresence>
        </button>
      </div>

      {/* Backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[70] md:hidden"
          />
        )}
      </AnimatePresence>

      {/* Slide-Over Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: "100%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "100%", opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 bottom-0 w-full max-w-[400px] z-[80] glass-panel border-l border-border/50 shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-border/50 bg-background/50 shrink-0">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${content.bg} ${content.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <h2 className="font-bold text-lg">{content.title}</h2>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>

            {/* Content Body */}
            <div className="flex-1 overflow-y-auto p-6 scrollbar-hide">
              {content.isOverview ? (
                <div className="space-y-6">
                  <p className="text-muted-foreground">{content.description}</p>
                  <div className="grid gap-3">
                    {content.links?.map((link, i) => (
                      <Link
                        key={i}
                        href={link.href}
                        onClick={() => setIsOpen(false)}
                        className="group flex flex-col p-4 rounded-xl border border-border/50 bg-secondary/10 hover:bg-secondary/30 transition-all hover:border-primary/30"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2 font-bold">
                            <link.icon className="w-4 h-4 text-primary" />
                            {link.title}
                          </div>
                          <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                        </div>
                        <p className="text-xs text-muted-foreground">{link.desc}</p>
                      </Link>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="relative space-y-8 before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-border/50 before:to-transparent">
                  {content.steps?.map((step, i) => (
                    <div key={i} className="relative flex items-start gap-4">
                      {/* Step Number Badge */}
                      <div className={`shrink-0 w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm z-10 border-4 border-background ${i === 0 ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'bg-secondary text-muted-foreground'}`}>
                        {i + 1}
                      </div>
                      <div className="pt-2 pb-1 flex-1">
                        <h4 className="font-bold text-foreground mb-1 leading-none">{step.title}</h4>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {step.desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-border/50 bg-background/50 shrink-0">
              <p className="text-xs text-center text-muted-foreground flex items-center justify-center gap-2">
                Need more help? <Link href="https://wa.me/233241234567" target="_blank" className="text-primary font-bold hover:underline">Contact Support</Link>
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
