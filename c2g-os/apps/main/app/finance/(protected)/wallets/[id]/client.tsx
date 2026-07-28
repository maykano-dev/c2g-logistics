"use client";

import { useState } from "react";
import { ArrowLeft, Download, ShieldAlert, Wallet, Settings2, Plus, Minus, CheckCircle2, Lock, Unlock, AlertCircle } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { freezeWalletAction, manualWalletAdjustment } from "./actions";
import { downloadCSV } from "@/utils/export";

export default function WalletLedgerClient({ wallet, transactions }: { wallet: any, transactions: any[] }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [isFrozen, setIsFrozen] = useState(wallet.status === 'frozen');
  const [error, setError] = useState("");
  const [isAdjusting, setIsAdjusting] = useState(false);
  const [adjustType, setAdjustType] = useState<'top_up'|'withdrawal'>('top_up');
  const [adjustAmount, setAdjustAmount] = useState("");
  const [adjustReason, setAdjustReason] = useState("");

  const totalBalance = parseFloat(wallet.available_balance || 0) + parseFloat(wallet.held_balance || 0);

  const handleToggleFreeze = async () => {
    const reason = prompt(isFrozen ? "Reason for unfreezing?" : "Reason for freezing?");
    if (!reason) return;

    setLoading(true);
    setError("");

    const res = await freezeWalletAction(wallet.id, isFrozen ? 'frozen' : 'active', reason);
    if (res.success) {
      setIsFrozen(!isFrozen);
      router.refresh();
    } else {
      setError(res.error || "Failed to update wallet status");
    }
    setLoading(false);
  };

  const handleAdjustSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const amountNum = parseFloat(adjustAmount);
    if (!amountNum || amountNum <= 0) {
      setError("Invalid amount");
      return;
    }
    if (!adjustReason) {
      setError("Reason is required");
      return;
    }

    setLoading(true);
    setError("");

    const res = await manualWalletAdjustment(wallet.id, amountNum, adjustType, adjustReason);
    if (res.success) {
      setIsAdjusting(false);
      setAdjustAmount("");
      setAdjustReason("");
      router.refresh();
    } else {
      setError(res.error || "Adjustment failed");
    }
    setLoading(false);
  };

  return (
    <div className="space-y-6 max-w-6xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/finance/wallets" className="p-2 -ml-2 hover:bg-zinc-800 rounded-full transition-colors text-zinc-400">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-3">
              {wallet.customers?.name}'s Wallet
              {isFrozen && (
                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-xs font-bold bg-rose-500/10 text-rose-500 border border-rose-500/20">
                  <Lock className="w-3.5 h-3.5" /> Frozen
                </span>
              )}
            </h1>
            <p className="text-sm text-zinc-400 font-mono mt-1">
              {wallet.customers?.customer_unique_id || wallet.id}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsAdjusting(true)}
            className="px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg text-sm font-bold flex items-center gap-2 transition-colors"
          >
            <Settings2 className="w-4 h-4" /> Adjust Balance
          </button>
          <button 
            onClick={handleToggleFreeze}
            disabled={loading}
            className={`px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-colors ${
              isFrozen 
                ? "bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20" 
                : "bg-rose-500/10 text-rose-500 hover:bg-rose-500/20"
            }`}
          >
            {isFrozen ? <Unlock className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
            {isFrozen ? "Unfreeze Wallet" : "Freeze Wallet"}
          </button>
          
          <button 
            onClick={() => downloadCSV(transactions, `wallet_ledger_${wallet.id}`)}
            className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg text-sm font-bold flex items-center gap-2 transition-colors"
          >
            <Download className="w-4 h-4" /> Export CSV
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-rose-500/10 text-rose-500 p-4 rounded-xl border border-rose-500/20 text-sm font-medium flex items-center gap-2">
          <AlertCircle className="w-5 h-5" /> {error}
        </div>
      )}

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-6 opacity-10"><Wallet className="w-16 h-16" /></div>
          <p className="text-sm text-zinc-400 font-medium mb-1">Available Balance</p>
          <h2 className="text-3xl font-bold text-white">₵{parseFloat(wallet.available_balance).toLocaleString(undefined, {minimumFractionDigits: 2})}</h2>
        </div>
        
        <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-xl">
          <p className="text-sm text-zinc-400 font-medium mb-1">Held Balance</p>
          <h2 className="text-3xl font-bold text-zinc-300">₵{parseFloat(wallet.held_balance).toLocaleString(undefined, {minimumFractionDigits: 2})}</h2>
          <p className="text-xs text-zinc-500 mt-2">Reserved for pending transactions</p>
        </div>
        
        <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-xl bg-gradient-to-br from-zinc-900 to-indigo-950/20">
          <p className="text-sm text-indigo-300 font-medium mb-1">Total Equity</p>
          <h2 className="text-3xl font-bold text-white">₵{totalBalance.toLocaleString(undefined, {minimumFractionDigits: 2})}</h2>
        </div>
      </div>

      {/* Immutable Ledger */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden mt-8">
        <div className="p-6 border-b border-zinc-800 flex items-center justify-between">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-indigo-400" /> Immutable Ledger
          </h2>
          <span className="text-xs font-medium text-zinc-500 bg-zinc-950 px-3 py-1 rounded-full border border-zinc-800">
            Cannot be altered or deleted
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-zinc-400">
            <thead className="bg-zinc-950/50 text-zinc-500 font-medium">
              <tr>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Reference ID</th>
                <th className="px-6 py-4">Type</th>
                <th className="px-6 py-4">Description</th>
                <th className="px-6 py-4 text-right">Amount</th>
                <th className="px-6 py-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/50">
              {transactions.map((tx) => {
                const isPositive = ['top_up', 'refund', 'admin_adjustment', 'referral_bonus'].includes(tx.transaction_type) && tx.amount > 0;
                
                return (
                  <tr key={tx.id} className="hover:bg-zinc-800/20 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      {new Date(tx.created_at).toLocaleString()}
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-mono text-xs bg-zinc-950 px-2 py-1 rounded border border-zinc-800">
                        {tx.reference_id || 'N/A'}
                      </span>
                    </td>
                    <td className="px-6 py-4 capitalize">
                      {tx.transaction_type.replace('_', ' ')}
                    </td>
                    <td className="px-6 py-4 max-w-xs truncate" title={tx.description}>
                      {tx.description}
                    </td>
                    <td className={`px-6 py-4 text-right font-bold ${isPositive ? 'text-emerald-500' : 'text-rose-500'}`}>
                      {isPositive ? '+' : '-'} ₵{Math.abs(tx.amount).toLocaleString(undefined, {minimumFractionDigits: 2})}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-bold capitalize ${
                        tx.status === 'completed' ? 'bg-emerald-500/10 text-emerald-500' :
                        tx.status === 'pending' ? 'bg-amber-500/10 text-amber-500' :
                        'bg-zinc-500/10 text-zinc-500'
                      }`}>
                        {tx.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
              
              {transactions.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-zinc-500">
                    No transactions found in this ledger.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      {isAdjusting && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl w-full max-w-md shadow-2xl">
            <h3 className="text-xl font-bold text-white mb-4">Manual Adjustment</h3>
            <form onSubmit={handleAdjustSubmit} className="space-y-4">
              <div>
                <label className="text-sm text-zinc-400 mb-1 block">Adjustment Type</label>
                <div className="grid grid-cols-2 gap-2">
                  <button type="button" onClick={() => setAdjustType('top_up')} className={`py-2 rounded-lg text-sm font-bold border transition-colors flex justify-center items-center gap-2 ${adjustType === 'top_up' ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-500' : 'bg-zinc-800 border-zinc-700 text-zinc-400 hover:bg-zinc-700'}`}><Plus className="w-4 h-4"/> Add Funds</button>
                  <button type="button" onClick={() => setAdjustType('withdrawal')} className={`py-2 rounded-lg text-sm font-bold border transition-colors flex justify-center items-center gap-2 ${adjustType === 'withdrawal' ? 'bg-rose-500/20 border-rose-500/50 text-rose-500' : 'bg-zinc-800 border-zinc-700 text-zinc-400 hover:bg-zinc-700'}`}><Minus className="w-4 h-4"/> Deduct Funds</button>
                </div>
              </div>
              
              <div>
                <label className="text-sm text-zinc-400 mb-1 block">Amount (₵)</label>
                <input type="number" step="0.01" min="0" required value={adjustAmount} onChange={e => setAdjustAmount(e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-white focus:outline-none focus:border-indigo-500" placeholder="0.00" />
              </div>

              <div>
                <label className="text-sm text-zinc-400 mb-1 block">Reason / Description</label>
                <input type="text" required value={adjustReason} onChange={e => setAdjustReason(e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-white focus:outline-none focus:border-indigo-500" placeholder="e.g. Order discrepancy correction" />
              </div>

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setIsAdjusting(false)} className="flex-1 px-4 py-3 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg font-bold transition-colors">Cancel</button>
                <button type="submit" disabled={loading} className={`flex-1 px-4 py-3 text-white rounded-lg font-bold transition-colors ${adjustType === 'top_up' ? 'bg-emerald-600 hover:bg-emerald-500' : 'bg-rose-600 hover:bg-rose-500'} disabled:opacity-50`}>{loading ? 'Processing...' : 'Confirm'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
