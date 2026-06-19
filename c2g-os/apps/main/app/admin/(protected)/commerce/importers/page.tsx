'use client';

import { useState, useEffect } from 'react';
import { Users, Briefcase, TrendingUp, Filter, Search, CheckCircle2, XCircle, AlertTriangle, Building2 } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';
import { adminHandleImporterStatus } from '@/app/admin/importer-actions';
import { useModal } from "@/components/providers/modal-provider";

export default function ImportersView() {
  const [importers, setImporters] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [stats, setStats] = useState({ pendingCount: 0, totalVolume: 0 });
  const { showConfirm, showAlert } = useModal();

  useEffect(() => {
    fetchImporters();
  }, []);

  const fetchImporters = async () => {
    setLoading(true);
    const supabase = createClient();
    
    const { data, error } = await supabase
      .from('importers')
      .select('*, customers(email, name)')
      .order('created_at', { ascending: false });

    if (data && !error) {
      setImporters(data);
      
      // Compute stats
      let pending = 0;
      let vol = 0;
      data.forEach(imp => {
        if (imp.status === 'pending') pending++;
        if (imp.status === 'active') vol += parseFloat(imp.wallet_balance || 0); // Using wallet balance as proxy for volume
      });
      setStats({ pendingCount: pending, totalVolume: vol });
    }
    setLoading(false);
  };

  const handleAction = async (id: string, action: 'approve' | 'reject') => {
    const confirmed = await showConfirm({
      title: 'Confirm Action',
      message: `Are you sure you want to ${action} this importer application?`,
      type: action === 'approve' ? 'success' : 'danger',
      confirmText: `Yes, ${action}`
    });

    if (!confirmed) return;

    const res = await adminHandleImporterStatus(id, action);
    if (res.success) {
      const newStatus = action === 'approve' ? 'active' : 'rejected';
      setImporters(prev => prev.map(imp => imp.id === id ? { ...imp, status: newStatus } : imp));
      setStats(prev => ({ ...prev, pendingCount: prev.pendingCount - 1 }));
      showAlert({ title: 'Success', message: `Importer application ${newStatus}.`, type: 'success' });
    } else {
      showAlert({ title: 'Error', message: 'Action failed: ' + res.error, type: 'danger' });
    }
  };

  const filtered = importers.filter(imp => 
    imp.business_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    imp.customers?.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-7xl mx-auto pb-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-3">
            <Briefcase className="w-6 h-6 text-indigo-500" /> B2B Importers
          </h1>
          <p className="text-zinc-400 mt-1">Manage bulk purchasers, special B2B rates, and wholesale accounts.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Main List */}
        <div className="md:col-span-2 bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
          <div className="p-4 border-b border-zinc-800 flex justify-between items-center bg-zinc-950/50">
             <h2 className="text-sm font-bold text-white uppercase tracking-widest">Importer Accounts</h2>
             <div className="flex gap-2">
               <div className="relative">
                 <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                 <input 
                   type="text" 
                   placeholder="Search businesses..." 
                   value={searchTerm}
                   onChange={(e) => setSearchTerm(e.target.value)}
                   className="h-8 bg-zinc-900 border border-zinc-700 rounded-lg pl-9 pr-3 text-xs text-white focus:border-indigo-500 focus:outline-none" 
                 />
               </div>
               <button className="p-2 border border-zinc-700 text-zinc-400 hover:text-white rounded-lg"><Filter className="w-4 h-4"/></button>
             </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-zinc-800 bg-zinc-900/50 text-xs text-zinc-500 uppercase">
                  <th className="p-4 font-semibold tracking-wider">Business</th>
                  <th className="p-4 font-semibold tracking-wider">Status & Tier</th>
                  <th className="p-4 font-semibold tracking-wider">Wallet / Volume</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800 text-sm">
                {loading ? (
                  <tr><td colSpan={4} className="p-8 text-center text-zinc-500">Loading accounts...</td></tr>
                ) : filtered.length === 0 ? (
                  <tr><td colSpan={4} className="p-8 text-center text-zinc-500">No importers found.</td></tr>
                ) : (
                  filtered.map(imp => (
                    <tr key={imp.id} className="hover:bg-zinc-800/50 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-indigo-500/10 text-indigo-400 rounded-lg shrink-0">
                            <Building2 className="w-5 h-5"/>
                          </div>
                          <div>
                            <p className="font-bold text-white">{imp.business_name || 'Unnamed Business'}</p>
                            <p className="text-[10px] text-zinc-500 mt-1">{imp.customers?.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex flex-col gap-1.5 items-start">
                          <span className={`px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded border ${
                            imp.status === 'active' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 
                            imp.status === 'pending' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                            'bg-red-500/10 text-red-400 border-red-500/20'
                          }`}>
                            {imp.status}
                          </span>
                          {imp.status === 'active' && (
                            <span className="px-2 py-0.5 bg-purple-500/10 text-purple-400 text-[10px] font-bold uppercase rounded border border-purple-500/20">
                              Tier 1
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="p-4 font-mono font-bold text-zinc-300">
                        ₵{(parseFloat(imp.wallet_balance || 0)).toLocaleString(undefined, {minimumFractionDigits: 2})}
                      </td>
                      <td className="p-4 text-right">
                        {imp.status === 'pending' ? (
                          <div className="flex items-center justify-end gap-2">
                            <button onClick={() => handleAction(imp.id, 'approve')} className="p-2 text-emerald-500 hover:bg-emerald-500/20 rounded-lg transition-colors" title="Approve Account">
                              <CheckCircle2 className="w-4 h-4" />
                            </button>
                            <button onClick={() => handleAction(imp.id, 'reject')} className="p-2 text-red-500 hover:bg-red-500/20 rounded-lg transition-colors" title="Reject Application">
                              <XCircle className="w-4 h-4" />
                            </button>
                          </div>
                        ) : (
                          <span className="text-zinc-500 text-xs">—</span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* B2B Analytics Widget */}
        <div className="space-y-6">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
            <h3 className="text-sm font-bold uppercase text-zinc-500 tracking-widest mb-4 flex items-center gap-2"><TrendingUp className="w-4 h-4 text-emerald-500"/> Retained Value</h3>
            <p className="text-3xl font-black text-white">₵{stats.totalVolume.toLocaleString(undefined, {minimumFractionDigits:0})}</p>
            <p className="text-xs text-emerald-500 font-bold mt-2">Active Importer Wallet Balances</p>
          </div>
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
             <h3 className="text-sm font-bold uppercase text-zinc-500 tracking-widest mb-4 flex items-center gap-2">
               <Users className={`w-4 h-4 ${stats.pendingCount > 0 ? 'text-amber-500' : 'text-indigo-500'}`}/> Pending Approvals
             </h3>
             {stats.pendingCount > 0 ? (
               <div className="flex items-start gap-3 p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl mt-2">
                 <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                 <div>
                   <p className="text-sm font-bold text-amber-500">{stats.pendingCount} Account(s) Waiting</p>
                   <p className="text-xs text-amber-500/70 mt-1">Review business documents before approving B2B rates.</p>
                 </div>
               </div>
             ) : (
               <p className="text-sm text-zinc-400">No new importer applications require review at this time.</p>
             )}
          </div>
        </div>
      </div>
    </div>
  );
}
