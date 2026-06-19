'use client';

import { useState } from 'react';
import { CreditCard } from 'lucide-react';
import { useModal } from "@/components/providers/modal-provider";

export default function PackagePayButton({ packageId }: { packageId: string }) {
  const [isLoading, setIsLoading] = useState(false);
  const { showAlert } = useModal();

  const handlePay = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/hubtel/initialize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ packageId, type: 'package_registration' })
      });
      
      const data = await res.json();
      
      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      } else {
        showAlert({ title: 'Payment Error', message: data.error || 'Failed to initialize payment', type: 'danger' });
        setIsLoading(false);
      }
    } catch (err) {
      showAlert({ title: 'Network Error', message: 'Network error. Please try again.', type: 'danger' });
      setIsLoading(false);
    }
  };

  return (
    <button 
      onClick={handlePay}
      disabled={isLoading}
      className="w-full inline-flex items-center justify-center whitespace-nowrap rounded-md text-xs font-medium transition-colors bg-destructive text-destructive-foreground hover:bg-destructive/90 h-8 px-3 gap-1 shadow-sm disabled:opacity-50 disabled:pointer-events-none"
    >
      <CreditCard className="w-3 h-3" /> 
      {isLoading ? 'Loading...' : 'Pay ₵5 Fee'}
    </button>
  );
}
