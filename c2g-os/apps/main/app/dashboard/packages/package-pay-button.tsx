'use client';

import { useState } from 'react';
import { CreditCard, Wallet } from 'lucide-react';
import { useModal } from "@/components/providers/modal-provider";
import { payPackageRegistrationFee } from './actions';
import WalletPaymentModal from "@/components/wallet/wallet-payment-modal";
import { useRouter } from "next/navigation";

export default function PackagePayButton({ packageId, walletBalance, registrationFee }: { packageId: string, walletBalance: number, registrationFee: number }) {
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { showAlert } = useModal();
  const router = useRouter();

  const handlePay = async () => {
    setIsLoading(true);
    const res = await payPackageRegistrationFee(packageId);
    
    if (res.success) {
      router.refresh();
    } else {
      setIsLoading(false);
      throw new Error(res.error || 'Failed to process payment');
    }
  };

  return (
    <>
      <WalletPaymentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handlePay}
        amount={registrationFee}
        walletBalance={walletBalance}
        itemName="Package Registration Fee"
        isProcessing={isLoading}
      />
      <button 
        onClick={() => setIsModalOpen(true)}
        disabled={isLoading}
        className="w-full inline-flex items-center justify-center whitespace-nowrap rounded-md text-xs font-medium transition-colors bg-primary text-primary-foreground hover:bg-primary/90 h-8 px-3 gap-1 shadow-sm disabled:opacity-50 disabled:pointer-events-none"
      >
        <Wallet className="w-3 h-3" /> 
        Pay ₵{registrationFee}
      </button>
    </>
  );
}
