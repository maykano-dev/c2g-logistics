'use client';

import { useState } from 'react';
import { useModal } from '@/components/providers/modal-provider';

import { useRouter } from 'next/navigation';
import { payMallOrder } from './actions';

export function MallOrderPayButton({ orderId }: { orderId: string }) {
  const [isPaying, setIsPaying] = useState(false);
  const { showAlert } = useModal();
  const router = useRouter();

  const handlePay = async () => {
    if (isPaying) return;
    setIsPaying(true);
    try {
      const res = await payMallOrder(orderId);
      
      if (res.success) {
        showAlert({ title: 'Payment Successful', message: 'Order paid successfully from wallet.', type: 'success' });
        // Clear cart if needed
        try {
          localStorage.removeItem('ecomCart');
          window.dispatchEvent(new Event('cartUpdated'));
        } catch (e) {}
        
        router.refresh();
      } else {
        showAlert({ title: 'Payment Error', message: res.error || 'Failed to process payment.', type: 'danger' });
      }
    } catch (err) {
      showAlert({ title: 'System Error', message: 'An unexpected error occurred.', type: 'danger' });
    } finally {
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
