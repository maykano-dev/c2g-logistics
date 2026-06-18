'use client';

import { Activity, Server, Database, Globe, RefreshCw, AlertTriangle, CheckCircle2, TerminalSquare, ShieldAlert, GitBranch, Power } from 'lucide-react';

export default function TechDashboardView() {
  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-10">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-3">
            <TerminalSquare className="w-6 h-6 text-indigo-500" /> IT & Systems Diagnostics
          </h1>
          <p className="text-zinc-400 mt-1">Monitor webhooks, scanner uptime, deployments, and security logs.</p>
        </div>
        <div className="flex gap-3">
          <button className="bg-red-500/10 hover:bg-red-500/20 text-red-500 px-4 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-2">
            <Power className="w-4 h-4" /> Global Maintenance Mode
          </button>
        </div>
      </div>

      {/* Global System Health Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { name: 'Database (Supabase)', status: 'Healthy', ping: '12ms', icon: Database, color: 'text-emerald-500' },
          { name: 'App Edge (Vercel)', status: 'Healthy', ping: '8ms', icon: Globe, color: 'text-emerald-500' },
          { name: 'Hubtel API', status: 'Degraded', ping: '450ms', icon: Server, color: 'text-amber-500' },
          { name: 'China Scanner', status: 'Offline', ping: 'Timeout', icon: Activity, color: 'text-red-500' },
        ].map((sys, i) => (
          <div key={i} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 flex flex-col justify-between h-32">
            <div className="flex justify-between items-start">
              <sys.icon className={`w-6 h-6 ${sys.color}`} />
              <span className="text-[10px] font-mono text-zinc-500">{sys.ping}</span>
            </div>
            <div>
              <p className="text-white font-bold text-sm">{sys.name}</p>
              <p className={`text-xs font-bold uppercase tracking-widest mt-1 ${sys.color}`}>{sys.status}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Webhook & Error Monitor */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden flex flex-col h-[500px]">
          <div className="p-4 border-b border-zinc-800 bg-zinc-950/50 flex justify-between items-center">
            <h2 className="text-xs font-bold uppercase tracking-widest text-zinc-500 flex items-center gap-2">
              <RefreshCw className="w-4 h-4" /> Hubtel Webhook Log
            </h2>
          </div>
          
          <div className="flex-1 overflow-y-auto p-2 space-y-2">
             {[
               { id: 'wh_912389', ref: 'C2G-ORD-1042', status: 'success', time: '10 mins ago', error: null },
               { id: 'wh_912390', ref: 'C2G-MALL-891', status: 'failed', time: '25 mins ago', error: '500 Internal Server Error' },
               { id: 'wh_912391', ref: 'Unknown_Ref', status: 'unrecognized', time: '1 hour ago', error: 'Reference not found in DB' },
             ].map((log, i) => (
               <div key={i} className="p-4 bg-zinc-950/50 border border-zinc-800/50 rounded-xl">
                 <div className="flex justify-between items-start mb-2">
                   <span className="font-mono font-bold text-white text-xs">{log.id}</span>
                   <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest ${
                     log.status === 'success' ? 'bg-emerald-500/10 text-emerald-500' :
                     log.status === 'failed' ? 'bg-red-500/10 text-red-500' :
                     'bg-amber-500/10 text-amber-500'
                   }`}>
                     {log.status}
                   </span>
                 </div>
                 <div className="flex justify-between items-end">
                   <div>
                     <p className="text-sm text-zinc-300 font-mono mb-1">Payload: {log.ref}</p>
                     {log.error && <p className="text-xs text-red-400 font-mono">{log.error}</p>}
                   </div>
                   {log.status === 'failed' && (
                     <button className="bg-zinc-800 hover:bg-zinc-700 text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center gap-2">
                       <RefreshCw className="w-3 h-3" /> Retry
                     </button>
                   )}
                 </div>
               </div>
             ))}
          </div>
        </div>

        {/* Security & Deployment */}
        <div className="space-y-6">
          
          {/* Active Deployments */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
            <div className="p-4 border-b border-zinc-800 bg-zinc-950/50">
              <h2 className="text-xs font-bold uppercase tracking-widest text-zinc-500 flex items-center gap-2">
                <GitBranch className="w-4 h-4" /> Production Release
              </h2>
            </div>
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-bold text-white">v2.1.0 - Phase 5 Complete</h3>
                  <p className="text-zinc-500 text-sm mt-1">Deployed via Vercel • 14 June 2026, 14:32 GMT</p>
                </div>
                <span className="bg-emerald-500/20 text-emerald-500 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest">Active</span>
              </div>
              <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4 mb-4 font-mono text-xs text-zinc-400">
                commit: 9f8a2b1c<br/>
                Merge pull request #42 from maykano/enterprise-dashboards
              </div>
              <button className="w-full bg-zinc-800 hover:bg-zinc-700 text-white py-2 rounded-xl text-sm font-bold transition-colors">
                Rollback to Previous Version
              </button>
            </div>
          </div>

          {/* Security Log */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
            <div className="p-4 border-b border-zinc-800 bg-zinc-950/50">
              <h2 className="text-xs font-bold uppercase tracking-widest text-zinc-500 flex items-center gap-2">
                <ShieldAlert className="w-4 h-4" /> Suspicious Activity Alerts
              </h2>
            </div>
            <div className="p-4 space-y-3">
              <div className="flex items-center justify-between p-3 bg-red-500/5 border border-red-500/20 rounded-xl">
                <div>
                  <p className="text-sm font-bold text-white">Multiple Failed Logins</p>
                  <p className="text-xs text-red-400">IP: 192.168.1.45 (Unknown) • Target: Manager Acc</p>
                </div>
                <button className="text-xs font-bold text-red-500 bg-red-500/10 px-3 py-1.5 rounded-lg">Block IP</button>
              </div>
              <div className="flex items-center justify-between p-3 bg-amber-500/5 border border-amber-500/20 rounded-xl">
                <div>
                  <p className="text-sm font-bold text-white">Off-Hours Admin Action</p>
                  <p className="text-xs text-amber-400">User: Finance Officer • Action: Approve Withdrawal</p>
                </div>
                <span className="text-xs font-mono text-zinc-500">02:14 AM</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
