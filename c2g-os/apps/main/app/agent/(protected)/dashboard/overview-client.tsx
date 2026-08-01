'use client';

import { 
  Users, 
  Store, 
  Ship, 
  Truck, 
  Link as LinkIcon, 
  Radio, 
  Package,
  ShoppingCart
} from 'lucide-react';
import CommandBar from '@/components/agent/CommandBar';
import Link from 'next/link';

interface DashboardStats {
  pendingLinkOrders: number;
  processingLinkOrders: number;
  processingMallOrders: number;
  activeReservations: number;
  totalCustomers: number;
  activeShipments: number;
  packagesInWarehouse: number;
  ordersToday: number;
  liveAnnouncements: number;
}

export default function AgentDashboardClient({ stats }: { stats: DashboardStats }) {

  const KpiCard = ({ title, value, icon: Icon, color, href, alert }: any) => {
    const CardContent = (
      <div className={`bg-zinc-900 border ${alert ? 'border-red-500/50 shadow-[0_0_15px_rgba(239,68,68,0.1)]' : 'border-zinc-800'} rounded-2xl p-6 relative overflow-hidden group h-full transition-all hover:scale-[1.02] hover:border-zinc-700 cursor-pointer`}>
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

    return href ? (
      <Link href={href} className="block h-full">
        {CardContent}
      </Link>
    ) : (
      <div className="h-full">{CardContent}</div>
    );
  };

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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard 
          title="Pending Link Orders" 
          value={stats.pendingLinkOrders} 
          icon={LinkIcon} 
          color="bg-indigo-500" 
          href="/agent/global-orders/link-orders?payment=pending"
          alert={stats.pendingLinkOrders > 10}
        />
        <KpiCard 
          title="Processing Link Orders" 
          value={stats.processingLinkOrders} 
          icon={Package} 
          color="bg-violet-500" 
          href="/agent/global-orders/link-orders?status=processing"
        />
        <KpiCard 
          title="Processing Mall Orders" 
          value={stats.processingMallOrders} 
          icon={ShoppingCart} 
          color="bg-fuchsia-500" 
          href="/agent/global-orders/mall-orders?status=processing"
        />
        <KpiCard 
          title="Active Shipments" 
          value={stats.activeShipments} 
          icon={Ship} 
          color="bg-emerald-500" 
          href="/agent/shipments?status=active"
        />
        <KpiCard 
          title="Active Reservations" 
          value={stats.activeReservations} 
          icon={Truck} 
          color="bg-amber-500" 
          href="/agent/reservations?status=active"
        />
      </div>

      {/* Secondary KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link href="/agent/announcements" className="block">
          <div className="bg-zinc-950/50 border border-zinc-800 rounded-2xl p-6 flex items-center gap-4 transition-all hover:bg-zinc-900 cursor-pointer">
            <div className="p-4 bg-zinc-900 rounded-full">
              <Radio className="w-6 h-6 text-red-500" />
            </div>
            <div>
              <p className="text-sm text-zinc-500 font-bold uppercase tracking-wider">Live Announcements</p>
              <p className="text-2xl font-bold text-white">{stats.liveAnnouncements}</p>
            </div>
          </div>
        </Link>
        
        <Link href="/agent/global-orders?created=today" className="block">
          <div className="bg-zinc-950/50 border border-zinc-800 rounded-2xl p-6 flex items-center gap-4 transition-all hover:bg-zinc-900 cursor-pointer">
            <div className="p-4 bg-zinc-900 rounded-full">
              <Store className="w-6 h-6 text-orange-500" />
            </div>
            <div>
              <p className="text-sm text-zinc-500 font-bold uppercase tracking-wider">Orders Today</p>
              <p className="text-2xl font-bold text-white">{stats.ordersToday}</p>
            </div>
          </div>
        </Link>

        <Link href="/agent/shipments?status=in_warehouse" className="block">
          <div className="bg-zinc-950/50 border border-zinc-800 rounded-2xl p-6 flex items-center gap-4 transition-all hover:bg-zinc-900 cursor-pointer">
            <div className="p-4 bg-zinc-900 rounded-full">
              <Package className="w-6 h-6 text-indigo-500" />
            </div>
            <div>
              <p className="text-sm text-zinc-500 font-bold uppercase tracking-wider">Packages in China Warehouse</p>
              <p className="text-2xl font-bold text-white">{stats.packagesInWarehouse}</p>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}
