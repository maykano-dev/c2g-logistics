'use client';

import { Activity, Zap, TrendingUp, Clock, Package, Users } from 'lucide-react';

export default function PerformanceAnalyticsView() {
  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-7xl mx-auto pb-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-3">
            <Zap className="w-6 h-6 text-amber-500" /> Operational Performance
          </h1>
          <p className="text-zinc-400 mt-1">Track KPIs, delivery time averages, and system bottlenecks.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-zinc-900 border border-zinc-800 p-5 rounded-2xl">
          <div className="flex items-center gap-2 mb-2 text-zinc-500">
            <Clock className="w-4 h-4"/>
            <span className="text-xs uppercase font-bold tracking-widest">Avg Air Freight Time</span>
          </div>
          <p className="text-3xl font-black text-white">4.2 Days</p>
          <div className="w-full bg-zinc-800 rounded-full h-1.5 mt-4 overflow-hidden">
            <div className="bg-emerald-500 h-full rounded-full" style={{ width: '85%' }}></div>
          </div>
          <p className="text-[10px] text-zinc-500 mt-2 text-right">Target: &lt; 5 Days</p>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 p-5 rounded-2xl">
          <div className="flex items-center gap-2 mb-2 text-zinc-500">
            <Clock className="w-4 h-4"/>
            <span className="text-xs uppercase font-bold tracking-widest">Avg Sea Freight Time</span>
          </div>
          <p className="text-3xl font-black text-white">42 Days</p>
          <div className="w-full bg-zinc-800 rounded-full h-1.5 mt-4 overflow-hidden">
            <div className="bg-amber-500 h-full rounded-full" style={{ width: '90%' }}></div>
          </div>
          <p className="text-[10px] text-zinc-500 mt-2 text-right">Target: &lt; 45 Days</p>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 p-5 rounded-2xl">
          <div className="flex items-center gap-2 mb-2 text-zinc-500">
            <Package className="w-4 h-4"/>
            <span className="text-xs uppercase font-bold tracking-widest">QC Failure Rate</span>
          </div>
          <p className="text-3xl font-black text-white">2.4%</p>
          <div className="w-full bg-zinc-800 rounded-full h-1.5 mt-4 overflow-hidden">
            <div className="bg-red-500 h-full rounded-full" style={{ width: '24%' }}></div>
          </div>
          <p className="text-[10px] text-zinc-500 mt-2 text-right">Target: &lt; 3%</p>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 p-5 rounded-2xl">
          <div className="flex items-center gap-2 mb-2 text-zinc-500">
            <Users className="w-4 h-4"/>
            <span className="text-xs uppercase font-bold tracking-widest">Support Response</span>
          </div>
          <p className="text-3xl font-black text-white">14 Mins</p>
          <div className="w-full bg-zinc-800 rounded-full h-1.5 mt-4 overflow-hidden">
            <div className="bg-indigo-500 h-full rounded-full" style={{ width: '70%' }}></div>
          </div>
          <p className="text-[10px] text-zinc-500 mt-2 text-right">Target: &lt; 20 Mins</p>
        </div>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 min-h-[400px] flex flex-col items-center justify-center relative overflow-hidden">
         <Activity className="w-16 h-16 text-zinc-800 mb-4" />
         <p className="text-zinc-500 font-medium text-lg">Performance Visualization Engine</p>
         <p className="text-sm text-zinc-600 mt-1">Operational throughput over time (Recharts integration placeholder)</p>
         
         <div className="absolute inset-0 pointer-events-none opacity-20">
           <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 100">
             <path d="M0,100 L0,80 Q25,20 50,70 T100,30 L100,100 Z" fill="currentColor" className="text-indigo-500"></path>
           </svg>
         </div>
      </div>

    </div>
  );
}
