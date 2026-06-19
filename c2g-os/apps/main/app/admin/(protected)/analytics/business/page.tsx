'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { BarChart3, TrendingUp, Users, PackageOpen, CreditCard, ArrowUpRight, ArrowDownRight, Target } from 'lucide-react';

export default function AnalyticsOverview() {
  const [stats, setStats] = useState({
    totalRevenue: 0,
    customers: 0,
    packages: 0,
    savings: 0,
    mallRevenue: 0,
    shippingRevenue: 0,
    wholesaleRevenue: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      const supabase = createClient();
      setLoading(true);

      const [
        { data: ecomOrders },
        { data: orders },
        { data: customersCount }
      ] = await Promise.all([
        supabase.from('ecom_orders').select('total_amount'),
        supabase.from('orders').select('total'),
        supabase.from('customers').select('id', { count: 'exact', head: true })
      ]);

      let mallRev = 0;
      if (ecomOrders) {
        mallRev = ecomOrders.reduce((sum, order) => sum + (Number(order.total_amount) || 0), 0);
      }

      let procRev = 0;
      if (orders) {
        procRev = orders.reduce((sum, order) => sum + (Number(order.total) || 0), 0);
      }

      setStats({
        totalRevenue: mallRev + procRev,
        customers: customersCount?.count || 0,
        packages: 1204, // Placeholder until package stats are defined
        savings: 4200,  // Placeholder
        mallRevenue: mallRev,
        shippingRevenue: procRev * 0.4, // Estimated
        wholesaleRevenue: procRev * 0.1 // Estimated
      });
      setLoading(false);
    }
    fetchStats();
  }, []);
  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-10">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-3">
            <BarChart3 className="w-6 h-6 text-indigo-500" /> Business Analytics
          </h1>
          <p className="text-zinc-400 mt-1">High-level read-only overview of revenue, operations, and growth.</p>
        </div>
        <div className="flex gap-2">
          <select className="bg-zinc-900 border border-zinc-800 text-white text-sm font-bold rounded-xl px-4 py-2 focus:outline-none focus:border-indigo-500">
            <option>Last 7 Days</option>
            <option>Last 30 Days</option>
            <option>This Quarter</option>
            <option>Year to Date</option>
          </select>
        </div>
      </div>

      {/* Top Level KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Revenue', value: `₵${stats.totalRevenue.toLocaleString(undefined, {minimumFractionDigits: 2})}`, trend: '+14.2%', up: true, icon: TrendingUp, color: 'text-emerald-500' },
          { label: 'Active Customers', value: stats.customers.toLocaleString(), trend: '+5.4%', up: true, icon: Users, color: 'text-indigo-500' },
          { label: 'Packages Delivered', value: stats.packages.toLocaleString(), trend: '-2.1%', up: false, icon: PackageOpen, color: 'text-amber-500' },
          { label: 'Procurement Savings', value: `¥${stats.savings.toLocaleString()}`, trend: '+18.9%', up: true, icon: CreditCard, color: 'text-fuchsia-500' },
        ].map((kpi, i) => (
          <div key={i} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
            <div className="flex justify-between items-start mb-4">
              <div className={`p-2 rounded-lg bg-zinc-950 ${kpi.color}`}>
                <kpi.icon className="w-5 h-5" />
              </div>
              <div className={`flex items-center gap-1 text-xs font-bold ${kpi.up ? 'text-emerald-500' : 'text-red-500'}`}>
                {kpi.up ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                {kpi.trend}
              </div>
            </div>
            <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-1">{kpi.label}</p>
            <h3 className="text-2xl font-black text-white">{kpi.value}</h3>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Revenue by Channel */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
          <h2 className="text-sm font-bold uppercase tracking-widest text-zinc-500 mb-6">Revenue Breakdown</h2>
          
          <div className="space-y-6">
            {[
              { channel: 'C2G Mall Sales', amount: `₵${stats.mallRevenue.toLocaleString(undefined, {minimumFractionDigits: 2})}`, pct: (stats.mallRevenue / Math.max(stats.totalRevenue, 1)) * 100, color: 'bg-indigo-500' },
              { channel: 'Shipping Fees (Air & Sea)', amount: `₵${stats.shippingRevenue.toLocaleString(undefined, {minimumFractionDigits: 2})}`, pct: (stats.shippingRevenue / Math.max(stats.totalRevenue, 1)) * 100, color: 'bg-emerald-500' },
              { channel: 'Importer Wholesale', amount: `₵${stats.wholesaleRevenue.toLocaleString(undefined, {minimumFractionDigits: 2})}`, pct: (stats.wholesaleRevenue / Math.max(stats.totalRevenue, 1)) * 100, color: 'bg-amber-500' },
            ].map((item, i) => (
              <div key={i}>
                <div className="flex justify-between items-end mb-2">
                  <span className="text-sm font-bold text-white">{item.channel}</span>
                  <span className="text-sm font-mono text-zinc-400">{item.amount}</span>
                </div>
                <div className="w-full bg-zinc-950 rounded-full h-2 overflow-hidden border border-zinc-800">
                  <div className={`h-full ${item.color} rounded-full`} style={{ width: `${item.pct}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Operational Performance */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
          <h2 className="text-sm font-bold uppercase tracking-widest text-zinc-500 mb-6 flex items-center gap-2">
            <Target className="w-4 h-4" /> Operations Health
          </h2>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4 text-center">
              <p className="text-3xl font-black text-white mb-1">1.4 <span className="text-sm text-zinc-500">Days</span></p>
              <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Avg Procurement Time</p>
            </div>
            <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4 text-center">
              <p className="text-3xl font-black text-emerald-500 mb-1">98.2%</p>
              <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Scanner Match Rate</p>
            </div>
            <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4 text-center">
              <p className="text-3xl font-black text-white mb-1">2.1 <span className="text-sm text-zinc-500">Hours</span></p>
              <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Ticket Resolution Time</p>
            </div>
            <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4 text-center">
              <p className="text-3xl font-black text-red-500 mb-1">4.5%</p>
              <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Issue Escalation Rate</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
