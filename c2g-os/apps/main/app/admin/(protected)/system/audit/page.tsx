'use client';

import { useState, useEffect } from 'react';
import { ShieldCheck, Search, Filter, Terminal, Activity, AlertTriangle, Key, Trash2, Edit, LogIn, Database } from 'lucide-react';
import { format } from 'date-fns';
import { createClient } from '@/utils/supabase/client';

export default function AuditLogsView() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [stats, setStats] = useState({ total24h: 0, failedLogins: 0, destructive: 0 });

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    setLoading(true);
    const supabase = createClient();
    
    const { data, error } = await supabase
      .from('audit_logs')
      .select('*, admins(email, name)')
      .order('created_at', { ascending: false })
      .limit(100);

    if (data && !error) {
      setLogs(data);
      
      // Calculate basic stats for top cards
      const now = new Date();
      const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
      
      let failed = 0;
      let deleteCount = 0;
      let total24 = 0;

      data.forEach(log => {
        const logDate = new Date(log.created_at);
        if (logDate > twentyFourHoursAgo) total24++;
        if (log.action.includes('FAILED')) failed++;
        if (log.action.includes('DELETE') || log.action.includes('REMOVE')) deleteCount++;
      });

      setStats({ total24h: total24, failedLogins: failed, destructive: deleteCount });
    }
    setLoading(false);
  };

  const getActionIcon = (action: string) => {
    if (action.includes('DELETE') || action.includes('REMOVE')) return Trash2;
    if (action.includes('FAILED')) return Key;
    if (action.includes('LOGIN')) return LogIn;
    if (action.includes('UPDATE') || action.includes('EDIT')) return Edit;
    if (action.includes('APPROVE') || action.includes('VERIFY')) return ShieldCheck;
    return Database;
  };

  const filteredLogs = logs.filter(log => 
    log.action?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.entity_type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.admins?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.ip_address?.includes(searchTerm)
  );

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
             <p className="text-2xl font-black text-white">{stats.total24h}</p>
           </div>
        </div>
        <div className="bg-zinc-900 border border-amber-500/30 p-4 rounded-xl flex items-center gap-4">
           <div className="p-3 bg-amber-500/10 rounded-lg text-amber-500"><AlertTriangle className="w-6 h-6"/></div>
           <div>
             <p className="text-xs text-amber-500 uppercase font-bold tracking-widest mb-1">Failed Logins</p>
             <p className="text-2xl font-black text-white">{stats.failedLogins}</p>
           </div>
        </div>
        <div className="bg-zinc-900 border border-red-500/30 p-4 rounded-xl flex items-center gap-4">
           <div className="p-3 bg-red-500/10 rounded-lg text-red-500"><Trash2 className="w-6 h-6"/></div>
           <div>
             <p className="text-xs text-red-500 uppercase font-bold tracking-widest mb-1">Destructive Actions</p>
             <p className="text-2xl font-black text-white">{stats.destructive}</p>
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
               <input 
                 type="text" 
                 placeholder="Filter logs..." 
                 value={searchTerm}
                 onChange={(e) => setSearchTerm(e.target.value)}
                 className="h-8 bg-zinc-900 border border-zinc-700 rounded-lg pl-9 pr-3 text-xs text-white focus:border-indigo-500 focus:outline-none" 
               />
             </div>
             <button className="p-2 border border-zinc-700 text-zinc-400 hover:text-white rounded-lg"><Filter className="w-4 h-4"/></button>
           </div>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 bg-[#0c0c0e] font-mono text-xs">
          <div className="hidden md:block">
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
              {loading ? (
                <tr><td colSpan={5} className="py-8 text-center text-zinc-500">Loading audit stream...</td></tr>
              ) : filteredLogs.length === 0 ? (
                <tr><td colSpan={5} className="py-8 text-center text-zinc-500">No events found matching filter.</td></tr>
              ) : (
                filteredLogs.map((log) => {
                  const Icon = getActionIcon(log.action);
                  return (
                    <tr key={log.id} className="hover:bg-zinc-800/20 transition-colors">
                      <td className="py-3 text-zinc-500">{format(new Date(log.created_at), 'yyyy-MM-dd HH:mm:ss')}</td>
                      <td className="py-3 text-indigo-400">{log.admins?.name || log.admins?.email || log.user_id || 'System'}</td>
                      <td className="py-3">
                        <span className={`px-2 py-0.5 rounded border flex items-center gap-1 w-fit ${
                          log.action.includes('DELETE') ? 'text-red-400 border-red-500/20 bg-red-500/10' :
                          log.action.includes('FAILED') ? 'text-amber-400 border-amber-500/20 bg-amber-500/10' :
                          'text-emerald-400 border-emerald-500/20 bg-emerald-500/10'
                        }`}>
                          <Icon className="w-3 h-3" /> {log.action}
                        </span>
                      </td>
                      <td className="py-3 text-zinc-300">
                        {log.entity_type} {log.entity_id ? `[id=${log.entity_id}]` : ''}
                      </td>
                      <td className="py-3 text-zinc-600">{log.ip_address || '127.0.0.1'}</td>
                    </tr>
                  );
                })
              )}
            </tbody>
            </table>
          </div>

          {/* Mobile Card Layout */}
          <div className="md:hidden flex flex-col gap-3">
            {loading ? (
              <div className="py-8 text-center text-zinc-500">Loading audit stream...</div>
            ) : filteredLogs.length === 0 ? (
              <div className="py-8 text-center text-zinc-500">No events found matching filter.</div>
            ) : (
              filteredLogs.map((log) => {
                const Icon = getActionIcon(log.action);
                return (
                  <div key={log.id} className="p-3 bg-zinc-900/50 border border-zinc-800 rounded-xl hover:bg-zinc-800/50 transition-colors">
                    <div className="flex items-start justify-between mb-2">
                      <span className={`px-2 py-0.5 rounded border flex items-center gap-1 w-fit text-[10px] ${
                        log.action.includes('DELETE') ? 'text-red-400 border-red-500/20 bg-red-500/10' :
                        log.action.includes('FAILED') ? 'text-amber-400 border-amber-500/20 bg-amber-500/10' :
                        'text-emerald-400 border-emerald-500/20 bg-emerald-500/10'
                      }`}>
                        <Icon className="w-3 h-3" /> {log.action}
                      </span>
                      <span className="text-[10px] text-zinc-500">{format(new Date(log.created_at), 'yyyy-MM-dd HH:mm:ss')}</span>
                    </div>
                    
                    <div className="space-y-1">
                      <p className="text-sm text-zinc-300">
                        {log.entity_type} {log.entity_id ? <span className="text-zinc-500">[{log.entity_id}]</span> : ''}
                      </p>
                      <div className="flex items-center justify-between mt-2 pt-2 border-t border-zinc-800/50">
                        <span className="text-indigo-400 font-medium">{log.admins?.name || log.admins?.email || log.user_id || 'System'}</span>
                        <span className="text-zinc-600">{log.ip_address || '127.0.0.1'}</span>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
