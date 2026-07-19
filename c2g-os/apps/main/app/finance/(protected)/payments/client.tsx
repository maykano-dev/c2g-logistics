"use client";

import { useState } from "react";
import { Search, Download, RefreshCw, X, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";

function downloadCSV(data: any[]) {
  const headers = "Order ID,Type,Customer,Phone,Amount,Gateway,Reference,Date\n";
  const rows = data.map(p => 
    `${p.order_id || p.id},${p.type || 'N/A'},${p.customer_name},${p.customer_phone},${p.total_amount},${p.payment_gateway || 'N/A'},${p.payment_reference || 'N/A'},${new Date(p.created_at).toLocaleString()}`
  ).join("\n");
  const blob = new Blob([headers + rows], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `payments-${new Date().toISOString().split('T')[0]}.csv`;
  a.click();
}

export default function PaymentsClient({ payments, summary }: { payments: any[], summary: any }) {
  const [search, setSearch] = useState("");
  const [syncState, setSyncState] = useState<'idle' | 'confirm' | 'syncing' | 'success' | 'error'>('idle');
  const [syncResult, setSyncResult] = useState<{reconciled: number, failed: number} | null>(null);
  const [syncError, setSyncError] = useState('');

  const handleSync = async () => {
    setSyncState('syncing');
    try {
      const res = await fetch('/api/cron/reconcile-hubtel', { method: 'GET' });
      const json = await res.json();
      if (json.success) {
        setSyncResult({ reconciled: json.results?.reconciled || 0, failed: json.results?.failed || 0 });
        setSyncState('success');
      } else {
        setSyncError(json.error || 'Unknown error occurred');
        setSyncState('error');
      }
    } catch (e) {
      setSyncError('Network request failed');
      setSyncState('error');
    }
  };

  const closeSyncModal = () => {
    if (syncState === 'success') {
      window.location.reload();
    } else {
      setSyncState('idle');
    }
  };

  const filtered = payments.filter(p => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      (p.customer_name || '').toLowerCase().includes(q) ||
      (p.customer_phone || '').includes(q) ||
      (p.customer_email || '').toLowerCase().includes(q) ||
      (p.order_id || '').toLowerCase().includes(q) ||
      (p.payment_reference || '').toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="grid gap-4 md:grid-cols-2">
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
          <p className="text-sm text-zinc-400 font-medium">Total Received</p>
          <h3 className="text-3xl font-bold text-emerald-400 mt-1">₵{summary.totalReceived.toLocaleString(undefined, { minimumFractionDigits: 2 })}</h3>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
          <p className="text-sm text-zinc-400 font-medium">Total Transactions</p>
          <h3 className="text-3xl font-bold text-white mt-1">{summary.count}</h3>
        </div>
      </div>

      {/* Search + Export */}
      <div className="flex gap-4 max-w-3xl">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by customer, order ID, or reference..."
            className="w-full pl-10 pr-4 py-3 bg-zinc-900 border border-zinc-800 rounded-xl text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
          />
        </div>
        <button
          onClick={() => setSyncState('confirm')}
          className="px-4 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-medium transition-colors flex items-center gap-2 shadow-lg shadow-indigo-500/20"
        >
          <RefreshCw className="w-4 h-4" /> Sync Hubtel
        </button>
        <button
          onClick={() => downloadCSV(filtered)}
          className="px-4 py-3 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-xl font-medium transition-colors flex items-center gap-2"
        >
          <Download className="w-4 h-4" /> Export
        </button>
      </div>

      {/* Table */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-zinc-400">
            <thead className="bg-zinc-950/50 text-zinc-500 font-medium">
              <tr>
                <th className="px-6 py-4">Order ID</th>
                <th className="px-6 py-4">Type</th>
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">Amount</th>
                <th className="px-6 py-4">Gateway</th>
                <th className="px-6 py-4">Reference</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/50">
              {filtered.map((p) => (
                <tr key={p.id} className="hover:bg-zinc-800/20 transition-colors">
                  <td className="px-6 py-4 font-mono text-xs text-indigo-400">{p.order_id || p.id.slice(0, 8)}</td>
                  <td className="px-6 py-4 text-xs font-semibold text-zinc-300">{p.type}</td>
                  <td className="px-6 py-4">
                    <div className="font-bold text-zinc-200">{p.customer_name}</div>
                    <div className="text-xs text-zinc-500">{p.customer_phone}</div>
                  </td>
                  <td className="px-6 py-4 font-bold text-emerald-400">₵{Number(p.total_amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                  <td className="px-6 py-4">
                    <span className="bg-zinc-800 px-2 py-1 rounded text-xs font-mono border border-zinc-700 text-zinc-300 capitalize">
                      {p.payment_gateway || 'hubtel'}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-mono text-xs text-zinc-500">{p.payment_reference || '—'}</td>
                  <td className="px-6 py-4">
                    {p.status ? (
                      <span className={`px-2 py-1 rounded text-xs font-bold border ${
                        p.status === 'completed' || p.status === 'success' || p.status === 'paid' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                        p.status === 'failed' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                        'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
                      }`}>
                        {p.status}
                      </span>
                    ) : (
                      <span className="text-zinc-600 text-xs">—</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-zinc-500 text-xs">{new Date(p.created_at).toLocaleString()}</td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-zinc-500">
                    No payments found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Sync Modal */}
      {syncState !== 'idle' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
            <div className="p-6">
              {syncState === 'confirm' && (
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 bg-indigo-500/10 text-indigo-400 rounded-full flex items-center justify-center mx-auto mb-6">
                    <RefreshCw className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold text-white">Manual Reconciliation</h3>
                  <p className="text-zinc-400 text-sm">
                    This will force the engine to immediately interrogate Hubtel for all pending and stuck transactions from the last 24 hours. Are you sure?
                  </p>
                  <div className="flex gap-3 pt-4">
                    <button onClick={() => setSyncState('idle')} className="flex-1 px-4 py-3 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl font-medium transition-colors">
                      Cancel
                    </button>
                    <button onClick={handleSync} className="flex-1 px-4 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-medium transition-colors">
                      Yes, Sync Now
                    </button>
                  </div>
                </div>
              )}

              {syncState === 'syncing' && (
                <div className="text-center space-y-6 py-8">
                  <Loader2 className="w-12 h-12 text-indigo-500 animate-spin mx-auto" />
                  <div>
                    <h3 className="text-xl font-bold text-white">Interrogating Hubtel</h3>
                    <p className="text-zinc-400 text-sm mt-2">Checking status of stuck transactions...</p>
                  </div>
                </div>
              )}

              {syncState === 'success' && (
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 bg-emerald-500/10 text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold text-white">Reconciliation Complete</h3>
                  <div className="bg-zinc-950 rounded-xl p-4 space-y-2 text-sm text-zinc-300">
                    <div className="flex justify-between border-b border-zinc-800/50 pb-2">
                      <span>Successfully Rescued:</span>
                      <span className="font-bold text-emerald-400">{syncResult?.reconciled}</span>
                    </div>
                    <div className="flex justify-between pt-1">
                      <span>Marked as Failed:</span>
                      <span className="font-bold text-red-400">{syncResult?.failed}</span>
                    </div>
                  </div>
                  <div className="pt-4">
                    <button onClick={closeSyncModal} className="w-full px-4 py-3 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl font-medium transition-colors">
                      Done
                    </button>
                  </div>
                </div>
              )}

              {syncState === 'error' && (
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 bg-red-500/10 text-red-400 rounded-full flex items-center justify-center mx-auto mb-6">
                    <AlertCircle className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold text-white">Sync Failed</h3>
                  <p className="text-red-400/80 text-sm bg-red-500/10 p-3 rounded-lg border border-red-500/20 break-words">
                    {syncError}
                  </p>
                  <div className="pt-4">
                    <button onClick={() => setSyncState('idle')} className="w-full px-4 py-3 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl font-medium transition-colors">
                      Close
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
