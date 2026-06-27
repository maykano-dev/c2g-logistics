"use client";

import { useState } from "react";
import { Check, X, Search, FileText, Plus, RefreshCw, Banknote } from "lucide-react";
import { useRouter } from "next/navigation";
import { updateExpenseStatus } from "./actions";
import { useModal } from "@/components/providers/modal-provider";

export default function ExpensesClient({ initialExpenses }: { initialExpenses: any[] }) {
  const [filter, setFilter] = useState("pending");
  const [search, setSearch] = useState("");
  const router = useRouter();
  const { showAlert } = useModal();
  const [processing, setProcessing] = useState<string | null>(null);

  const filtered = initialExpenses.filter(e => {
    if (filter !== "all" && e.status !== filter) return false;
    if (search && !e.description?.toLowerCase().includes(search.toLowerCase()) && !e.category?.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const handleAction = async (expenseId: string, action: 'approved' | 'rejected' | 'paid') => {
    setProcessing(expenseId);
    try {
      const res = await updateExpenseStatus(expenseId, action);
      if (res.success) {
        showAlert({ title: "Success", message: `Expense marked as ${action}`, type: "success" });
        router.refresh();
      } else {
        showAlert({ title: "Error", message: res.error || "Failed to process expense", type: "danger" });
      }
    } catch (e: any) {
      showAlert({ title: "Error", message: e.message || "Network error", type: "danger" });
    }
    setProcessing(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
        <div className="flex gap-4 flex-1">
          <div className="flex-1 relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
            <input
              type="text"
              placeholder="Search expenses..."
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
            <option value="paid">Paid</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>

        <button className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-bold flex items-center justify-center gap-2 transition-colors">
          <Plus className="w-5 h-5" /> Record Expense
        </button>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-zinc-400">
            <thead className="bg-zinc-950/50 text-zinc-500 font-medium">
              <tr>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Description</th>
                <th className="px-6 py-4 text-right">Amount</th>
                <th className="px-6 py-4 text-center">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/50">
              {filtered.map(e => (
                <tr key={e.id} className="hover:bg-zinc-800/20 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-zinc-300">
                    {new Date(e.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 capitalize font-medium text-zinc-200">
                    {e.category}
                  </td>
                  <td className="px-6 py-4">
                    <div className="line-clamp-2 max-w-[250px]" title={e.description}>{e.description}</div>
                    {e.receipt_url && (
                      <a href={e.receipt_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs text-indigo-400 hover:text-indigo-300 mt-1">
                        <FileText className="w-3 h-3" /> View Receipt
                      </a>
                    )}
                  </td>
                  <td className="px-6 py-4 font-bold text-white text-right">
                    {e.currency} {parseFloat(e.amount).toLocaleString(undefined, {minimumFractionDigits: 2})}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-bold capitalize ${
                      e.status === 'paid' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' :
                      e.status === 'approved' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' :
                      e.status === 'rejected' ? 'bg-rose-500/10 text-rose-500 border border-rose-500/20' :
                      'bg-amber-500/10 text-amber-500 border border-amber-500/20'
                    }`}>
                      {e.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    {e.status === 'pending' ? (
                      <div className="flex justify-end gap-2">
                        <button 
                          onClick={() => handleAction(e.id, 'rejected')}
                          disabled={processing === e.id}
                          className="p-2 bg-rose-500/10 hover:bg-rose-500/20 rounded-lg text-rose-500 transition-colors disabled:opacity-50" 
                          title="Reject"
                        >
                          <X className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleAction(e.id, 'approved')}
                          disabled={processing === e.id}
                          className="p-2 bg-blue-500/10 hover:bg-blue-500/20 rounded-lg text-blue-400 transition-colors disabled:opacity-50" 
                          title="Approve"
                        >
                          {processing === e.id ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                        </button>
                      </div>
                    ) : e.status === 'approved' ? (
                      <div className="flex justify-end gap-2">
                         <button 
                          onClick={() => handleAction(e.id, 'paid')}
                          disabled={processing === e.id}
                          className="p-2 bg-emerald-500/10 hover:bg-emerald-500/20 rounded-lg text-emerald-500 transition-colors disabled:opacity-50 flex items-center gap-1 text-xs font-bold" 
                          title="Mark as Paid"
                        >
                          {processing === e.id ? <RefreshCw className="w-4 h-4 animate-spin" /> : <><Banknote className="w-4 h-4" /> Pay</>}
                        </button>
                      </div>
                    ) : (
                      <span className="text-xs text-zinc-500">
                        Processed
                      </span>
                    )}
                  </td>
                </tr>
              ))}
              
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-zinc-500">
                    No expenses found.
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
