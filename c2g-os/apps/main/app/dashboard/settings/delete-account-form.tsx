'use client';

import { useState } from 'react';
import { ShieldAlert, Loader2 } from 'lucide-react';
import { deleteAccount } from './actions';

export default function DeleteAccountForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async () => {
    if (!confirm('Are you absolutely sure you want to permanently delete your account? All your shipments, orders, and data will be unrecoverable. This action cannot be undone.')) {
      return;
    }

    setIsLoading(true);
    setError(null);

    const result = await deleteAccount();
    if (!result.success) {
      setError(result.error || 'Failed to delete account.');
      setIsLoading(false);
    } else {
      window.location.href = '/login';
    }
  };

  return (
    <div className="glass-panel p-6 border-l-4 border-l-destructive">
      <h3 className="text-lg font-bold text-destructive mb-2 flex items-center gap-2">
        <ShieldAlert className="w-5 h-5" /> Danger Zone
      </h3>
      <p className="text-sm text-muted-foreground mb-6">
        Permanently delete your C2G Logistics account and all of your data.
      </p>
      
      {error && (
        <div className="p-3 mb-4 bg-destructive/10 text-destructive text-sm font-medium rounded-lg border border-destructive/20">
          {error}
        </div>
      )}

      <button 
        onClick={handleDelete}
        disabled={isLoading}
        className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-all bg-destructive text-destructive-foreground hover:bg-destructive/90 h-10 px-6 shadow-lg shadow-destructive/20 disabled:opacity-50 gap-2"
      >
        {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
        {isLoading ? 'Deleting Account...' : 'Delete Account'}
      </button>
    </div>
  );
}
