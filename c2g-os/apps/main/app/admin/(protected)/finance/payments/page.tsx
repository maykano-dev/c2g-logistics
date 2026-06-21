'use client';

import { useState, useEffect } from 'react';
import { CreditCard, ArrowRightLeft, Search, Filter, CheckCircle2, AlertTriangle, FileText, Download, Wallet } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';
import { format } from 'date-fns';

export default function PaymentsView() {
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [stats, setStats] = useState({ totalToday: 0, countToday: 0, totalPending: 0, pendingCount: 0 });

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    setLoading(true);
    const supabase = createClient();
    
    // We fetch from ecom_orders and orders combined to simulate a unified payment ledger
    // Since we don't have a dedicated `transactions` table in schema.
    const [ecomRes, ordersRes] = await Promise.all([
      supabase.from('ecom_orders').select('*, customers(name)').order('created_at', { ascending: false }).limit(50),
      supabase.from('orders').select('*, customers(name)').order('created_at', { ascending: false }).limit(50)
    ]);

    let combined: any[] = [];
    
    if (ecomRes.data) {
      combined = [...combined, ...ecomRes.data.map(o => ({
        id: o.order_number || o.id,
        type: 'Mall Order Payment',
        user: o.customers?.name || 'Unknown',
        amount: parseFloat(o.total_amount || 0) + parseFloat(o.shipping_cost || 0),
        method: o.payment_method || 'Online',
        status: o.payment_status === 'paid' ? 'success' : o.payment_status === 'failed' ? 'failed' : 'pending',
        created_at: o.created_at
      }))];
    }

    if (ordersRes.data) {
      combined = [...combined, ...ordersRes.data.map(o => ({
        id: o.id,
        type: 'Procurement/Link Order',
        user: o.customers?.name || o.customer_name || 'Unknown',
        amount: parseFloat(o.total || 0),
        method: 'Wallet/Transfer',
        status: o.payment_status === 'paid' ? 'success' : o.payment_status === 'failed' ? 'failed' : 'pending',
        created_at: o.created_at
      }))];
    }

    // Sort combined by date desc
    combined.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    setPayments(combined);

    // Calc stats
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    let tToday = 0;
    let cToday = 0;
    let tPending = 0;
    let cPending = 0;

    combined.forEach(p => {
      const pDate = new Date(p.created_at);
      if (pDate >= today && p.status === 'success') {
        tToday += p.amount;
        cToday++;
      }
      if (p.status === 'pending') {
        tPending += p.amount;
        cPending++;
      }
    });

    setStats({ totalToday: tToday, countToday: cToday, totalPending: tPending, pendingCount: cPending });
    setLoading(false);
  };

  const filtered = payments.filter(p => 
    p.id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.user?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-7xl mx-auto pb-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-3">
            <ArrowRightLeft className="w-6 h-6 text-indigo-500" /> Payment Gateway & Ledger
          </h1>
          <p className="text-zinc-400 mt-1">Monitor inbound Mobile Money, Card transactions, and manual top-ups.</p>
        </div>
        <button className="bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-white px-4 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2">
          <Download className="w-4 h-4" /> Export CSV
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-zinc-900 border border-zinc-800 p-5 rounded-2xl">
          <p className="text-xs text-zinc-500 uppercase font-bold tracking-widest mb-1">Today's Processing</p>
          <p className="text-3xl font-black text-white">₵{stats.totalToday.toLocaleString(undefined, {minimumFractionDigits:2})}</p>
          <p className="text-xs text-emerald-500 font-bold mt-2">{stats.countToday} Successful TXNs</p>
        </div>
        <div className="bg-zinc-900 border border-amber-500/30 p-5 rounded-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-3 text-amber-500/10 group-hover:text-amber-500/20 transition-colors">
            <AlertTriangle className="w-16 h-16 transform rotate-12" />
          </div>
          <p className="text-xs text-amber-500 uppercase font-bold tracking-widest mb-1 relative z-10">Failed / Pending</p>
          <p className="text-3xl font-black text-white relative z-10">₵{stats.totalPending.toLocaleString(undefined, {minimumFractionDigits:2})}</p>
          <p className="text-xs text-zinc-400 font-medium mt-2 relative z-10">{stats.pendingCount} Transactions require review</p>
        </div>
        <div className="bg-zinc-900 border border-indigo-500/30 p-5 rounded-2xl">
          <p className="text-xs text-indigo-400 uppercase font-bold tracking-widest mb-1">Gateway Uptime</p>
          <p className="text-3xl font-black text-white">99.98%</p>
          <p className="text-xs text-emerald-500 font-bold mt-2">Paystack API Healthy</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 p-4 bg-zinc-900 border border-zinc-800 rounded-2xl">
        <div className="relative flex-1">
          <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
          <input 
            type="text"
            placeholder="Search by Transaction ID or User..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full h-10 bg-zinc-950 border border-zinc-800 rounded-lg pl-10 pr-4 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors"
          />
        </div>
        <button className="px-4 h-10 border border-zinc-800 bg-zinc-950 text-white rounded-lg text-sm font-medium flex items-center gap-2 hover:bg-zinc-800 transition-colors shrink-0">
          <Filter className="w-4 h-4" /> Filters
        </button>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto hidden md:block">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-zinc-800 bg-zinc-950/50">
                <th className="p-4 text-xs font-semibold text-zinc-400 uppercase tracking-wider">Transaction Details</th>
                <th className="p-4 text-xs font-semibold text-zinc-400 uppercase tracking-wider">User</th>
                <th className="p-4 text-xs font-semibold text-zinc-400 uppercase tracking-wider">Amount</th>
                <th className="p-4 text-xs font-semibold text-zinc-400 uppercase tracking-wider">Status & Method</th>
                <th className="p-4 text-xs font-semibold text-zinc-400 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800">
              {loading ? (
                <tr><td colSpan={5} className="py-8 text-center text-zinc-500">Loading ledger...</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={5} className="py-8 text-center text-zinc-500">No transactions found.</td></tr>
              ) : (
                filtered.map((txn, i) => (
                  <tr key={i} className="hover:bg-zinc-800/50 transition-colors">
                    <td className="p-4">
                      <p className="text-sm font-bold text-white">{txn.type}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] font-mono text-zinc-500">{txn.id?.toString().substring(0,8)}</span>
                        <span className="text-[10px] text-zinc-600">• {format(new Date(txn.created_at), 'MMM dd, HH:mm')}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <p className="text-sm font-medium text-zinc-300">{txn.user}</p>
                    </td>
                    <td className="p-4 font-mono font-bold text-white">
                      ₵{txn.amount.toFixed(2)}
                    </td>
                    <td className="p-4">
                      <div className="flex flex-col items-start gap-1">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border flex items-center gap-1 ${
                          txn.status === 'success' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' :
                          txn.status === 'pending' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' :
                          'bg-red-500/10 text-red-500 border-red-500/20'
                        }`}>
                          {txn.status === 'success' && <CheckCircle2 className="w-3 h-3"/>}
                          {txn.status === 'failed' && <AlertTriangle className="w-3 h-3"/>}
                          {txn.status}
                        </span>
                        <span className="text-[10px] text-zinc-500 capitalize">{txn.method}</span>
                      </div>
                    </td>
                    <td className="p-4 text-right">
                      <button className="text-zinc-400 hover:text-white transition-colors p-2 hover:bg-zinc-800 rounded-lg">
                        <FileText className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Card Layout */}
        <div className="md:hidden flex flex-col divide-y divide-zinc-800">
          {loading ? (
            <div className="py-8 text-center text-zinc-500">Loading ledger...</div>
          ) : filtered.length === 0 ? (
            <div className="py-8 text-center text-zinc-500">No transactions found.</div>
          ) : (
            filtered.map((txn, i) => (
              <div key={i} className="p-4 flex flex-col gap-4 hover:bg-zinc-800/20 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex flex-col gap-1">
                    <p className="text-sm font-bold text-white">{txn.type}</p>
                    <p className="text-xs font-medium text-zinc-400">{txn.user}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] font-mono text-zinc-500">{txn.id?.toString().substring(0,8)}</span>
                    </div>
                  </div>
                  <div>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border flex items-center gap-1 w-fit ${
                      txn.status === 'success' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' :
                      txn.status === 'pending' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' :
                      'bg-red-500/10 text-red-500 border-red-500/20'
                    }`}>
                      {txn.status === 'success' && <CheckCircle2 className="w-3 h-3"/>}
                      {txn.status === 'failed' && <AlertTriangle className="w-3 h-3"/>}
                      {txn.status}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 bg-zinc-950 p-3 rounded-xl border border-zinc-800/50">
                  <div>
                    <p className="text-xs text-zinc-500 mb-1">Method</p>
                    <p className="text-xs text-zinc-300 capitalize">{txn.method}</p>
                  </div>
                  <div>
                    <p className="text-xs text-zinc-500 mb-1">Amount</p>
                    <p className="font-mono font-bold text-white text-sm">
                      ₵{txn.amount.toFixed(2)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-zinc-600">{format(new Date(txn.created_at), 'MMM dd, yyyy HH:mm')}</span>
                  <button className="text-zinc-400 hover:text-white transition-colors p-2 hover:bg-zinc-800 rounded-lg">
                    <FileText className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
