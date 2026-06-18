'use client';

import { Target, CheckCircle2, Clock, AlertTriangle, ArrowRight, Activity } from 'lucide-react';
import Link from 'next/link';

export default function ActionCenterView() {
  // In a real app, these numbers would be fetched dynamically based on the user's role
  const actions = [
    { title: 'Purchase Orders', count: 12, priority: 'high', link: '/employee/procurement', icon: Target },
    { title: 'Scan Packages', count: 47, priority: 'normal', link: '/employee/warehouse', icon: Activity },
    { title: 'Resolve Unmatched Packages', count: 3, priority: 'urgent', link: '/employee/warehouse', icon: AlertTriangle },
    { title: 'Respond to Customers', count: 4, priority: 'normal', link: '/employee/queue', icon: Clock },
    { title: 'Approve Withdrawals', count: 2, priority: 'high', link: '/employee/finance', icon: Target },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500 pb-10">
      
      {/* Header & Clock In */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 bg-indigo-600 rounded-3xl p-8 shadow-2xl shadow-indigo-900/20 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
          <Target className="w-48 h-48" />
        </div>
        
        <div className="relative z-10 text-white">
          <h1 className="text-3xl font-black tracking-tight mb-2">Good morning, Staff</h1>
          <p className="text-indigo-200">You are currently clocked in. Office network IP verified.</p>
        </div>
        
        <div className="relative z-10 flex flex-col items-center bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
          <span className="text-sm font-bold uppercase tracking-widest text-indigo-200 mb-2">Shift Status</span>
          <div className="flex gap-4">
             <div className="flex flex-col items-center gap-1">
               <span className="text-2xl font-black text-white">08:14 AM</span>
               <span className="text-xs text-indigo-300">Time In</span>
             </div>
             <div className="w-px bg-white/20"></div>
             <div className="flex flex-col items-center gap-1">
               <span className="text-2xl font-black text-white/50">--:--</span>
               <span className="text-xs text-indigo-300">Time Out</span>
             </div>
          </div>
          <button className="mt-6 w-full py-3 bg-red-500 hover:bg-red-400 text-white font-bold rounded-xl transition-colors shadow-lg shadow-red-900/20">
            Clock Out
          </button>
        </div>
      </div>

      {/* Action Center Feed */}
      <div>
        <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
          <Target className="w-5 h-5 text-indigo-500" /> Action Center
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {actions.map((action, i) => (
            <Link key={i} href={action.link} className="block group">
              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 hover:border-indigo-500/50 transition-all hover:-translate-y-1 shadow-lg shadow-black/50">
                <div className="flex justify-between items-start mb-4">
                  <div className={`p-3 rounded-xl ${
                    action.priority === 'urgent' ? 'bg-red-500/10 text-red-500' :
                    action.priority === 'high' ? 'bg-amber-500/10 text-amber-500' :
                    'bg-indigo-500/10 text-indigo-500'
                  }`}>
                    <action.icon className="w-6 h-6" />
                  </div>
                  {action.priority !== 'normal' && (
                    <span className={`px-2 py-1 text-[10px] font-bold uppercase tracking-wider rounded ${
                      action.priority === 'urgent' ? 'bg-red-500/20 text-red-400' : 'bg-amber-500/20 text-amber-400'
                    }`}>
                      {action.priority}
                    </span>
                  )}
                </div>
                
                <p className="text-sm text-zinc-400 font-medium">{action.title}</p>
                <div className="flex justify-between items-end mt-2">
                  <h3 className="text-4xl font-black text-white group-hover:text-indigo-400 transition-colors">{action.count}</h3>
                  <ArrowRight className="w-5 h-5 text-zinc-600 group-hover:text-indigo-500 group-hover:translate-x-1 transition-all" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Issue Center Preview */}
      <div className="pt-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-500" /> Open Issues
          </h2>
          <Link href="/employee/issues" className="text-sm font-bold text-indigo-400 hover:text-white transition-colors">View All Issues</Link>
        </div>
        
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
          <div className="p-4 border-b border-zinc-800 bg-zinc-950/50 flex justify-between text-xs font-bold uppercase text-zinc-500 tracking-widest">
            <span>Issue Details</span>
            <span>Status</span>
          </div>
          <div className="divide-y divide-zinc-800">
             {[
               { title: 'Supplier Out Of Stock', entity: 'Order #9021', time: '2 hours ago', status: 'awaiting_manager' },
               { title: 'Package Missing Tracking', entity: 'Package C2G-811', time: '5 hours ago', status: 'investigating' },
             ].map((issue, i) => (
               <div key={i} className="p-4 flex justify-between items-center hover:bg-zinc-800/50 transition-colors cursor-pointer group">
                 <div>
                   <h3 className="text-sm font-bold text-white group-hover:text-amber-400 transition-colors">{issue.title}</h3>
                   <div className="flex items-center gap-2 mt-1 text-xs text-zinc-500">
                     <span className="font-mono">{issue.entity}</span>
                     <span>•</span>
                     <span>{issue.time}</span>
                   </div>
                 </div>
                 <span className="px-2 py-1 bg-amber-500/10 text-amber-500 text-[10px] font-bold uppercase rounded border border-amber-500/20">
                   {issue.status.replace('_', ' ')}
                 </span>
               </div>
             ))}
          </div>
        </div>
      </div>

    </div>
  );
}
