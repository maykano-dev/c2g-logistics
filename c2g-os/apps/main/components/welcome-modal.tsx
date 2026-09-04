"use client";

import { useState, useEffect } from "react";
import { X, ArrowRight } from "lucide-react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

interface WelcomeModalProps {
  createdAt: string;
  userId: string;
}

export function WelcomeModal({ createdAt, userId }: WelcomeModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    // Check if the user is truly new (created within the last 24 hours)
    const accountAgeMs = new Date().getTime() - new Date(createdAt.replace(' ', 'T')).getTime();
    const isNewAccount = accountAgeMs < 24 * 60 * 60 * 1000;

    const hasSeenWelcome = localStorage.getItem(`hasSeenWelcome_${userId}`);

    // Only show if it's a new account and they haven't seen it yet
    if (isNewAccount && !hasSeenWelcome) {
      // Small delay for better UX after dashboard load
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [createdAt, userId]);

  const handleClose = () => {
    setIsOpen(false);
    localStorage.setItem(`hasSeenWelcome_${userId}`, "true");
  };

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 md:p-12">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-background/80 backdrop-blur-sm"
            onClick={handleClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative w-full max-w-4xl max-h-[90vh] bg-background border border-border rounded-3xl shadow-2xl overflow-y-auto flex flex-col md:flex-row"
          >
            {/* Close Button (Floating) */}
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-background/50 backdrop-blur-md hover:bg-black/5 dark:hover:bg-white/10 transition-colors text-muted-foreground hover:text-foreground"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Left Side: Image */}
            <div className="w-full md:w-5/12 bg-primary/5 relative min-h-[180px] md:min-h-[400px] flex items-center justify-center p-5 md:p-8 overflow-hidden">
              {/* Decorative blobs */}
              <div className="absolute top-0 left-0 w-full h-full opacity-30">
                <div className="absolute -top-[20%] -left-[20%] w-[70%] h-[70%] rounded-full bg-primary blur-3xl mix-blend-multiply dark:mix-blend-screen" />
                <div className="absolute -bottom-[20%] -right-[20%] w-[70%] h-[70%] rounded-full bg-blue-500 blur-3xl mix-blend-multiply dark:mix-blend-screen" />
              </div>

              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="relative z-10 flex items-center justify-center"
              >
                <Image
                  src="/logo.png"
                  alt="C2G Logistics Logo"
                  width={280}
                  height={280}
                  style={{ width: 'clamp(200px, 50vw, 280px)', height: 'auto' }}
                  className="object-contain drop-shadow-2xl"
                  priority
                />
              </motion.div>
            </div>

            {/* Right Side: Content */}
            <div className="w-full md:w-7/12 p-8 md:p-12 flex flex-col justify-center">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="space-y-6"
              >
                <div>
                  <h2 className="text-3xl md:text-4xl font-extrabold text-foreground tracking-tight mb-2">
                    Welcome to <span className="text-primary">C2G Logistics</span>
                  </h2>
                  <p className="text-lg text-muted-foreground">
                    Your global importing journey starts here.
                  </p>
                </div>

                <div className="space-y-4 text-base text-foreground/90 leading-relaxed">
                  <p>
                    We're thrilled to have you with us! Whether you're importing for personal use or growing your business, C2G is designed to make sourcing and shipping from China completely effortless.
                  </p>
                  <p>
                    From your new dashboard, you can easily place <strong className="text-foreground">Buy For Me</strong> orders, get your personalized <strong>Warehouse address</strong>, register self-purchased packages, and track every shipment in real-time.
                  </p>
                </div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.4 }}
                  className="pt-6 space-y-3"
                >
                  <a
                    href="https://whatsapp.com/channel/0029VaF5XWk65yD3qE6p2j0x"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group w-full flex flex-col items-center justify-center h-16 rounded-2xl bg-[#25D366]/10 border border-[#25D366]/30 hover:bg-[#25D366]/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
                  >
                    <div className="flex items-center gap-2 text-[#25D366] font-bold text-base md:text-lg">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
                      </svg>
                      Join Our WhatsApp Channel
                    </div>
                    <p className="text-[11px] text-[#25D366] opacity-80 font-medium tracking-tight">(Make sure to unmute for updates!)</p>
                  </a>

                  <button
                    onClick={handleClose}
                    className="group w-full flex items-center justify-center gap-2 h-14 rounded-2xl bg-primary text-primary-foreground font-bold text-lg hover:bg-primary/90 transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-primary/25"
                  >
                    Proceed to Dashboard
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </button>
                </motion.div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
}
