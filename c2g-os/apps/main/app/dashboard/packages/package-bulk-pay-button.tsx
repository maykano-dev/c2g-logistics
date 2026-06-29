'use client';

import { useState } from 'react';
import { Layers, Wallet, Loader2 } from 'lucide-react';
import { useModal } from "@/components/providers/modal-provider";
import { payBulkPackageRegistrationFees } from './actions';
import WalletPaymentModal from "@/components/wallet/wallet-payment-modal";
import { useRouter } from "next/navigation";

interface PackageBulkPayButtonProps {
  unpaidCount: number;
  unpaidPackageIds: string[];
  registrationFee: number;
  walletBalance: number;
  className?: string;
}

export default function PackageBulkPayButton({ unpaidCount, unpaidPackageIds, registrationFee, walletBalance, className = '' }: PackageBulkPayButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { showAlert } = useModal();
  const router = useRouter();

  const totalCost = unpaidCount * registrationFee;

  const handlePayAll = async () => {
    setIsLoading(true);
    const res = await payBulkPackageRegistrationFees(unpaidPackageIds);
    
    if (res.success) {
      router.refresh();
      setIsModalOpen(false);
      showAlert({ title: 'Success', message: `Successfully paid registration fees for ${unpaidCount} packages.`, type: 'info' });
    } else {
      setIsLoading(false);
      throw new Error(res.error || 'Failed to process bulk payment');
    }
  };

  if (unpaidCount <= 1) return null;

  return (
    <>
      <WalletPaymentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handlePayAll}
        amount={totalCost}
        walletBalance={walletBalance}
        itemName={`Bulk Registration Fee (${unpaidCount} Packages)`}
        isProcessing={isLoading}
      />
      <button 
        onClick={() => setIsModalOpen(true)}
        disabled={isLoading}
        className={`inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring bg-orange-500 text-white hover:bg-orange-600 h-10 px-4 py-2 gap-2 shadow-lg shadow-orange-500/25 hover:scale-[1.02] disabled:opacity-50 disabled:pointer-events-none ${className}`}
      >
        {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Layers className="w-4 h-4" />}
        Pay All Unpaid ({unpaidCount}) - ₵{totalCost.toFixed(2)}
      </button>
    </>
  );
}
