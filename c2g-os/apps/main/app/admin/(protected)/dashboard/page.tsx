'use client';

import { useEffect, useState } from 'react';
import { Activity, Package, ShoppingCart, Users, DollarSign, AlertTriangle, Clock, Truck, UserCircle, Briefcase, ListTodo, Store } from 'lucide-react';
import { getDashboardStats } from './actions';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { format } from 'date-fns';

export default function AdminDashboardOverview() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      const res = await getDashboardStats();
      if (res.success) {
        setStats(res.data);
      }
      setLoading(false);
    }
    loadStats();
  }, []);

  if (loading) {
    return <div className="p-8 text-center text-zinc-500">Loading dashboard metrics...</div>;
  }

  if (!stats) {
    return <div className="p-8 text-center text-red-500">Failed to load dashboard metrics.</div>;
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white">Dashboard Overview</h1>
        <p className="text-zinc-400">High-level metrics for your logistics network.</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric Card 1: New Orders */}
        <div className="p-5 bg-zinc-900 border border-zinc-800 rounded-2xl flex flex-col gap-2">
          <div className="flex items-center gap-3 text-indigo-400 mb-1">
            <ShoppingCart className="w-4 h-4" />
            <span className="text-xs font-semibold uppercase tracking-wider">New Orders</span>
          </div>
          <span className="text-3xl font-extrabold text-white">{stats.newOrdersCount}</span>
        </div>

        {/* Metric Card 2: Revenue */}
        <div className="p-5 bg-zinc-900 border border-zinc-800 rounded-2xl flex flex-col gap-2">
          <div className="flex items-center gap-3 text-emerald-500 mb-1">
            <DollarSign className="w-4 h-4" />
            <span className="text-xs font-semibold uppercase tracking-wider">Revenue</span>
          </div>
          <span className="text-2xl font-extrabold text-white">
            ${stats.totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
        </div>

        {/* Metric Card 3: Pending Payments */}
        <div className="p-5 bg-zinc-900 border border-zinc-800 rounded-2xl flex flex-col gap-2 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-2 text-amber-500/20 group-hover:text-amber-500/40 transition-colors">
             <AlertTriangle className="w-16 h-16 transform rotate-12" />
          </div>
          <div className="flex items-center gap-3 text-amber-400 mb-1 relative z-10">
            <Clock className="w-4 h-4" />
            <span className="text-xs font-semibold uppercase tracking-wider">Pending Pay</span>
          </div>
          <span className="text-3xl font-extrabold text-white relative z-10">{stats.pendingPaymentsCount}</span>
        </div>

        {/* Metric Card 4: At Warehouse */}
        <div className="p-5 bg-zinc-900 border border-zinc-800 rounded-2xl flex flex-col gap-2">
          <div className="flex items-center gap-3 text-emerald-400 mb-1">
            <Package className="w-4 h-4" />
            <span className="text-xs font-semibold uppercase tracking-wider">At Warehouse</span>
          </div>
          <span className="text-3xl font-extrabold text-white">{stats.warehouseCount}</span>
        </div>

        {/* Metric Card 5: Ecom Orders */}
        <div className="p-5 bg-zinc-900 border border-zinc-800 rounded-2xl flex flex-col gap-2">
          <div className="flex items-center gap-3 text-pink-400 mb-1">
            <ShoppingCart className="w-4 h-4" />
            <span className="text-xs font-semibold uppercase tracking-wider">E-commerce</span>
          </div>
          <span className="text-3xl font-extrabold text-white">{stats.ecomOrdersCount}</span>
        </div>

        {/* Metric Card 6: Customers */}
        <div className="p-5 bg-zinc-900 border border-zinc-800 rounded-2xl flex flex-col gap-2">
          <div className="flex items-center gap-3 text-orange-400 mb-1">
            <Users className="w-4 h-4" />
            <span className="text-xs font-semibold uppercase tracking-wider">Customers</span>
          </div>
          <span className="text-3xl font-extrabold text-white">{stats.customersCount}</span>
        </div>

        {/* Metric Card 7: Total Products */}
        <div className="p-5 bg-zinc-900 border border-zinc-800 rounded-2xl flex flex-col gap-2">
          <div className="flex items-center gap-3 text-cyan-400 mb-1">
            <Package className="w-4 h-4" />
            <span className="text-xs font-semibold uppercase tracking-wider">Products</span>
          </div>
          <span className="text-3xl font-extrabold text-white">{stats.totalProductsCount}</span>
        </div>

        {/* Metric Card 8: Active Ships */}
        <div className="p-5 bg-zinc-900 border border-zinc-800 rounded-2xl flex flex-col gap-2">
          <div className="flex items-center gap-3 text-blue-400 mb-1">
            <Activity className="w-4 h-4" />
            <span className="text-xs font-semibold uppercase tracking-wider">Active Ships</span>
          </div>
          <span className="text-3xl font-extrabold text-white">{stats.activeShipmentsCount}</span>
        </div>

        {/* Metric Card 9: Packages Received */}
        <div className="p-5 bg-zinc-900 border border-zinc-800 rounded-2xl flex flex-col gap-2">
          <div className="flex items-center gap-3 text-emerald-400 mb-1">
            <Store className="w-4 h-4" />
            <span className="text-xs font-semibold uppercase tracking-wider">Packages Rcvd</span>
          </div>
          <span className="text-3xl font-extrabold text-white">{stats.packagesReceivedCount}</span>
        </div>

        {/* Metric Card 10: Packages Shipped */}
        <div className="p-5 bg-zinc-900 border border-zinc-800 rounded-2xl flex flex-col gap-2">
          <div className="flex items-center gap-3 text-indigo-400 mb-1">
            <Truck className="w-4 h-4" />
            <span className="text-xs font-semibold uppercase tracking-wider">Pkgs Shipped</span>
          </div>
          <span className="text-3xl font-extrabold text-white">{stats.packagesShippedCount}</span>
        </div>

        {/* Metric Card 11: Active Importers */}
        <div className="p-5 bg-zinc-900 border border-zinc-800 rounded-2xl flex flex-col gap-2">
          <div className="flex items-center gap-3 text-purple-400 mb-1">
            <UserCircle className="w-4 h-4" />
            <span className="text-xs font-semibold uppercase tracking-wider">Active Importers</span>
          </div>
          <span className="text-3xl font-extrabold text-white">{stats.importersCount}</span>
        </div>

        {/* Metric Card 12: Pending Procurement */}
        <div className="p-5 bg-zinc-900 border border-zinc-800 rounded-2xl flex flex-col gap-2 relative overflow-hidden group">
          <div className="flex items-center gap-3 text-rose-400 mb-1 relative z-10">
            <Briefcase className="w-4 h-4" />
            <span className="text-xs font-semibold uppercase tracking-wider">Pending B4M</span>
          </div>
          <span className="text-3xl font-extrabold text-white relative z-10">{stats.pendingProcurementCount}</span>
        </div>

        {/* Metric Card 13: Total Products */}
        <div className="p-5 bg-zinc-900 border border-zinc-800 rounded-2xl flex flex-col gap-2">
          <div className="flex items-center gap-3 text-cyan-400 mb-1">
            <Package className="w-4 h-4" />
            <span className="text-xs font-semibold uppercase tracking-wider">Products</span>
          </div>
          <span className="text-3xl font-extrabold text-white">{stats.totalProductsCount}</span>
        </div>

        {/* Metric Card 14: Active Ships */}
        <div className="p-5 bg-zinc-900 border border-zinc-800 rounded-2xl flex flex-col gap-2">
          <div className="flex items-center gap-3 text-blue-400 mb-1">
            <Activity className="w-4 h-4" />
            <span className="text-xs font-semibold uppercase tracking-wider">Active Ships</span>
          </div>
          <span className="text-3xl font-extrabold text-white">{stats.activeShipmentsCount}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
        <div className="p-6 bg-zinc-900 border border-zinc-800 rounded-2xl h-96 flex flex-col lg:col-span-2">
          <h2 className="text-lg font-bold text-white mb-4">Weekly Order Volume</h2>
          <div className="flex-1 w-full h-full min-h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={stats.chartData} margin={{ top: 5, right: 30, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#3f3f46" vertical={false} />
                <XAxis dataKey="name" stroke="#a1a1aa" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#a1a1aa" fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#18181b', border: '1px solid #27272a', borderRadius: '8px' }}
                  itemStyle={{ fontSize: '13px' }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                <Line type="monotone" dataKey="linkOrders" name="Link Orders" stroke="#4f46e5" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
                <Line type="monotone" dataKey="mallOrders" name="Mall Orders" stroke="#10b981" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="space-y-6">
          <div className="p-6 bg-zinc-900 border border-zinc-800 rounded-2xl flex flex-col">
            <h2 className="text-lg font-bold text-white mb-4">Action Items</h2>
            <div className="space-y-3">
              {stats.pendingPaymentsCount > 0 && (
                <div className="flex items-center justify-between p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl">
                  <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-amber-500" />
                    <span className="text-sm text-white font-medium">{stats.pendingPaymentsCount} Pending Payments</span>
                  </div>
                </div>
              )}
              {stats.lowStockProducts.length > 0 && (
                <div className="flex flex-col gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-xl max-h-48 overflow-y-auto">
                  <div className="flex items-center gap-3 mb-1">
                    <AlertTriangle className="w-5 h-5 text-red-500" />
                    <span className="text-sm text-white font-medium">{stats.lowStockProducts.length} Low Stock Alerts</span>
                  </div>
                  {stats.lowStockProducts.slice(0, 3).map((p: any, i: number) => (
                    <div key={i} className="text-xs text-zinc-300 flex justify-between bg-zinc-950/50 p-2 rounded">
                      <span className="truncate pr-2">{p.name}</span>
                      <span className="text-red-400 font-bold shrink-0">{p.stock} left</span>
                    </div>
                  ))}
                </div>
              )}
              {stats.pendingPaymentsCount === 0 && stats.lowStockProducts.length === 0 && (
                <p className="text-sm text-zinc-500 text-center py-4">No pending actions.</p>
              )}
            </div>
          </div>

          <div className="p-6 bg-zinc-900 border border-zinc-800 rounded-2xl flex flex-col">
            <h2 className="text-lg font-bold text-white mb-4">Recent Procurement</h2>
            <div className="space-y-3">
              {stats.recentOrders.length === 0 ? (
                <p className="text-sm text-zinc-500 text-center py-4">No recent orders.</p>
              ) : (
                stats.recentOrders.map((order: any) => (
                  <div key={order.id} className="flex flex-col p-3 bg-zinc-950 rounded-xl border border-zinc-800">
                    <div className="flex justify-between items-start mb-1">
                      <span className="text-sm font-bold text-white">#LO-{order.id.toString().slice(-4)}</span>
                      <span className="text-xs text-zinc-400">{format(new Date(order.created_at), 'MMM dd')}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-zinc-400">{order.customer_name || 'Customer'}</span>
                      <div className="flex gap-2">
                        <span className="px-2 py-0.5 rounded text-[10px] uppercase font-bold bg-zinc-800 text-zinc-300">
                          {order.order_status?.replace('_', ' ')}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
          <div className="p-6 bg-zinc-900 border border-zinc-800 rounded-2xl flex flex-col">
            <h2 className="text-lg font-bold text-white mb-4">Activity Log</h2>
            <div className="space-y-3">
              <p className="text-sm text-zinc-500 text-center py-4">No recent activity.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
