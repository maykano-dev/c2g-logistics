'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/client';
import { 
  Search, Filter, Plus, Edit, Eye, Clock, CheckCircle, XCircle, 
  Link as LinkIcon, Copy, X, ExternalLink, Image as ImageIcon, 
  Box, User, CreditCard, Receipt
} from 'lucide-react';
import { format } from 'date-fns';

export default function AdminLinkOrdersView() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [copiedLink, setCopiedLink] = useState<string | null>(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    const supabase = createClient();
    
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });

    if (data && !error) {
      setOrders(data);
    } else {
      console.error('Error fetching orders', error);
    }
    setLoading(false);
  };

  const handleCopyLinks = async (order: any, e: React.MouseEvent) => {
    e.stopPropagation();
    const items = Array.isArray(order.items) ? order.items : [];
    let linksToCopy = '';
    
    if (items.length > 1) {
      linksToCopy = items.map((item: any) => item.product_link).filter(Boolean).join('\n');
    } else {
      linksToCopy = order.product_link;
    }
    
    if (linksToCopy) {
      try {
        await navigator.clipboard.writeText(linksToCopy);
        setCopiedLink(order.id);
        setTimeout(() => setCopiedLink(null), 2000);
      } catch (err) {
        console.error('Failed to copy links', err);
      }
    }
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

  const filteredOrders = orders.filter(o => {
    const matchesSearch = o.id?.toString().includes(searchTerm) ||
      o.customer_name?.toLowerCase().includes(searchTerm.toLowerCase());
      
    if (!matchesSearch) return false;
    
    // STRICTLY filter for Link Orders
    return o.type === 'link_order';
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-3">
            <LinkIcon className="w-6 h-6 text-indigo-500" />
            Link Orders
          </h1>
          <p className="text-zinc-400">Manage procurement requests sourced via external custom links.</p>
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
        <div className="overflow-x-auto hidden md:block">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-zinc-800 bg-zinc-950/50">
                <th className="p-4 text-xs font-semibold text-zinc-400 uppercase tracking-wider">Date & ID</th>
                <th className="p-4 text-xs font-semibold text-zinc-400 uppercase tracking-wider">Customer</th>
                <th className="p-4 text-xs font-semibold text-zinc-400 uppercase tracking-wider">Link</th>
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
                      <p className="text-sm text-zinc-200">{order.customer_name || 'Unknown'}</p>
                      <p className="text-[10px] text-zinc-500 font-mono">{order.customer_id ? `ID: ${order.customer_id.substring(0,8)}` : ''}</p>
                    </td>
                    <td className="p-4">
                      {order.product_link || (Array.isArray(order.items) && order.items.length > 0) ? (
                        <div className="flex items-center gap-2">
                          {order.product_link && (
                            <a href={order.product_link} target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:text-indigo-300 text-sm flex items-center gap-1 w-fit">
                              View Link <ExternalLink className="w-3 h-3" />
                            </a>
                          )}
                          <button 
                            onClick={(e) => handleCopyLinks(order, e)}
                            className="flex items-center gap-1 px-2 py-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded text-xs transition-colors"
                          >
                            <Copy className="w-3 h-3" />
                            {copiedLink === order.id ? 'Copied!' : (Array.isArray(order.items) && order.items.length > 1 ? 'Copy All' : 'Copy')}
                          </button>
                        </div>
                      ) : (
                        <span className="text-zinc-500 text-xs">No Link</span>
                      )}
                    </td>
                    <td className="p-4">
                      {getStatusBadge(order.order_status)}
                    </td>
                    <td className="p-4 text-sm text-zinc-300 font-medium">¥{order.total ? Number(order.total).toFixed(2) : '0.00'}</td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => setSelectedOrder(order)} className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors" title="View Details">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button onClick={() => setSelectedOrder(order)} className="p-2 text-indigo-400 hover:text-white hover:bg-indigo-500/20 rounded-lg transition-colors" title="Edit Status">
                          <Edit className="w-4 h-4" />
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
        <div className="md:hidden flex flex-col divide-y divide-zinc-800">
          {loading ? (
            <div className="p-8 text-center text-zinc-500">Loading orders...</div>
          ) : filteredOrders.length === 0 ? (
            <div className="p-8 text-center text-zinc-500">No orders found.</div>
          ) : (
            filteredOrders.map(order => (
              <div key={order.id} className="p-4 flex flex-col gap-4 hover:bg-zinc-800/20 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex flex-col gap-1">
                    <p className="text-sm text-white font-mono font-medium">#{order.id}</p>
                    <p className="text-xs text-zinc-500">{order.customer_name || 'Unknown'}</p>
                  </div>
                  <div>{getStatusBadge(order.order_status)}</div>
                </div>

                <div className="grid grid-cols-2 gap-2 bg-zinc-950 p-3 rounded-xl border border-zinc-800/50">
                  <div>
                    <p className="text-xs text-zinc-500 mb-1">Product Link</p>
                    {order.product_link || (Array.isArray(order.items) && order.items.length > 0) ? (
                      <div className="flex flex-col gap-1">
                        {order.product_link && (
                          <a href={order.product_link} target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:text-indigo-300 text-xs flex items-center gap-1 w-fit">
                            Open <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                        <button 
                          onClick={(e) => handleCopyLinks(order, e)}
                          className="flex items-center gap-1 px-2 py-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded text-xs transition-colors w-fit"
                        >
                          <Copy className="w-3 h-3" />
                          {copiedLink === order.id ? 'Copied!' : (Array.isArray(order.items) && order.items.length > 1 ? 'Copy All' : 'Copy')}
                        </button>
                      </div>
                    ) : (
                      <span className="text-zinc-500 text-xs">No Link</span>
                    )}
                  </div>
                  <div>
                    <p className="text-xs text-zinc-500 mb-1">Total Due</p>
                    <p className="text-sm text-zinc-300 font-medium">¥{order.total ? Number(order.total).toFixed(2) : '0.00'}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <p className="text-[10px] text-zinc-600">{format(new Date(order.created_at), 'MMM dd, yyyy HH:mm')}</p>
                  <div className="flex items-center gap-2">
                    <button onClick={() => setSelectedOrder(order)} className="p-2 bg-zinc-800/50 text-zinc-400 hover:text-white rounded-xl transition-colors">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button onClick={() => setSelectedOrder(order)} className="p-2 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded-xl transition-colors">
                      <Edit className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Link Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col">
             {/* Header */}
             <div className="flex items-center justify-between p-6 border-b border-zinc-800 sticky top-0 bg-zinc-900/95 backdrop-blur-md z-10">
               <div>
                 <div className="flex items-center gap-3 mb-1">
                   <h2 className="text-xl font-bold text-white tracking-tight">Order #{selectedOrder.id}</h2>
                   <span className="px-2 py-1 rounded text-xs font-bold uppercase tracking-wider bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">LINK ORDER</span>
                 </div>
                 <p className="text-sm text-zinc-400 flex items-center gap-2">
                   <Clock className="w-4 h-4" /> Placed on {format(new Date(selectedOrder.created_at), 'MMM dd, yyyy HH:mm')}
                 </p>
               </div>
               <button onClick={() => setSelectedOrder(null)} className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-xl transition-colors">
                 <X className="w-6 h-6" />
               </button>
             </div>

             {/* Body */}
             <div className="p-6 space-y-6">
                {/* Top Info Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Customer Card */}
                  <div className="bg-zinc-950/50 border border-zinc-800/50 rounded-xl p-5">
                    <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-500 mb-4 flex items-center gap-2"><User className="w-4 h-4" /> Customer</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-zinc-400 text-sm">Name</span>
                        <span className="text-white font-medium">{selectedOrder.customer_name || 'Unknown User'}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-zinc-400 text-sm">ID</span>
                        <span className="text-zinc-300 font-mono text-sm">{selectedOrder.customer_unique_id || (selectedOrder.customer_id ? selectedOrder.customer_id.substring(0,8) : 'N/A')}</span>
                      </div>
                    </div>
                  </div>

                  {/* Financials Card */}
                  <div className="bg-zinc-950/50 border border-zinc-800/50 rounded-xl p-5">
                    <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-500 mb-4 flex items-center gap-2"><Receipt className="w-4 h-4" /> Financials</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-zinc-400 text-sm">Total Due</span>
                        <span className="text-white font-medium">¥{selectedOrder.total ? Number(selectedOrder.total).toFixed(2) : '0.00'}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-zinc-400 text-sm">Status</span>
                        {getStatusBadge(selectedOrder.order_status)}
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-zinc-400 text-sm">Payment</span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${selectedOrder.payment_status === 'paid' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' : 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20'}`}>
                          {selectedOrder.payment_status ? selectedOrder.payment_status.replace('_', ' ') : 'Awaiting Payment'}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-zinc-400 text-sm">Reference</span>
                        <span className="text-zinc-300 font-mono text-xs">{selectedOrder.payment_reference || 'N/A'}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Products Section */}
                <div className="bg-zinc-950/50 border border-zinc-800/50 rounded-xl p-5">
                   <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-500 mb-4 flex items-center gap-2"><Box className="w-4 h-4" /> Product Details</h3>
                   
                   {Array.isArray(selectedOrder.items) && selectedOrder.items.length > 1 ? (
                     <div className="overflow-x-auto rounded-lg border border-zinc-800">
                        <table className="w-full text-left text-sm">
                          <thead className="bg-zinc-900 border-b border-zinc-800">
                            <tr>
                              <th className="p-3 font-medium text-zinc-400">#</th>
                              <th className="p-3 font-medium text-zinc-400">Link</th>
                              <th className="p-3 font-medium text-zinc-400 text-center">Qty</th>
                              <th className="p-3 font-medium text-zinc-400 text-right">Price (¥)</th>
                              <th className="p-3 font-medium text-zinc-400">Tracking #</th>
                              <th className="p-3 font-medium text-zinc-400">Status</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-zinc-800">
                            {selectedOrder.items.map((item: any, idx: number) => (
                               <tr key={idx} className="hover:bg-zinc-900/50 transition-colors">
                                  <td className="p-3 text-zinc-500 font-mono">{idx + 1}</td>
                                  <td className="p-3">
                                    <div className="flex items-center gap-2">
                                      <a href={item.product_link} target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:text-indigo-300 flex items-center gap-1 max-w-[200px] truncate">
                                        View Link <ExternalLink className="w-3 h-3 flex-shrink-0" />
                                      </a>
                                    </div>
                                  </td>
                                  <td className="p-3 text-center text-white">{item.quantity || 1}</td>
                                  <td className="p-3 text-right text-zinc-300 font-medium">¥{item.price ? Number(item.price).toFixed(2) : '0.00'}</td>
                                  <td className="p-3 text-zinc-300 font-mono">{item.tracking_number || '-'}</td>
                                  <td className="p-3 text-zinc-400 text-xs capitalize">{item.status ? item.status.replace('_', ' ') : 'Pending'}</td>
                               </tr>
                            ))}
                          </tbody>
                        </table>
                        <div className="mt-4 flex justify-between items-center px-2">
                           <span className="text-sm text-zinc-400">Total Bundle Price</span>
                           <span className="text-lg text-white font-medium">¥{selectedOrder.cny_price ? Number(selectedOrder.cny_price).toFixed(2) : '0.00'}</span>
                        </div>
                     </div>
                   ) : (
                     <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="col-span-2 bg-zinc-900 p-4 rounded-lg border border-zinc-800">
                             <span className="text-xs text-zinc-500 block mb-1">Product Link</span>
                             <div className="flex items-center gap-2">
                                <a href={selectedOrder.product_link} target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:text-indigo-300 text-sm flex items-center gap-1 break-all">
                                  {selectedOrder.product_link} <ExternalLink className="w-3 h-3 flex-shrink-0" />
                                </a>
                                <button onClick={(e) => handleCopyLinks(selectedOrder, e)} className="p-1.5 bg-zinc-800 hover:bg-zinc-700 rounded text-zinc-400 transition-colors shrink-0">
                                  <Copy className="w-3 h-3" />
                                </button>
                             </div>
                          </div>
                          <div className="bg-zinc-900 p-4 rounded-lg border border-zinc-800">
                             <span className="text-xs text-zinc-500 block mb-1">Item Price</span>
                             <p className="text-lg text-white font-medium">¥{selectedOrder.cny_price ? Number(selectedOrder.cny_price).toFixed(2) : '0.00'}</p>
                          </div>
                          <div className="bg-zinc-900 p-4 rounded-lg border border-zinc-800">
                             <span className="text-xs text-zinc-500 block mb-1">Quantity</span>
                             <p className="text-lg text-white font-medium">{selectedOrder.quantity || 1}</p>
                          </div>
                          <div className="col-span-2 bg-zinc-900 p-4 rounded-lg border border-zinc-800">
                             <span className="text-xs text-zinc-500 block mb-1">Notes</span>
                             <p className="text-sm text-zinc-300 whitespace-pre-wrap">{selectedOrder.notes || 'None'}</p>
                          </div>
                        </div>

                        {selectedOrder.screenshot_url && (
                          <div className="mt-4">
                             <span className="text-xs text-zinc-500 block mb-2">Screenshot Preview</span>
                             <a href={selectedOrder.screenshot_url} target="_blank" rel="noopener noreferrer" className="block max-w-sm rounded-lg overflow-hidden border border-zinc-800 hover:border-indigo-500 transition-colors">
                               <img src={selectedOrder.screenshot_url} alt="Order Screenshot" className="w-full h-auto" />
                             </a>
                          </div>
                        )}
                     </div>
                   )}
                </div>
             </div>
          </div>
        </div>
      )}
    </div>
  );
}
