'use client';

import { Users, Briefcase, TrendingUp, CreditCard, Filter, Search, MoreVertical } from 'lucide-react';

export default function ImportersView() {
  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-7xl mx-auto pb-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-3">
            <Briefcase className="w-6 h-6 text-indigo-500" /> B2B Importers
          </h1>
          <p className="text-zinc-400 mt-1">Manage bulk purchasers, special B2B rates, and wholesale accounts.</p>
        </div>
        <button className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-indigo-900/20 transition-all">
          Invite Importer
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Placeholder UI for Importers */}
        <div className="md:col-span-2 bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
          <div className="p-4 border-b border-zinc-800 flex justify-between items-center bg-zinc-950/50">
             <h2 className="text-sm font-bold text-white uppercase tracking-widest">Active Importer Accounts</h2>
             <div className="flex gap-2">
               <div className="relative">
                 <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                 <input type="text" placeholder="Search accounts..." className="h-8 bg-zinc-900 border border-zinc-700 rounded-lg pl-9 pr-3 text-xs text-white focus:border-indigo-500 focus:outline-none" />
               </div>
               <button className="p-2 border border-zinc-700 text-zinc-400 hover:text-white rounded-lg"><Filter className="w-4 h-4"/></button>
             </div>
          </div>
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-zinc-800 bg-zinc-900/50 text-xs text-zinc-500 uppercase">
                <th className="p-4 font-semibold tracking-wider">Company / Importer</th>
                <th className="p-4 font-semibold tracking-wider">Tier Rate</th>
                <th className="p-4 font-semibold tracking-wider">LTV (CNY)</th>
                <th className="p-4 text-right"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800 text-sm">
              {[1,2,3,4,5].map(i => (
                <tr key={i} className="hover:bg-zinc-800/50 transition-colors">
                  <td className="p-4">
                    <p className="font-bold text-white">Importer Business {i} Ltd.</p>
                    <p className="text-[10px] text-zinc-500 mt-1">Joined Jan 2024</p>
                  </td>
                  <td className="p-4">
                    <span className="px-2 py-1 bg-purple-500/10 text-purple-400 text-[10px] font-bold uppercase rounded border border-purple-500/20">
                      Tier {i > 2 ? '2 (Standard)' : '1 (VIP)'}
                    </span>
                  </td>
                  <td className="p-4 font-mono font-bold text-zinc-300">
                    ¥{(Math.random() * 500000 + 100000).toLocaleString(undefined, {maximumFractionDigits:0})}
                  </td>
                  <td className="p-4 text-right">
                    <button className="text-zinc-500 hover:text-white"><MoreVertical className="w-4 h-4"/></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* B2B Analytics Widget */}
        <div className="space-y-6">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
            <h3 className="text-sm font-bold uppercase text-zinc-500 tracking-widest mb-4 flex items-center gap-2"><TrendingUp className="w-4 h-4 text-emerald-500"/> B2B Volume</h3>
            <p className="text-3xl font-black text-white">¥2.4M</p>
            <p className="text-xs text-emerald-500 font-bold mt-2">+14% vs last month</p>
          </div>
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
             <h3 className="text-sm font-bold uppercase text-zinc-500 tracking-widest mb-4 flex items-center gap-2"><Users className="w-4 h-4 text-indigo-500"/> Pending Approvals</h3>
             <p className="text-sm text-zinc-400">No new importer applications require review at this time.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
