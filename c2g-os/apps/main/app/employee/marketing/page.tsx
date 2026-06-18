'use client';

import { Megaphone, Users, Search, LayoutTemplate, Send, BarChart2, MessageSquare, Plus, ArrowRight } from 'lucide-react';
import { useState } from 'react';

export default function MarketingDashboardView() {
  const [activeTab, setActiveTab] = useState<'campaigns' | 'search' | 'segments' | 'cms'>('campaigns');

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-in fade-in duration-500 pb-10">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-3">
            <Megaphone className="w-6 h-6 text-fuchsia-500" /> Growth & Marketing
          </h1>
          <p className="text-zinc-400 mt-1">Manage campaigns, analyze search intent, and control homepage content.</p>
        </div>
        <div className="flex bg-zinc-900 border border-zinc-800 rounded-xl p-1">
          {['campaigns', 'search', 'segments', 'cms'].map((tab) => (
            <button 
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`px-4 py-2 rounded-lg text-sm font-bold capitalize transition-all ${activeTab === tab ? 'bg-zinc-800 text-white shadow-sm' : 'text-zinc-500 hover:text-zinc-300'}`}
            >
              {tab.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {activeTab === 'campaigns' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-in fade-in">
          
          {/* Campaign List */}
          <div className="lg:col-span-5 bg-zinc-900 border border-zinc-800 rounded-2xl flex flex-col h-[700px] overflow-hidden">
            <div className="p-4 border-b border-zinc-800 bg-zinc-950/50 flex justify-between items-center">
              <h2 className="text-xs font-bold uppercase tracking-widest text-zinc-500">Recent Campaigns</h2>
              <button className="text-fuchsia-400 hover:text-fuchsia-300 text-sm font-bold flex items-center gap-1 transition-colors">
                <Plus className="w-4 h-4" /> New Campaign
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
               {[
                 { title: 'Sea Freight Sale - 15% Off', type: 'Email + Push', status: 'sent', date: 'Yesterday' },
                 { title: 'Win-back: 60 Days Inactive', type: 'Email', status: 'active', date: 'Ongoing' },
                 { title: 'New Importer Onboarding', type: 'WhatsApp', status: 'draft', date: '-' },
               ].map((c, i) => (
                 <div key={i} className="p-4 bg-zinc-950/50 border border-zinc-800/50 rounded-xl hover:border-fuchsia-500/50 transition-all cursor-pointer group">
                   <div className="flex justify-between items-start mb-2">
                     <h3 className="text-white font-bold text-sm group-hover:text-fuchsia-400 transition-colors">{c.title}</h3>
                     <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded ${
                       c.status === 'sent' ? 'bg-emerald-500/10 text-emerald-500' :
                       c.status === 'active' ? 'bg-fuchsia-500/10 text-fuchsia-500' :
                       'bg-zinc-800 text-zinc-400'
                     }`}>
                       {c.status}
                     </span>
                   </div>
                   <div className="flex justify-between items-center text-xs text-zinc-500">
                     <span>{c.type}</span>
                     <span>{c.date}</span>
                   </div>
                 </div>
               ))}
            </div>
          </div>

          {/* Campaign Performance Analytics */}
          <div className="lg:col-span-7 bg-zinc-900 border border-zinc-800 rounded-2xl flex flex-col h-[700px] overflow-hidden">
            <div className="p-6 border-b border-zinc-800 bg-zinc-950/50">
              <span className="px-2 py-1 bg-emerald-500/20 text-emerald-500 text-xs font-bold uppercase tracking-widest rounded mb-2 inline-block">Sent Yesterday</span>
              <h2 className="text-2xl font-bold text-white mb-1">Sea Freight Sale - 15% Off</h2>
              <p className="text-zinc-400 text-sm">Audience: All customers with packages in transit (847 users)</p>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-8">
              
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-zinc-950 border border-zinc-800 p-5 rounded-xl">
                  <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-1">Delivery</p>
                  <p className="text-2xl font-black text-white">97.2%</p>
                  <p className="text-xs text-zinc-400 mt-1">823 / 847 sent</p>
                </div>
                <div className="bg-zinc-950 border border-zinc-800 p-5 rounded-xl">
                  <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-1">Open Rate</p>
                  <p className="text-2xl font-black text-white">36.8%</p>
                  <p className="text-xs text-zinc-400 mt-1">312 opens</p>
                </div>
                <div className="bg-zinc-950 border border-zinc-800 p-5 rounded-xl">
                  <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-1">Click Rate</p>
                  <p className="text-2xl font-black text-white">10.5%</p>
                  <p className="text-xs text-zinc-400 mt-1">89 clicks</p>
                </div>
              </div>

              <div className="bg-fuchsia-500/5 border border-fuchsia-500/20 p-6 rounded-2xl relative overflow-hidden">
                <BarChart2 className="absolute -right-4 -bottom-4 w-32 h-32 text-fuchsia-500/10" />
                <h3 className="text-sm font-bold uppercase tracking-widest text-fuchsia-500 mb-4 relative z-10">Attributed Conversion (48h)</h3>
                
                <div className="grid grid-cols-2 gap-8 relative z-10">
                  <div>
                    <p className="text-zinc-400 text-sm mb-1">Orders Placed</p>
                    <p className="text-3xl font-black text-white">34</p>
                  </div>
                  <div>
                    <p className="text-zinc-400 text-sm mb-1">Revenue Generated</p>
                    <p className="text-3xl font-black text-white">₵12,450</p>
                  </div>
                </div>
              </div>

            </div>
          </div>

        </div>
      )}

      {activeTab === 'search' && (
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden animate-in fade-in">
          <div className="p-6 border-b border-zinc-800 bg-zinc-950/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Search className="w-5 h-5 text-indigo-500" /> Search Intelligence
              </h2>
              <p className="text-zinc-400 text-sm mt-1">Turn missed customer searches into new product listings.</p>
            </div>
            <button className="bg-zinc-800 hover:bg-zinc-700 text-white px-4 py-2 rounded-xl text-sm font-bold transition-colors">
              Export 30-Day Logs
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-zinc-400">
              <thead className="text-xs uppercase bg-zinc-950/50 text-zinc-500 border-b border-zinc-800">
                <tr>
                  <th className="px-6 py-4 font-bold tracking-widest">Search Term</th>
                  <th className="px-6 py-4 font-bold tracking-widest">Volume (7D)</th>
                  <th className="px-6 py-4 font-bold tracking-widest">Products Matched</th>
                  <th className="px-6 py-4 font-bold tracking-widest">Conversion</th>
                  <th className="px-6 py-4 font-bold tracking-widest">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/50">
                {[
                  { term: '"waist trainer"', volume: 189, matches: 0, conv: '0%', alert: true },
                  { term: '"xiaomi air fryer"', volume: 234, matches: 12, conv: '8%', alert: false },
                  { term: '"gaming chair"', volume: 156, matches: 3, conv: '2%', alert: false },
                  { term: '"ps5 controller"', volume: 92, matches: 0, conv: '0%', alert: true },
                ].map((row, i) => (
                  <tr key={i} className="hover:bg-zinc-800/20 transition-colors group">
                    <td className="px-6 py-4 font-bold text-white">
                      {row.term}
                      {row.alert && <span className="ml-2 inline-block px-2 py-0.5 bg-amber-500/20 text-amber-500 text-[10px] uppercase tracking-wider rounded">Opportunity</span>}
                    </td>
                    <td className="px-6 py-4 font-mono">{row.volume}</td>
                    <td className={`px-6 py-4 font-mono font-bold ${row.matches === 0 ? 'text-red-400' : 'text-zinc-400'}`}>{row.matches}</td>
                    <td className="px-6 py-4 font-mono">{row.conv}</td>
                    <td className="px-6 py-4">
                      {row.matches === 0 ? (
                        <button className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold transition-colors">
                          <Plus className="w-3 h-3" /> Request Sourcing
                        </button>
                      ) : (
                        <button className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg text-xs font-bold transition-colors">
                          <Megaphone className="w-3 h-3" /> Create Promo
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
}
