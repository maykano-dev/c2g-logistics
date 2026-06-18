'use client';

import { DollarSign, Wallet, ArrowDownLeft, ArrowUpRight, CheckCircle2, XCircle, FileText, Download } from 'lucide-react';
import { useState } from 'react';

export default function FinanceOfficerView() {
  const [activeTab, setActiveTab] = useState<'reconciliation' | 'withdrawals' | 'expenses'>('reconciliation');

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-in fade-in duration-500 pb-10">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-3">
            <DollarSign className="w-6 h-6 text-emerald-500" /> Finance & Treasury
          </h1>
          <p className="text-zinc-400 mt-1">Reconcile Hubtel payments, approve withdrawals, and track operational expenses.</p>
        </div>
        <div className="flex bg-zinc-900 border border-zinc-800 rounded-xl p-1">
          {['reconciliation', 'withdrawals', 'expenses'].map((tab) => (
            <button 
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`px-4 py-2 rounded-lg text-sm font-bold capitalize transition-all ${activeTab === tab ? 'bg-zinc-800 text-white shadow-sm' : 'text-zinc-500 hover:text-zinc-300'}`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {activeTab === 'reconciliation' && (
        <div className="space-y-6 animate-in fade-in">
          {/* Analytics Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
              <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-1">Hubtel Reported (Today)</p>
              <h3 className="text-3xl font-black text-white">₵ 12,450.00</h3>
              <p className="text-sm text-emerald-500 mt-2 flex items-center gap-1 font-bold">+14% vs yesterday</p>
            </div>
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
              <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-1">System Logged (Today)</p>
              <h3 className="text-3xl font-black text-white">₵ 12,450.00</h3>
              <p className="text-sm text-zinc-400 mt-2 font-bold">Perfect Match</p>
            </div>
            <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-6 flex flex-col justify-center items-center text-center">
              <CheckCircle2 className="w-10 h-10 text-emerald-500 mb-2" />
              <h3 className="text-lg font-bold text-emerald-500">Reconciliation Passed</h3>
              <p className="text-xs text-emerald-500/70">All 42 transactions matched</p>
            </div>
          </div>

          {/* The Reconciliation Ledger */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
            <div className="p-4 border-b border-zinc-800 bg-zinc-950/50 flex justify-between items-center">
              <h2 className="text-sm font-bold uppercase tracking-widest text-zinc-500">Hubtel vs System Match Log</h2>
              <button className="flex items-center gap-2 text-sm font-bold text-indigo-400 hover:text-indigo-300 transition-colors">
                <Download className="w-4 h-4" /> Export CSV
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-zinc-400">
                <thead className="text-xs uppercase bg-zinc-950/50 text-zinc-500 border-b border-zinc-800">
                  <tr>
                    <th className="px-6 py-4 font-bold tracking-widest">Time</th>
                    <th className="px-6 py-4 font-bold tracking-widest">Customer ID</th>
                    <th className="px-6 py-4 font-bold tracking-widest">Hubtel Record</th>
                    <th className="px-6 py-4 font-bold tracking-widest">System Record</th>
                    <th className="px-6 py-4 font-bold tracking-widest">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/50">
                  {[
                    { time: '14:22', customer: 'C2G-1042', amount: '₵450.00', match: true },
                    { time: '13:45', customer: 'C2G-8812', amount: '₵1,200.00', match: true },
                    { time: '12:10', customer: 'C2G-3901', amount: '₵85.00', match: false },
                    { time: '11:05', customer: 'C2G-9921', amount: '₵5,400.00', match: true },
                  ].map((row, i) => (
                    <tr key={i} className="hover:bg-zinc-800/20 transition-colors">
                      <td className="px-6 py-4 font-mono">{row.time}</td>
                      <td className="px-6 py-4 font-bold text-white">{row.customer}</td>
                      <td className="px-6 py-4 font-mono">{row.amount}</td>
                      <td className="px-6 py-4 font-mono">{row.match ? row.amount : '₵0.00'}</td>
                      <td className="px-6 py-4">
                        {row.match ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                            <CheckCircle2 className="w-3 h-3" /> Matched
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-red-500/10 text-red-500 border border-red-500/20">
                            <XCircle className="w-3 h-3" /> Missing
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'withdrawals' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-in fade-in">
          {/* Pending Queue */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl flex flex-col h-[600px] overflow-hidden">
            <div className="p-4 border-b border-zinc-800 bg-zinc-950/50">
              <h2 className="text-xs font-bold uppercase tracking-widest text-zinc-500">Pending Approvals</h2>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
               {[
                 { id: 'WD-991', name: 'Tech Imports Ltd', amount: '₵2,400.00', threshold: 'Officer (You)' },
                 { id: 'WD-992', name: 'Kwame Mensah', amount: '₵850.00', threshold: 'Officer (You)' },
                 { id: 'WD-993', name: 'Mega Store GH', amount: '₵15,000.00', threshold: 'Requires Manager' },
               ].map((w, i) => (
                 <div key={i} className="p-4 bg-zinc-950/50 border border-zinc-800/50 rounded-xl">
                   <div className="flex justify-between items-start mb-4">
                     <div>
                       <h3 className="text-white font-bold text-sm">{w.name}</h3>
                       <p className="text-zinc-500 text-xs font-mono">{w.id}</p>
                     </div>
                     <span className="text-lg font-black text-white">{w.amount}</span>
                   </div>
                   <div className="flex justify-between items-center">
                     <span className={`text-xs font-bold uppercase tracking-widest px-2 py-1 rounded ${
                       w.threshold.includes('You') ? 'bg-indigo-500/10 text-indigo-400' : 'bg-red-500/10 text-red-500'
                     }`}>
                       {w.threshold}
                     </span>
                     <button className="bg-zinc-800 hover:bg-zinc-700 text-white px-4 py-1.5 rounded-lg text-sm font-bold transition-colors">
                       Review
                     </button>
                   </div>
                 </div>
               ))}
            </div>
          </div>

          {/* Action View */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 flex flex-col justify-center items-center text-center">
             <div className="w-20 h-20 bg-zinc-800 text-zinc-600 rounded-full flex items-center justify-center mx-auto mb-6">
               <Wallet className="w-10 h-10" />
             </div>
             <h2 className="text-xl font-bold text-white mb-2">Select a withdrawal to process</h2>
             <p className="text-zinc-400 text-sm max-w-sm">
               You can only approve withdrawals under your assigned tier threshold (₵5,000). Larger withdrawals must be escalated.
             </p>
          </div>
        </div>
      )}

    </div>
  );
}
