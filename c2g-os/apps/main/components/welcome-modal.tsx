"use client";

import { useState, useEffect } from "react";
import { X, ArrowRight } from "lucide-react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

interface WelcomeModalProps {
  createdAt: string;
}

export function WelcomeModal({ createdAt }: WelcomeModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    // Check if the user is truly new (created within the last 24 hours)
    const accountAgeMs = new Date().getTime() - new Date(createdAt.replace(' ', 'T')).getTime();
    const isNewAccount = accountAgeMs < 24 * 60 * 60 * 1000;
    
    const hasSeenWelcome = localStorage.getItem("hasSeenWelcome");

    // Only show if it's a new account and they haven't seen it yet
    if (isNewAccount && !hasSeenWelcome) {
      // Small delay for better UX after dashboard load
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [createdAt]);

  const handleClose = () => {
    setIsOpen(false);
    localStorage.setItem("hasSeenWelcome", "true");
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
            className="relative w-full max-w-4xl bg-background border border-border rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row"
          >
            {/* Close Button (Floating) */}
            <button 
              onClick={handleClose}
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-background/50 backdrop-blur-md hover:bg-black/5 dark:hover:bg-white/10 transition-colors text-muted-foreground hover:text-foreground"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Left Side: Image */}
            <div className="w-full md:w-5/12 bg-primary/5 relative min-h-[250px] md:min-h-[400px] flex items-center justify-center p-8 overflow-hidden">
              {/* Decorative blobs */}
              <div className="absolute top-0 left-0 w-full h-full opacity-30">
                <div className="absolute -top-[20%] -left-[20%] w-[70%] h-[70%] rounded-full bg-primary blur-3xl mix-blend-multiply dark:mix-blend-screen" />
                <div className="absolute -bottom-[20%] -right-[20%] w-[70%] h-[70%] rounded-full bg-blue-500 blur-3xl mix-blend-multiply dark:mix-blend-screen" />
              </div>
              
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="relative w-full h-full min-h-[200px] z-10 rounded-2xl overflow-hidden shadow-2xl ring-1 ring-white/10"
              >
                <Image 
                  src="/welcome-illustration.png" 
                  alt="Welcome to C2G Logistics" 
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover"
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
                    Welcome to <span className="text-primary">C2G</span>
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
                    From your new dashboard, you can easily place <strong className="text-foreground">Buy For Me</strong> orders, register self-purchased packages, and track every shipment in real-time.
                  </p>
                </div>

                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.4 }}
                  className="pt-6"
                >
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
