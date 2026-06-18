'use client';

import { DollarSign, TrendingUp, BarChart3, Download, Filter } from 'lucide-react';

export default function RevenueAnalyticsView() {
  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-7xl mx-auto pb-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-3">
            <DollarSign className="w-6 h-6 text-emerald-500" /> Revenue & Profitability
          </h1>
          <p className="text-zinc-400 mt-1">Deep dive into margin analysis, operational costs, and net revenue streams.</p>
        </div>
        <div className="flex gap-2">
          <select className="bg-zinc-900 border border-zinc-800 text-white text-sm rounded-xl px-4 py-2.5 focus:outline-none focus:border-indigo-500">
            <option>Last 30 Days</option>
            <option>This Quarter</option>
            <option>Year to Date</option>
            <option>All Time</option>
          </select>
          <button className="bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-white px-4 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2">
            <Download className="w-4 h-4" /> Export Report
          </button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-zinc-900 border border-zinc-800 p-5 rounded-2xl">
          <p className="text-xs text-zinc-500 uppercase font-bold tracking-widest mb-1">Gross Revenue (CNY)</p>
          <p className="text-3xl font-black text-white">¥1.2M</p>
          <p className="text-xs text-emerald-500 font-bold mt-2 flex items-center gap-1"><TrendingUp className="w-3 h-3"/> +8.4% vs last period</p>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 p-5 rounded-2xl">
          <p className="text-xs text-zinc-500 uppercase font-bold tracking-widest mb-1">Operating Costs (CNY)</p>
          <p className="text-3xl font-black text-white">¥845K</p>
          <p className="text-xs text-red-500 font-bold mt-2 flex items-center gap-1">Shipping, Clearing, Overheads</p>
        </div>
        <div className="bg-zinc-900 border border-emerald-500/30 p-5 rounded-2xl">
          <p className="text-xs text-emerald-500 uppercase font-bold tracking-widest mb-1">Net Profit (CNY)</p>
          <p className="text-3xl font-black text-white">¥355K</p>
          <p className="text-xs text-emerald-400 font-medium mt-2">Gross Margin: 29.5%</p>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 p-5 rounded-2xl">
          <p className="text-xs text-zinc-500 uppercase font-bold tracking-widest mb-1">Service Fees Collected</p>
          <p className="text-3xl font-black text-white">₵45,200</p>
          <p className="text-xs text-indigo-400 font-bold mt-2 flex items-center gap-1">From Procurement & Wallet</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart Area */}
        <div className="lg:col-span-2 bg-zinc-900 border border-zinc-800 rounded-2xl p-6 min-h-[400px] flex flex-col items-center justify-center relative">
          <BarChart3 className="w-16 h-16 text-zinc-800 mb-4" />
          <p className="text-zinc-500 font-medium">Revenue Chart Visualization</p>
          <p className="text-xs text-zinc-600 mt-1">Connects to Recharts library in production</p>
          
          <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between gap-2 h-48 opacity-20 pointer-events-none">
            {[40, 60, 35, 80, 50, 90, 70, 100, 45, 65, 85, 55].map((h, i) => (
              <div key={i} className="w-full bg-indigo-500 rounded-t-sm" style={{ height: `${h}%` }}></div>
            ))}
          </div>
        </div>

        {/* Revenue Streams Breakdown */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
          <h2 className="text-sm font-bold uppercase tracking-widest text-white mb-6">Revenue Streams</h2>
          
          <div className="space-y-6">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-zinc-300 font-medium">C2G Mall Sales</span>
                <span className="text-white font-bold">45%</span>
              </div>
              <div className="w-full bg-zinc-800 rounded-full h-2">
                <div className="bg-indigo-500 h-full rounded-full" style={{ width: '45%' }}></div>
              </div>
              <p className="text-xs text-zinc-500 mt-1">¥540,000</p>
            </div>
            
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-zinc-300 font-medium">Link Procurement (B4M)</span>
                <span className="text-white font-bold">35%</span>
              </div>
              <div className="w-full bg-zinc-800 rounded-full h-2">
                <div className="bg-emerald-500 h-full rounded-full" style={{ width: '35%' }}></div>
              </div>
              <p className="text-xs text-zinc-500 mt-1">¥420,000</p>
            </div>

            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-zinc-300 font-medium">Shipping Fees</span>
                <span className="text-white font-bold">15%</span>
              </div>
              <div className="w-full bg-zinc-800 rounded-full h-2">
                <div className="bg-amber-500 h-full rounded-full" style={{ width: '15%' }}></div>
              </div>
              <p className="text-xs text-zinc-500 mt-1">¥180,000</p>
            </div>

            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-zinc-300 font-medium">Wallet & Service Fees</span>
                <span className="text-white font-bold">5%</span>
              </div>
              <div className="w-full bg-zinc-800 rounded-full h-2">
                <div className="bg-purple-500 h-full rounded-full" style={{ width: '5%' }}></div>
              </div>
              <p className="text-xs text-zinc-500 mt-1">¥60,000</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
