'use client';

import { useState, useEffect } from 'react';
import { LifeBuoy, Filter, Search, MessageCircle, Clock, AlertTriangle, User } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { createClient } from '@/utils/supabase/client';

export default function SupportTicketsView() {
  const [tickets, setTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string[]>(['open']);

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    setLoading(true);
    const supabase = createClient();
    
    // Support tickets are stored in contact_inquiries table
    const { data, error } = await supabase
      .from('contact_inquiries')
      .select('*')
      .order('created_at', { ascending: false });

    if (data && !error) {
      setTickets(data);
    }
    setLoading(false);
  };

  const toggleStatusFilter = (status: string) => {
    setStatusFilter(prev => 
      prev.includes(status) ? prev.filter(s => s !== status) : [...prev, status]
    );
  };

  const filteredTickets = tickets.filter(t => {
    const matchesSearch = t.subject?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          t.message?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          t.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          t.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter.length === 0 || statusFilter.includes(t.status?.toLowerCase() || 'open');
    return matchesSearch && matchesStatus;
  });

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
               <input 
                 type="text" 
                 placeholder="Search tickets..." 
                 value={searchTerm}
                 onChange={(e) => setSearchTerm(e.target.value)}
                 className="w-full h-10 bg-zinc-950 border border-zinc-800 rounded-lg pl-9 pr-3 text-sm text-white focus:border-indigo-500 focus:outline-none" 
               />
             </div>
          </div>
          
          <div>
            <h3 className="text-xs font-bold uppercase text-zinc-500 tracking-widest mb-3">Status Filter</h3>
            <div className="space-y-2">
              <label className="flex items-center gap-3 text-sm text-white cursor-pointer group">
                <input 
                  type="checkbox" 
                  checked={statusFilter.includes('open')}
                  onChange={() => toggleStatusFilter('open')}
                  className="rounded border-zinc-700 bg-zinc-900 text-indigo-500 focus:ring-indigo-500" 
                />
                <span className="group-hover:text-indigo-400 transition-colors">Open</span>
              </label>
              <label className="flex items-center gap-3 text-sm text-zinc-400 cursor-pointer group">
                <input 
                  type="checkbox" 
                  checked={statusFilter.includes('in_progress')}
                  onChange={() => toggleStatusFilter('in_progress')}
                  className="rounded border-zinc-700 bg-zinc-900 text-indigo-500 focus:ring-indigo-500" 
                />
                <span className="group-hover:text-white transition-colors">In Progress</span>
              </label>
              <label className="flex items-center gap-3 text-sm text-zinc-400 cursor-pointer group">
                <input 
                  type="checkbox" 
                  checked={statusFilter.includes('resolved')}
                  onChange={() => toggleStatusFilter('resolved')}
                  className="rounded border-zinc-700 bg-zinc-900 text-indigo-500 focus:ring-indigo-500" 
                />
                <span className="group-hover:text-white transition-colors">Resolved</span>
              </label>
            </div>
          </div>
        </div>

        {/* Right Area: Ticket List */}
        <div className="lg:col-span-3 space-y-4">
          {loading ? (
            <div className="text-center p-12 text-zinc-500 bg-zinc-900 border border-zinc-800 rounded-2xl">Loading tickets...</div>
          ) : filteredTickets.length === 0 ? (
            <div className="text-center p-12 text-zinc-500 bg-zinc-900 border border-zinc-800 rounded-2xl">No tickets found matching filters.</div>
          ) : (
            filteredTickets.map((ticket) => (
              <div key={ticket.id} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 hover:border-indigo-500/50 transition-colors cursor-pointer group">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="flex gap-4">
                    <div className="p-3 rounded-xl flex-shrink-0 h-fit bg-zinc-800 text-zinc-400">
                       <MessageCircle className="w-6 h-6"/>
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-white group-hover:text-indigo-400 transition-colors">{ticket.subject}</h3>
                      <p className="text-sm text-zinc-400 mt-1 line-clamp-1">{ticket.message}</p>
                      <div className="flex items-center gap-3 mt-3 text-xs text-zinc-500">
                        <span className="flex items-center gap-1 text-zinc-300 font-medium"><User className="w-3 h-3"/> {ticket.name}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1"><Clock className="w-3 h-3"/> {ticket.created_at ? formatDistanceToNow(new Date(ticket.created_at), { addSuffix: true }) : 'Unknown'}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded border ${
                      ticket.status === 'open' || !ticket.status ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 
                      ticket.status === 'resolved' ? 'bg-zinc-800 text-zinc-400 border-zinc-700' :
                      'bg-amber-500/10 text-amber-400 border-amber-500/20'
                    }`}>
                      {ticket.status || 'open'}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
}
