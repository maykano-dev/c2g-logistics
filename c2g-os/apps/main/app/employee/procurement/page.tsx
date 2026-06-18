'use client';

import { DollarSign, Search, Filter, AlertTriangle, ArrowUpRight, CheckCircle2, Link2, MessageSquare } from 'lucide-react';
import { useState } from 'react';

export default function ProcurementPipelineView() {
  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-in fade-in duration-500 pb-10">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-3">
            <DollarSign className="w-6 h-6 text-indigo-500" /> Procurement Pipeline
          </h1>
          <p className="text-zinc-400 mt-1">Source, purchase, and verify pricing for C2G Mall and Link orders.</p>
        </div>
      </div>

      {/* Analytics Mini-cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Unassigned', value: '7', color: 'text-amber-500', alert: true },
          { label: 'My Queue', value: '12', color: 'text-indigo-400' },
          { label: 'Purchased Today', value: '34', color: 'text-emerald-500' },
          { label: 'Issues Raised', value: '2', color: 'text-red-500', alert: true },
        ].map((stat, i) => (
          <div key={i} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
            <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest">{stat.label}</p>
            <div className="mt-2 flex items-center justify-between">
              <p className={`text-3xl font-black ${stat.color}`}>{stat.value}</p>
              {stat.alert && <AlertTriangle className={`w-5 h-5 ${stat.color}`} />}
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* The Procurement Queue */}
        <div className="lg:col-span-5 bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden flex flex-col h-[700px]">
          <div className="p-4 border-b border-zinc-800 bg-zinc-950/50 flex gap-2">
            <button className="px-3 py-1.5 bg-zinc-800 text-white rounded-lg text-xs font-bold w-full">My Assigned (12)</button>
            <button className="px-3 py-1.5 bg-transparent text-zinc-500 hover:text-white rounded-lg text-xs font-bold w-full">Unassigned (7)</button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-2 space-y-2">
            {[
              { id: 'ORD-1042', item: 'Nike Air Max Pro', price: '₵450.00', platform: '1688', age: 3, urgency: 'red' },
              { id: 'ORD-1089', item: 'Xiaomi Air Fryer', price: '₵1,200.00', platform: 'Taobao', age: 2, urgency: 'amber' },
              { id: 'ORD-1103', item: 'Leather Sofa Set', price: '₵8,500.00', platform: 'Alibaba', age: 0, urgency: 'green' },
              { id: 'ORD-1104', item: 'iPhone 15 Case x50', price: '₵250.00', platform: '1688', age: 0, urgency: 'green' },
            ].map((order, i) => (
              <div key={i} className={`p-4 border rounded-xl hover:bg-zinc-800/30 transition-all cursor-pointer ${
                order.urgency === 'red' ? 'bg-red-500/5 border-red-500/20' : 
                order.urgency === 'amber' ? 'bg-amber-500/5 border-amber-500/20' : 
                'bg-zinc-950/50 border-zinc-800/50 hover:border-indigo-500/50'
              }`}>
                <div className="flex justify-between items-start mb-2">
                  <span className="font-mono font-bold text-white text-sm">{order.id}</span>
                  <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded ${
                    order.urgency === 'red' ? 'bg-red-500/20 text-red-500' : 
                    order.urgency === 'amber' ? 'bg-amber-500/20 text-amber-500' : 
                    'bg-zinc-800 text-zinc-400'
                  }`}>
                    {order.age} Days Old
                  </span>
                </div>
                <p className="text-sm text-zinc-300 font-bold mb-3">{order.item}</p>
                <div className="flex justify-between items-center text-xs text-zinc-500">
                  <span className="flex items-center gap-1 font-bold text-indigo-400"><DollarSign className="w-3 h-3"/> {order.price}</span>
                  <span className="uppercase tracking-wider">{order.platform}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Purchase Workflow Pane */}
        <div className="lg:col-span-7 bg-zinc-900 border border-zinc-800 rounded-2xl flex flex-col h-[700px]">
          <div className="p-6 border-b border-zinc-800 bg-zinc-950/50 flex justify-between items-center">
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">Order #1042</h2>
              <p className="text-zinc-500 text-sm mt-1">Customer: Kwame Mensah (C2G-8911)</p>
            </div>
            <button className="bg-indigo-600/10 text-indigo-500 hover:bg-indigo-600 hover:text-white px-4 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-2">
              <Link2 className="w-4 h-4" /> Open Supplier Link
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            
            {/* Product Details */}
            <div>
              <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-500 mb-3">Product Requirements</h3>
              <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4">
                <p className="text-lg font-bold text-white mb-2">Nike Air Max Pro (Size 42)</p>
                <div className="flex items-start gap-2 text-sm text-zinc-400 bg-amber-500/5 p-3 rounded-lg border border-amber-500/10 mt-3">
                  <MessageSquare className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                  <p><strong>Customer Note:</strong> Please ensure it comes in the original box and is strictly the black and white colorway.</p>
                </div>
              </div>
            </div>

            {/* Financial Variance Tracker */}
            <div>
              <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-500 mb-3 flex items-center gap-2">
                <DollarSign className="w-4 h-4" /> Price Verification
              </h3>
              <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-5">
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div>
                    <p className="text-xs text-zinc-500 font-bold mb-1">Customer Paid</p>
                    <p className="text-xl font-bold text-white">₵450.00</p>
                  </div>
                  <div>
                    <p className="text-xs text-zinc-500 font-bold mb-1">Expected Supplier Price (¥)</p>
                    <p className="text-xl font-bold text-zinc-300">¥ 810.00</p>
                  </div>
                  <div>
                    <p className="text-xs text-zinc-500 font-bold mb-1">Exchange Rate</p>
                    <p className="text-xl font-bold text-zinc-500">1.8</p>
                  </div>
                </div>

                <div className="border-t border-zinc-800 pt-6">
                  <label className="block text-sm font-bold text-white mb-2">Actual Purchase Amount (Yuan)</label>
                  <div className="flex items-center gap-4">
                    <div className="relative flex-1">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 font-bold text-lg">¥</span>
                      <input 
                        type="number" 
                        defaultValue="800"
                        className="w-full bg-zinc-900 border border-zinc-700 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-xl px-10 py-3 text-white font-mono text-lg transition-colors"
                      />
                    </div>
                    <div className="px-4 py-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 rounded-xl flex items-center gap-2">
                      <ArrowUpRight className="w-5 h-5" /> 
                      <div className="flex flex-col">
                        <span className="text-xs font-bold uppercase">Variance Saved</span>
                        <span className="font-mono font-bold text-lg">+ ¥10.00</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Tracking Input */}
            <div>
              <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-500 mb-3">Supplier Fulfillment</h3>
              <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-5 space-y-4">
                <div>
                  <label className="block text-sm font-bold text-zinc-400 mb-2">Supplier Order Number (Platform ID)</label>
                  <input type="text" placeholder="e.g. TB-8923190" className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-2 text-white" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-zinc-400 mb-2">Tracking Number (If shipped immediately)</label>
                  <input type="text" placeholder="e.g. YT89938221" className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-2 text-white" />
                </div>
              </div>
            </div>

          </div>
          
          <div className="p-4 border-t border-zinc-800 bg-zinc-950 flex gap-3">
             <button className="flex-1 py-3 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-xl font-bold transition-colors">
               Raise Issue
             </button>
             <button className="flex-1 py-3 bg-zinc-800 text-white hover:bg-zinc-700 rounded-xl font-bold transition-colors">
               Save Progress
             </button>
             <button className="flex-[2] py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-colors">
               <CheckCircle2 className="w-5 h-5" /> Mark as Purchased
             </button>
          </div>
        </div>

      </div>
    </div>
  );
}
