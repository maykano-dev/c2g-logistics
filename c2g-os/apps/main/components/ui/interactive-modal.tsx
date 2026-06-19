'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, CheckCircle2, Info, AlertTriangle, X } from 'lucide-react';

interface InteractiveModalProps {
  isOpen: boolean;
  isConfirm: boolean;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'danger' | 'success';
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function InteractiveModal({
  isOpen,
  isConfirm,
  title,
  message,
  type,
  confirmText,
  cancelText,
  onConfirm,
  onCancel,
}: InteractiveModalProps) {
  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onCancel();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onCancel]);

  const getIcon = () => {
    switch (type) {
      case 'danger':
        return <AlertCircle className="w-6 h-6 text-destructive" />;
      case 'warning':
        return <AlertTriangle className="w-6 h-6 text-amber-500" />;
      case 'success':
        return <CheckCircle2 className="w-6 h-6 text-green-500" />;
      case 'info':
      default:
        return <Info className="w-6 h-6 text-blue-500" />;
    }
  };

  const getThemeStyles = () => {
    switch (type) {
      case 'danger':
        return {
          bg: 'bg-destructive/10 border-destructive/20',
          button: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
        };
      case 'warning':
        return {
          bg: 'bg-amber-500/10 border-amber-500/20',
          button: 'bg-amber-500 text-white hover:bg-amber-600',
        };
      case 'success':
        return {
          bg: 'bg-green-500/10 border-green-500/20',
          button: 'bg-green-500 text-white hover:bg-green-600',
        };
      case 'info':
      default:
        return {
          bg: 'bg-blue-500/10 border-blue-500/20',
          button: 'bg-primary text-primary-foreground hover:bg-primary/90',
        };
    }
  };

  const theme = getThemeStyles();

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onCancel}
            className="absolute inset-0 bg-background/80 backdrop-blur-sm"
          />

          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", duration: 0.5, bounce: 0.3 }}
            className="relative w-full max-w-md overflow-hidden rounded-2xl border border-border bg-card shadow-2xl"
          >
            {/* Header pattern */}
            <div className={`absolute top-0 left-0 w-full h-32 ${theme.bg} opacity-50 -z-10`} />

            <div className="p-6">
              <div className="flex items-start justify-between">
                <div className={`flex h-12 w-12 items-center justify-center rounded-full border ${theme.bg} bg-card`}>
                  {getIcon()}
                </div>
                {!isConfirm && (
                  <button 
                    onClick={onCancel}
                    className="rounded-full p-2 hover:bg-secondary/80 transition-colors"
                  >
                    <X className="w-5 h-5 text-muted-foreground" />
                  </button>
                )}
              </div>

              <div className="mt-4">
                <h3 className="text-xl font-bold tracking-tight">{title}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
                  {message}
                </p>
              </div>

              <div className="mt-8 flex flex-col-reverse sm:flex-row sm:justify-end gap-3">
                {isConfirm ? (
                  <>
                    <button
                      type="button"
                      onClick={onCancel}
                      className="inline-flex h-10 items-center justify-center rounded-lg border border-input bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring w-full sm:w-auto"
                    >
                      {cancelText || 'Cancel'}
                    </button>
                    <button
                      type="button"
                      onClick={onConfirm}
                      className={`inline-flex h-10 items-center justify-center rounded-lg px-4 py-2 text-sm font-bold transition-all hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring w-full sm:w-auto ${theme.button}`}
                    >
                      {confirmText || 'Confirm'}
                    </button>
                  </>
                ) : (
                  <button
                    type="button"
                    onClick={onConfirm} // For alerts, confirm button just closes it
                    className={`inline-flex h-10 items-center justify-center rounded-lg px-4 py-2 text-sm font-bold transition-all hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring w-full sm:w-auto ${theme.button}`}
                  >
                    {confirmText || 'OK'}
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
