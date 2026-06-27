"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { ArrowRight, Loader2, AlertCircle, CheckCircle2, Wallet, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

interface WalletPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  amount: number;
  walletBalance: number;
  itemName: string;
  isProcessing: boolean;
}

export default function WalletPaymentModal({
  isOpen,
  onClose,
  onConfirm,
  amount,
  walletBalance,
  itemName,
  isProcessing,
}: WalletPaymentModalProps) {
  const router = useRouter();
  const [status, setStatus] = useState<"confirm" | "insufficient" | "success">("confirm");
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const safeWalletBalance = typeof walletBalance === 'number' ? walletBalance : (parseFloat(String(walletBalance)) || 0);
  const safeAmount = typeof amount === 'number' ? amount : (parseFloat(String(amount)) || 0);

  const hasInsufficientFunds = safeWalletBalance < safeAmount;

  // Reset state when modal opens
  if (isOpen && status === "success" && !isProcessing) {
      // Do not reset while processing or if success is already showing
  }

  const handleConfirm = async () => {
    if (hasInsufficientFunds) {
      setStatus("insufficient");
      return;
    }
    
    try {
      setError(null);
      await onConfirm();
      setStatus("success");
      
      // Auto close after 3 seconds on success
      setTimeout(() => {
        onClose();
        setStatus("confirm");
      }, 3000);
    } catch (err: any) {
      setError(err.message || "Payment failed");
    }
  };

  const handleClose = (e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }
    if (isProcessing) return;
    setStatus("confirm");
    setError(null);
    onClose();
  };

  // If opening fresh, ensure we start at confirm or insufficient
  if (isOpen && status !== "success" && !isProcessing && hasInsufficientFunds && status !== "insufficient") {
      setStatus("insufficient");
  }

  const modalContent = (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9999]"
            onClick={handleClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[90vw] sm:max-w-md bg-card border border-border rounded-2xl shadow-2xl z-[10000] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-border/50">
              <h3 className="font-bold text-lg flex items-center gap-2">
                {status === "success" ? (
                  <><CheckCircle2 className="w-5 h-5 text-green-500" /> Payment Successful</>
                ) : status === "insufficient" ? (
                  <><AlertCircle className="w-5 h-5 text-destructive" /> Insufficient Funds</>
                ) : (
                  <><Wallet className="w-5 h-5 text-primary" /> Confirm Payment</>
                )}
              </h3>
              {!isProcessing && status !== "success" && (
                <button
                  onClick={handleClose}
                  className="p-1 rounded-full hover:bg-secondary transition-colors"
                >
                  <X className="w-5 h-5 text-muted-foreground" />
                </button>
              )}
            </div>

            {/* Body */}
            <div className="p-4 sm:p-6 max-h-[80vh] overflow-y-auto">
              {status === "success" ? (
                <div className="flex flex-col items-center justify-center text-center space-y-4 py-4">
                  <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mb-2">
                    <CheckCircle2 className="w-8 h-8 text-green-500" />
                  </div>
                  <p className="text-muted-foreground">
                    Your payment of <strong className="text-foreground">₵{safeAmount.toFixed(2)}</strong> for {itemName} was successful!
                  </p>
                </div>
              ) : status === "insufficient" ? (
                <div className="space-y-6">
                  <p className="text-muted-foreground text-center">
                    You need <strong className="text-foreground">₵{safeAmount.toFixed(2)}</strong> to complete this payment, but your wallet balance is only <strong className="text-foreground">₵{safeWalletBalance.toFixed(2)}</strong>.
                  </p>
                  <div className="bg-destructive/10 border border-destructive/20 rounded-xl p-4 flex flex-col items-center justify-center gap-2">
                    <span className="text-sm text-destructive font-medium">Deficit</span>
                    <span className="text-2xl font-bold text-destructive">₵{(safeAmount - safeWalletBalance).toFixed(2)}</span>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleClose(e);
                      router.push("/dashboard/wallet");
                    }}
                    className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground py-3 rounded-xl font-bold shadow-lg hover:opacity-90 transition-opacity"
                  >
                    Top Up Wallet <ArrowRight className="w-4 h-4" />
                  </button>
                  <button
                    onClick={handleClose}
                    className="w-full py-3 rounded-xl font-bold text-muted-foreground hover:bg-secondary transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  <p className="text-muted-foreground text-center">
                    Are you sure you want to confirm the payment of <strong className="text-foreground">{itemName}</strong>?
                  </p>
                  
                  <div className="space-y-3 bg-secondary/50 rounded-xl p-4">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-muted-foreground">Amount to pay:</span>
                      <span className="font-bold text-lg">₵{safeAmount.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm border-t border-border/50 pt-3">
                      <span className="text-muted-foreground">Wallet Balance:</span>
                      <span className="font-medium text-primary">₵{safeWalletBalance.toFixed(2)}</span>
                    </div>
                  </div>

                  {error && (
                    <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-lg flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                      <p>{error}</p>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <button
                      onClick={handleClose}
                      disabled={isProcessing}
                      className="w-full py-3 rounded-xl font-bold text-foreground bg-secondary hover:bg-secondary/80 transition-colors disabled:opacity-50"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleConfirm}
                      disabled={isProcessing}
                      className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-primary-foreground bg-primary hover:opacity-90 transition-opacity disabled:opacity-50 shadow-lg shadow-primary/20"
                    >
                      {isProcessing ? (
                        <><Loader2 className="w-4 h-4 animate-spin" /> Processing</>
                      ) : (
                        "Confirm & Pay"
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );

  if (!mounted) return null;

  return createPortal(modalContent, document.body);
}
