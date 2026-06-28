"use client";

import { useState } from "react";
import { Search, Download, Truck, CheckCircle } from "lucide-react";

function downloadCSV(data: any[], label: string) {
  const headers = "Order ID,Customer,Phone,Shipping Cost,Method,Status,Date\n";
  const rows = data.map(o => 
    `${o.order_id || o.id},${o.customer_name},${o.customer_phone},${o.shipping_cost},${o.shipping_method},${o.shipping_fee_paid ? 'Paid' : 'Unpaid'},${new Date(o.created_at).toLocaleString()}`
  ).join("\n");
  const blob = new Blob([headers + rows], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `shipping-${label}-${new Date().toISOString().split('T')[0]}.csv`;
  a.click();
}

export default function ShippingClient({ unpaid, paid, summary }: { unpaid: any[], paid: any[], summary: any }) {
  const [tab, setTab] = useState<'unpaid' | 'paid'>('unpaid');
  const [search, setSearch] = useState("");

  const currentData = tab === 'unpaid' ? unpaid : paid;
  const filtered = currentData.filter(o => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      (o.customer_name || '').toLowerCase().includes(q) ||
      (o.customer_phone || '').includes(q) ||
      (o.order_id || '').toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="grid gap-4 md:grid-cols-2">
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 border-l-4 border-l-amber-500">
          <p className="text-sm text-zinc-400 font-medium">Outstanding Shipping Fees</p>
          <h3 className="text-3xl font-bold text-amber-400 mt-1">₵{summary.totalUnpaid.toLocaleString(undefined, { minimumFractionDigits: 2 })}</h3>
          <p className="text-xs text-zinc-500 mt-1">{summary.unpaidCount} unpaid orders</p>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 border-l-4 border-l-emerald-500">
          <p className="text-sm text-zinc-400 font-medium">Collected Shipping Fees</p>
          <h3 className="text-3xl font-bold text-emerald-400 mt-1">₵{summary.totalPaid.toLocaleString(undefined, { minimumFractionDigits: 2 })}</h3>
          <p className="text-xs text-zinc-500 mt-1">{summary.paidCount} paid orders</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        <button
          onClick={() => setTab('unpaid')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${tab === 'unpaid' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' : 'bg-zinc-900 text-zinc-400 hover:text-zinc-200 border border-zinc-800'}`}
        >
          <Truck className="w-4 h-4 inline mr-2" />Unpaid ({summary.unpaidCount})
        </button>
        <button
          onClick={() => setTab('paid')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${tab === 'paid' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-zinc-900 text-zinc-400 hover:text-zinc-200 border border-zinc-800'}`}
        >
          <CheckCircle className="w-4 h-4 inline mr-2" />Paid ({summary.paidCount})
        </button>
      </div>

      {/* Search + Export */}
      <div className="flex gap-4 max-w-3xl">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by customer or order ID..."
            className="w-full pl-10 pr-4 py-3 bg-zinc-900 border border-zinc-800 rounded-xl text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
          />
        </div>
        <button
          onClick={() => downloadCSV(filtered, tab)}
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
                <th className="px-6 py-4">Order</th>
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">Shipping Fee</th>
                <th className="px-6 py-4">Method</th>
                <th className="px-6 py-4">Order Status</th>
                <th className="px-6 py-4">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/50">
              {filtered.map((o) => (
                <tr key={o.id} className="hover:bg-zinc-800/20 transition-colors">
                  <td className="px-6 py-4 font-mono text-xs text-indigo-400">{o.order_id || o.id.slice(0, 8)}</td>
                  <td className="px-6 py-4">
                    <div className="font-bold text-zinc-200">{o.customer_name}</div>
                    <div className="text-xs text-zinc-500">{o.customer_phone}</div>
                  </td>
                  <td className="px-6 py-4 font-bold text-zinc-200">₵{Number(o.shipping_cost).toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                  <td className="px-6 py-4">
                    <span className="bg-zinc-800 px-2 py-1 rounded text-xs font-mono border border-zinc-700 text-zinc-300 capitalize">
                      {o.shipping_method || 'sea'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-xs font-bold ${
                      o.order_status === 'delivered' ? 'bg-emerald-500/10 text-emerald-500' :
                      o.order_status === 'processing' ? 'bg-blue-500/10 text-blue-500' :
                      'bg-zinc-800 text-zinc-400'
                    }`}>
                      {(o.order_status || 'pending').replace(/_/g, ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-zinc-500 text-xs">{new Date(o.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-zinc-500">
                    No {tab} shipping fees found.
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
