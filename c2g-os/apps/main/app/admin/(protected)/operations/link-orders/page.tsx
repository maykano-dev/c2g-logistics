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
                   
                   {(() => {
                     const { items: parsedItems, notes: cleanNotes } = (() => {
                        let displayItems = Array.isArray(selectedOrder.items) ? [...selectedOrder.items] : [];
                        let displayNotes = selectedOrder.notes || '';
                        
                        if (displayNotes.includes('JSON_ITEMS:')) {
                          try {
                            const parts = displayNotes.split('JSON_ITEMS:');
                            const jsonPart = parts[1];
                            const parsedItems = JSON.parse(jsonPart);
                            if (Array.isArray(parsedItems)) {
                              displayItems = parsedItems.map((item: any) => ({
                                product_link: item.link || item.product_link,
                                price: item.price,
                                quantity: item.qty || item.quantity,
                                screenshot_url: item.screenshotUrl || item.screenshot_url,
                                tracking_number: item.tracking_number,
                                status: item.status
                              }));
                            }
                            displayNotes = parts[0].replace(/HUBTEL_CHECKOUT:.*(\n|$)/g, '').trim();
                          } catch (e) {
                            console.error('Failed to parse JSON_ITEMS', e);
                          }
                        }
                        
                        if (displayItems.length === 0 && selectedOrder.product_link) {
                          displayItems = [{
                            product_link: selectedOrder.product_link,
                            price: selectedOrder.cny_price,
                            quantity: selectedOrder.quantity,
                            screenshot_url: selectedOrder.screenshot_url
                          }];
                        }
                        
                        return { items: displayItems, notes: displayNotes };
                     })();

                     return (
                       <div className="space-y-6">
                         {cleanNotes && (
                           <div className="bg-zinc-900 p-4 rounded-lg border border-zinc-800">
                             <span className="text-xs text-zinc-500 block mb-1">Notes</span>
                             <p className="text-sm text-zinc-300 whitespace-pre-wrap">{cleanNotes}</p>
                           </div>
                         )}

                         <div className="space-y-4">
                           {parsedItems.map((item: any, idx: number) => (
                             <div key={idx} className="flex flex-col sm:flex-row gap-4 p-4 bg-zinc-900 border border-zinc-800 rounded-xl">
                               <div className="w-full sm:w-32 h-32 rounded-lg overflow-hidden shrink-0 bg-zinc-950 border border-zinc-800 flex items-center justify-center">
                                 {item.screenshot_url ? (
                                   <a href={item.screenshot_url} target="_blank" rel="noopener noreferrer" className="w-full h-full block">
                                     <img src={item.screenshot_url} alt={`Item ${idx + 1}`} className="w-full h-full object-cover hover:scale-105 transition-transform" />
                                   </a>
                                 ) : (
                                   <div className="flex flex-col items-center justify-center text-zinc-600 gap-2">
                                     <ImageIcon className="w-8 h-8" />
                                     <span className="text-[10px] uppercase tracking-wider">No Image</span>
                                   </div>
                                 )}
                               </div>
                               
                               <div className="flex-1 min-w-0 flex flex-col justify-between">
                                 <div className="flex items-start justify-between gap-4 mb-3">
                                   <div className="flex-1 min-w-0">
                                     <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider mb-1 block">Item #{idx + 1}</span>
                                     <a href={item.product_link} target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:text-indigo-300 text-sm font-medium break-all line-clamp-2">
                                       {item.product_link || 'No Link Provided'}
                                     </a>
                                   </div>
                                   <button 
                                     onClick={(e) => {
                                        e.stopPropagation();
                                        if(item.product_link) {
                                          navigator.clipboard.writeText(item.product_link);
                                          setCopiedLink(`item-${idx}`);
                                          setTimeout(() => setCopiedLink(null), 2000);
                                        }
                                     }} 
                                     className="p-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-zinc-400 transition-colors shrink-0"
                                     title="Copy Link"
                                   >
                                     {copiedLink === `item-${idx}` ? <CheckCircle className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                                   </button>
                                 </div>
                                 
                                 <div className="grid grid-cols-3 gap-2 py-2 border-y border-zinc-800/50 mb-3">
                                   <div>
                                     <span className="text-xs text-zinc-500 block mb-0.5">Price</span>
                                     <span className="text-sm text-white font-medium">¥{item.price ? Number(item.price).toFixed(2) : '0.00'}</span>
                                   </div>
                                   <div>
                                     <span className="text-xs text-zinc-500 block mb-0.5">Quantity</span>
                                     <span className="text-sm text-white font-medium">{item.quantity || 1}</span>
                                   </div>
                                   <div>
                                     <span className="text-xs text-zinc-500 block mb-0.5">Total</span>
                                     <span className="text-sm text-indigo-400 font-medium">¥{((item.price || 0) * (item.quantity || 1)).toFixed(2)}</span>
                                   </div>
                                 </div>

                                 <div className="flex flex-wrap gap-4">
                                   <div>
                                     <span className="text-xs text-zinc-500 block mb-0.5">Tracking #</span>
                                     <span className="text-sm text-zinc-300 font-mono bg-zinc-950 px-2 py-0.5 rounded border border-zinc-800/50">{item.tracking_number || 'N/A'}</span>
                                   </div>
                                   <div>
                                     <span className="text-xs text-zinc-500 block mb-0.5">Item Status</span>
                                     <span className="text-xs px-2 py-1 rounded bg-zinc-800 text-zinc-300 capitalize">{item.status ? item.status.replace('_', ' ') : 'Pending'}</span>
                                   </div>
                                 </div>
                               </div>
                             </div>
                           ))}
                         </div>
                       </div>
                     );
                   })()}
                </div>
             </div>
          </div>
        </div>
      )}
    </div>
  );
}
