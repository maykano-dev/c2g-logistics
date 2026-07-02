"use client";

import { useState, useEffect } from "react";
import { CheckCircle2, X } from "lucide-react";
import { createPortal } from "react-dom";

interface WelcomeModalProps {
  createdAt: string;
}

export function WelcomeModal({ createdAt }: WelcomeModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    // Check if the user is truly new (created within the last 24 hours)
    const accountAgeMs = new Date().getTime() - new Date(createdAt).getTime();
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

  if (!mounted || !isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-background/80 backdrop-blur-sm animate-fade-in"
        onClick={handleClose}
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-lg bg-background border border-border rounded-2xl shadow-2xl overflow-hidden animate-scale-in">
        {/* Header Graphic */}
        <div className="bg-gradient-to-r from-primary/10 to-blue-500/10 p-8 flex flex-col items-center justify-center border-b border-border/50 relative">
          <button 
            onClick={handleClose}
            className="absolute top-4 right-4 p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors text-muted-foreground hover:text-foreground"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mb-4 ring-8 ring-green-500/10">
            <CheckCircle2 className="w-8 h-8 text-green-500" />
          </div>
          <h2 className="text-2xl font-bold text-center text-foreground tracking-tight">
            Welcome to the C2G Family!
          </h2>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          <p className="text-base text-foreground font-medium text-center">
            Your account has been created successfully, and we're excited to have you with us.
          </p>
          
          <p className="text-sm text-muted-foreground leading-relaxed">
            Whether you're importing for yourself or growing a business, C2G is here to make importing from China simple, secure, and stress-free. From your dashboard, you can place <strong className="text-foreground">Buy For Me</strong> orders, register packages, track shipments, and manage all your imports in one place.
          </p>

          <p className="text-sm font-semibold text-foreground text-center">
            Thank you for choosing C2G. We're glad to have you on board!
          </p>

          {/* Action Button */}
          <div className="pt-2">
            <button
              onClick={handleClose}
              className="w-full flex items-center justify-center h-12 rounded-xl bg-primary text-primary-foreground font-bold hover:bg-primary/90 transition-all hover:scale-[1.02] shadow-lg shadow-primary/25"
            >
              Get Started
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
