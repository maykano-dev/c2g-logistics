'use client';

import { useState } from 'react';
import { useModal } from '@/components/providers/modal-provider';

export function MallOrderPayButton({ orderId }: { orderId: string | number }) {
  const [isPaying, setIsPaying] = useState(false);
  const { showAlert } = useModal();

  const handlePay = async () => {
    if (isPaying) return;
    setIsPaying(true);
    try {
      const res = await fetch('/api/hubtel/initialize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, type: 'mall_order' })
      });
      const data = await res.json();
      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      } else {
        showAlert({ title: 'Payment Error', message: data.error || 'Failed to initialize payment.', type: 'danger' });
        setIsPaying(false);
      }
    } catch (err) {
      showAlert({ title: 'Network Error', message: 'Network error. Please try again.', type: 'danger' });
      setIsPaying(false);
    }
  };

  return (
    <button 
      onClick={handlePay}
      disabled={isPaying}
      className="w-full sm:w-auto inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 shadow-lg shadow-primary/25 disabled:opacity-50 disabled:pointer-events-none"
    >
      {isPaying ? 'Redirecting...' : 'Pay Now'}
    </button>
  );
}
