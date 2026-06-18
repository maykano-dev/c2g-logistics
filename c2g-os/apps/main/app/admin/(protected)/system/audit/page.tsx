'use client';

import { ShieldCheck, Search, Filter, Terminal, Activity, AlertTriangle, Key, Trash2, Edit, LogIn } from 'lucide-react';
import { format } from 'date-fns';

export default function AuditLogsView() {
  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-7xl mx-auto pb-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-3">
            <ShieldCheck className="w-6 h-6 text-indigo-500" /> System Audit Logs
          </h1>
          <p className="text-zinc-400 mt-1">Immutable record of all administrator actions, mutations, and security events.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-xl flex items-center gap-4">
           <div className="p-3 bg-indigo-500/10 rounded-lg text-indigo-500"><Activity className="w-6 h-6"/></div>
           <div>
             <p className="text-xs text-zinc-500 uppercase font-bold tracking-widest mb-1">Total Events (24h)</p>
             <p className="text-2xl font-black text-white">1,402</p>
           </div>
        </div>
        <div className="bg-zinc-900 border border-amber-500/30 p-4 rounded-xl flex items-center gap-4">
           <div className="p-3 bg-amber-500/10 rounded-lg text-amber-500"><AlertTriangle className="w-6 h-6"/></div>
           <div>
             <p className="text-xs text-amber-500 uppercase font-bold tracking-widest mb-1">Failed Logins</p>
             <p className="text-2xl font-black text-white">14</p>
           </div>
        </div>
        <div className="bg-zinc-900 border border-red-500/30 p-4 rounded-xl flex items-center gap-4">
           <div className="p-3 bg-red-500/10 rounded-lg text-red-500"><Trash2 className="w-6 h-6"/></div>
           <div>
             <p className="text-xs text-red-500 uppercase font-bold tracking-widest mb-1">Destructive Actions</p>
             <p className="text-2xl font-black text-white">3</p>
           </div>
        </div>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden flex flex-col h-[600px]">
        <div className="p-4 border-b border-zinc-800 flex justify-between items-center bg-zinc-950/50">
           <div className="flex items-center gap-3">
             <Terminal className="w-5 h-5 text-zinc-500" />
             <h2 className="text-sm font-bold text-white uppercase tracking-widest">Event Stream</h2>
           </div>
           <div className="flex gap-2">
             <div className="relative">
               <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
               <input type="text" placeholder="Filter logs..." className="h-8 bg-zinc-900 border border-zinc-700 rounded-lg pl-9 pr-3 text-xs text-white focus:border-indigo-500 focus:outline-none" />
             </div>
             <button className="p-2 border border-zinc-700 text-zinc-400 hover:text-white rounded-lg"><Filter className="w-4 h-4"/></button>
           </div>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 bg-[#0c0c0e] font-mono text-xs">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-zinc-500 border-b border-zinc-800/50">
                <th className="pb-2 font-normal">Timestamp</th>
                <th className="pb-2 font-normal">Actor</th>
                <th className="pb-2 font-normal">Action</th>
                <th className="pb-2 font-normal">Target</th>
                <th className="pb-2 font-normal">IP Address</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/30 text-zinc-400">
              {[
                { time: new Date().toISOString(), actor: 'admin@c2g.com', type: 'UPDATE', icon: Edit, target: 'orders [id=9021]', ip: '192.168.1.1' },
                { time: new Date(Date.now() - 5000).toISOString(), actor: 'finance@c2g.com', type: 'APPROVE', icon: ShieldCheck, target: 'withdrawals [id=44]', ip: '10.0.0.8' },
                { time: new Date(Date.now() - 15000).toISOString(), actor: 'system', type: 'DELETE', icon: Trash2, target: 'expired_sessions', ip: '127.0.0.1' },
                { time: new Date(Date.now() - 45000).toISOString(), actor: 'qc@c2g.com', type: 'LOGIN_SUCCESS', icon: LogIn, target: 'auth', ip: '192.168.1.45' },
                { time: new Date(Date.now() - 60000).toISOString(), actor: 'unknown', type: 'LOGIN_FAILED', icon: Key, target: 'auth', ip: '142.250.190.46' },
                { time: new Date(Date.now() - 120000).toISOString(), actor: 'admin@c2g.com', type: 'UPDATE', icon: Edit, target: 'products [sku=A99]', ip: '192.168.1.1' },
              ].map((log, i) => (
                <tr key={i} className="hover:bg-zinc-800/20 transition-colors">
                  <td className="py-3 text-zinc-500">{format(new Date(log.time), 'yyyy-MM-dd HH:mm:ss')}</td>
                  <td className="py-3 text-indigo-400">{log.actor}</td>
                  <td className="py-3">
                    <span className={`px-2 py-0.5 rounded border flex items-center gap-1 w-fit ${
                      log.type === 'DELETE' ? 'text-red-400 border-red-500/20 bg-red-500/10' :
                      log.type.includes('FAILED') ? 'text-amber-400 border-amber-500/20 bg-amber-500/10' :
                      'text-emerald-400 border-emerald-500/20 bg-emerald-500/10'
                    }`}>
                      <log.icon className="w-3 h-3" /> {log.type}
                    </span>
                  </td>
                  <td className="py-3 text-zinc-300">{log.target}</td>
                  <td className="py-3 text-zinc-600">{log.ip}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
