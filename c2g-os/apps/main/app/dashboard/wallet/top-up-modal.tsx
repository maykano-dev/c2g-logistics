'use client';

import { useState } from 'react';
import { Wallet, Loader2, Plus } from 'lucide-react';
import { useModal } from '@/components/providers/modal-provider';
import { topUpWallet } from './actions';

export default function TopUpModal({ currentPhone }: { currentPhone?: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [amount, setAmount] = useState('');
  const [phone, setPhone] = useState(currentPhone || '');
  const [isLoading, setIsLoading] = useState(false);
  const { showAlert } = useModal();

  const handleTopUp = async (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount < 1) {
      showAlert({ title: 'Invalid Amount', message: 'Please enter a valid amount greater than 0.', type: 'danger' });
      return;
    }

    setIsLoading(true);
    try {
      const res = await topUpWallet(numAmount, phone);
      if (res.success && res.checkoutUrl) {
        window.location.href = res.checkoutUrl;
      } else {
        showAlert({ title: 'Top-Up Error', message: res.error || 'Failed to initialize top-up', type: 'danger' });
        setIsLoading(false);
      }
    } catch (err) {
      showAlert({ title: 'Network Error', message: 'Failed to connect to payment gateway.', type: 'danger' });
      setIsLoading(false);
    }
  };

  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center justify-center rounded-xl bg-primary text-primary-foreground font-bold px-6 h-12 shadow-lg shadow-primary/20 hover:scale-[1.02] transition-transform gap-2 shrink-0"
      >
        <Plus className="w-5 h-5" /> Top Up Wallet
      </button>
    );
  }

  return (
    <>
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[90]" onClick={() => !isLoading && setIsOpen(false)} />
      <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[calc(100%-2rem)] max-w-md bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl p-6 z-[100]">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <Wallet className="w-5 h-5 text-primary" /> Top Up Wallet
        </h2>
        
        <form onSubmit={handleTopUp} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-400">Amount (GHS)</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 font-bold">₵</span>
              <input 
                type="number" 
                step="0.01"
                min="1"
                required
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-xl h-12 pl-10 pr-4 text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                placeholder="0.00"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-400">Mobile Money Number</label>
            <input 
              type="tel" 
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-xl h-12 px-4 text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
              placeholder="054XXXXXXX"
            />
          </div>

          <div className="pt-2 flex gap-3">
            <button 
              type="button"
              disabled={isLoading}
              onClick={() => setIsOpen(false)}
              className="flex-1 h-12 rounded-xl bg-zinc-800 text-white font-semibold hover:bg-zinc-700 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button 
              type="submit"
              disabled={isLoading || !amount || !phone}
              className="flex-1 h-12 rounded-xl bg-primary text-primary-foreground font-bold shadow-lg shadow-primary/20 hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Proceed to Pay'}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
