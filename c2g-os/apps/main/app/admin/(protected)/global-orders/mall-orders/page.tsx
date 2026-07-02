'use client';

import { useState, useEffect, useTransition } from 'react';
import { createClient } from '@/utils/supabase/client';
import { Search, Filter, Eye, Edit, Copy, Save, X, ExternalLink, Package, CheckCircle2, AlertCircle, Trash2, Bell, Truck, CreditCard, Calendar, Ship, Plane } from 'lucide-react';
import { format } from 'date-fns';
import { updateMallOrderStatus, invoiceMallOrderShipping, updateMallOrderPaymentStatus, updateMallOrderShippingMethod, deleteMallOrder } from './actions';

// Mapped from DB enum values for Order Status
const STATUS_OPTIONS = [
  { value: 'pending_payment', label: 'Pending Payment', color: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/30' },
  { value: 'processing', label: 'Processing', color: 'bg-blue-500/10 text-blue-400 border-blue-500/30' },
  { value: 'purchased', label: 'Purchased', color: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/30' },
  { value: 'in_warehouse', label: 'In Warehouse', color: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30' },
  { value: 'in_transit', label: 'In Transit', color: 'bg-purple-500/10 text-purple-400 border-purple-500/30' },
  { value: 'clearing_customs', label: 'Clearance', color: 'bg-orange-500/10 text-orange-400 border-orange-500/30' },
  { value: 'ready_for_pickup', label: 'Available for pickup', color: 'bg-teal-500/10 text-teal-400 border-teal-500/30' },
  { value: 'shipped', label: 'Shipped', color: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30' },
  { value: 'delivered', label: 'Delivered', color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/50' },
  { value: 'cancelled', label: 'Cancelled', color: 'bg-red-500/10 text-red-400 border-red-500/30' }
];

export default function AdminMallOrdersView() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modal State
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [shippingFeeInput, setShippingFeeInput] = useState<string>('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  
  // Toast State
  const [toast, setToast] = useState<{message: string, type: 'success'|'error'} | null>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    const supabase = createClient();
    const { data, error } = await supabase
      .from('ecom_orders')
      .select('*')
      .order('created_at', { ascending: false });

    if (data && !error) setOrders(data);
    setLoading(false);
  };

  const handleStatusChange = (id: string, newStatus: string) => {
    setOrders(prev => prev.map(o => o.id === id ? { ...o, order_status: newStatus } : o));
    if (selectedOrder?.id === id) setSelectedOrder((prev: any) => ({ ...prev, order_status: newStatus }));
    startTransition(async () => {
      await updateMallOrderStatus(id, newStatus);
    });
  };

  const handlePaymentStatusChange = (id: string, newStatus: string) => {
    setOrders(prev => prev.map(o => o.id === id ? { ...o, payment_status: newStatus } : o));
    if (selectedOrder?.id === id) setSelectedOrder((prev: any) => ({ ...prev, payment_status: newStatus }));
    startTransition(async () => {
      await updateMallOrderPaymentStatus(id, newStatus);
    });
  };

  const handleShippingMethodChange = (id: string, newMethod: string) => {
    setOrders(prev => prev.map(o => o.id === id ? { ...o, shipping_method: newMethod } : o));
    if (selectedOrder?.id === id) setSelectedOrder((prev: any) => ({ ...prev, shipping_method: newMethod }));
    startTransition(async () => {
      await updateMallOrderShippingMethod(id, newMethod);
    });
  };

  const handleDeleteOrder = (id: string) => {
    if (!confirm('Are you sure you want to permanently delete this order?')) return;
    setOrders(prev => prev.filter(o => o.id !== id));
    setSelectedOrder(null);
    startTransition(async () => {
      await deleteMallOrder(id);
      showToast('Order deleted successfully', 'success');
    });
  };

  const handleOpenModal = (order: any) => {
    setSelectedOrder(order);
    setShippingFeeInput(order.shipping_cost ? String(order.shipping_cost) : '');
  };

  const handleInvoiceShipping = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrder || !shippingFeeInput) return;
    const amount = parseFloat(shippingFeeInput);
    if (isNaN(amount)) return;

    startTransition(async () => {
      const res = await invoiceMallOrderShipping(selectedOrder.id, amount);
      if (res.success) {
        showToast('Shipping fee invoiced & user notified successfully!', 'success');
        setOrders(prev => prev.map(o => o.id === selectedOrder.id ? { ...o, shipping_cost: amount } : o));
        setSelectedOrder((prev: any) => ({ ...prev, shipping_cost: amount }));
        setShippingFeeInput('');
      } else {
        showToast('Failed: ' + res.error, 'error');
      }
    });
  };

  const handleCopySuccess = (id: string) => {
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    showToast('Copied to clipboard!', 'success');
    handleCopySuccess(id);
  };

  const copyImageToClipboard = async (url: string, id: string) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      await navigator.clipboard.write([
        new ClipboardItem({
          [blob.type]: blob
        })
      ]);
      showToast('Image copied to clipboard!', 'success');
      handleCopySuccess(id);
    } catch (err) {
      console.error('Failed to copy actual image data:', err);
      try {
        await navigator.clipboard.writeText(url);
        showToast('Image URL copied to clipboard (direct image copy blocked)', 'success');
        handleCopySuccess(id);
      } catch (fallbackErr) {
        showToast('Failed to copy image', 'error');
      }
    }
  };

  const copyAllLinks = (items: any[]) => {
    const links = items.map(i => {
      if (i.url) return i.url;
      if (i.product_url) return i.product_url;
      if (i.product_link) return i.product_link;
      return 'No supplier link';
    }).join('\n');
    navigator.clipboard.writeText(links);
    showToast('Copied all supplier links!', 'success');
    handleCopySuccess('all_links');
  };

  const getStatusColor = (status: string) => {
    const option = STATUS_OPTIONS.find(o => o.value === status);
    return option ? option.color : 'bg-zinc-500/10 text-zinc-400 border-zinc-500/30';
  };

  const filteredOrders = orders.filter(o => 
    o.order_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    o.customer_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-24 relative">
      {/* Toast Notification */}
      {toast && (
        <div className={`fixed top-4 right-4 z-[100] flex items-center gap-2 px-4 py-3 rounded-xl shadow-2xl border ${toast.type === 'success' ? 'bg-emerald-950/90 border-emerald-900/50 text-emerald-400' : 'bg-red-950/90 border-red-900/50 text-red-400'} animate-in slide-in-from-top-2 fade-in duration-300`}>
          {toast.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
          <span className="text-sm font-medium">{toast.message}</span>
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Mall Orders</h1>
          <p className="text-zinc-400">Manage C2G Mall purchases and dispatch logistics.</p>
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

      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden relative">
        <div className="overflow-x-auto hidden md:block [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          <table className="w-full text-left border-collapse whitespace-nowrap">
            <thead>
              <tr className="border-b border-zinc-800 bg-zinc-950/50">
                <th className="p-4 text-xs font-semibold text-zinc-400 uppercase tracking-wider">Date & ID</th>
                <th className="p-4 text-xs font-semibold text-zinc-400 uppercase tracking-wider">Customer</th>
                <th className="p-4 text-xs font-semibold text-zinc-400 uppercase tracking-wider">Payment</th>
                <th className="p-4 text-xs font-semibold text-zinc-400 uppercase tracking-wider">Status</th>
                <th className="p-4 text-xs font-semibold text-zinc-400 uppercase tracking-wider">Items</th>
                <th className="p-4 text-xs font-semibold text-zinc-400 uppercase tracking-wider">Shipping Fee</th>
                <th className="p-4 text-xs font-semibold text-zinc-400 uppercase tracking-wider">Total (GHS)</th>
                <th className="p-4 text-xs font-semibold text-zinc-400 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800">
              {loading ? (
                <tr><td colSpan={8} className="p-8 text-center text-zinc-500">Loading mall orders...</td></tr>
              ) : filteredOrders.length === 0 ? (
                <tr><td colSpan={8} className="p-8 text-center text-zinc-500">No mall orders found.</td></tr>
              ) : (
                filteredOrders.map(order => {
                  const itemsList = Array.isArray(order.items) ? order.items : [];
                  const statusVal = order.order_status || order.procurement_status || 'pending_payment';
                  return (
                    <tr key={order.id} className="hover:bg-zinc-800/50 transition-colors group">
                      <td className="p-4">
                        <p className="text-sm text-white font-mono font-medium">{order.order_id || 'N/A'}</p>
                        <p className="text-[10px] text-zinc-500 mt-1">{format(new Date(order.created_at), 'MMM dd, yyyy HH:mm')}</p>
                      </td>
                      <td className="p-4">
                        <p className="text-sm text-zinc-200">{order.customer_name || 'Unknown'}</p>
                        <p className="text-[10px] text-zinc-500">{order.customer_phone || order.customer_email}</p>
                      </td>
                      <td className="p-4">
                        <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                          order.payment_status === 'paid' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' :
                          order.payment_status === 'failed' ? 'bg-red-500/10 text-red-500 border border-red-500/20' :
                          'bg-amber-500/10 text-amber-500 border border-amber-500/20'
                        }`}>
                          {order.payment_status || 'pending'}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="relative inline-block w-fit">
                          <select
                            value={statusVal}
                            onChange={(e) => handleStatusChange(order.id, e.target.value)}
                            disabled={isPending}
                            className={`appearance-none px-3 py-1.5 pr-8 rounded-lg text-xs font-bold tracking-wider border outline-none cursor-pointer transition-all disabled:opacity-50 ${getStatusColor(statusVal)}`}
                            style={{ backgroundImage: 'url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'currentColor\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3e%3cpolyline points=\'6 9 12 15 18 9\'%3e%3c/polyline%3e%3c/svg%3e")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.5rem center', backgroundSize: '1em' }}
                          >
                            {STATUS_OPTIONS.map(s => <option key={s.value} value={s.value} className="bg-zinc-900 text-white">{s.label}</option>)}
                          </select>
                        </div>
                      </td>
                      <td className="p-4 text-sm text-zinc-300">
                        {itemsList.length} items
                      </td>
                      <td className="p-4 text-sm text-zinc-300">
                        {order.shipping_cost ? <span className="text-emerald-400 font-medium">₵{order.shipping_cost}</span> : <span className="text-yellow-500 text-xs font-medium">Pending Invoice</span>}
                      </td>
                      <td className="p-4 text-sm text-zinc-300 font-medium">₵{order.total_amount || order.total_cost_ghs ? Number(order.total_amount || order.total_cost_ghs).toFixed(2) : '0.00'}</td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button 
                            onClick={() => handleOpenModal(order)}
                            className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors" 
                            title="View Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Card Layout */}
          <div className="md:hidden flex flex-col divide-y divide-zinc-800">
            {loading ? (
              <div className="p-8 text-center text-zinc-500">Loading mall orders...</div>
            ) : filteredOrders.length === 0 ? (
              <div className="p-8 text-center text-zinc-500">No mall orders found.</div>
            ) : (
              filteredOrders.map(order => {
                const itemsList = Array.isArray(order.items) ? order.items : [];
                const statusVal = order.order_status || order.procurement_status || 'pending_payment';
                return (
                  <div key={order.id} className="p-4 flex flex-col gap-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-sm text-white font-mono font-medium">{order.order_id || 'N/A'}</p>
                        <p className="text-xs text-zinc-400 mt-0.5">{order.customer_name || 'Unknown'}</p>
                      </div>
                      <button 
                        onClick={() => handleOpenModal(order)}
                        className="bg-zinc-800/50 hover:bg-zinc-800 text-white p-2 rounded-xl transition-colors" 
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </div>
                    
                    <div className="flex flex-wrap gap-2">
                      <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                        order.payment_status === 'paid' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' :
                        order.payment_status === 'failed' ? 'bg-red-500/10 text-red-500 border border-red-500/20' :
                        'bg-amber-500/10 text-amber-500 border border-amber-500/20'
                      }`}>
                        {order.payment_status || 'pending'}
                      </span>
                      <div className="relative inline-block">
                        <select
                          value={statusVal}
                          onChange={(e) => handleStatusChange(order.id, e.target.value)}
                          disabled={isPending}
                          className={`appearance-none px-3 py-1 pr-6 rounded-md text-[10px] font-bold tracking-wider border outline-none cursor-pointer transition-all disabled:opacity-50 ${getStatusColor(statusVal)}`}
                          style={{ backgroundImage: 'url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'currentColor\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3e%3cpolyline points=\'6 9 12 15 18 9\'%3e%3c/polyline%3e%3c/svg%3e")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.25rem center', backgroundSize: '1em' }}
                        >
                          {STATUS_OPTIONS.map(s => <option key={s.value} value={s.value} className="bg-zinc-900 text-white">{s.label}</option>)}
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-sm bg-zinc-950 p-3 rounded-xl border border-zinc-800/50">
                      <div>
                        <p className="text-xs text-zinc-500 mb-1">Items</p>
                        <p className="text-zinc-300 font-medium">{itemsList.length}</p>
                      </div>
                      <div>
                        <p className="text-xs text-zinc-500 mb-1">Shipping</p>
                        <p className="text-zinc-300 font-medium">
                          {order.shipping_cost ? <span className="text-emerald-400">₵{order.shipping_cost}</span> : <span className="text-yellow-500 text-xs">Pending Invoice</span>}
                        </p>
                      </div>
                      <div className="col-span-2 pt-2 border-t border-zinc-800/50 mt-1">
                        <div className="flex justify-between items-center">
                          <p className="text-xs text-zinc-500">Total Due</p>
                          <p className="text-white font-bold">₵{order.total_amount || order.total_cost_ghs ? Number(order.total_amount || order.total_cost_ghs).toFixed(2) : '0.00'}</p>
                        </div>
                      </div>
                    </div>
                    
                    <p className="text-[10px] text-zinc-600 text-center">{format(new Date(order.created_at), 'MMM dd, yyyy HH:mm')}</p>
                  </div>
                )
              })
            )}
          </div>
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-0 md:p-4" onClick={() => setSelectedOrder(null)}>
          <div 
            className="bg-zinc-950 md:border md:border-zinc-800 md:rounded-3xl w-full h-full md:h-auto max-w-4xl max-h-[100dvh] md:max-h-[90vh] overflow-hidden flex flex-col animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shrink-0">
              <div className="flex items-center gap-3">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <Package className="w-5 h-5 text-indigo-500" /> {selectedOrder.order_id}
                </h2>
                <div className="flex gap-2">
                  <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                    selectedOrder.payment_status === 'paid' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' :
                    selectedOrder.payment_status === 'failed' ? 'bg-red-500/10 text-red-500 border border-red-500/20' :
                    'bg-amber-500/10 text-amber-500 border border-amber-500/20'
                  }`}>
                    {selectedOrder.payment_status || 'pending'}
                  </span>
                  <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${getStatusColor(selectedOrder.order_status || selectedOrder.procurement_status || 'pending_payment')}`}>
                    {(selectedOrder.order_status || selectedOrder.procurement_status || 'pending_payment').replace(/_/g, ' ')}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => handleDeleteOrder(selectedOrder.id)} disabled={isPending} className="p-2 text-zinc-400 hover:text-red-400 bg-zinc-900 hover:bg-red-500/10 border border-zinc-800 rounded-lg transition-colors disabled:opacity-50" title="Delete Order">
                  <Trash2 className="w-4 h-4" />
                </button>
                <button onClick={() => setSelectedOrder(null)} className="p-2 text-zinc-400 hover:text-white bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 rounded-lg transition-colors"><X className="w-4 h-4"/></button>
              </div>
            </div>

            <div className="overflow-y-auto flex-1 flex flex-col [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
              <div className="px-4 sm:px-6 py-4 bg-zinc-900/50 border-b border-zinc-800 flex flex-col sm:flex-row flex-wrap gap-4 items-center shrink-0">
                <div className="w-full sm:flex-1 sm:min-w-[200px]">
                  <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-1">Order Status</label>
                  <select value={selectedOrder.order_status || selectedOrder.procurement_status || 'pending_payment'} onChange={(e) => handleStatusChange(selectedOrder.id, e.target.value)} disabled={isPending} className="w-full bg-zinc-950 border border-zinc-800 rounded-lg py-2 pl-3 pr-8 text-sm text-white focus:outline-none focus:border-indigo-500 appearance-none">
                    {STATUS_OPTIONS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                  </select>
                </div>
                <div className="w-full sm:flex-1 sm:min-w-[200px]">
                  <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-1">Payment Status</label>
                  <select value={selectedOrder.payment_status || 'pending'} onChange={(e) => handlePaymentStatusChange(selectedOrder.id, e.target.value)} disabled={isPending} className="w-full bg-zinc-950 border border-zinc-800 rounded-lg py-2 pl-3 pr-8 text-sm text-white focus:outline-none focus:border-indigo-500 appearance-none">
                    <option value="pending">Pending</option>
                    <option value="paid">Paid</option>
                    <option value="failed">Failed</option>
                    <option value="refunded">Refunded</option>
                  </select>
                </div>
                <div className="w-full sm:flex-1 sm:min-w-[200px]">
                  <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-1">Shipping Method</label>
                  <select value={selectedOrder.shipping_method || 'sea'} onChange={(e) => handleShippingMethodChange(selectedOrder.id, e.target.value)} disabled={isPending} className="w-full bg-zinc-950 border border-zinc-800 rounded-lg py-2 pl-3 pr-8 text-sm text-white focus:outline-none focus:border-indigo-500 appearance-none">
                    <option value="sea">🚢 Sea Shipping</option>
                    <option value="normal">✈️ Air Normal</option>
                    <option value="express">⚡ Air Express</option>
                  </select>
                </div>
                <div className="w-full sm:w-auto flex items-end self-stretch py-1">
                   {selectedOrder.payment_status !== 'paid' && (
                      <div className="w-full sm:w-auto h-full px-4 py-2 sm:py-0 bg-zinc-800/50 text-zinc-500 border border-zinc-800/50 rounded-lg text-[10px] font-medium flex items-center justify-center gap-2 cursor-not-allowed" title="Reminders are sent automatically via the system cron job">
                        <Bell className="w-3 h-3"/> Auto-Reminders Active
                      </div>
                   )}
                </div>
              </div>

              <div className="p-4 sm:p-6 flex-1 space-y-8">
              
              {/* Top Info Grid */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4">
                  <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-4 flex items-center gap-2"><Package className="w-4 h-4"/> Order Info</h3>
                  <div className="space-y-2">
                    <p className="text-sm text-white flex justify-between"><span className="text-zinc-500">Date:</span> {format(new Date(selectedOrder.created_at), 'MMM dd, yyyy HH:mm')}</p>
                    <p className="text-sm text-white flex justify-between"><span className="text-zinc-500">Ref:</span> <span className="font-mono text-xs bg-zinc-950 px-1 py-0.5 rounded border border-zinc-800">{selectedOrder.payment_reference || selectedOrder.reference || 'N/A'}</span></p>
                    <p className="text-sm text-white flex justify-between"><span className="text-zinc-500">Gateway:</span> <span className="capitalize">{selectedOrder.payment_gateway || 'hubtel'}</span></p>
                  </div>
                </div>

                <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4">
                  <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-4 flex items-center gap-2"><CreditCard className="w-4 h-4"/> Customer</h3>
                  <div className="space-y-2">
                    <p className="text-sm text-white font-medium">{selectedOrder.customer_name}</p>
                    <p className="text-sm text-zinc-400">{selectedOrder.customer_email}</p>
                    <p className="text-sm text-zinc-400">{selectedOrder.customer_phone}</p>
                  </div>
                </div>

                <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4">
                  <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-4 flex items-center gap-2"><Truck className="w-4 h-4"/> Delivery</h3>
                  <div className="space-y-2">
                    <p className="text-sm text-zinc-300 leading-relaxed">{selectedOrder.shipping_address || 'No address provided'}</p>
                    {selectedOrder.shipping_notes && <p className="text-xs text-zinc-400 italic">Note: {selectedOrder.shipping_notes}</p>}
                    {selectedOrder.estimated_delivery && <p className="text-xs text-emerald-400 mt-2 font-medium">Est. Delivery: {format(new Date(selectedOrder.estimated_delivery), 'MMM dd, yyyy')}</p>}
                  </div>
                </div>

                <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 flex flex-col justify-between">
                  <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-4">Invoice Shipping Fee</h3>
                  <form onSubmit={handleInvoiceShipping} className="space-y-3">
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 font-medium">₵</span>
                        <input 
                          type="number" step="0.01" 
                          value={shippingFeeInput} onChange={e => setShippingFeeInput(e.target.value)}
                          className="w-full bg-zinc-950 border border-zinc-800 rounded-xl py-2 pl-8 pr-4 text-sm text-white outline-none focus:border-indigo-500"
                          placeholder="0.00"
                          required
                        />
                      </div>
                      <button type="submit" disabled={isPending} className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-xl text-sm font-bold flex items-center gap-2 shrink-0">
                        <Save className="w-4 h-4"/> {selectedOrder.shipping_cost ? 'Update' : 'Save'}
                      </button>
                    </div>
                    <p className="text-[10px] text-zinc-500">{selectedOrder.shipping_cost ? 'Updating this will override the previous fee.' : 'Saving this will notify the user to pay.'}</p>
                  </form>
                </div>
              </div>

              {/* Items List */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider">Items to Purchase</h3>
                  <button 
                    onClick={() => copyAllLinks(selectedOrder.items || [])}
                    className="flex items-center gap-2 px-3 py-1.5 bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/30 text-indigo-400 hover:text-indigo-300 rounded-lg text-xs font-bold transition-all duration-300 w-32 justify-center"
                  >
                    {copiedId === 'all_links' ? (
                      <><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Copied!</>
                    ) : (
                      <><Copy className="w-3.5 h-3.5" /> Copy All</>
                    )}
                  </button>
                </div>
                
                <div className="border border-zinc-800 rounded-2xl overflow-x-auto">
                  <table className="w-full text-left border-collapse min-w-[700px] hidden sm:table">
                    <thead className="bg-zinc-900 border-b border-zinc-800">
                      <tr>
                        <th className="p-4 text-xs font-semibold text-zinc-400">Item Name</th>
                        <th className="p-4 text-xs font-semibold text-zinc-400">Options</th>
                        <th className="p-4 text-xs font-semibold text-zinc-400 text-center">Qty</th>
                        <th className="p-4 text-xs font-semibold text-zinc-400 text-right">Unit Price</th>
                        <th className="p-4 text-xs font-semibold text-zinc-400 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-800">
                      {(selectedOrder.items || []).map((item: any, i: number) => {
                        const supplierUrl = item.url || item.product_url || item.product_link;
                        const c2gUrl = item.productId ? `https://c2g-logistics.com/shop/product/${item.productId}` : null;
                        const imageUrl = item.image_url || item.image || item.thumbnail;
                        
                        return (
                        <tr key={i} className="hover:bg-zinc-900/50">
                          <td className="p-4">
                            <div className="flex items-center gap-4">
                              {imageUrl ? (
                                <div 
                                  className="relative group/image w-16 h-16 shrink-0 rounded-xl overflow-hidden bg-zinc-800 cursor-pointer border border-zinc-700/50" 
                                  onClick={() => copyImageToClipboard(imageUrl, `image_${i}`)} 
                                  title="Click to copy image"
                                >
                                  <img src={imageUrl} alt={item.name} className="w-full h-full object-cover transition-all duration-300 group-hover/image:scale-110 group-hover/image:opacity-40" />
                                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/image:opacity-100 transition-opacity duration-300">
                                    {copiedId === `image_${i}` ? (
                                      <CheckCircle2 className="w-6 h-6 text-emerald-400 drop-shadow-lg scale-110 transition-transform" />
                                    ) : (
                                      <Copy className="w-6 h-6 text-white drop-shadow-lg" />
                                    )}
                                  </div>
                                </div>
                              ) : (
                                <div className="w-16 h-16 rounded-xl bg-zinc-800/50 border border-zinc-800 flex items-center justify-center shrink-0">
                                  <Package className="w-6 h-6 text-zinc-600" />
                                </div>
                              )}
                              <p className="text-sm font-medium text-white max-w-[150px] sm:max-w-[200px] line-clamp-2" title={item.name}>{item.name}</p>
                            </div>
                          </td>
                          <td className="p-4">
                            {item.variants && Object.keys(item.variants).length > 0 ? (
                              <div className="space-y-1">
                                {Object.entries(item.variants).map(([k, v]) => (
                                  <p key={k} className="text-[11px] text-zinc-400 capitalize">
                                    {k}: <span className="text-zinc-200 font-medium">{String(v)}</span>
                                  </p>
                                ))}
                              </div>
                            ) : (
                              <p className="text-xs text-zinc-500">N/A</p>
                            )}
                          </td>
                          <td className="p-4 text-center text-sm text-white font-medium">{item.quantity}</td>
                          <td className="p-4 text-right">
                            <span className="inline-flex items-center px-2 py-1 rounded-md bg-zinc-800 border border-zinc-700/50 text-xs font-bold text-zinc-300">
                              ¥{item.price_cny || '0.00'}
                            </span>
                          </td>
                          <td className="p-4 text-right">
                            <div className="flex items-center justify-end gap-2 flex-wrap">
                              {supplierUrl && (
                                <a href={supplierUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1 px-2 py-1.5 text-zinc-400 hover:text-indigo-400 bg-zinc-900 hover:bg-indigo-500/10 border border-zinc-800 rounded-md transition-colors text-[10px] font-medium" title="Original Supplier Link">
                                  <ExternalLink className="w-3 h-3" /> Supplier
                                </a>
                              )}
                              {c2gUrl && (
                                <a href={c2gUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1 px-2 py-1.5 text-zinc-400 hover:text-indigo-400 bg-zinc-900 hover:bg-indigo-500/10 border border-zinc-800 rounded-md transition-colors text-[10px] font-medium" title="C2G Mall Link">
                                  <ExternalLink className="w-3 h-3" /> C2G
                                </a>
                              )}
                              {(supplierUrl || c2gUrl) ? (
                                <button onClick={() => copyToClipboard(supplierUrl || c2gUrl || '', `link_${i}`)} className="p-2 text-indigo-400 hover:text-indigo-300 bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/30 rounded-md transition-all duration-300 w-9 h-9 flex items-center justify-center" title="Copy Best Link">
                                  {copiedId === `link_${i}` ? (
                                    <CheckCircle2 className="w-4 h-4 text-emerald-400 scale-110 transition-transform" />
                                  ) : (
                                    <Copy className="w-4 h-4" />
                                  )}
                                </button>
                              ) : <span className="text-xs text-zinc-600">No Link</span>}
                            </div>
                          </td>
                        </tr>
                      )})}
                    </tbody>
                  </table>

                  {/* Mobile Cards for Items */}
                  <div className="sm:hidden flex flex-col divide-y divide-zinc-800">
                    {(selectedOrder.items || []).map((item: any, i: number) => {
                      const supplierUrl = item.url || item.product_url || item.product_link;
                      const c2gUrl = item.productId ? `https://c2g-logistics.com/shop/product/${item.productId}` : null;
                      const imageUrl = item.image_url || item.image || item.thumbnail;
                      
                      return (
                        <div key={i} className="p-4 flex flex-col gap-3 hover:bg-zinc-900/50 transition-colors">
                          <div className="flex gap-4">
                            {imageUrl ? (
                              <div 
                                className="relative group/image w-20 h-20 shrink-0 rounded-xl overflow-hidden bg-zinc-800 cursor-pointer border border-zinc-700/50" 
                                onClick={() => copyImageToClipboard(imageUrl, `image_${i}_mobile`)} 
                              >
                                <img src={imageUrl} alt={item.name} className="w-full h-full object-cover" />
                                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/image:opacity-100 bg-black/40 transition-opacity duration-300">
                                  {copiedId === `image_${i}_mobile` ? <CheckCircle2 className="w-6 h-6 text-emerald-400" /> : <Copy className="w-6 h-6 text-white" />}
                                </div>
                              </div>
                            ) : (
                              <div className="w-20 h-20 rounded-xl bg-zinc-800/50 border border-zinc-800 flex items-center justify-center shrink-0">
                                <Package className="w-6 h-6 text-zinc-600" />
                              </div>
                            )}
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-white line-clamp-2 leading-tight mb-1">{item.name}</p>
                              <p className="text-xs text-zinc-400 font-medium">Qty: {item.quantity}</p>
                              <div className="mt-1">
                                {item.variants && Object.keys(item.variants).length > 0 ? (
                                  <div className="flex flex-wrap gap-1">
                                    {Object.entries(item.variants).map(([k, v]) => (
                                      <span key={k} className="text-[10px] bg-zinc-800 text-zinc-300 px-1.5 py-0.5 rounded-md border border-zinc-700/50">{String(v)}</span>
                                    ))}
                                  </div>
                                ) : (
                                  <span className="text-[10px] text-zinc-500">No options</span>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center justify-between pt-2 border-t border-zinc-800/50">
                            <span className="inline-flex items-center px-2 py-1 rounded-md bg-zinc-800 border border-zinc-700/50 text-sm font-bold text-zinc-200">
                              ¥{item.price_cny || '0.00'}
                            </span>
                            <div className="flex items-center gap-2">
                              {supplierUrl && (
                                <a href={supplierUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1 px-2 py-1 text-zinc-400 bg-zinc-900 border border-zinc-800 rounded-md text-[10px] font-medium"><ExternalLink className="w-3 h-3" /> Supplier</a>
                              )}
                              {(supplierUrl || c2gUrl) && (
                                <button onClick={() => copyToClipboard(supplierUrl || c2gUrl || '', `link_${i}_mobile`)} className="p-1.5 text-indigo-400 bg-indigo-500/10 border border-indigo-500/30 rounded-md w-7 h-7 flex items-center justify-center transition-colors">
                                  {copiedId === `link_${i}_mobile` ? <CheckCircle2 className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>

                {/* Financial Summary */}
                <div className="flex justify-end pt-2 pb-6 pr-2">
                  <div className="w-full max-w-sm bg-zinc-900 border border-zinc-800 rounded-2xl p-5 space-y-4 shadow-xl">
                    <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2 flex items-center gap-2"><CreditCard className="w-4 h-4"/> Financial Summary</h3>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-zinc-400">Subtotal</span>
                      <span className="text-sm text-white font-medium">¥{selectedOrder.subtotal || selectedOrder.items?.reduce((acc: number, item: any) => acc + ((item.price_cny || 0) * (item.quantity || 1)), 0).toFixed(2) || '0.00'}</span>
                    </div>
                    
                    {selectedOrder.service_fee > 0 && (
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-zinc-400">Service Fee</span>
                        <span className="text-sm text-white font-medium">¥{selectedOrder.service_fee.toFixed(2)}</span>
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-zinc-400">Shipping Fee</span>
                      <span className="text-sm text-emerald-400 font-bold">₵{selectedOrder.shipping_cost || '0.00'}</span>
                    </div>
                    
                    <div className="pt-4 mt-2 border-t border-zinc-800/80 flex items-center justify-between">
                      <span className="text-base font-bold text-white">Grand Total</span>
                      <span className="text-xl text-white font-black tracking-tight">₵{((selectedOrder.total_amount || selectedOrder.total_cost_ghs || 0) + (selectedOrder.shipping_cost || 0)).toFixed(2)}</span>
                    </div>
                  </div>
                </div>

              </div>

              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
