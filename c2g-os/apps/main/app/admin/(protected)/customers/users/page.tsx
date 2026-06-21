'use client';

import { useState, useEffect, useTransition } from 'react';
import { createClient } from '@/utils/supabase/client';
import { Search, Filter, Ban, Eye, CheckCircle, Plus, X, Package, ShoppingCart, Key, UserPlus } from 'lucide-react';
import { format } from 'date-fns';
import { toggleCustomerStatus, adminCreateUser, adminFetchUserDetails } from '@/app/admin/customer-actions';
import { useModal } from "@/components/providers/modal-provider";

export default function AdminCustomersView() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isPending, startTransition] = useTransition();
  const { showConfirm, showAlert } = useModal();

  // Modals state
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [loadingUserDetails, setLoadingUserDetails] = useState(false);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    setLoading(true);
    const supabase = createClient();
    const { data, error } = await supabase
      .from('customers')
      .select('*')
      .order('created_at', { ascending: false });

    if (data && !error) setCustomers(data);
    setLoading(false);
  };

  const handleBanToggle = async (customer: any) => {
    const actionName = customer.is_banned ? 'unban' : 'ban';
    const confirmed = await showConfirm({
      title: `${actionName === 'ban' ? 'Ban' : 'Unban'} User`,
      message: `Are you sure you want to ${actionName} ${customer.name}? ${actionName === 'ban' ? 'They will no longer be able to log in.' : 'They will regain access to their account.'}`,
      type: actionName === 'ban' ? 'danger' : 'success',
      confirmText: `Yes, ${actionName}`
    });

    if (!confirmed) return;

    startTransition(async () => {
      const res = await toggleCustomerStatus(customer.id, customer.is_banned);
      if (res.success) {
        setCustomers(prev => prev.map(c => c.id === customer.id ? { ...c, is_banned: !customer.is_banned } : c));
        showAlert({ title: 'Success', message: `User successfully ${actionName}ned.`, type: 'success' });
      } else {
        showAlert({ title: 'Error', message: 'Failed: ' + res.error, type: 'danger' });
      }
    });
  };

  const handleViewUser = async (id: string) => {
    setLoadingUserDetails(true);
    setSelectedUser({ id, loading: true }); // Open skeleton modal immediately
    
    const res = await adminFetchUserDetails(id);
    if (res.success) {
      setSelectedUser(res.data);
    } else {
      showAlert({ title: 'Error', message: 'Failed to fetch user details', type: 'danger' });
      setSelectedUser(null);
    }
    setLoadingUserDetails(false);
  };

  const handleAddUser = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    startTransition(async () => {
      const res = await adminCreateUser(formData);
      if (res.success) {
        showAlert({ title: 'Success', message: 'User created successfully.', type: 'success' });
        setShowAddModal(false);
        fetchCustomers(); // Refresh list
      } else {
        showAlert({ title: 'Error', message: res.error || 'Failed to create user', type: 'danger' });
      }
    });
  };

  const filteredCustomers = customers.filter(c => 
    c.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.phone?.includes(searchTerm)
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-24">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Customers</h1>
          <p className="text-zinc-400">Manage registered users and their accounts.</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-indigo-900/20 transition-all flex items-center gap-2"
        >
          <UserPlus className="w-4 h-4" /> Add User
        </button>
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
        <div className="overflow-x-auto hidden md:block">
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
                        <button 
                          onClick={() => handleViewUser(customer.id)}
                          className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors" 
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleBanToggle(customer)}
                          disabled={isPending}
                          className={`p-2 rounded-lg transition-colors disabled:opacity-50 ${customer.is_banned ? 'text-emerald-400 hover:text-white hover:bg-emerald-500/20' : 'text-red-400 hover:text-white hover:bg-red-500/20'}`} 
                          title={customer.is_banned ? "Unban User" : "Ban User"}
                        >
                          {customer.is_banned ? <CheckCircle className="w-4 h-4" /> : <Ban className="w-4 h-4" />}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Card Layout */}
          <div className="sm:hidden flex flex-col divide-y divide-zinc-800">
            {loading ? (
              <div className="p-8 text-center text-zinc-500">Loading customers...</div>
            ) : filteredCustomers.length === 0 ? (
              <div className="p-8 text-center text-zinc-500">No customers found.</div>
            ) : (
              filteredCustomers.map(customer => (
                <div key={customer.id} className="p-4 flex flex-col gap-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold text-sm border border-indigo-500/30 shrink-0">
                        {customer.name?.substring(0, 2).toUpperCase() || 'U'}
                      </div>
                      <div>
                        <p className="text-sm text-white font-medium">{customer.name || 'No Name'}</p>
                        <p className="text-xs text-zinc-500 font-mono mt-0.5">CUS-{customer.customer_unique_id || 'UNKNOWN'}</p>
                      </div>
                    </div>
                    {customer.is_banned ? (
                      <span className="px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-red-500/10 text-red-500 border border-red-500/20">
                        Banned
                      </span>
                    ) : (
                      <span className="px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 flex items-center gap-1">
                        <CheckCircle className="w-3 h-3"/> Active
                      </span>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 text-sm bg-zinc-950 p-3 rounded-xl border border-zinc-800/50">
                    <div className="col-span-2 mb-1">
                      <p className="text-xs text-zinc-500 mb-1">Email</p>
                      <p className="text-zinc-300 truncate">{customer.email}</p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-xs text-zinc-500 mb-1">Phone</p>
                      <p className="text-zinc-300">{customer.phone || 'No phone'}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <p className="text-[10px] text-zinc-500">Joined: {customer.created_at ? format(new Date(customer.created_at), 'MMM dd, yyyy') : 'Unknown'}</p>
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => handleViewUser(customer.id)}
                        className="bg-zinc-800/50 hover:bg-zinc-800 text-white p-2 rounded-xl transition-colors" 
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleBanToggle(customer)}
                        disabled={isPending}
                        className={`p-2 rounded-xl transition-colors disabled:opacity-50 ${customer.is_banned ? 'text-emerald-400 bg-emerald-500/10 border border-emerald-500/20' : 'text-red-400 bg-red-500/10 border border-red-500/20'}`} 
                      >
                        {customer.is_banned ? <CheckCircle className="w-4 h-4" /> : <Ban className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      {/* Add User Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-0 md:p-4" onClick={() => setShowAddModal(false)}>
          <div 
            className="bg-zinc-950 md:border md:border-zinc-800 md:rounded-3xl w-full h-full md:h-auto max-w-md overflow-hidden flex flex-col md:max-h-[90vh] max-h-[100dvh] animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b border-zinc-800 flex items-center justify-between shrink-0">
              <h2 className="text-xl font-bold text-white">Create User</h2>
              <button onClick={() => setShowAddModal(false)} className="text-zinc-500 hover:text-white"><X className="w-5 h-5"/></button>
            </div>
            <form onSubmit={handleAddUser} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">Full Name</label>
                <input type="text" name="name" required className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-2 px-4 text-sm text-white outline-none focus:border-indigo-500" placeholder="John Doe" />
              </div>
              <div>
                <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">Email Address</label>
                <input type="email" name="email" required className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-2 px-4 text-sm text-white outline-none focus:border-indigo-500" placeholder="john@example.com" />
              </div>
              <div>
                <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">Phone Number</label>
                <input type="tel" name="phone" required className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-2 px-4 text-sm text-white outline-none focus:border-indigo-500" placeholder="+233..." />
              </div>
              <div>
                <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">Temporary Password</label>
                <div className="relative">
                  <Key className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                  <input type="password" name="password" required className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-2 pl-10 pr-4 text-sm text-white outline-none focus:border-indigo-500" placeholder="Min 6 characters" minLength={6} />
                </div>
                <p className="text-[10px] text-zinc-500 mt-2">The user will be able to log in immediately using these credentials.</p>
              </div>
              <div className="pt-4 border-t border-zinc-800">
                <button type="submit" disabled={isPending} className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white py-3 rounded-xl text-sm font-bold shadow-lg shadow-indigo-900/20 transition-all">
                  {isPending ? 'Creating...' : 'Create Account'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View User Details Modal */}
      {selectedUser && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-0 md:p-4" onClick={() => setSelectedUser(null)}>
          <div 
            className="bg-zinc-950 md:border md:border-zinc-800 md:rounded-3xl w-full h-full md:h-auto max-w-2xl overflow-hidden flex flex-col md:max-h-[90vh] max-h-[100dvh] animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b border-zinc-800 flex items-center justify-between shrink-0">
              <h2 className="text-xl font-bold text-white flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold text-xs border border-indigo-500/30">
                  {selectedUser.name?.substring(0, 2).toUpperCase() || 'U'}
                </div>
                User Profile
              </h2>
              <button onClick={() => setSelectedUser(null)} className="text-zinc-500 hover:text-white"><X className="w-5 h-5"/></button>
            </div>
            
            <div className="p-6 overflow-y-auto">
              {selectedUser.loading ? (
                <div className="flex flex-col items-center justify-center py-12 text-zinc-500">
                  <div className="w-8 h-8 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin mb-4"></div>
                  Loading comprehensive user data...
                </div>
              ) : (
                <div className="space-y-8">
                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400">
                        <Package className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Shipments</p>
                        <p className="text-2xl font-bold text-white">{selectedUser.stats?.shipments || 0}</p>
                      </div>
                    </div>
                    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-400">
                        <ShoppingCart className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Mall Orders</p>
                        <p className="text-2xl font-bold text-white">{selectedUser.stats?.orders || 0}</p>
                      </div>
                    </div>
                  </div>

                  {/* Info Blocks */}
                  <div className="grid sm:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-4 border-b border-zinc-800 pb-2">Account Status</h3>
                      <div className="space-y-3">
                        <div>
                          <p className="text-xs text-zinc-500">C2G ID</p>
                          <p className="text-sm font-mono text-white font-medium">{selectedUser.customer_unique_id}</p>
                        </div>
                        <div>
                          <p className="text-xs text-zinc-500">Joined Date</p>
                          <p className="text-sm text-white">{selectedUser.created_at ? format(new Date(selectedUser.created_at), 'MMMM dd, yyyy') : 'N/A'}</p>
                        </div>
                        <div>
                          <p className="text-xs text-zinc-500">Status</p>
                          {selectedUser.is_banned ? (
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-red-500/10 text-red-500 border border-red-500/20 mt-1 inline-block">Banned</span>
                          ) : (
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 mt-1 inline-block">Active</span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-4 border-b border-zinc-800 pb-2">Contact Details</h3>
                      <div className="space-y-3">
                        <div>
                          <p className="text-xs text-zinc-500">Full Name</p>
                          <p className="text-sm text-white font-medium">{selectedUser.name}</p>
                        </div>
                        <div>
                          <p className="text-xs text-zinc-500">Email Address</p>
                          <p className="text-sm text-white">{selectedUser.email}</p>
                        </div>
                        <div>
                          <p className="text-xs text-zinc-500">Phone Number</p>
                          <p className="text-sm text-white">{selectedUser.phone || 'Not provided'}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
