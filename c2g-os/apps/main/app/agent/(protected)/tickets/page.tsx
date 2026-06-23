'use client';

import { useState } from 'react';
import { 
  Ticket, 
  Search, 
  Filter, 
  Clock, 
  AlertOctagon, 
  MoreVertical,
  User
} from 'lucide-react';
import { format } from 'date-fns';

export default function AgentTicketsView() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Mock tickets
  const tickets = [
    {
      id: 'TKT-10042',
      customerName: 'Sarah Mensah',
      customerId: 'C2G-09912',
      subject: 'Package missing from shipment SEA-0012',
      category: 'Package Missing',
      priority: 'urgent',
      status: 'open',
      createdAt: new Date(),
      deadline: new Date(Date.now() + 1000 * 60 * 15), // 15 mins
    },
    {
      id: 'TKT-10043',
      customerName: 'Kwame Osei',
      customerId: 'C2G-10294',
      subject: 'When is the next sea shipment?',
      category: 'General Question',
      priority: 'low',
      status: 'open',
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
      deadline: new Date(Date.now() + 1000 * 60 * 60 * 2), // 2 hours left
    }
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-7xl mx-auto pb-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-3">
            <Ticket className="w-6 h-6 text-indigo-500" /> Support Tickets
          </h1>
          <p className="text-zinc-400 mt-1">Manage customer inquiries, complaints, and escalations.</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 p-4 bg-zinc-900 border border-zinc-800 rounded-2xl">
        <div className="relative flex-1">
          <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
          <input 
            type="text"
            placeholder="Search by ID, Name, Phone, Email, Order #, or Tracking..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full h-10 bg-zinc-950 border border-zinc-800 rounded-lg pl-10 pr-4 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto [&::-webkit-scrollbar]:hidden">
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-zinc-950 border border-zinc-800 text-zinc-300 text-sm rounded-lg px-4 focus:outline-none focus:border-indigo-500"
          >
            <option value="all">All Statuses</option>
            <option value="open">Open</option>
            <option value="pending">Pending</option>
            <option value="escalated">Escalated</option>
            <option value="resolved">Resolved</option>
          </select>
          <button className="px-4 h-10 border border-zinc-800 bg-zinc-950 text-white rounded-lg text-sm font-medium flex items-center gap-2 hover:bg-zinc-800 transition-colors shrink-0">
            <Filter className="w-4 h-4" /> Filters
          </button>
        </div>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-zinc-950/50 border-b border-zinc-800">
                <th className="p-4 text-xs font-semibold text-zinc-400 uppercase tracking-wider">Ticket</th>
                <th className="p-4 text-xs font-semibold text-zinc-400 uppercase tracking-wider">Customer</th>
                <th className="p-4 text-xs font-semibold text-zinc-400 uppercase tracking-wider">Category</th>
                <th className="p-4 text-xs font-semibold text-zinc-400 uppercase tracking-wider">Priority</th>
                <th className="p-4 text-xs font-semibold text-zinc-400 uppercase tracking-wider">SLA Status</th>
                <th className="p-4 text-xs font-semibold text-zinc-400 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/50">
              {tickets.map((ticket) => (
                <tr key={ticket.id} className="hover:bg-zinc-800/20 transition-colors group">
                  <td className="p-4">
                    <div className="flex flex-col">
                      <span className="text-white font-bold text-sm">{ticket.id}</span>
                      <span className="text-xs text-zinc-500 truncate max-w-[200px] mt-0.5" title={ticket.subject}>{ticket.subject}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-zinc-800 flex items-center justify-center text-xs text-zinc-400">
                        <User className="w-3 h-3" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm text-zinc-300 font-medium">{ticket.customerName}</span>
                        <span className="text-[10px] text-zinc-500 font-mono">{ticket.customerId}</span>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="text-xs text-zinc-400 font-medium">{ticket.category}</span>
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-1 text-[10px] font-bold uppercase tracking-wider rounded ${
                      ticket.priority === 'urgent' ? 'bg-red-500/10 text-red-500 border border-red-500/20' :
                      ticket.priority === 'high' ? 'bg-orange-500/10 text-orange-500 border border-orange-500/20' :
                      ticket.priority === 'medium' ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20' :
                      'bg-zinc-800 text-zinc-400 border border-zinc-700'
                    }`}>
                      {ticket.priority}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      {ticket.priority === 'urgent' ? (
                        <AlertOctagon className="w-4 h-4 text-red-500 animate-pulse" />
                      ) : (
                        <Clock className="w-4 h-4 text-zinc-500" />
                      )}
                      <div className="flex flex-col">
                        <span className={`text-xs font-bold ${ticket.priority === 'urgent' ? 'text-red-500' : 'text-zinc-300'}`}>
                          {ticket.priority === 'urgent' ? '14 mins left' : '1h 45m left'}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-right">
                    <button className="p-2 hover:bg-zinc-800 rounded-lg text-zinc-500 hover:text-white transition-colors">
                      <MoreVertical className="w-4 h-4" />
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
