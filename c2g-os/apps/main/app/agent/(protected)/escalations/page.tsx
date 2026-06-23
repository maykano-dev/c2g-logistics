'use client';

import { useState } from 'react';
import { 
  AlertTriangle,
  Search,
  Filter,
  ArrowUpRight,
  Clock,
  CheckCircle2,
  XCircle,
  Building2
} from 'lucide-react';
import { format } from 'date-fns';

export default function AgentEscalationsView() {
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('all');

  const escalations = [
    {
      id: 'ESC-44912',
      ticketId: 'TKT-10042',
      department: 'China Warehouse',
      reason: 'Customer claims item was broken before shipping. Need warehouse photos.',
      status: 'pending',
      escalatedAt: new Date(Date.now() - 1000 * 60 * 60 * 4), // 4 hours ago
      escalatedBy: 'Agent 04'
    },
    {
      id: 'ESC-44913',
      ticketId: 'TKT-10029',
      department: 'Finance',
      reason: 'Refund requested for cancelled mall order ORD-2991. Payment was via Hubtel.',
      status: 'resolved',
      escalatedAt: new Date(Date.now() - 1000 * 60 * 60 * 48), // 2 days ago
      escalatedBy: 'Agent 02',
      resolvedAt: new Date(Date.now() - 1000 * 60 * 60 * 2) // 2 hours ago
    }
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-7xl mx-auto pb-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-3">
            <AlertTriangle className="w-6 h-6 text-orange-500" /> Escalation Center
          </h1>
          <p className="text-zinc-400 mt-1">Track tickets escalated to other departments for resolution.</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 p-4 bg-zinc-900 border border-zinc-800 rounded-2xl">
        <div className="relative flex-1">
          <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
          <input 
            type="text"
            placeholder="Search by Escalation ID or Ticket ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full h-10 bg-zinc-950 border border-zinc-800 rounded-lg pl-10 pr-4 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto [&::-webkit-scrollbar]:hidden">
          <select 
            value={departmentFilter}
            onChange={(e) => setDepartmentFilter(e.target.value)}
            className="bg-zinc-950 border border-zinc-800 text-zinc-300 text-sm rounded-lg px-4 focus:outline-none focus:border-indigo-500"
          >
            <option value="all">All Departments</option>
            <option value="warehouse">China Warehouse</option>
            <option value="finance">Finance</option>
            <option value="procurement">Procurement</option>
            <option value="management">Management</option>
          </select>
          <button className="px-4 h-10 border border-zinc-800 bg-zinc-950 text-white rounded-lg text-sm font-medium flex items-center gap-2 hover:bg-zinc-800 transition-colors shrink-0">
            <Filter className="w-4 h-4" /> Filters
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {escalations.map((escalation) => (
          <div key={escalation.id} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-zinc-700 transition-colors">
            {escalation.status === 'pending' && (
              <div className="absolute left-0 top-0 w-1 h-full bg-orange-500"></div>
            )}
            {escalation.status === 'resolved' && (
              <div className="absolute left-0 top-0 w-1 h-full bg-emerald-500"></div>
            )}
            
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-sm font-bold text-white">{escalation.id}</span>
                <span className="text-zinc-500 font-bold">•</span>
                <span className="text-xs font-mono text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded flex items-center gap-1">
                  <ArrowUpRight className="w-3 h-3" /> {escalation.ticketId}
                </span>
                <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded ${
                  escalation.status === 'pending' ? 'bg-orange-500/10 text-orange-500' : 'bg-emerald-500/10 text-emerald-500'
                }`}>
                  {escalation.status}
                </span>
              </div>
              <p className="text-sm text-zinc-300 max-w-2xl">{escalation.reason}</p>
            </div>

            <div className="flex items-center gap-8 text-sm shrink-0">
              <div className="flex flex-col">
                <span className="text-[10px] uppercase font-bold text-zinc-500 mb-1 flex items-center gap-1">
                  <Building2 className="w-3 h-3" /> Department
                </span>
                <span className="text-zinc-300 font-medium">{escalation.department}</span>
              </div>
              
              <div className="flex flex-col">
                <span className="text-[10px] uppercase font-bold text-zinc-500 mb-1 flex items-center gap-1">
                  <Clock className="w-3 h-3" /> Escalated At
                </span>
                <span className="text-zinc-300 font-medium">{format(escalation.escalatedAt, 'MMM dd, HH:mm')}</span>
              </div>
            </div>

            <div className="shrink-0">
              <button className="px-4 py-2 bg-zinc-950 border border-zinc-800 text-white rounded-lg text-sm font-bold hover:bg-zinc-800 transition-colors">
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
