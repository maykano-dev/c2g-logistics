'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { Wallet, Search, Filter, CheckCircle2, XCircle, AlertTriangle, ShieldCheck, Banknote } from 'lucide-react';
import { format } from 'date-fns';
import { adminHandleWithdrawal } from '@/app/admin/withdrawal-actions';
import { useModal } from "@/components/providers/modal-provider";

export default function WithdrawalsPage() {
  const [withdrawals, setWithdrawals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [userRole, setUserRole] = useState<'founder' | 'manager' | 'officer'>('officer');
  const { showAlert } = useModal();

  useEffect(() => {
    fetchWithdrawals();
  }, []);

  const fetchWithdrawals = async () => {
    setLoading(true);
    const supabase = createClient();
    
    // Fallback mock data if the table doesn't exist yet in the database schema
    const mockData = [
      { id: '1', amount: 350.00, customer: { name: 'John Doe', email: 'john@example.com' }, status: 'pending', created_at: new Date().toISOString(), required_tier: 'officer' },
      { id: '2', amount: 4500.00, customer: { name: 'Sarah Smith', email: 'sarah@example.com' }, status: 'pending', created_at: new Date(Date.now() - 3600000).toISOString(), required_tier: 'manager' },
      { id: '3', amount: 65000.00, customer: { name: 'Michael Tech', email: 'michael@tech.com' }, status: 'pending', created_at: new Date(Date.now() - 86400000).toISOString(), required_tier: 'founder' },
      { id: '4', amount: 150.00, customer: { name: 'Emma Watson', email: 'emma@example.com' }, status: 'approved', created_at: new Date(Date.now() - 186400000).toISOString(), required_tier: 'officer' },
    ];

    try {
      // Try to fetch from actual table
      const { data, error } = await supabase
        .from('withdrawals')
        .select('*, customers(name, email)')
        .order('created_at', { ascending: false });

      if (data && !error) {
        // Compute required tier dynamically based on requested rules:
        // ₵500 = Officer, ₵5000 = Manager, >₵50000 = Founder
        const processedData = data.map(w => ({
          ...w,
          required_tier: w.amount >= 50000 ? 'founder' : w.amount >= 5000 ? 'manager' : 'officer'
        }));
        setWithdrawals(processedData);
      } else {
        setWithdrawals(mockData);
      }
    } catch (e) {
      setWithdrawals(mockData);
    }
    
    setLoading(false);
  };

  const handleAction = async (id: string, action: 'approve' | 'reject') => {
    const res = await adminHandleWithdrawal(id, action);
    if (res.success) {
      const newStatus = action === 'approve' ? 'approved' : 'rejected';
      setWithdrawals(prev => prev.map(w => w.id === id ? { ...w, status: newStatus } : w));
      showAlert({ title: 'Success', message: `Withdrawal successfully ${newStatus}`, type: 'success' });
    } else {
      showAlert({ title: 'Error', message: res.error || 'Action failed', type: 'danger' });
    }
  };

  const canApprove = (requiredTier: string) => {
    if (userRole === 'founder') return true;
    if (userRole === 'manager' && (requiredTier === 'manager' || requiredTier === 'officer')) return true;
    if (userRole === 'officer' && requiredTier === 'officer') return true;
    return false;
  };

  const filtered = withdrawals.filter(w => 
    w.customer?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    w.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-3">
            <Wallet className="w-6 h-6 text-indigo-500" /> Wallet Withdrawals
          </h1>
          <p className="text-zinc-400 mt-1">Manage and approve importer wallet withdrawals via authorization tiers.</p>
        </div>

        {/* Temporary Role Switcher for Demonstration */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-1 flex">
          <button onClick={() => setUserRole('officer')} className={`px-4 py-2 text-xs font-bold uppercase tracking-widest rounded-lg transition-colors ${userRole === 'officer' ? 'bg-indigo-600 text-white' : 'text-zinc-500 hover:text-white'}`}>Officer</button>
          <button onClick={() => setUserRole('manager')} className={`px-4 py-2 text-xs font-bold uppercase tracking-widest rounded-lg transition-colors ${userRole === 'manager' ? 'bg-indigo-600 text-white' : 'text-zinc-500 hover:text-white'}`}>Manager</button>
          <button onClick={() => setUserRole('founder')} className={`px-4 py-2 text-xs font-bold uppercase tracking-widest rounded-lg transition-colors ${userRole === 'founder' ? 'bg-indigo-600 text-white' : 'text-zinc-500 hover:text-white'}`}>Founder</button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 p-4 bg-zinc-900 border border-zinc-800 rounded-2xl">
        <div className="relative flex-1">
          <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
          <input 
            type="text"
            placeholder="Search by customer name or status..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full h-10 bg-zinc-950 border border-zinc-800 rounded-lg pl-10 pr-4 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors"
          />
        </div>
        <button className="px-4 h-10 border border-zinc-800 bg-zinc-950 text-white rounded-lg text-sm font-medium flex items-center gap-2 hover:bg-zinc-800 transition-colors shrink-0">
          <Filter className="w-4 h-4" /> Filters
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        <div className="md:col-span-2 bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-zinc-800 bg-zinc-950/50">
                  <th className="p-4 text-xs font-semibold text-zinc-400 uppercase tracking-wider">Customer</th>
                  <th className="p-4 text-xs font-semibold text-zinc-400 uppercase tracking-wider">Amount (₵)</th>
                  <th className="p-4 text-xs font-semibold text-zinc-400 uppercase tracking-wider">Status</th>
                  <th className="p-4 text-xs font-semibold text-zinc-400 uppercase tracking-wider">Required Auth</th>
                  <th className="p-4 text-xs font-semibold text-zinc-400 uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800">
                {loading ? (
                  <tr><td colSpan={5} className="p-8 text-center text-zinc-500">Loading requests...</td></tr>
                ) : filtered.length === 0 ? (
                  <tr><td colSpan={5} className="p-8 text-center text-zinc-500">No withdrawal requests found.</td></tr>
                ) : (
                  filtered.map(req => (
                    <tr key={req.id} className="hover:bg-zinc-800/50 transition-colors">
                      <td className="p-4">
                        <p className="text-sm font-medium text-white">{req.customer?.name || 'Unknown'}</p>
                        <p className="text-[10px] text-zinc-500">{format(new Date(req.created_at), 'MMM dd, yyyy HH:mm')}</p>
                      </td>
                      <td className="p-4 font-mono font-bold text-white">₵{req.amount.toLocaleString(undefined, {minimumFractionDigits: 2})}</td>
                      <td className="p-4">
                        <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${
                          req.status === 'approved' ? 'bg-emerald-500/10 text-emerald-500' :
                          req.status === 'rejected' ? 'bg-red-500/10 text-red-500' :
                          'bg-yellow-500/10 text-yellow-500'
                        }`}>
                          {req.status}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className={`px-2 py-1 flex items-center gap-1 w-fit rounded text-[10px] font-bold uppercase tracking-wider ${
                          req.required_tier === 'founder' ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20' :
                          req.required_tier === 'manager' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' :
                          'bg-zinc-800 text-zinc-400 border border-zinc-700'
                        }`}>
                          {req.required_tier === 'founder' && <ShieldCheck className="w-3 h-3"/>}
                          {req.required_tier}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        {req.status === 'pending' && (
                          <div className="flex items-center justify-end gap-2">
                            {canApprove(req.required_tier) ? (
                              <>
                                <button onClick={() => handleAction(req.id, 'approve')} className="p-2 text-emerald-500 hover:bg-emerald-500/20 rounded-lg transition-colors" title="Approve">
                                  <CheckCircle2 className="w-5 h-5" />
                                </button>
                                <button onClick={() => handleAction(req.id, 'reject')} className="p-2 text-red-500 hover:bg-red-500/20 rounded-lg transition-colors" title="Reject">
                                  <XCircle className="w-5 h-5" />
                                </button>
                              </>
                            ) : (
                              <div className="flex items-center gap-2 text-[10px] font-bold text-red-400 bg-red-500/10 px-2 py-1 rounded">
                                <AlertTriangle className="w-3 h-3" /> Needs {req.required_tier}
                              </div>
                            )}
                          </div>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
            <h2 className="text-sm font-bold text-white mb-4 flex items-center gap-2"><Banknote className="w-4 h-4 text-emerald-500"/> Liquidity Pool</h2>
            <div className="space-y-4">
              <div>
                <p className="text-xs font-semibold text-zinc-500 uppercase tracking-widest mb-1">Available Balance</p>
                <p className="text-3xl font-black text-white">₵142,500.00</p>
              </div>
              <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full" style={{ width: '65%' }}></div>
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed">Ensure wallet balances remain above ₵50,000 to cover sudden importer bulk withdrawals.</p>
            </div>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
            <h2 className="text-sm font-bold text-white mb-4 flex items-center gap-2"><ShieldCheck className="w-4 h-4 text-indigo-500"/> Authorization Rules</h2>
            <ul className="space-y-3 text-sm text-zinc-400">
              <li className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-zinc-600"></span> <strong>&lt; ₵5,000:</strong> Finance Officer</li>
              <li className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-blue-500"></span> <strong>₵5,000 - ₵49,999:</strong> Manager</li>
              <li className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-purple-500"></span> <strong>&gt; ₵50,000:</strong> Founder Only</li>
            </ul>
          </div>
        </div>

      </div>
    </div>
  );
}
