'use client';

import { useState, useEffect } from 'react';
import { 
  Users, 
  Store, 
  Ship, 
  Truck, 
  Link as LinkIcon, 
  Radio, 
  Package,
  Activity
} from 'lucide-react';
import CommandBar from '@/components/agent/CommandBar';

export default function AgentDashboardView() {
  const [stats, setStats] = useState({
    pendingLinkOrders: 0,
    activeShipments: 0,
    activeReservations: 0,
    totalCustomers: 0,
    liveAnnouncements: 0,
    recentOrders: 0,
    packagesInWarehouse: 0
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real scenario, this would be fetched from the DB
    // Simulating the fetch for the UI
    setTimeout(() => {
      setStats({
        pendingLinkOrders: 14,
        activeShipments: 3,
        activeReservations: 8,
        totalCustomers: 1204,
        liveAnnouncements: 2,
        recentOrders: 45,
        packagesInWarehouse: 156
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
        <KpiCard title="Pending Link Orders" value={loading ? '-' : stats.pendingLinkOrders} icon={LinkIcon} color="bg-indigo-500" />
        <KpiCard title="Active Shipments" value={loading ? '-' : stats.activeShipments} icon={Ship} color="bg-emerald-500" />
        <KpiCard title="Active Reservations" value={loading ? '-' : stats.activeReservations} icon={Truck} color="bg-amber-500" />
        <KpiCard title="Total Customers" value={loading ? '-' : stats.totalCustomers.toLocaleString()} icon={Users} color="bg-blue-500" />
      </div>

      {/* Secondary KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-zinc-950/50 border border-zinc-800 rounded-2xl p-6 flex items-center gap-4">
          <div className="p-4 bg-zinc-900 rounded-full">
            <Radio className="w-6 h-6 text-red-500" />
          </div>
          <div>
            <p className="text-sm text-zinc-500 font-bold uppercase tracking-wider">Live Announcements</p>
            <p className="text-2xl font-bold text-white">{loading ? '-' : stats.liveAnnouncements}</p>
          </div>
        </div>
        
        <div className="bg-zinc-950/50 border border-zinc-800 rounded-2xl p-6 flex items-center gap-4">
          <div className="p-4 bg-zinc-900 rounded-full">
            <Store className="w-6 h-6 text-orange-500" />
          </div>
          <div>
            <p className="text-sm text-zinc-500 font-bold uppercase tracking-wider">Orders Today</p>
            <p className="text-2xl font-bold text-white">{loading ? '-' : stats.recentOrders}</p>
          </div>
        </div>

        <div className="bg-zinc-950/50 border border-zinc-800 rounded-2xl p-6 flex items-center gap-4">
          <div className="p-4 bg-zinc-900 rounded-full">
            <Package className="w-6 h-6 text-indigo-500" />
          </div>
          <div>
            <p className="text-sm text-zinc-500 font-bold uppercase tracking-wider">Packages in Warehouse</p>
            <p className="text-2xl font-bold text-white">{loading ? '-' : stats.packagesInWarehouse}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
