'use client';

import { useState } from 'react';
import { Search, PlaneTakeoff, Ship, CheckCircle2, AlertCircle, Clock, Package, MoreVertical, Eye } from 'lucide-react';

export default function ReservationsClient({ initialReservations }: { initialReservations: any[] }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');

  const filtered = initialReservations.filter(res => {
    const matchesSearch = res.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          res.customers?.first_name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'all' || res.status === filter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="relative max-w-sm w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
          <input 
            type="text"
            placeholder="Search Reservation ID or Customer..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-2 pl-10 pr-4 text-sm text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>
        <div className="flex bg-zinc-900 p-1 rounded-xl border border-zinc-800 shrink-0 overflow-x-auto">
          {['all', 'reserved_for_shipment', 'waiting_for_deposit'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-1.5 text-xs font-medium rounded-lg capitalize whitespace-nowrap transition-colors ${filter === f ? 'bg-zinc-800 text-white' : 'text-zinc-500 hover:text-zinc-300'}`}
            >
              {f.replace(/_/g, ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="border border-zinc-800 rounded-2xl bg-zinc-900/50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-zinc-900 text-zinc-400 text-xs uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4 font-semibold">Reservation</th>
                <th className="px-6 py-4 font-semibold">Customer</th>
                <th className="px-6 py-4 font-semibold">Items & Mode</th>
                <th className="px-6 py-4 font-semibold">Deposit Status</th>
                <th className="px-6 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/50">
              {filtered.map(res => (
                <tr key={res.id} className="hover:bg-zinc-800/20 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-mono font-medium text-white">{res.id}</div>
                    <div className="text-xs text-zinc-500 mt-1">{new Date(res.created_at).toLocaleDateString()}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-medium text-zinc-200">
                      {res.customers?.first_name} {res.customers?.last_name}
                    </div>
                    <div className="text-xs text-zinc-500 mt-0.5">{res.customers?.phone || res.customers?.email}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1 text-zinc-300">
                        <Package className="w-4 h-4 text-zinc-500" />
                        {res.total_items}
                      </div>
                      <span className="text-zinc-600">|</span>
                      <div className="flex items-center gap-1.5 capitalize text-zinc-300">
                        {res.shipping_mode === 'sea' ? <Ship className="w-4 h-4 text-blue-400" /> : <PlaneTakeoff className="w-4 h-4 text-sky-400" />}
                        {res.shipping_mode.replace('_', ' ')}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1.5 items-start">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase ${
                        res.deposit_paid ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' : 'bg-orange-500/10 text-orange-500 border border-orange-500/20'
                      }`}>
                        {res.deposit_paid ? <CheckCircle2 className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                        {res.deposit_paid ? 'Paid' : 'Pending'}
                      </span>
                      <span className="text-xs font-semibold text-zinc-400">₵{Number(res.deposit_amount).toFixed(2)}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-2 hover:bg-zinc-800 rounded-lg text-zinc-400 transition-colors">
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-zinc-500">
                    <PlaneTakeoff className="w-8 h-8 mx-auto mb-3 opacity-20" />
                    No reservations found matching your criteria.
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
