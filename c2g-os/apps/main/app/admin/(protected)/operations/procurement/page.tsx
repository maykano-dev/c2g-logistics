'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/client';
import { Search, Filter, Plus, Edit, Eye, Clock, CheckCircle, XCircle } from 'lucide-react';
import { format } from 'date-fns';

export default function AdminOrdersView() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    const supabase = createClient();
    
    const { data, error } = await supabase
      .from('orders')
      .select('*, customers(name, email)')
      .order('created_at', { ascending: false });

    if (data && !error) {
      setOrders(data);
    } else {
      console.error('Error fetching orders', error);
    }
    setLoading(false);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending': return <span className="px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 flex items-center gap-1 w-fit"><Clock className="w-3 h-3"/> Pending</span>;
      case 'processing': return <span className="px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-blue-500/10 text-blue-500 border border-blue-500/20">Processing</span>;
      case 'purchased': return <span className="px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-indigo-500/10 text-indigo-500 border border-indigo-500/20">Purchased</span>;
      case 'arrived_warehouse': return <span className="px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 flex items-center gap-1 w-fit"><CheckCircle className="w-3 h-3"/> Arrived Wh</span>;
      case 'shipped': return <span className="px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-purple-500/10 text-purple-500 border border-purple-500/20">Shipped</span>;
      case 'delivered': return <span className="px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">Delivered</span>;
      case 'cancelled': return <span className="px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-red-500/10 text-red-500 border border-red-500/20 flex items-center gap-1 w-fit"><XCircle className="w-3 h-3"/> Cancelled</span>;
      default: return <span className="px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-zinc-500/10 text-zinc-500 border border-zinc-500/20">{status}</span>;
    }
  };

  const filteredOrders = orders.filter(o => 
    o.id?.toString().includes(searchTerm) ||
    o.customer_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    o.customers?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Procurement Orders</h1>
          <p className="text-zinc-400">Manage 'Buy For Me' requests from customers.</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 p-4 bg-zinc-900 border border-zinc-800 rounded-2xl">
        <div className="relative flex-1">
          <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
          <input 
            type="text"
            placeholder="Search orders by ID, Customer Name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
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
                <th className="p-4 text-xs font-semibold text-zinc-400 uppercase tracking-wider">Date & ID</th>
                <th className="p-4 text-xs font-semibold text-zinc-400 uppercase tracking-wider">Customer</th>
                <th className="p-4 text-xs font-semibold text-zinc-400 uppercase tracking-wider">Platform</th>
                <th className="p-4 text-xs font-semibold text-zinc-400 uppercase tracking-wider">Status</th>
                <th className="p-4 text-xs font-semibold text-zinc-400 uppercase tracking-wider">Total (¥)</th>
                <th className="p-4 text-xs font-semibold text-zinc-400 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800">
              {loading ? (
                <tr><td colSpan={6} className="p-8 text-center text-zinc-500">Loading orders...</td></tr>
              ) : filteredOrders.length === 0 ? (
                <tr><td colSpan={6} className="p-8 text-center text-zinc-500">No orders found.</td></tr>
              ) : (
                filteredOrders.map(order => (
                  <tr key={order.id} className="hover:bg-zinc-800/50 transition-colors group">
                    <td className="p-4">
                      <p className="text-sm text-white font-mono font-medium">#{order.id}</p>
                      <p className="text-[10px] text-zinc-500 mt-1">{format(new Date(order.created_at), 'MMM dd, yyyy HH:mm')}</p>
                    </td>
                    <td className="p-4">
                      <p className="text-sm text-zinc-200">{order.customer_name || order.customers?.name || 'Unknown'}</p>
                      <p className="text-[10px] text-zinc-500">{order.customers?.email}</p>
                    </td>
                    <td className="p-4 text-sm text-zinc-300 capitalize">{order.platform || 'Link Order'}</td>
                    <td className="p-4">
                      {getStatusBadge(order.order_status)}
                    </td>
                    <td className="p-4 text-sm text-zinc-300 font-medium">¥{order.total ? Number(order.total).toFixed(2) : '0.00'}</td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link href={`/admin/operations/procurement/${order.id}`} className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors" title="View Details">
                          <Eye className="w-4 h-4" />
                        </Link>
                        <Link href={`/admin/operations/procurement/${order.id}`} className="p-2 text-indigo-400 hover:text-white hover:bg-indigo-500/20 rounded-lg transition-colors" title="Edit Status">
                          <Edit className="w-4 h-4" />
                        </Link>
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
