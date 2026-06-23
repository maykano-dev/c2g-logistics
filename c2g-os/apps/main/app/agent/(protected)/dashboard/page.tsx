'use client';

import { useState, useEffect } from 'react';
import { 
  Ticket, 
  Users, 
  Clock, 
  AlertOctagon, 
  CheckCircle2, 
  Timer,
  AlertTriangle,
  Radio
} from 'lucide-react';
import CommandBar from '@/components/agent/CommandBar';
import { createClient } from '@/utils/supabase/client';

export default function AgentDashboardView() {
  const [stats, setStats] = useState({
    openTickets: 0,
    unassignedTickets: 0,
    urgentTickets: 0,
    avgResponseTime: '0 mins',
    customersWaiting: 0,
    closedToday: 0,
    escalationsPending: 0
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real scenario, this would be fetched from the DB
    // Simulating the fetch for the UI
    setTimeout(() => {
      setStats({
        openTickets: 12,
        unassignedTickets: 5,
        urgentTickets: 3,
        avgResponseTime: '14 mins',
        customersWaiting: 8,
        closedToday: 45,
        escalationsPending: 2
      });
      setLoading(false);
    }, 1000);
  }, []);

  const KpiCard = ({ title, value, icon: Icon, color, alert }: any) => (
    <div className={`bg-zinc-900 border ${alert ? 'border-red-500/50 shadow-[0_0_15px_rgba(239,68,68,0.1)]' : 'border-zinc-800'} rounded-2xl p-6 relative overflow-hidden group`}>
      <div className={`absolute -right-6 -top-6 w-24 h-24 rounded-full blur-2xl opacity-20 transition-opacity group-hover:opacity-30 ${color}`}></div>
      <div className="flex justify-between items-start mb-4 relative z-10">
        <div className={`p-3 rounded-xl ${color} bg-opacity-10`}>
          <Icon className={`w-5 h-5 ${color.replace('bg-', 'text-')}`} />
        </div>
      </div>
      <div className="relative z-10">
        <h3 className="text-3xl font-black text-white tracking-tight">{value}</h3>
        <p className="text-sm font-medium text-zinc-500 uppercase tracking-wider mt-1">{title}</p>
      </div>
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-7xl mx-auto pb-10">
      {/* Header & Command Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-3">
            Customer Support Center
          </h1>
          <p className="text-zinc-400 mt-1">Welcome to the COS. Your shift has started.</p>
        </div>
        
        <div className="flex-1 md:max-w-md w-full">
          <CommandBar />
        </div>
      </div>

      {/* Primary KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard title="Open Tickets" value={loading ? '-' : stats.openTickets} icon={Ticket} color="bg-indigo-500" />
        <KpiCard title="Urgent Tickets" value={loading ? '-' : stats.urgentTickets} icon={AlertOctagon} color="bg-red-500" alert={stats.urgentTickets > 0} />
        <KpiCard title="Customers Waiting" value={loading ? '-' : stats.customersWaiting} icon={Users} color="bg-amber-500" />
        <KpiCard title="Avg Response" value={loading ? '-' : stats.avgResponseTime} icon={Timer} color="bg-emerald-500" />
      </div>

      {/* Secondary KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-zinc-950/50 border border-zinc-800 rounded-2xl p-6 flex items-center gap-4">
          <div className="p-4 bg-zinc-900 rounded-full">
            <CheckCircle2 className="w-6 h-6 text-zinc-500" />
          </div>
          <div>
            <p className="text-sm text-zinc-500 font-bold uppercase tracking-wider">Closed Today</p>
            <p className="text-2xl font-bold text-white">{loading ? '-' : stats.closedToday}</p>
          </div>
        </div>
        
        <div className="bg-zinc-950/50 border border-zinc-800 rounded-2xl p-6 flex items-center gap-4">
          <div className="p-4 bg-zinc-900 rounded-full">
            <AlertTriangle className="w-6 h-6 text-orange-500" />
          </div>
          <div>
            <p className="text-sm text-zinc-500 font-bold uppercase tracking-wider">Pending Escalations</p>
            <p className="text-2xl font-bold text-white">{loading ? '-' : stats.escalationsPending}</p>
          </div>
        </div>

        <div className="bg-zinc-950/50 border border-zinc-800 rounded-2xl p-6 flex items-center gap-4">
          <div className="p-4 bg-zinc-900 rounded-full">
            <Clock className="w-6 h-6 text-indigo-500" />
          </div>
          <div>
            <p className="text-sm text-zinc-500 font-bold uppercase tracking-wider">Unassigned</p>
            <p className="text-2xl font-bold text-white">{loading ? '-' : stats.unassignedTickets}</p>
          </div>
        </div>
      </div>

      {/* SLA Warning Banner */}
      {stats.urgentTickets > 0 && !loading && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-6 flex items-start gap-4">
          <AlertOctagon className="w-6 h-6 text-red-500 shrink-0 mt-0.5" />
          <div>
            <h3 className="text-lg font-bold text-red-400">SLA Breach Warning</h3>
            <p className="text-red-400/80 mt-1">You have {stats.urgentTickets} urgent tickets approaching the SLA deadline. Please prioritize these immediately to avoid compliance issues.</p>
            <button className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg text-sm font-bold shadow-lg shadow-red-500/20 hover:bg-red-600 transition-colors">
              View Urgent Tickets
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
