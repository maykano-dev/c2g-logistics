'use client';

import { LifeBuoy, Filter, Search, MessageCircle, Clock, AlertTriangle } from 'lucide-react';

export default function SupportTicketsView() {
  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-7xl mx-auto pb-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-3">
            <LifeBuoy className="w-6 h-6 text-indigo-500" /> Support Tickets
          </h1>
          <p className="text-zinc-400 mt-1">Manage customer inquiries, complaints, and unassigned packages tracking requests.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Left Sidebar: Filters */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 h-fit space-y-6">
          <div>
             <div className="relative">
               <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
               <input type="text" placeholder="Search tickets..." className="w-full h-10 bg-zinc-950 border border-zinc-800 rounded-lg pl-9 pr-3 text-sm text-white focus:border-indigo-500 focus:outline-none" />
             </div>
          </div>
          
          <div>
            <h3 className="text-xs font-bold uppercase text-zinc-500 tracking-widest mb-3">Status Filter</h3>
            <div className="space-y-2">
              <label className="flex items-center gap-3 text-sm text-white cursor-pointer group">
                <input type="checkbox" defaultChecked className="rounded border-zinc-700 bg-zinc-900 text-indigo-500 focus:ring-indigo-500" />
                <span className="group-hover:text-indigo-400 transition-colors">Open <span className="text-zinc-500 ml-1 text-xs">(12)</span></span>
              </label>
              <label className="flex items-center gap-3 text-sm text-zinc-400 cursor-pointer group">
                <input type="checkbox" className="rounded border-zinc-700 bg-zinc-900 text-indigo-500 focus:ring-indigo-500" />
                <span className="group-hover:text-white transition-colors">Pending Client <span className="text-zinc-600 ml-1 text-xs">(4)</span></span>
              </label>
              <label className="flex items-center gap-3 text-sm text-zinc-400 cursor-pointer group">
                <input type="checkbox" className="rounded border-zinc-700 bg-zinc-900 text-indigo-500 focus:ring-indigo-500" />
                <span className="group-hover:text-white transition-colors">Resolved <span className="text-zinc-600 ml-1 text-xs">(89)</span></span>
              </label>
            </div>
          </div>

          <div>
            <h3 className="text-xs font-bold uppercase text-zinc-500 tracking-widest mb-3">Priority</h3>
            <div className="space-y-2">
              <label className="flex items-center gap-3 text-sm text-red-400 cursor-pointer">
                <input type="checkbox" className="rounded border-red-900 bg-zinc-900 text-red-500 focus:ring-red-500" />
                Urgent
              </label>
              <label className="flex items-center gap-3 text-sm text-amber-400 cursor-pointer">
                <input type="checkbox" className="rounded border-amber-900 bg-zinc-900 text-amber-500 focus:ring-amber-500" />
                High
              </label>
              <label className="flex items-center gap-3 text-sm text-zinc-400 cursor-pointer">
                <input type="checkbox" className="rounded border-zinc-700 bg-zinc-900 text-zinc-500 focus:ring-zinc-500" />
                Normal
              </label>
            </div>
          </div>
        </div>

        {/* Right Area: Ticket List */}
        <div className="lg:col-span-3 space-y-4">
          {[
            { id: 'TCK-001', subject: 'Where is my Unmatched Package?', user: 'John Doe', priority: 'high', status: 'open', time: '2 hours ago' },
            { id: 'TCK-002', subject: 'Refund request for QC failed item', user: 'Sarah Smith', priority: 'urgent', status: 'open', time: '5 hours ago' },
            { id: 'TCK-003', subject: 'How do I use my C2G Wallet balance?', user: 'Kwame A.', priority: 'normal', status: 'open', time: '1 day ago' },
            { id: 'TCK-004', subject: 'Wrong tracking number provided', user: 'Emmanuel Tech', priority: 'normal', status: 'pending', time: '2 days ago' },
          ].map((ticket, i) => (
            <div key={i} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 hover:border-indigo-500/50 transition-colors cursor-pointer group">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="flex gap-4">
                  <div className={`p-3 rounded-xl flex-shrink-0 h-fit ${ticket.priority === 'urgent' ? 'bg-red-500/10 text-red-500' : ticket.priority === 'high' ? 'bg-amber-500/10 text-amber-500' : 'bg-zinc-800 text-zinc-400'}`}>
                    {ticket.priority === 'urgent' ? <AlertTriangle className="w-6 h-6"/> : <MessageCircle className="w-6 h-6"/>}
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white group-hover:text-indigo-400 transition-colors">{ticket.subject}</h3>
                    <div className="flex items-center gap-3 mt-1.5 text-xs text-zinc-400">
                      <span className="text-zinc-300 font-medium">{ticket.user}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3"/> {ticket.time}</span>
                      <span>•</span>
                      <span className="font-mono text-zinc-500">{ticket.id}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded border ${
                    ticket.status === 'open' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-zinc-800 text-zinc-400 border-zinc-700'
                  }`}>
                    {ticket.status}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
