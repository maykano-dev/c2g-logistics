'use client';

import { FileBarChart, Download, Calendar, Filter, FileText, CheckCircle2 } from 'lucide-react';

export default function ReportsView() {
  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-7xl mx-auto pb-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-3">
            <FileBarChart className="w-6 h-6 text-indigo-500" /> Exportable Reports
          </h1>
          <p className="text-zinc-400 mt-1">Generate and download PDF/CSV reports for accounting, compliance, and auditing.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Report Generator Generator */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 flex flex-col gap-6">
          <h2 className="text-sm font-bold uppercase tracking-widest text-white border-b border-zinc-800 pb-4">Generate Custom Report</h2>
          
          <div>
            <label className="block text-xs font-bold uppercase text-zinc-500 tracking-widest mb-2">Report Type</label>
            <select className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-white focus:outline-none focus:border-indigo-500">
              <option>Financial Ledger (All Transactions)</option>
              <option>Procurement Summary (B4M)</option>
              <option>Shipping & Logistics Volume</option>
              <option>User Growth & Demographics</option>
              <option>Quality Control Incident Log</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-zinc-500 tracking-widest mb-2">Date Range</label>
            <div className="grid grid-cols-2 gap-4">
               <div className="relative">
                 <Calendar className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                 <input type="date" className="w-full bg-zinc-950 border border-zinc-800 rounded-lg pl-9 p-3 text-xs text-white focus:outline-none focus:border-indigo-500" />
               </div>
               <div className="relative">
                 <Calendar className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                 <input type="date" className="w-full bg-zinc-950 border border-zinc-800 rounded-lg pl-9 p-3 text-xs text-white focus:outline-none focus:border-indigo-500" />
               </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-zinc-500 tracking-widest mb-2">Export Format</label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 text-sm text-white cursor-pointer group">
                <input type="radio" name="format" defaultChecked className="text-indigo-500 bg-zinc-950 border-zinc-700 focus:ring-indigo-500" />
                <span className="group-hover:text-indigo-400 transition-colors">CSV (Excel)</span>
              </label>
              <label className="flex items-center gap-2 text-sm text-white cursor-pointer group">
                <input type="radio" name="format" className="text-indigo-500 bg-zinc-950 border-zinc-700 focus:ring-indigo-500" />
                <span className="group-hover:text-indigo-400 transition-colors">PDF Document</span>
              </label>
            </div>
          </div>

          <button className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors mt-auto">
            <Download className="w-4 h-4" /> Generate & Download
          </button>
        </div>

        {/* Saved & Scheduled Reports */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden flex flex-col">
            <div className="p-4 border-b border-zinc-800 bg-zinc-950/50 flex justify-between items-center">
              <h2 className="text-sm font-bold uppercase tracking-widest text-white">Automated Scheduled Reports</h2>
              <button className="text-xs font-bold text-indigo-400 hover:text-white transition-colors flex items-center gap-1"><Filter className="w-3 h-3"/> Manage</button>
            </div>
            <div className="p-4 space-y-4">
               {[
                 { title: 'Weekly Financial Ledger', schedule: 'Every Monday at 08:00', recipient: 'finance@c2g.com', status: 'active' },
                 { title: 'Monthly QC Defect Rate', schedule: '1st of Month at 09:00', recipient: 'ops-lead@c2g.com', status: 'active' },
               ].map((rep, i) => (
                 <div key={i} className="p-4 bg-zinc-950/50 border border-zinc-800/50 rounded-xl flex justify-between items-center group hover:border-indigo-500/30 transition-colors">
                   <div className="flex gap-4 items-center">
                     <div className="p-3 bg-indigo-500/10 text-indigo-500 rounded-lg"><FileText className="w-5 h-5"/></div>
                     <div>
                       <h3 className="text-sm font-bold text-white group-hover:text-indigo-400 transition-colors">{rep.title}</h3>
                       <p className="text-xs text-zinc-500 mt-1">{rep.schedule} • <span className="text-zinc-400">{rep.recipient}</span></p>
                     </div>
                   </div>
                   <span className="px-2 py-1 bg-emerald-500/10 text-emerald-500 text-[10px] font-bold uppercase tracking-wider rounded border border-emerald-500/20 flex items-center gap-1">
                     <CheckCircle2 className="w-3 h-3"/> Active
                   </span>
                 </div>
               ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
