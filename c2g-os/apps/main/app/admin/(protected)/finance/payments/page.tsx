'use client';

import { CreditCard, ArrowRightLeft, Search, Filter, CheckCircle2, AlertTriangle, FileText, Download } from 'lucide-react';

export default function PaymentsView() {
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
          <p className="text-3xl font-black text-white">₵12,450.00</p>
          <p className="text-xs text-emerald-500 font-bold mt-2">142 Successful TXNs</p>
        </div>
        <div className="bg-zinc-900 border border-amber-500/30 p-5 rounded-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-3 text-amber-500/10 group-hover:text-amber-500/20 transition-colors">
            <AlertTriangle className="w-16 h-16 transform rotate-12" />
          </div>
          <p className="text-xs text-amber-500 uppercase font-bold tracking-widest mb-1 relative z-10">Failed / Pending</p>
          <p className="text-3xl font-black text-white relative z-10">₵850.00</p>
          <p className="text-xs text-zinc-400 font-medium mt-2 relative z-10">4 Transactions require review</p>
        </div>
        <div className="bg-zinc-900 border border-indigo-500/30 p-5 rounded-2xl">
          <p className="text-xs text-indigo-400 uppercase font-bold tracking-widest mb-1">Gateway Uptime</p>
          <p className="text-3xl font-black text-white">99.98%</p>
          <p className="text-xs text-emerald-500 font-bold mt-2">Paystack & Momo APIs Healthy</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 p-4 bg-zinc-900 border border-zinc-800 rounded-2xl">
        <div className="relative flex-1">
          <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
          <input 
            type="text"
            placeholder="Search by Transaction ID, User, or Reference..."
            className="w-full h-10 bg-zinc-950 border border-zinc-800 rounded-lg pl-10 pr-4 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors"
          />
        </div>
        <button className="px-4 h-10 border border-zinc-800 bg-zinc-950 text-white rounded-lg text-sm font-medium flex items-center gap-2 hover:bg-zinc-800 transition-colors shrink-0">
          <Filter className="w-4 h-4" /> Filters
        </button>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
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
              {[
                { id: 'TXN-902381', type: 'Wallet Top-up', user: 'Samuel Osei', amount: 450.00, method: 'MTN Mobile Money', status: 'success', time: '10 mins ago' },
                { id: 'TXN-902380', type: 'Shipping Payment', user: 'Abena Mensah', amount: 120.00, method: 'Visa Card', status: 'success', time: '25 mins ago' },
                { id: 'TXN-902379', type: 'Procurement B4M', user: 'Tech Traders Ltd', amount: 850.00, method: 'Bank Transfer', status: 'pending', time: '1 hour ago' },
                { id: 'TXN-902378', type: 'Wallet Top-up', user: 'Kwasi Owusu', amount: 300.00, method: 'Vodafone Cash', status: 'failed', time: '2 hours ago' },
              ].map((txn, i) => (
                <tr key={i} className="hover:bg-zinc-800/50 transition-colors">
                  <td className="p-4">
                    <p className="text-sm font-bold text-white">{txn.type}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] font-mono text-zinc-500">{txn.id}</span>
                      <span className="text-[10px] text-zinc-600">• {txn.time}</span>
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
                      <span className="text-[10px] text-zinc-500">{txn.method}</span>
                    </div>
                  </td>
                  <td className="p-4 text-right">
                    <button className="text-zinc-400 hover:text-white transition-colors p-2 hover:bg-zinc-800 rounded-lg">
                      <FileText className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
