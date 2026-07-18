"use client";

import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { Package, Truck, Ship, Plane, Search, RefreshCcw, User, Eye, X, CheckCircle2, Loader2 } from 'lucide-react';
import { format } from 'date-fns';

export default function ReservationsTab() {
  const [reservations, setReservations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [viewingRes, setViewingRes] = useState<any>(null);
  const [resItems, setResItems] = useState<any>({ packages: [], linkOrders: [], mallOrders: [] });
  const [loadingItems, setLoadingItems] = useState(false);
  
  const supabase = createClient();

  const fetchReservations = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('shipment_reservations')
        .select(`
          *,
          customers(name)
        `)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      setReservations(data || []);
    } catch (err) {
      console.error('Error fetching reservations:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReservations();
  }, []);

  const handleViewItems = async (res: any) => {
    setViewingRes(res);
    setLoadingItems(true);
    try {
      // Fetch packages
      const { data: pkgs } = await supabase
        .from('shipments')
        .select('*')
        .eq('reservation_id', res.id);
        
      // Fetch link orders
      const { data: links } = await supabase
        .from('orders')
        .select('*')
        .eq('reservation_id', res.id);

      setResItems({
        packages: pkgs || [],
        linkOrders: links || [],
        mallOrders: [] // simplified for warehouse
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingItems(false);
    }
  };

  const filteredReservations = reservations.filter(r => 
    r.id.toLowerCase().includes(searchQuery.toLowerCase()) || 
    r.customers?.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="h-full w-full bg-zinc-950 flex flex-col pt-safe">
      <div className="p-4 border-b border-zinc-800 bg-zinc-900/50 backdrop-blur-xl shrink-0 z-10">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-white">Tasks / Reservations</h2>
          <button onClick={fetchReservations} className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white transition-colors">
            <RefreshCcw className="w-4 h-4" />
          </button>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search tasks..."
            className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-3 pl-10 pr-4 text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-40 gap-3 text-zinc-500">
            <RefreshCcw className="w-6 h-6 animate-spin" />
            <p className="text-sm font-medium">Loading tasks...</p>
          </div>
        ) : filteredReservations.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-zinc-500">
            <Truck className="w-12 h-12 mb-3 opacity-20" />
            <p className="text-base font-medium text-white mb-1">No active tasks</p>
            <p className="text-sm">There are no pending shipments to pack.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredReservations.map((res) => (
              <div key={res.id} onClick={() => handleViewItems(res)} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 shadow-sm cursor-pointer hover:bg-zinc-800 transition-colors">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-bold text-lg text-white font-mono">{res.id}</h3>
                    {res.created_at && (
                      <p className="text-[10px] text-zinc-500 mt-1">
                        {format(new Date(res.created_at), 'MMM dd, yyyy HH:mm')}
                      </p>
                    )}
                  </div>
                  {res.deposit_paid ? (
                    <span className="flex items-center gap-1 text-[10px] uppercase font-bold text-green-400 bg-green-400/10 px-2 py-1 rounded">
                      <CheckCircle2 className="w-3 h-3" /> Paid & Ready
                    </span>
                  ) : (
                    <span className="text-[10px] uppercase font-bold text-amber-500 bg-amber-500/10 px-2 py-1 rounded">
                      Payment Pending
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-y-2 mb-3 text-sm">
                  <div className="flex items-center gap-2 text-zinc-300">
                    <User className="w-4 h-4 text-zinc-500" />
                    <span className="truncate">{res.customers?.name || 'Unknown'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-zinc-300">
                    <Package className="w-4 h-4 text-zinc-500" />
                    <span>{res.total_items} Items</span>
                  </div>
                  <div className="flex items-center gap-2 text-zinc-300 col-span-2">
                    {res.shipping_mode.includes('air') ? <Plane className="w-4 h-4 text-blue-400" /> : <Ship className="w-4 h-4 text-cyan-400" />}
                    <span className="capitalize">{res.shipping_mode.replace('_', ' ')}</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-zinc-800 flex justify-between items-center">
                  <span className="text-xs text-zinc-500 capitalize">{res.status.replace(/_/g, ' ')}</span>
                  <button className="flex items-center gap-1 text-sm font-bold text-blue-500">
                    <Eye className="w-4 h-4" /> View Items
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal for Viewing Items */}
      {viewingRes && (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-zinc-950 w-full sm:max-w-md h-[85vh] sm:h-auto sm:max-h-[85vh] rounded-t-3xl sm:rounded-3xl border border-zinc-800 flex flex-col shadow-2xl animate-slide-up">
            <div className="flex justify-between items-center p-5 border-b border-zinc-800 shrink-0">
              <div>
                <h3 className="font-bold text-lg text-white font-mono">{viewingRes.id}</h3>
                <p className="text-xs text-zinc-400">Pull these items for shipping</p>
              </div>
              <button onClick={() => setViewingRes(null)} className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-5 custom-scrollbar">
              {loadingItems ? (
                <div className="flex justify-center py-10">
                  <Loader2 className="w-8 h-8 animate-spin text-zinc-500" />
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Warehouse Packages */}
                  {resItems.packages.length > 0 && (
                    <div className="space-y-3">
                      <h4 className="font-bold text-xs uppercase tracking-wider text-zinc-500 flex items-center gap-2">
                        <Package className="w-4 h-4" /> Warehouse Packages ({resItems.packages.length})
                      </h4>
                      <div className="space-y-2">
                        {resItems.packages.map((pkg: any) => (
                          <div key={pkg.id} className="bg-zinc-900 border border-zinc-800 rounded-xl p-3 flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-zinc-800 shrink-0 flex items-center justify-center overflow-hidden">
                              {pkg.image_url ? (
                                <img src={pkg.image_url} alt="" className="w-full h-full object-cover" />
                              ) : (
                                <Package className="w-5 h-5 text-zinc-500" />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-mono text-sm font-bold text-white truncate">{pkg.tracking_number}</p>
                              <p className="text-xs text-zinc-400 truncate">{pkg.items_description || 'No description'}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Link Orders */}
                  {resItems.linkOrders.length > 0 && (
                    <div className="space-y-3">
                      <h4 className="font-bold text-xs uppercase tracking-wider text-zinc-500 flex items-center gap-2">
                        <Truck className="w-4 h-4" /> Link Orders ({resItems.linkOrders.length})
                      </h4>
                      <div className="space-y-2">
                        {resItems.linkOrders.map((order: any) => (
                          <div key={order.id} className="bg-zinc-900 border border-zinc-800 rounded-xl p-3 flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-zinc-800 shrink-0 flex items-center justify-center overflow-hidden">
                              {order.screenshot_url ? (
                                <img src={order.screenshot_url} alt="" className="w-full h-full object-cover" />
                              ) : (
                                <Truck className="w-5 h-5 text-zinc-500" />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-mono text-sm font-bold text-white truncate">LNK-{String(order.id).substring(0, 8).toUpperCase()}</p>
                              <p className="text-xs text-zinc-400 truncate">{order.product_name}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
            
            <div className="p-5 border-t border-zinc-800 shrink-0">
              <button 
                onClick={() => setViewingRes(null)} 
                className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
