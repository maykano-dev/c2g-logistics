'use client';

import { LifeBuoy, AlertTriangle, MessageSquare, CheckCircle2, Clock, Filter, AlertCircle, ArrowRight } from 'lucide-react';
import { useState } from 'react';

export default function IssueCenterView() {
  const [filter, setFilter] = useState<'all' | 'unresolved' | 'resolved'>('unresolved');

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-in fade-in duration-500 pb-10">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-zinc-900 border border-zinc-800 p-6 rounded-2xl">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-3">
            <AlertTriangle className="w-6 h-6 text-amber-500" /> Global Issue Center
          </h1>
          <p className="text-zinc-400 mt-1">Cross-department problem resolution and operational bottlenecks.</p>
        </div>
        
        <div className="flex bg-zinc-950 border border-zinc-800 rounded-xl p-1">
          <button 
            onClick={() => setFilter('unresolved')}
            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${filter === 'unresolved' ? 'bg-amber-500/10 text-amber-500' : 'text-zinc-500 hover:text-zinc-300'}`}
          >
            Unresolved (4)
          </button>
          <button 
            onClick={() => setFilter('resolved')}
            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${filter === 'resolved' ? 'bg-emerald-500/10 text-emerald-500' : 'text-zinc-500 hover:text-zinc-300'}`}
          >
            Resolved (12)
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* The Issue Queue */}
        <div className="lg:col-span-5 bg-zinc-900 border border-zinc-800 rounded-2xl flex flex-col h-[700px] overflow-hidden">
          <div className="p-4 border-b border-zinc-800 bg-zinc-950/50 flex items-center justify-between">
            <h2 className="text-xs font-bold uppercase tracking-widest text-zinc-500 flex items-center gap-2">
              <Filter className="w-4 h-4" /> Issue Queue
            </h2>
          </div>
          
          <div className="flex-1 overflow-y-auto p-2 space-y-2">
            {[
              { id: 'ISS-401', type: 'Supplier Out Of Stock', entity: 'Order #1042', severity: 'high', reporter: 'Procurement Team', time: '2h ago' },
              { id: 'ISS-402', type: 'Price Variance Alert', entity: 'Order #1089', severity: 'medium', reporter: 'System', time: '5h ago' },
              { id: 'ISS-403', type: 'Package Missing', entity: 'Tracking YT89938', severity: 'critical', reporter: 'China Warehouse', time: '1d ago' },
              { id: 'ISS-404', type: 'Duplicate Payment', entity: 'Order #1103', severity: 'medium', reporter: 'Finance Team', time: '1d ago' },
            ].map((issue, i) => (
              <div key={i} className="p-4 bg-zinc-950/50 border border-zinc-800/50 rounded-xl hover:border-amber-500/50 hover:bg-amber-500/5 transition-all cursor-pointer group">
                <div className="flex justify-between items-start mb-2">
                  <span className="font-mono font-bold text-white text-sm group-hover:text-amber-400 transition-colors">{issue.entity}</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest ${
                    issue.severity === 'critical' ? 'bg-red-500/20 text-red-500' : 
                    issue.severity === 'high' ? 'bg-amber-500/20 text-amber-500' : 
                    'bg-zinc-800 text-zinc-400'
                  }`}>
                    {issue.severity}
                  </span>
                </div>
                <h3 className="text-sm font-bold text-zinc-300 mb-3">{issue.type}</h3>
                <div className="flex justify-between items-center text-xs text-zinc-500">
                  <span>Reported by: <span className="font-bold text-indigo-400">{issue.reporter}</span></span>
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {issue.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Issue Resolution Pane */}
        <div className="lg:col-span-7 bg-zinc-900 border border-zinc-800 rounded-2xl flex flex-col h-[700px] overflow-hidden">
          {/* Issue Header */}
          <div className="p-6 border-b border-zinc-800 bg-zinc-950/50">
            <div className="flex items-center gap-3 mb-2">
              <span className="px-2 py-1 bg-red-500/20 text-red-500 text-xs font-bold uppercase tracking-widest rounded">Critical Issue</span>
              <span className="text-sm font-mono text-zinc-500">ISS-403</span>
            </div>
            <h2 className="text-2xl font-bold text-white mb-1">Package Missing in Warehouse</h2>
            <p className="text-zinc-400 text-sm">Entity: Tracking YT89938 • Raised 1 day ago</p>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            
            {/* The Problem Statement */}
            <div className="bg-red-500/5 border border-red-500/20 rounded-xl p-5 relative overflow-hidden">
              <AlertCircle className="absolute -right-4 -bottom-4 w-32 h-32 text-red-500/10" />
              <h3 className="text-sm font-bold uppercase tracking-widest text-red-500 mb-3 relative z-10">Problem Statement</h3>
              <p className="text-white text-sm leading-relaxed relative z-10">
                The scanner logged this package as "Received" yesterday at 14:00, but it is not physically present in the sorting bin for Shipment AIR-2025-06. The customer is Kwame Mensah. The package was supposed to contain 2x Nike Shoes.
              </p>
            </div>

            {/* Resolution Thread / Internal Chat */}
            <div>
               <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-500 mb-4 flex items-center gap-2">
                 <MessageSquare className="w-4 h-4" /> Internal Investigation Log
               </h3>
               
               <div className="space-y-4">
                 <div className="flex gap-4">
                   <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center shrink-0">
                     <span className="text-xs font-bold text-indigo-500">CW</span>
                   </div>
                   <div className="bg-zinc-950 border border-zinc-800 p-4 rounded-xl rounded-tl-none flex-1">
                     <div className="flex justify-between items-center mb-1">
                       <span className="text-xs font-bold text-indigo-400">Chen (China Warehouse)</span>
                       <span className="text-[10px] text-zinc-500 font-mono">Yesterday 18:30</span>
                     </div>
                     <p className="text-sm text-zinc-300">I have checked the overflow bin, it is not there. The thermal label was printed successfully though. Re-checking CCTV logs.</p>
                   </div>
                 </div>

                 <div className="flex gap-4">
                   <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0">
                     <span className="text-xs font-bold text-emerald-500">MA</span>
                   </div>
                   <div className="bg-zinc-950 border border-zinc-800 p-4 rounded-xl rounded-tl-none flex-1">
                     <div className="flex justify-between items-center mb-1">
                       <span className="text-xs font-bold text-emerald-400">Manager (Accra)</span>
                       <span className="text-[10px] text-zinc-500 font-mono">Today 09:15</span>
                     </div>
                     <p className="text-sm text-zinc-300">Please check if it was accidentally thrown into the Sea Freight container instead. If not found by 12:00, we need to issue a refund to Kwame.</p>
                   </div>
                 </div>
               </div>
            </div>

            {/* Action Box */}
            <div className="mt-4 flex gap-2">
              <input type="text" placeholder="Add a note to the investigation..." className="flex-1 bg-zinc-950 border border-zinc-800 rounded-xl px-4 text-sm text-white focus:outline-none focus:border-indigo-500" />
              <button className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-xl font-bold transition-colors">Post</button>
            </div>

          </div>
          
          <div className="p-4 border-t border-zinc-800 bg-zinc-950 flex justify-end gap-3">
             <button className="py-2.5 px-6 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl font-bold transition-colors text-sm">
               Escalate to Super Admin
             </button>
             <button className="py-2.5 px-6 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-colors text-sm">
               <CheckCircle2 className="w-4 h-4" /> Mark Issue Resolved
             </button>
          </div>
        </div>

      </div>
    </div>
  );
}
