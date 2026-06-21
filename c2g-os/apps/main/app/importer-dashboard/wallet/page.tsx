"use client";

import { Wallet, ArrowDownRight, ArrowUpRight, History, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { getWalletStats } from "./actions";

export default function WalletPage() {
  const [stats, setStats] = useState({ wallet_balance: 0, pending_clearance: 0, total_earned: 0 });
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadWallet() {
      const { success, stats, transactions } = await getWalletStats();
      if (success) {
        setStats(stats || { wallet_balance: 0, pending_clearance: 0, total_earned: 0 });
        setTransactions(transactions || []);
      }
      setLoading(false);
    }
    loadWallet();
  }, []);

  const handleWithdraw = () => alert(`Withdrawal request submitted for ₵${stats.wallet_balance.toFixed(2)}. Admin approval pending.`);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto animate-fade-in pb-24">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Profits & Wallet</h1>
        <p className="text-muted-foreground mt-1">Manage your earnings, request payouts, and view transaction history.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 glass-panel p-8 shadow-lg relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
            <Wallet className="w-32 h-32 text-primary" />
          </div>
          
          <h2 className="text-lg font-bold text-muted-foreground mb-2">Available Balance</h2>
          <div className="text-5xl sm:text-6xl font-black mb-8">₵{stats.wallet_balance.toFixed(2)}</div>
          
          <div className="flex flex-col sm:flex-row flex-wrap gap-4">
            <button onClick={handleWithdraw} disabled={stats.wallet_balance <= 0} className="w-full sm:w-auto px-6 py-3 rounded-xl bg-primary text-primary-foreground font-bold hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
              <ArrowUpRight className="w-5 h-5" />
              Request Withdrawal
            </button>
          </div>
        </div>

        <div className="glass-panel p-6 shadow-lg flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-muted-foreground mb-1">Total Earned</h3>
            <div className="text-2xl font-black text-green-500">₵{stats.total_earned.toFixed(2)}</div>
          </div>
          <div className="mt-6">
            <h3 className="font-bold text-muted-foreground mb-1">Pending Clearance</h3>
            <div className="text-2xl font-black text-amber-500">₵{stats.pending_clearance.toFixed(2)}</div>
          </div>
        </div>
      </div>

      <div className="glass-panel p-6 shadow-lg mt-8">
        <div className="flex items-center gap-3 mb-6">
          <History className="w-6 h-6 text-muted-foreground" />
          <h2 className="text-xl font-bold">Transaction History</h2>
        </div>
        
        <div className="space-y-4">
          {transactions.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No transactions found.
            </div>
          )}
          {transactions.map((txn) => (
            <div key={txn.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border border-border/50 bg-secondary/5 hover:bg-secondary/10 transition-colors gap-4">
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                  txn.type === 'earning' ? 'bg-green-500/10 text-green-500' :
                  txn.type === 'withdrawal' ? 'bg-blue-500/10 text-blue-500' :
                  'bg-amber-500/10 text-amber-500'
                }`}>
                  {txn.amount > 0 ? <ArrowDownRight className="w-5 h-5" /> : <ArrowUpRight className="w-5 h-5" />}
                </div>
                <div>
                  <h4 className="font-bold text-sm sm:text-base">{txn.description}</h4>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                    <span>{new Date(txn.date).toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short' })}</span>
                    <span>•</span>
                    <span className="font-mono">{txn.id}</span>
                  </div>
                </div>
              </div>
              <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2 sm:gap-1">
                <span className={`text-lg font-black ${
                  txn.amount > 0 ? 'text-green-500' : 'text-foreground'
                }`}>
                  {txn.amount > 0 ? '+' : ''}₵{Math.abs(txn.amount).toFixed(2)}
                </span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                  txn.status === 'completed' ? 'bg-secondary text-muted-foreground' : 'bg-amber-500/20 text-amber-500'
                }`}>
                  {txn.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
