"use client";

import { useState } from "react";
import { Search, Download } from "lucide-react";

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
    </div>
  );
}
