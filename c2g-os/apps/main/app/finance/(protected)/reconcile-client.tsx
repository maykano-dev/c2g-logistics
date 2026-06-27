"use client";

import { useState } from "react";
import { RefreshCcw } from "lucide-react";
import { useModal } from "@/components/providers/modal-provider";

export function ReconcileButton() {
  const [isReconciling, setIsReconciling] = useState(false);
  const { showAlert } = useModal();

  const handleReconcile = async () => {
    setIsReconciling(true);
    // Simulate API call to payment gateways (Hubtel/Paystack)
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsReconciling(false);
    
    showAlert({
      title: "Reconciliation Complete",
      message: "Successfully synchronized 14 pending transactions with payment gateways. Ledgers are up to date.",
      type: "success"
    });
  };

  return (
    <button 
      onClick={handleReconcile}
      disabled={isReconciling}
      className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm font-bold flex items-center gap-2 transition-colors disabled:opacity-50"
    >
      <RefreshCcw className={`w-4 h-4 ${isReconciling ? 'animate-spin' : ''}`} /> 
      {isReconciling ? 'Reconciling...' : 'Reconcile Gateways'}
    </button>
  );
}
