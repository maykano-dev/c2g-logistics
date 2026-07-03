'use client';

import { useState, useEffect } from 'react';
import { 
  X, User, Mail, Phone, MapPin, CreditCard, Box, Truck, 
  Receipt, Clock, History, AlertCircle, TrendingUp, Calendar, ChevronRight
} from 'lucide-react';
import { getCustomer360Core, getCustomer360Financials, getCustomer360Orders, getCustomer360Logistics } from '@/app/admin/customer-360-actions';
import { format } from 'date-fns';

export default function Customer360Modal({ 
  customerId, 
  onClose,
  readOnly = false
}: { 
  customerId: string; 
  onClose: () => void;
  readOnly?: boolean;
}) {
  const [activeTab, setActiveTab] = useState('overview');
  
  // Data states
  const [core, setCore] = useState<any>(null);
  const [financials, setFinancials] = useState<any>(null);
  const [orders, setOrders] = useState<any>(null);
  const [logistics, setLogistics] = useState<any>(null);
  
  // Loading states
  const [loadingCore, setLoadingCore] = useState(true);
  const [loadingFin, setLoadingFin] = useState(false);
  const [loadingOrd, setLoadingOrd] = useState(false);
  const [loadingLog, setLoadingLog] = useState(false);

  useEffect(() => {
    async function loadCore() {
      const res = await getCustomer360Core(customerId);
      if (res.success) setCore(res.data);
      setLoadingCore(false);
    }
    loadCore();
  }, [customerId]);

  useEffect(() => {
    if (activeTab === 'financials' && !financials && !loadingFin) {
      setLoadingFin(true);
      getCustomer360Financials(customerId).then(res => {
        if (res.success) setFinancials(res.data);
        setLoadingFin(false);
      });
    }
    if (activeTab === 'orders' && !orders && !loadingOrd) {
      setLoadingOrd(true);
      getCustomer360Orders(customerId).then(res => {
        if (res.success) setOrders(res.data);
        setLoadingOrd(false);
      });
    }
    if (activeTab === 'logistics' && !logistics && !loadingLog) {
      setLoadingLog(true);
      getCustomer360Logistics(customerId).then(res => {
        if (res.success) setLogistics(res.data);
        setLoadingLog(false);
      });
    }
  }, [activeTab, customerId]);

  if (loadingCore) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
        <div className="animate-spin w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (!core) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
        <div className="bg-zinc-950 border border-zinc-800 p-6 rounded-xl">
          <p className="text-red-400">Failed to load customer profile.</p>
          <button onClick={onClose} className="mt-4 px-4 py-2 bg-zinc-800 text-white rounded-lg">Close</button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in" onClick={onClose}>
      <div className="bg-zinc-950 border border-zinc-800 rounded-2xl w-full max-w-6xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden" onClick={e => e.stopPropagation()}>
        
        {/* Header Header */}
        <div className="bg-zinc-900 border-b border-zinc-800 p-6 flex items-start justify-between shrink-0">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-indigo-500/20 flex items-center justify-center text-indigo-400 font-bold text-2xl border border-indigo-500/30">
              {core.name?.substring(0, 2).toUpperCase() || 'CU'}
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h2 className="text-2xl font-bold text-white tracking-tight">{core.name || 'Unknown'}</h2>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                  core.status === 'active' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'
                }`}>
                  {core.status}
                </span>
                {readOnly && <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-zinc-800 text-zinc-400 border border-zinc-700">Read Only</span>}
              </div>
              <div className="flex items-center gap-4 mt-2 text-sm text-zinc-400">
                <span className="flex items-center gap-1.5"><Mail className="w-4 h-4" /> {core.email}</span>
                {core.phone && <span className="flex items-center gap-1.5"><Phone className="w-4 h-4" /> {core.phone}</span>}
                <span className="flex items-center gap-1.5 font-mono bg-zinc-950 px-2 py-0.5 rounded border border-zinc-800">{core.customer_unique_id}</span>
              </div>
            </div>
          </div>
          <button onClick={onClose} className="p-2 bg-zinc-950 text-zinc-400 hover:text-white rounded-xl border border-zinc-800 hover:bg-zinc-800 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1 px-6 pt-4 border-b border-zinc-800 bg-zinc-900/50 overflow-x-auto shrink-0">
          {[
            { id: 'overview', label: 'Overview', icon: User },
            { id: 'financials', label: 'Financials & Wallet', icon: CreditCard },
            { id: 'orders', label: 'Orders Pipeline', icon: Box },
            { id: 'logistics', label: 'Logistics', icon: Truck },
            { id: 'engagement', label: 'Engagement', icon: History }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                activeTab === tab.id 
                  ? 'border-indigo-500 text-indigo-400' 
                  : 'border-transparent text-zinc-400 hover:text-zinc-200 hover:border-zinc-700'
              }`}
            >
              <tab.icon className="w-4 h-4" /> {tab.label}
            </button>
          ))}
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 bg-zinc-950">
          
          {/* OVERVIEW TAB */}
          {activeTab === 'overview' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-zinc-900 border border-zinc-800 p-5 rounded-xl">
                  <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-4 flex items-center gap-2"><CreditCard className="w-4 h-4"/> Wallet Balance</h3>
                  <p className="text-3xl font-bold text-white">₵{core.wallet?.balance ? Number(core.wallet.balance).toFixed(2) : '0.00'}</p>
                  <p className="text-xs text-zinc-500 mt-2">Wallet ID: {core.wallet?.id ? core.wallet.id.substring(0,8) : 'N/A'}</p>
                </div>
                <div className="bg-zinc-900 border border-zinc-800 p-5 rounded-xl">
                  <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-4 flex items-center gap-2"><TrendingUp className="w-4 h-4"/> Lifetime Value</h3>
                  <p className="text-3xl font-bold text-emerald-400">₵{core.lifetime_value ? Number(core.lifetime_value).toFixed(2) : '0.00'}</p>
                  <p className="text-xs text-zinc-500 mt-2">Total spent across all orders & shipments</p>
                </div>
                <div className="bg-zinc-900 border border-zinc-800 p-5 rounded-xl">
                  <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-4 flex items-center gap-2"><MapPin className="w-4 h-4"/> China Warehouse</h3>
                  <div className="bg-zinc-950 p-3 rounded-lg border border-zinc-800 text-sm text-zinc-300 font-mono">
                    <p>C2G Logistics ({core.customer_unique_id})</p>
                    <p>Guangzhou City, Baiyun District</p>
                    <p className="text-xs text-zinc-500 mt-1">Address config generated</p>
                  </div>
                </div>
              </div>

              <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
                <div className="px-6 py-4 border-b border-zinc-800 bg-zinc-950">
                  <h3 className="font-bold text-white">Account Details</h3>
                </div>
                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <div className="flex justify-between border-b border-zinc-800 pb-2">
                      <span className="text-zinc-500 text-sm">Account Created</span>
                      <span className="text-zinc-200 text-sm flex items-center gap-2"><Calendar className="w-3.5 h-3.5 text-zinc-600"/> {core.created_at ? format(new Date(core.created_at), 'MMM dd, yyyy') : 'Unknown'}</span>
                    </div>
                    <div className="flex justify-between border-b border-zinc-800 pb-2">
                      <span className="text-zinc-500 text-sm">Auth UUID</span>
                      <span className="text-zinc-400 font-mono text-xs">{core.user_id || 'N/A'}</span>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex justify-between border-b border-zinc-800 pb-2">
                      <span className="text-zinc-500 text-sm">Last Login</span>
                      <span className="text-zinc-200 text-sm flex items-center gap-2"><Clock className="w-3.5 h-3.5 text-zinc-600"/> {core.last_login ? format(new Date(core.last_login), 'MMM dd, yyyy HH:mm') : 'N/A'}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* FINANCIALS TAB */}
          {activeTab === 'financials' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              {loadingFin ? (
                <div className="p-12 text-center text-zinc-500 flex flex-col items-center gap-3">
                  <div className="animate-spin w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full"></div>
                  Loading financial records...
                </div>
              ) : !financials ? (
                <div className="p-12 text-center text-red-400">Failed to load financials</div>
              ) : (
                <>
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-white flex items-center gap-2"><Receipt className="w-5 h-5 text-indigo-500"/> Wallet Transactions</h3>
                  </div>
                  {financials.transactions?.length === 0 ? (
                    <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-xl text-center text-zinc-500 text-sm">No transactions found for this customer.</div>
                  ) : (
                    <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
                      <table className="w-full text-left">
                        <thead className="bg-zinc-950 border-b border-zinc-800">
                          <tr>
                            <th className="p-4 text-xs font-semibold text-zinc-400 uppercase">Date</th>
                            <th className="p-4 text-xs font-semibold text-zinc-400 uppercase">Type</th>
                            <th className="p-4 text-xs font-semibold text-zinc-400 uppercase">Amount</th>
                            <th className="p-4 text-xs font-semibold text-zinc-400 uppercase">Status</th>
                            <th className="p-4 text-xs font-semibold text-zinc-400 uppercase">Reference</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-800">
                          {financials.transactions.map((tx: any) => (
                            <tr key={tx.id} className="hover:bg-zinc-800/50">
                              <td className="p-4 text-sm text-zinc-300">{format(new Date(tx.created_at), 'MMM dd, yyyy HH:mm')}</td>
                              <td className="p-4">
                                <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${tx.type === 'credit' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>{tx.type}</span>
                              </td>
                              <td className="p-4 text-sm font-medium text-white">₵{Number(tx.amount).toFixed(2)}</td>
                              <td className="p-4 text-sm text-zinc-400 capitalize">{tx.status}</td>
                              <td className="p-4 text-xs text-zinc-500 font-mono">{tx.reference || 'N/A'}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </>
              )}
            </div>
          )}

          {/* ORDERS TAB */}
          {activeTab === 'orders' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              {loadingOrd ? (
                <div className="p-12 text-center text-zinc-500 flex flex-col items-center gap-3"><div className="animate-spin w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full"></div>Loading orders...</div>
              ) : !orders ? (
                <div className="p-12 text-center text-red-400">Failed to load orders</div>
              ) : (
                <div className="space-y-8">
                  <div>
                    <h3 className="font-bold text-white mb-4">Link Orders</h3>
                    {orders.linkOrders?.length === 0 ? <p className="text-zinc-500 text-sm">No link orders found.</p> : (
                      <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
                        <table className="w-full text-left">
                          <thead className="bg-zinc-950 border-b border-zinc-800">
                            <tr>
                              <th className="p-4 text-xs font-semibold text-zinc-400 uppercase">ID / Date</th>
                              <th className="p-4 text-xs font-semibold text-zinc-400 uppercase">Total</th>
                              <th className="p-4 text-xs font-semibold text-zinc-400 uppercase">Status</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-zinc-800">
                            {orders.linkOrders.map((o: any) => (
                              <tr key={o.id}>
                                <td className="p-4 text-sm text-zinc-300">#{o.id} <br/><span className="text-xs text-zinc-500">{format(new Date(o.created_at), 'MMM dd')}</span></td>
                                <td className="p-4 text-sm font-medium text-white">₵{Number(o.total || 0).toFixed(2)}</td>
                                <td className="p-4 text-xs text-zinc-400 capitalize">{o.order_status?.replace('_',' ')}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                  {/* Mall Orders similar... */}
                </div>
              )}
            </div>
          )}

          {/* LOGISTICS TAB */}
          {activeTab === 'logistics' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              {loadingLog ? (
                <div className="p-12 text-center text-zinc-500 flex flex-col items-center gap-3"><div className="animate-spin w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full"></div>Loading logistics...</div>
              ) : !logistics ? (
                <div className="p-12 text-center text-red-400">Failed to load logistics</div>
              ) : (
                <div className="space-y-8">
                  <div>
                    <h3 className="font-bold text-white mb-4">Shipment Reservations</h3>
                    {logistics.reservations?.length === 0 ? <p className="text-zinc-500 text-sm">No reservations found.</p> : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {logistics.reservations.map((r: any) => (
                          <div key={r.id} className="bg-zinc-900 border border-zinc-800 p-4 rounded-xl">
                            <div className="flex justify-between items-start mb-2">
                              <span className="font-mono text-sm text-indigo-400">{r.master_tracking_number}</span>
                              <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-zinc-800 text-zinc-300">{r.status}</span>
                            </div>
                            <p className="text-xs text-zinc-500">Destination: {r.destination}</p>
                            <p className="text-xs text-zinc-500">Expected: {r.expected_delivery_date || 'N/A'}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
          
          {/* ENGAGEMENT TAB */}
          {activeTab === 'engagement' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="p-12 text-center text-zinc-500">
                <History className="w-8 h-8 mx-auto mb-3 opacity-20" />
                No engagement history recorded yet.
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
