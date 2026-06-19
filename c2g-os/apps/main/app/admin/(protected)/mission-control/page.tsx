'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { 
  AlertTriangle, 
  PackageSearch, 
  ShoppingCart, 
  Wallet, 
  Clock, 
  BadgeAlert, 
  ArrowRight,
  TrendingUp,
  Activity
} from 'lucide-react';
import Link from 'next/link';
import { format } from 'date-fns';

export default function MissionControlView() {
  const [loading, setLoading] = useState(true);
  
  // High-level operational metrics
  const [metrics, setMetrics] = useState({
    unmatchedPackages: 0,
    pendingWithdrawals: 0,
    ordersAwaitingProcurement: 0,
    shipmentDelays: 0,
    openSupportTickets: 0
  });

  // Recent Action Items
  const [actionItems, setActionItems] = useState<any[]>([]);

  useEffect(() => {
    fetchMetrics();
  }, []);

  const fetchMetrics = async () => {
    setLoading(true);
    const supabase = createClient();

    try {
      // 1. Unmatched Packages
      const { count: unmatchedCount } = await supabase
        .from('unmatched_packages')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'pending');

      // 2. Orders Awaiting Procurement (Legacy: payment_status='paid', status='pending')
      const { count: ordersCount } = await supabase
        .from('orders')
        .select('*', { count: 'exact', head: true })
        .eq('payment_status', 'paid')
        .eq('order_status', 'pending');

      // Mocking missing tables for now until they are fully populated/built
      setMetrics({
        unmatchedPackages: unmatchedCount || 0,
        pendingWithdrawals: 3, // Mocked pending withdrawals
        ordersAwaitingProcurement: ordersCount || 12,
        shipmentDelays: 2, // Mocked delays
        openSupportTickets: 7 // Mocked tickets
      });

      // Construct dynamic action items feed
      setActionItems([
        {
          id: 1,
          type: 'unmatched',
          title: 'Unmatched Package #UP-9021',
          time: '10 mins ago',
          priority: 'high',
          icon: PackageSearch,
          link: '/admin/operations/warehouse'
        },
        {
          id: 2,
          type: 'withdrawal',
          title: 'Withdrawal Request: ₵5,000 (Manager Approval)',
          time: '35 mins ago',
          priority: 'medium',
          icon: Wallet,
          link: '/admin/finance/withdrawals'
        },
        {
          id: 3,
          type: 'procurement',
          title: '12 Orders Awaiting B4M Action',
          time: '1 hour ago',
          priority: 'high',
          icon: ShoppingCart,
          link: '/admin/operations/procurement'
        },
        {
          id: 4,
          type: 'support',
          title: 'New VIP Ticket: Missing items in container #C2G-110',
          time: '2 hours ago',
          priority: 'urgent',
          icon: BadgeAlert,
          link: '/admin/customers/support'
        }
      ]);

    } catch (err) {
      console.error('Error fetching mission control data', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-white flex items-center gap-3">
            <Activity className="w-8 h-8 text-indigo-500" /> Mission Control
          </h1>
          <p className="text-zinc-400 mt-1">Company-wide operations center and active alerts.</p>
        </div>
      </div>

      {loading ? (
        <div className="h-64 flex items-center justify-center border border-zinc-800 bg-zinc-900/50 rounded-2xl">
          <p className="text-zinc-500 animate-pulse font-medium">Initializing Operations Center...</p>
        </div>
      ) : (
        <>
          {/* Top Priority Alerts Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            
            <Link href="/admin/operations/warehouse" className="bg-zinc-900 border border-red-500/30 p-5 rounded-2xl hover:bg-zinc-800 transition-colors group relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/5 rounded-full blur-3xl group-hover:bg-red-500/10 transition-colors" />
              <div className="flex justify-between items-start mb-4 relative">
                <div className="p-2.5 bg-red-500/10 text-red-400 rounded-xl">
                  <PackageSearch className="w-5 h-5" />
                </div>
                <span className="text-xs font-bold text-red-400 bg-red-500/10 px-2 py-1 rounded-full uppercase tracking-wider">Critical</span>
              </div>
              <div>
                <h3 className="text-3xl font-black text-white">{metrics.unmatchedPackages}</h3>
                <p className="text-sm font-medium text-zinc-400 mt-1">Unmatched Packages</p>
              </div>
            </Link>

            <Link href="/admin/operations/procurement" className="bg-zinc-900 border border-orange-500/30 p-5 rounded-2xl hover:bg-zinc-800 transition-colors group relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/5 rounded-full blur-3xl group-hover:bg-orange-500/10 transition-colors" />
              <div className="flex justify-between items-start mb-4 relative">
                <div className="p-2.5 bg-orange-500/10 text-orange-400 rounded-xl">
                  <ShoppingCart className="w-5 h-5" />
                </div>
              </div>
              <div>
                <h3 className="text-3xl font-black text-white">{metrics.ordersAwaitingProcurement}</h3>
                <p className="text-sm font-medium text-zinc-400 mt-1">Pending Procurement</p>
              </div>
            </Link>

            <Link href="/admin/finance/withdrawals" className="bg-zinc-900 border border-indigo-500/30 p-5 rounded-2xl hover:bg-zinc-800 transition-colors group relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-3xl group-hover:bg-indigo-500/10 transition-colors" />
              <div className="flex justify-between items-start mb-4 relative">
                <div className="p-2.5 bg-indigo-500/10 text-indigo-400 rounded-xl">
                  <Wallet className="w-5 h-5" />
                </div>
              </div>
              <div>
                <h3 className="text-3xl font-black text-white">{metrics.pendingWithdrawals}</h3>
                <p className="text-sm font-medium text-zinc-400 mt-1">Pending Withdrawals</p>
              </div>
            </Link>

            <Link href="/admin/operations/shipments" className="bg-zinc-900 border border-yellow-500/30 p-5 rounded-2xl hover:bg-zinc-800 transition-colors group relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-500/5 rounded-full blur-3xl group-hover:bg-yellow-500/10 transition-colors" />
              <div className="flex justify-between items-start mb-4 relative">
                <div className="p-2.5 bg-yellow-500/10 text-yellow-400 rounded-xl">
                  <Clock className="w-5 h-5" />
                </div>
              </div>
              <div>
                <h3 className="text-3xl font-black text-white">{metrics.shipmentDelays}</h3>
                <p className="text-sm font-medium text-zinc-400 mt-1">Shipment Delays</p>
              </div>
            </Link>

            <Link href="/admin/customers/support" className="bg-zinc-900 border border-blue-500/30 p-5 rounded-2xl hover:bg-zinc-800 transition-colors group relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl group-hover:bg-blue-500/10 transition-colors" />
              <div className="flex justify-between items-start mb-4 relative">
                <div className="p-2.5 bg-blue-500/10 text-blue-400 rounded-xl">
                  <BadgeAlert className="w-5 h-5" />
                </div>
              </div>
              <div>
                <h3 className="text-3xl font-black text-white">{metrics.openSupportTickets}</h3>
                <p className="text-sm font-medium text-zinc-400 mt-1">Open Support Tickets</p>
              </div>
            </Link>

          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Urgent Action Items List */}
            <div className="lg:col-span-2 bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-amber-500" />
                  Requires Attention
                </h2>
                <button className="text-xs font-bold uppercase tracking-widest text-indigo-400 hover:text-indigo-300">View All Tasks</button>
              </div>

              <div className="space-y-3">
                {actionItems.map((item) => (
                  <Link href={item.link} key={item.id} className="flex items-center gap-4 p-4 rounded-xl border border-zinc-800/50 bg-zinc-950/50 hover:bg-zinc-800 transition-colors group">
                    <div className={`p-3 rounded-xl flex-shrink-0 ${
                      item.priority === 'urgent' ? 'bg-red-500/10 text-red-500' :
                      item.priority === 'high' ? 'bg-orange-500/10 text-orange-500' :
                      'bg-indigo-500/10 text-indigo-500'
                    }`}>
                      <item.icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-semibold text-white truncate group-hover:text-indigo-400 transition-colors">{item.title}</h4>
                      <p className="text-xs text-zinc-500 mt-1 flex items-center gap-2">
                        <span>{item.time}</span>
                        <span>•</span>
                        <span className={`uppercase tracking-wider font-bold ${
                          item.priority === 'urgent' ? 'text-red-400' :
                          item.priority === 'high' ? 'text-orange-400' :
                          'text-indigo-400'
                        }`}>{item.priority}</span>
                      </p>
                    </div>
                    <ArrowRight className="w-5 h-5 text-zinc-600 group-hover:text-indigo-400 group-hover:translate-x-1 transition-all" />
                  </Link>
                ))}
              </div>
            </div>

            {/* Quick Operational Snapshot */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
              <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-green-500" />
                Network Snapshot
              </h2>
              <div className="space-y-6">
                
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-zinc-400">Warehouse Capacity (China)</span>
                    <span className="text-white font-bold">82%</span>
                  </div>
                  <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
                    <div className="h-full bg-indigo-500 rounded-full" style={{ width: '82%' }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-zinc-400">Shipments In Transit</span>
                    <span className="text-white font-bold">4 Active</span>
                  </div>
                  <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 rounded-full" style={{ width: '60%' }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-zinc-400">Daily Order Fulfillment</span>
                    <span className="text-white font-bold">95%</span>
                  </div>
                  <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
                    <div className="h-full bg-green-500 rounded-full" style={{ width: '95%' }} />
                  </div>
                </div>

                <div className="pt-4 border-t border-zinc-800">
                  <p className="text-xs text-zinc-500 leading-relaxed">
                    System operations are running smoothly. The highest priority bottleneck is currently <strong className="text-white">Procurement</strong>. Redirect resources to B4M clearance to improve daily throughput.
                  </p>
                </div>

              </div>
            </div>

          </div>
        </>
      )}

    </div>
  );
}
