'use client';

import { BarChart3, TrendingUp, Users, PackageOpen, CreditCard, ArrowUpRight, ArrowDownRight, Target } from 'lucide-react';

export default function AnalyticsOverview() {
  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-10">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-3">
            <BarChart3 className="w-6 h-6 text-indigo-500" /> Business Analytics
          </h1>
          <p className="text-zinc-400 mt-1">High-level read-only overview of revenue, operations, and growth.</p>
        </div>
        <div className="flex gap-2">
          <select className="bg-zinc-900 border border-zinc-800 text-white text-sm font-bold rounded-xl px-4 py-2 focus:outline-none focus:border-indigo-500">
            <option>Last 7 Days</option>
            <option>Last 30 Days</option>
            <option>This Quarter</option>
            <option>Year to Date</option>
          </select>
        </div>
      </div>

      {/* Top Level KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Revenue', value: '₵124,500', trend: '+14.2%', up: true, icon: TrendingUp, color: 'text-emerald-500' },
          { label: 'Active Customers', value: '8,421', trend: '+5.4%', up: true, icon: Users, color: 'text-indigo-500' },
          { label: 'Packages Delivered', value: '1,204', trend: '-2.1%', up: false, icon: PackageOpen, color: 'text-amber-500' },
          { label: 'Procurement Savings', value: '¥4,200', trend: '+18.9%', up: true, icon: CreditCard, color: 'text-fuchsia-500' },
        ].map((kpi, i) => (
          <div key={i} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
            <div className="flex justify-between items-start mb-4">
              <div className={`p-2 rounded-lg bg-zinc-950 ${kpi.color}`}>
                <kpi.icon className="w-5 h-5" />
              </div>
              <div className={`flex items-center gap-1 text-xs font-bold ${kpi.up ? 'text-emerald-500' : 'text-red-500'}`}>
                {kpi.up ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                {kpi.trend}
              </div>
            </div>
            <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-1">{kpi.label}</p>
            <h3 className="text-2xl font-black text-white">{kpi.value}</h3>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Revenue by Channel */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
          <h2 className="text-sm font-bold uppercase tracking-widest text-zinc-500 mb-6">Revenue Breakdown</h2>
          
          <div className="space-y-6">
            {[
              { channel: 'C2G Mall Sales', amount: '₵84,200', pct: 65, color: 'bg-indigo-500' },
              { channel: 'Shipping Fees (Air & Sea)', amount: '₵32,100', pct: 25, color: 'bg-emerald-500' },
              { channel: 'Importer Wholesale', amount: '₵8,200', pct: 10, color: 'bg-amber-500' },
            ].map((item, i) => (
              <div key={i}>
                <div className="flex justify-between items-end mb-2">
                  <span className="text-sm font-bold text-white">{item.channel}</span>
                  <span className="text-sm font-mono text-zinc-400">{item.amount}</span>
                </div>
                <div className="w-full bg-zinc-950 rounded-full h-2 overflow-hidden border border-zinc-800">
                  <div className={`h-full ${item.color} rounded-full`} style={{ width: `${item.pct}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Operational Performance */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
          <h2 className="text-sm font-bold uppercase tracking-widest text-zinc-500 mb-6 flex items-center gap-2">
            <Target className="w-4 h-4" /> Operations Health
          </h2>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4 text-center">
              <p className="text-3xl font-black text-white mb-1">1.4 <span className="text-sm text-zinc-500">Days</span></p>
              <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Avg Procurement Time</p>
            </div>
            <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4 text-center">
              <p className="text-3xl font-black text-emerald-500 mb-1">98.2%</p>
              <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Scanner Match Rate</p>
            </div>
            <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4 text-center">
              <p className="text-3xl font-black text-white mb-1">2.1 <span className="text-sm text-zinc-500">Hours</span></p>
              <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Ticket Resolution Time</p>
            </div>
            <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4 text-center">
              <p className="text-3xl font-black text-red-500 mb-1">4.5%</p>
              <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Issue Escalation Rate</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
