'use client';

import { MapPin, Truck, Box, Navigation, CheckCircle2, AlertTriangle, Users } from 'lucide-react';

export default function GhanaOpsView() {
  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-7xl mx-auto pb-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-3">
            <MapPin className="w-6 h-6 text-indigo-500" /> Ghana Last-Mile Operations
          </h1>
          <p className="text-zinc-400 mt-1">Manage local dispatches, Accra delivery zones, and driver assignments.</p>
        </div>
        <button className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-indigo-900/20 transition-all flex items-center gap-2">
          <Truck className="w-4 h-4" /> Assign New Dispatch
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-xl flex items-center gap-4">
           <div className="p-3 bg-blue-500/10 rounded-lg text-blue-500"><Box className="w-6 h-6"/></div>
           <div>
             <p className="text-xs text-zinc-500 uppercase font-bold tracking-widest mb-1">Pending Delivery</p>
             <p className="text-2xl font-black text-white">124</p>
           </div>
        </div>
        <div className="bg-zinc-900 border border-indigo-500/30 p-4 rounded-xl flex items-center gap-4">
           <div className="p-3 bg-indigo-500/10 rounded-lg text-indigo-500"><Truck className="w-6 h-6"/></div>
           <div>
             <p className="text-xs text-indigo-500 uppercase font-bold tracking-widest mb-1">Active Drivers</p>
             <p className="text-2xl font-black text-white">8 <span className="text-xs text-zinc-500 font-normal">/ 12</span></p>
           </div>
        </div>
        <div className="bg-zinc-900 border border-emerald-500/30 p-4 rounded-xl flex items-center gap-4">
           <div className="p-3 bg-emerald-500/10 rounded-lg text-emerald-500"><CheckCircle2 className="w-6 h-6"/></div>
           <div>
             <p className="text-xs text-emerald-500 uppercase font-bold tracking-widest mb-1">Delivered Today</p>
             <p className="text-2xl font-black text-white">45</p>
           </div>
        </div>
        <div className="bg-zinc-900 border border-amber-500/30 p-4 rounded-xl flex items-center gap-4">
           <div className="p-3 bg-amber-500/10 rounded-lg text-amber-500"><AlertTriangle className="w-6 h-6"/></div>
           <div>
             <p className="text-xs text-amber-500 uppercase font-bold tracking-widest mb-1">Failed Attempts</p>
             <p className="text-2xl font-black text-white">3</p>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden min-h-[500px] relative">
           <div className="absolute inset-0 flex items-center justify-center flex-col text-zinc-500 bg-zinc-950/50 backdrop-blur-[2px] z-10">
              <Navigation className="w-12 h-12 mb-4 opacity-50" />
              <p className="font-bold">Live Dispatch Map Visualization</p>
              <p className="text-xs mt-2">Connects to driver GPS module</p>
           </div>
           {/* Fallback pattern for map */}
           <div className="w-full h-full opacity-10 bg-[radial-gradient(#4f46e5_1px,transparent_1px)] [background-size:16px_16px]"></div>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 flex flex-col">
           <h2 className="text-sm font-bold uppercase tracking-widest text-white mb-4">Active Dispatch Queue</h2>
           <div className="space-y-4 flex-1 overflow-y-auto">
             {[1,2,3,4,5].map(i => (
               <div key={i} className="p-3 bg-zinc-950/50 border border-zinc-800/50 rounded-xl hover:border-indigo-500/30 transition-colors cursor-pointer group">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-xs font-bold text-indigo-400">Driver {i}</span>
                    <span className="text-[10px] text-zinc-500">20 mins ago</span>
                  </div>
                  <p className="text-sm text-zinc-300 font-medium">Route: East Legon → Madina</p>
                  <p className="text-xs text-zinc-500 mt-1">Carrying 14 packages</p>
                  <div className="mt-3 w-full bg-zinc-800 rounded-full h-1.5 overflow-hidden">
                    <div className="bg-indigo-500 h-full rounded-full" style={{ width: `${Math.random() * 80 + 10}%` }}></div>
                  </div>
               </div>
             ))}
           </div>
        </div>
      </div>
    </div>
  );
}
