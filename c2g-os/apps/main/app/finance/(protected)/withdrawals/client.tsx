"use client";

import { useState } from "react";
import { Check, X, Search, Filter, AlertCircle, RefreshCw } from "lucide-react";
import { useRouter } from "next/navigation";
import { updateWithdrawalStatus } from "./actions";
import { useModal } from "@/components/providers/modal-provider";
import { downloadCSV } from "@/utils/export";
import { Download } from "lucide-react";

export default function WithdrawalsClient({ initialWithdrawals }: { initialWithdrawals: any[] }) {
  const [filter, setFilter] = useState("pending");
  const [search, setSearch] = useState("");
  const router = useRouter();
  const { showAlert } = useModal();
  const [processing, setProcessing] = useState<string | null>(null);

  const filtered = initialWithdrawals.filter(w => {
    if (filter !== "all" && w.status !== filter) return false;
    if (search && !w.importers?.name?.toLowerCase().includes(search.toLowerCase()) && !w.id.includes(search)) return false;
    return true;
  });

  const handleAction = async (withdrawalId: string, customerId: string, amount: number, action: 'approved' | 'rejected') => {
    const notes = prompt(`Please enter a reason for ${action === 'approved' ? 'approving' : 'rejecting'} this withdrawal:`);
    if (notes === null) return; // cancelled

    setProcessing(withdrawalId);
    try {
      const res = await updateWithdrawalStatus(withdrawalId, customerId, amount, action, notes || `Manually ${action}`);
      if (res.success) {
        showAlert({ title: "Success", message: `Withdrawal ${action} successfully`, type: "success" });
        router.refresh();
      } else {
        showAlert({ title: "Error", message: res.error || "Failed to process withdrawal", type: "danger" });
      }
    } catch (e: any) {
      showAlert({ title: "Error", message: e.message || "Network error", type: "danger" });
    }
    setProcessing(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
          <input
            type="text"
            placeholder="Search by customer name or ID..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded-lg text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
          />
        </div>
        
        <select 
          value={filter}
          onChange={e => setFilter(e.target.value)}
          className="bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-2.5 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 min-w-[150px]"
        >
          <option value="all">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
        
        <button 
          onClick={() => downloadCSV(filtered.map(w => ({
            ID: w.id,
            Date: new Date(w.created_at).toLocaleString(),
            Customer: w.importers?.name,
            Amount: w.amount,
            Status: w.status,
            Tier: w.required_tier
          })), 'withdrawals_export')}
          className="px-4 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg font-bold flex items-center gap-2 transition-colors"
        >
          <Download className="w-4 h-4" /> Export CSV
        </button>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-zinc-400">
            <thead className="bg-zinc-950/50 text-zinc-500 font-medium">
              <tr>
                <th className="px-6 py-4">Requested At</th>
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">Tier Required</th>
                <th className="px-6 py-4">Amount</th>
                <th className="px-6 py-4 text-center">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/50">
              {filtered.map(w => (
                <tr key={w.id} className="hover:bg-zinc-800/20 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-zinc-300">
                    {new Date(w.created_at).toLocaleString()}
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-bold text-zinc-200">{w.importers?.name}</div>
                    <div className="text-xs text-zinc-500">{w.importers?.phone}</div>
                  </td>
                  <td className="px-6 py-4 capitalize">
                    <span className="bg-zinc-800 px-2 py-1 rounded text-xs font-mono border border-zinc-700 text-zinc-300">
                      {w.required_tier}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-bold text-white text-lg">
                    ₵{parseFloat(w.amount).toLocaleString(undefined, {minimumFractionDigits: 2})}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-bold capitalize ${
                      w.status === 'approved' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' :
                      w.status === 'rejected' ? 'bg-rose-500/10 text-rose-500 border border-rose-500/20' :
                      'bg-amber-500/10 text-amber-500 border border-amber-500/20'
                    }`}>
                      {w.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    {w.status === 'pending' ? (
                      <div className="flex justify-end gap-2">
                        <button 
                          onClick={() => handleAction(w.id, w.importers?.id, w.amount, 'rejected')}
                          disabled={processing === w.id}
                          className="p-2 bg-rose-500/10 hover:bg-rose-500/20 rounded-lg text-rose-500 transition-colors disabled:opacity-50" 
                          title="Reject"
                        >
                          <X className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleAction(w.id, w.importers?.id, w.amount, 'approved')}
                          disabled={processing === w.id}
                          className="p-2 bg-emerald-500/10 hover:bg-emerald-500/20 rounded-lg text-emerald-500 transition-colors disabled:opacity-50" 
                          title="Approve"
                        >
                          {processing === w.id ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                        </button>
                      </div>
                    ) : (
                      <span className="text-xs text-zinc-500 line-clamp-1 max-w-[150px]" title={w.notes}>
                        {w.notes || 'No notes'}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
              
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-zinc-500">
                    No withdrawals found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
