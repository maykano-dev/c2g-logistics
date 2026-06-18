'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { Search, Filter, Ban, Mail, CheckCircle, Clock } from 'lucide-react';
import { format } from 'date-fns';

export default function AdminCustomersView() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    setLoading(true);
    const supabase = createClient();
    
    // We fetch from the 'customers' table which mirrors auth.users profiles in this system
    const { data, error } = await supabase
      .from('customers')
      .select('*')
      .order('created_at', { ascending: false });

    if (data && !error) {
      setCustomers(data);
    } else {
      console.error('Error fetching customers', error);
    }
    setLoading(false);
  };

  const filteredCustomers = customers.filter(c => 
    c.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.phone?.includes(searchTerm)
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Customers</h1>
          <p className="text-zinc-400">Manage registered users and their accounts.</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 p-4 bg-zinc-900 border border-zinc-800 rounded-2xl">
        <div className="relative flex-1">
          <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
          <input 
            type="text"
            placeholder="Search by name, email, or phone..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full h-10 bg-zinc-950 border border-zinc-800 rounded-lg pl-10 pr-4 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors"
          />
        </div>
        <button className="px-4 h-10 border border-zinc-800 bg-zinc-950 text-white rounded-lg text-sm font-medium flex items-center gap-2 hover:bg-zinc-800 transition-colors shrink-0">
          <Filter className="w-4 h-4" /> Filters
        </button>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-zinc-800 bg-zinc-950/50">
                <th className="p-4 text-xs font-semibold text-zinc-400 uppercase tracking-wider">User</th>
                <th className="p-4 text-xs font-semibold text-zinc-400 uppercase tracking-wider">Contact</th>
                <th className="p-4 text-xs font-semibold text-zinc-400 uppercase tracking-wider">Joined</th>
                <th className="p-4 text-xs font-semibold text-zinc-400 uppercase tracking-wider">Status</th>
                <th className="p-4 text-xs font-semibold text-zinc-400 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800">
              {loading ? (
                <tr><td colSpan={5} className="p-8 text-center text-zinc-500">Loading customers...</td></tr>
              ) : filteredCustomers.length === 0 ? (
                <tr><td colSpan={5} className="p-8 text-center text-zinc-500">No customers found.</td></tr>
              ) : (
                filteredCustomers.map(customer => (
                  <tr key={customer.id} className="hover:bg-zinc-800/50 transition-colors group">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold text-xs border border-indigo-500/30">
                          {customer.name?.substring(0, 2).toUpperCase() || 'U'}
                        </div>
                        <div>
                          <p className="text-sm text-white font-medium">{customer.name || 'No Name'}</p>
                          <p className="text-[10px] text-zinc-500 font-mono">{customer.customer_unique_id || customer.user_id?.split('-')[0]}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-sm text-zinc-400">
                      {customer.email}<br/>
                      <span className="text-xs">{customer.phone || 'No phone'}</span>
                    </td>
                    <td className="p-4 text-sm text-zinc-400">
                      {customer.created_at ? format(new Date(customer.created_at), 'MMM dd, yyyy') : 'Unknown'}
                    </td>
                    <td className="p-4">
                      {customer.is_banned ? (
                        <span className="px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-red-500/10 text-red-500 border border-red-500/20">
                          Banned
                        </span>
                      ) : (
                        <span className="px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 flex items-center gap-1 w-fit">
                          <CheckCircle className="w-3 h-3"/> Active
                        </span>
                      )}
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors" title="Message">
                          <Mail className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-red-400 hover:text-white hover:bg-red-500/20 rounded-lg transition-colors" title="Ban / Unban">
                          <Ban className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
