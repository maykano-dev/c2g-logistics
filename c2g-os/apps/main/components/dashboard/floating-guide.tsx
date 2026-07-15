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
  ChevronRight,
  CheckCircle2,
  XCircle,
  AlertTriangle
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
        body: (
          <div className="space-y-6 text-sm text-muted-foreground leading-relaxed pb-4">
            <p>Reservations allow you to decide <strong className="text-foreground font-bold">what items to ship, how to ship them, and when to ship them.</strong></p>
            <p>Every item that reaches our warehouse will appear in the Reservations page. This includes Buy For Me Orders, C2G Mall Orders, and Registered Packages.</p>

            <div className="space-y-3">
              <h3 className="font-bold text-foreground text-base border-b border-border/50 pb-2">Creating a Reservation</h3>
              <ol className="list-decimal pl-4 space-y-2">
                <li><strong className="text-foreground font-bold">Select the items</strong> you want to ship together.</li>
                <li><strong className="text-foreground font-bold">Choose your preferred shipping method</strong> (Air Normal, Air Express, Sea Freight).</li>
                <li><strong className="text-foreground font-bold">Pay the Reservation Deposit</strong> to secure your space on the next shipment.</li>
              </ol>
            </div>

            <div className="space-y-3">
              <h3 className="font-bold text-foreground text-base border-b border-border/50 pb-2">Combine Multiple Items</h3>
              <p>You can combine many items into a single reservation. For example, 8 Buy For Me Orders and 4 Registered Packages.</p>
              <p>Create <strong className="text-foreground font-bold">one reservation</strong> for all 12 items and pay <strong className="text-foreground font-bold">one Reservation Deposit.</strong> If you create multiple separate reservations, each reservation requires its own deposit.</p>
            </div>

            <div className="space-y-3">
              <h3 className="font-bold text-foreground text-base border-b border-border/50 pb-2">Reservation Deposit</h3>
              <p>The Reservation Deposit is <strong className="text-foreground font-bold">not an extra charge.</strong> It forms part of your final shipping cost.</p>
              <div className="p-4 bg-secondary/30 rounded-xl space-y-2 border border-border/50">
                <p className="font-bold text-foreground text-xs uppercase tracking-wider">When your items arrive in Ghana:</p>
                <ul className="list-disc pl-4 space-y-1.5 mt-2">
                  <li>If your final shipping fee is <strong className="text-foreground font-bold">less than the deposit</strong>, the remaining balance is automatically credited to your C2G Wallet.</li>
                  <li>If your final shipping fee is <strong className="text-foreground font-bold">more than the deposit</strong>, you simply top up the difference.</li>
                </ul>
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="font-bold text-foreground text-base border-b border-border/50 pb-2">Why Reservations?</h3>
              <p>Reservations help us reserve space on upcoming shipments, process shipments more efficiently, prevent delays caused by unpaid shipping fees, and ensure every shipment leaving China has confirmed payment.</p>
            </div>

            <div className="bg-destructive/10 border border-destructive/20 p-4 rounded-xl text-destructive-foreground">
              <h4 className="font-bold flex items-start gap-2 mb-2 leading-none"><AlertTriangle className="w-5 h-5 shrink-0 -mt-0.5" /> Important</h4>
              <p>Items that are not reserved will remain in our China warehouse and will not be included in the next shipment until a reservation has been created.</p>
            </div>
          </div>
        )
      };
    }
    
    if (pathname.includes("/dashboard/orders")) {
      return {
        title: "How Link Orders Work",
        icon: ClipboardList,
        color: "text-purple-500",
        bg: "bg-purple-500/10",
        body: (
          <div className="space-y-6 text-sm text-muted-foreground leading-relaxed pb-4">
            <p>Link Orders allow C2G to purchase products from Chinese marketplaces such as <strong className="text-foreground font-bold">1688, Taobao, Pinduoduo, Alibaba</strong> and many others on your behalf.</p>
            
            <div className="space-y-4">
              <h3 className="font-bold text-foreground text-base border-b border-border/50 pb-2">Before placing a Link Order:</h3>
              
              <div className="space-y-5">
                <div>
                  <h4 className="font-bold text-foreground flex items-center gap-2 mb-1"><CheckCircle2 className="w-4 h-4 text-primary shrink-0" /> Paste the Product Link</h4>
                  <ul className="list-disc pl-9 space-y-1">
                    <li>Copy the product link from the supplier's website or app.</li>
                    <li>You can paste the entire copied text—C2G will automatically extract the correct link.</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-bold text-foreground flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-primary shrink-0" /> Enter the Quantity</h4>
                </div>

                <div>
                  <h4 className="font-bold text-foreground flex items-center gap-2 mb-1"><CheckCircle2 className="w-4 h-4 text-primary shrink-0" /> Enter the Final Price in Yuan</h4>
                  <ul className="list-disc pl-9 space-y-1">
                    <li>This is very important.</li>
                    <li>The first price displayed on many Chinese marketplaces is <strong className="text-foreground font-bold">often NOT the final price.</strong></li>
                    <li>Select the correct color, size or specification, then proceed to the supplier's checkout page to view the <strong className="text-foreground font-bold">actual final price</strong> before placing your order.</li>
                    <li>Enter that final price in C2G to avoid additional top-up requests later.</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-bold text-foreground flex items-center gap-2 mb-1"><CheckCircle2 className="w-4 h-4 text-primary shrink-0" /> Upload the Product Image</h4>
                  <p className="pl-9">Upload a clear image of the exact item you want.</p>
                </div>

                <div>
                  <h4 className="font-bold text-foreground flex items-center gap-2 mb-1"><CheckCircle2 className="w-4 h-4 text-primary shrink-0" /> Add Notes (Optional)</h4>
                  <p className="pl-9 mb-2">Include any specifications such as:</p>
                  <ul className="list-disc pl-14 space-y-1">
                    <li>Color</li>
                    <li>Size</li>
                    <li>Model</li>
                    <li>Storage Capacity</li>
                    <li>Any other important instructions</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-primary/10 border border-primary/20 p-4 rounded-xl text-foreground font-medium">
              <p>Once payment is confirmed, our procurement team purchases your item and keeps you updated throughout the process.</p>
            </div>
          </div>
        )
      };
    }

    if (pathname.includes("/dashboard/packages")) {
      return {
        title: "How Package Registration Works",
        icon: Package,
        color: "text-emerald-500",
        bg: "bg-emerald-500/10",
        body: (
          <div className="space-y-6 text-sm text-muted-foreground leading-relaxed pb-4">
            <p>Register every package you ship to our China warehouse so C2G can identify and track it.</p>
            
            <div className="space-y-4">
              <h3 className="font-bold text-foreground text-base border-b border-border/50 pb-2">When registering a package:</h3>
              
              <div className="space-y-5">
                <div>
                  <h4 className="font-bold text-foreground flex items-center gap-2 mb-1"><CheckCircle2 className="w-4 h-4 text-primary shrink-0" /> Enter the Tracking Number</h4>
                  <ul className="list-disc pl-9 space-y-1">
                    <li>Enter <strong className="text-foreground font-bold">ONLY the numbers</strong> in the tracking number.</li>
                    <li>Do <strong className="text-foreground font-bold">NOT</strong> include prefixes such as YT, STO, JT, ZTO, SF, or any other letters.</li>
                  </ul>
                  <div className="ml-9 mt-3 p-3 bg-secondary/30 rounded-xl space-y-2 border border-border/50">
                    <p className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground">Example:</p>
                    <div className="flex items-center gap-2 text-destructive font-medium"><XCircle className="w-4 h-4" /> YT123456789</div>
                    <div className="flex items-center gap-2 text-emerald-500 font-medium"><CheckCircle2 className="w-4 h-4" /> 123456789</div>
                  </div>
                </div>

                <div className="bg-destructive/10 border border-destructive/20 p-4 rounded-xl text-destructive-foreground">
                  <h4 className="font-bold flex items-start gap-2 mb-1 leading-none"><AlertTriangle className="w-4 h-4 shrink-0" /> Do NOT register Pickup Codes</h4>
                  <p>Pickup codes are different from tracking numbers and cannot be used to identify your package.</p>
                </div>

                <div>
                  <h4 className="font-bold text-foreground flex items-center gap-2 mb-1"><CheckCircle2 className="w-4 h-4 text-primary shrink-0" /> Upload an Image</h4>
                  <p className="pl-9">Upload a clear image of the item you are expecting.</p>
                </div>

                <div>
                  <h4 className="font-bold text-foreground flex items-center gap-2 mb-1"><CheckCircle2 className="w-4 h-4 text-primary shrink-0" /> Add a Description</h4>
                  <p className="pl-9">Briefly describe the product (e.g., White Sneakers, Black Office Chair, iPhone 14 Pro Case).</p>
                </div>

                <div>
                  <h4 className="font-bold text-foreground flex items-center gap-2 mb-1"><CheckCircle2 className="w-4 h-4 text-primary shrink-0" /> Select the Store</h4>
                  <p className="pl-9">Choose where you purchased the item from (1688, Taobao, Pinduoduo, Alibaba, JD, etc).</p>
                </div>
              </div>
            </div>

            <div className="bg-primary/10 border border-primary/20 p-4 rounded-xl text-foreground font-medium">
              <p>After your package arrives at our warehouse and is scanned, its status will automatically update to <strong className="font-bold">In Warehouse</strong>.</p>
            </div>
          </div>
        )
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
      <motion.button
        drag
        dragMomentum={false}
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-32 right-4 md:bottom-28 md:right-8 z-[60] w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center shadow-2xl transition-colors border border-white/20 backdrop-blur-md overflow-hidden group cursor-grab active:cursor-grabbing ${isOpen ? 'bg-zinc-800' : 'bg-primary'}`}
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
      </motion.button>

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
                content.body
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
