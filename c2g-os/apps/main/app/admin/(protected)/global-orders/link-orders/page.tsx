'use client';

import { useState, useEffect, useTransition } from 'react';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/client';
import { 
  Search, Filter, Plus, Edit, Eye, Clock, CheckCircle, XCircle, 
  Link as LinkIcon, Copy, X, ExternalLink, Image as ImageIcon, 
  Box, User, CreditCard, Receipt, Trash2, Save, AlertCircle, CheckCircle2
} from 'lucide-react';
import { format } from 'date-fns';
import { updateLinkOrderStatus, invoiceLinkOrderShipping, updateLinkOrderPaymentStatus, getAllLinkOrders } from './actions';
import { useModal } from '@/components/providers/modal-provider';

const STATUS_OPTIONS = [
  { value: 'pending_payment', label: 'Pending Payment', color: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/30' },
  { value: 'processing', label: 'Processing', color: 'bg-blue-500/10 text-blue-400 border-blue-500/30' },
  { value: 'purchased', label: 'Purchased', color: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/30' },
  { value: 'in_warehouse', label: 'China Warehouse', color: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30' },
  { value: 'in_transit', label: 'In Transit', color: 'bg-purple-500/10 text-purple-400 border-purple-500/30' },
  { value: 'clearing_customs', label: 'Clearance', color: 'bg-orange-500/10 text-orange-400 border-orange-500/30' },
  { value: 'ready_for_pickup', label: 'Available for pickup', color: 'bg-teal-500/10 text-teal-400 border-teal-500/30' },
  { value: 'shipped', label: 'Shipped', color: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30' },
  { value: 'delivered', label: 'Delivered', color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/50' },
  { value: 'cancelled', label: 'Cancelled', color: 'bg-red-500/10 text-red-400 border-red-500/30' }
];

export function LinkOrdersView({ readOnly = false }: { readOnly?: boolean }) {
  const { showAlert, showConfirm } = useModal();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All Statuses');
  const [filterPayment, setFilterPayment] = useState('All Payments');
  const [filterMode, setFilterMode] = useState('All Modes');
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [copiedLink, setCopiedLink] = useState<string | null>(null);
  const [shippingFeeInput, setShippingFeeInput] = useState<string>('');
  const [toast, setToast] = useState<{message: string, type: 'success'|'error'} | null>(null);
  const [isPending, startTransition] = useTransition();
  const [trackingInputs, setTrackingInputs] = useState<Record<number, string>>({});

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleOpenModal = (order: any) => {
    setSelectedOrder(order);
    setShippingFeeInput(order.shipping_cost ? String(order.shipping_cost) : '');
    setTrackingInputs({});
  };

  const handleUpdateTracking = (e: React.FormEvent, index: number) => {
    e.preventDefault();
    if (!selectedOrder) return;
    const newTracking = trackingInputs[index];
    if (newTracking === undefined) return;

    startTransition(async () => {
      const { updateLinkOrderItemTracking } = await import('./actions');
      const res = await updateLinkOrderItemTracking(selectedOrder.id, index, newTracking);
      if (res.success) {
        showToast('Tracking number saved!', 'success');
        fetchOrders(); // refresh global list
        // Update local selectedOrder state so modal updates
        setSelectedOrder((prev: any) => {
          let updatedNotes = prev.notes || '';
          if (updatedNotes.includes('JSON_ITEMS:')) {
            const parts = updatedNotes.split('JSON_ITEMS:');
            const parsedItems = JSON.parse(parts[1]);
            if (Array.isArray(parsedItems) && parsedItems.length > index) {
              parsedItems[index] = { ...parsedItems[index], tracking_number: newTracking };
              updatedNotes = `${parts[0]}JSON_ITEMS:${JSON.stringify(parsedItems)}`;
            }
          }
          return { ...prev, notes: updatedNotes };
        });
      } else {
        showToast('Failed to save tracking: ' + res.error, 'error');
      }
    });
  };

  const handleStatusChange = (id: number, newStatus: string) => {
    setOrders(prev => prev.map(o => o.id === id ? { ...o, order_status: newStatus } : o));
    if (selectedOrder?.id === id) setSelectedOrder((prev: any) => ({ ...prev, order_status: newStatus }));
    startTransition(async () => {
      await updateLinkOrderStatus(id, newStatus);
    });
  };

  const handlePaymentStatusChange = (id: number, newStatus: string) => {
    setOrders(prev => prev.map(o => o.id === id ? { ...o, payment_status: newStatus } : o));
    if (selectedOrder?.id === id) setSelectedOrder((prev: any) => ({ ...prev, payment_status: newStatus }));
    startTransition(async () => {
      await updateLinkOrderPaymentStatus(id, newStatus);
    });
  };

  const handleInvoiceShipping = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrder || !shippingFeeInput) return;
    const amount = parseFloat(shippingFeeInput);
    if (isNaN(amount)) return;

    startTransition(async () => {
      const res = await invoiceLinkOrderShipping(selectedOrder.id, amount);
      if (res.success) {
        showToast('Shipping fee invoiced & user notified successfully!', 'success');
        setOrders(prev => prev.map(o => o.id === selectedOrder.id ? { ...o, shipping_cost: amount } : o));
        setSelectedOrder((prev: any) => ({ ...prev, shipping_cost: amount }));
      } else {
        showToast('Failed: ' + res.error, 'error');
      }
    });
  };

  useEffect(() => {
    fetchOrders();
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const statusParam = params.get('status');
      if (statusParam) {
        setFilterStatus(statusParam);
      }
    }
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    const res = await getAllLinkOrders();
    if (res.success && res.data) {
      setOrders(res.data);
    } else {
      console.error('Error fetching orders');
    }
    setLoading(false);
  };

  const getOrderItemsCount = (order: any) => {
    if (Array.isArray(order.items) && order.items.length > 0) return order.items.length;
    if (order.notes && order.notes.includes('JSON_ITEMS:')) {
      try {
        const parsed = JSON.parse(order.notes.split('JSON_ITEMS:')[1]);
        if (Array.isArray(parsed)) return parsed.length;
      } catch(e) {}
    }
    return 0;
  };

  const handleDeleteOrder = async (orderId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    const isConfirmed = await showConfirm({ title: 'Delete Order', message: 'Are you sure you want to delete this link order? This action cannot be undone.', type: 'danger', confirmText: 'Delete' });
    if (isConfirmed) {
      const supabase = createClient();
      const { error } = await supabase.from('orders').delete().eq('id', orderId);
      if (!error) {
        setOrders(orders.filter(o => o.id !== orderId));
      } else {
        showAlert({ title: 'Error', message: 'Failed to delete order.', type: 'danger' });
        console.error(error);
      }
    }
  };

  const handleCopyLinks = async (order: any, e: React.MouseEvent) => {
    e.stopPropagation();
    let items = Array.isArray(order.items) ? order.items : [];
    
    if (order.notes && order.notes.includes('JSON_ITEMS:')) {
      try {
        const parsed = JSON.parse(order.notes.split('JSON_ITEMS:')[1]);
        if (Array.isArray(parsed)) items = parsed;
      } catch(e) {}
    }
    
    let linksToCopy = '';
    
    if (items.length > 1) {
      linksToCopy = items.map((item: any) => item.link || item.product_link).filter(Boolean).join('\n');
    } else if (items.length === 1) {
      linksToCopy = items[0].link || items[0].product_link;
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
    
    const isPaid = o.payment_status === 'paid' || o.payment_status === 'Paid';
    let statusVal = o.order_status || o.procurement_status || 'pending_payment';
    if (isPaid && (statusVal === 'pending_payment' || statusVal === 'new' || statusVal === 'pending')) {
      statusVal = 'processing';
    }
    const matchesStatus = filterStatus === 'All Statuses' || statusVal === filterStatus || (!statusVal && filterStatus === 'pending_payment');
    if (!matchesStatus) return false;
    
    const payStatus = (o.payment_status || 'pending').toLowerCase();
    const matchesPayment = filterPayment === 'All Payments' || payStatus === filterPayment;
    if (!matchesPayment) return false;

    const shipMode = (o.shipping_mode || '').toLowerCase();
    const matchesMode = filterMode === 'All Modes' || shipMode === filterMode;
    if (!matchesMode) return false;

    // STRICTLY filter for Link Orders
    return o.type === 'link_order';
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Toast Notification */}
      {toast && (
        <div className={`fixed top-4 right-4 z-[100] flex items-center gap-2 px-4 py-3 rounded-xl shadow-2xl border ${toast.type === 'success' ? 'bg-emerald-950/90 border-emerald-900/50 text-emerald-400' : 'bg-red-950/90 border-red-900/50 text-red-400'} animate-in slide-in-from-top-2 fade-in duration-300`}>
          {toast.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
          <span className="text-sm font-medium">{toast.message}</span>
        </div>
      )}

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
        <div className="flex gap-2 shrink-0 overflow-x-auto pb-1 lg:pb-0">
          <select 
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="h-10 bg-zinc-950 border border-zinc-800 rounded-lg px-4 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors appearance-none pr-8 relative"
            style={{ backgroundImage: 'url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'%23a1a1aa\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3e%3cpolyline points=\'6 9 12 15 18 9\'%3e%3c/polyline%3e%3c/svg%3e")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.5rem center', backgroundSize: '1em' }}
          >
            <option value="All Statuses">All Statuses</option>
            {STATUS_OPTIONS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
          </select>
          
          <select 
            value={filterPayment}
            onChange={(e) => setFilterPayment(e.target.value)}
            className="h-10 bg-zinc-950 border border-zinc-800 rounded-lg px-4 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors appearance-none pr-8 relative"
            style={{ backgroundImage: 'url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'%23a1a1aa\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3e%3cpolyline points=\'6 9 12 15 18 9\'%3e%3c/polyline%3e%3c/svg%3e")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.5rem center', backgroundSize: '1em' }}
          >
            <option value="All Payments">All Payments</option>
            <option value="paid">Paid</option>
            <option value="pending">Pending</option>
            <option value="failed">Failed</option>
            <option value="refunded">Refunded</option>
          </select>

          <select 
            value={filterMode}
            onChange={(e) => setFilterMode(e.target.value)}
            className="h-10 bg-zinc-950 border border-zinc-800 rounded-lg px-4 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors appearance-none pr-8 relative"
            style={{ backgroundImage: 'url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'%23a1a1aa\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3e%3cpolyline points=\'6 9 12 15 18 9\'%3e%3c/polyline%3e%3c/svg%3e")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.5rem center', backgroundSize: '1em' }}
          >
            <option value="All Modes">All Modes</option>
            <option value="air">Air Freight</option>
            <option value="sea">Sea Freight</option>
            <option value="express">Express</option>
          </select>
        </div>
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
                <th className="p-4 text-xs font-semibold text-zinc-400 uppercase tracking-wider">Total (₵)</th>
                <th className="p-4 text-xs font-semibold text-zinc-400 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800">
              {loading ? (
                <tr><td colSpan={6} className="p-8 text-center text-zinc-500">Loading orders...</td></tr>
              ) : filteredOrders.length === 0 ? (
                <tr><td colSpan={6} className="p-8 text-center text-zinc-500">No orders found.</td></tr>
              ) : (
                filteredOrders.map(order => {
                  const isPaid = order.payment_status === 'paid' || order.payment_status === 'Paid';
                  let displayStatus = order.order_status || order.procurement_status || 'pending_payment';
                  if (isPaid && (displayStatus === 'pending_payment' || displayStatus === 'new' || displayStatus === 'pending')) {
                    displayStatus = 'processing';
                  }
                  return (
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
                            {copiedLink === order.id ? 'Copied!' : (getOrderItemsCount(order) > 1 ? 'Copy All' : 'Copy')}
                          </button>
                        </div>
                      ) : (
                        <span className="text-zinc-500 text-xs">No Link</span>
                      )}
                    </td>
                    <td className="p-4">
                      <div className="relative inline-block w-fit">
                        <select
                          value={displayStatus}
                          onChange={(e) => handleStatusChange(order.id, e.target.value)}
                          disabled={isPending || readOnly}
                          className={`appearance-none px-3 py-1.5 pr-8 rounded-lg text-[10px] font-bold tracking-wider uppercase border outline-none cursor-pointer transition-all disabled:opacity-50 ${STATUS_OPTIONS.find(s => s.value === displayStatus)?.color || 'bg-zinc-900 text-zinc-400'}`}
                          style={{ backgroundImage: 'url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'currentColor\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3e%3cpolyline points=\'6 9 12 15 18 9\'%3e%3c/polyline%3e%3c/svg%3e")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.5rem center', backgroundSize: '1em' }}
                        >
                          {STATUS_OPTIONS.map(s => <option key={s.value} value={s.value} className="bg-zinc-900 text-white">{s.label}</option>)}
                        </select>
                      </div>
                    </td>
                    <td className="p-4 text-sm text-zinc-300 font-medium">₵{order.total ? Number(order.total).toFixed(2) : '0.00'}</td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => handleOpenModal(order)} className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors" title="View Details">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button onClick={(e) => handleDeleteOrder(order.id, e)} className="p-2 text-red-400 hover:text-white hover:bg-red-500/20 rounded-lg transition-colors" title="Delete Order">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                  );
                })
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
            filteredOrders.map(order => {
              const isPaid = order.payment_status === 'paid' || order.payment_status === 'Paid';
              let displayStatus = order.order_status || order.procurement_status || 'pending_payment';
              if (isPaid && (displayStatus === 'pending_payment' || displayStatus === 'new' || displayStatus === 'pending')) {
                displayStatus = 'processing';
              }
              return (
              <div key={order.id} className="p-4 flex flex-col gap-4 hover:bg-zinc-800/20 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex flex-col gap-1">
                    <p className="text-sm text-white font-mono font-medium">#{order.id}</p>
                    <p className="text-xs text-zinc-500">{order.customer_name || 'Unknown'}</p>
                  </div>
                  <div className="relative">
                    <select
                      value={displayStatus}
                      onChange={(e) => handleStatusChange(order.id, e.target.value)}
                      disabled={isPending || readOnly}
                      className={`appearance-none px-3 py-1.5 pr-8 rounded-lg text-[10px] font-bold tracking-wider uppercase border outline-none cursor-pointer transition-all disabled:opacity-50 ${STATUS_OPTIONS.find(s => s.value === displayStatus)?.color || 'bg-zinc-900 text-zinc-400'}`}
                      style={{ backgroundImage: 'url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'currentColor\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3e%3cpolyline points=\'6 9 12 15 18 9\'%3e%3c/polyline%3e%3c/svg%3e")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.5rem center', backgroundSize: '1em' }}
                    >
                      {STATUS_OPTIONS.map(s => <option key={s.value} value={s.value} className="bg-zinc-900 text-white">{s.label}</option>)}
                    </select>
                  </div>
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
                          {copiedLink === order.id ? 'Copied!' : (getOrderItemsCount(order) > 1 ? 'Copy All' : 'Copy')}
                        </button>
                      </div>
                    ) : (
                      <span className="text-zinc-500 text-xs">No Link</span>
                    )}
                  </div>
                  <div>
                    <p className="text-xs text-zinc-500 mb-1">Total Due</p>
                    <p className="text-sm text-zinc-300 font-medium">₵{order.total ? Number(order.total).toFixed(2) : '0.00'}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <p className="text-[10px] text-zinc-600">{format(new Date(order.created_at), 'MMM dd, yyyy HH:mm')}</p>
                  <div className="flex items-center gap-2">
                    <button onClick={() => handleOpenModal(order)} className="p-2 bg-zinc-800/50 text-zinc-400 hover:text-white rounded-xl transition-colors">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button onClick={(e) => handleDeleteOrder(order.id, e)} className="p-2 bg-red-500/10 text-red-400 border border-red-500/20 rounded-xl transition-colors" title="Delete Order">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
              );
            })
          )}
        </div>
      </div>

      {/* Link Order Details Modal */}
      {selectedOrder && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in"
          onClick={() => setSelectedOrder(null)}
        >
          <div 
            className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
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
                {/* Control Bar */}
                <div className="px-4 py-4 bg-zinc-900/50 border border-zinc-800 rounded-xl flex flex-col sm:flex-row flex-wrap gap-4 items-center">
                  <div className="w-full sm:flex-1 sm:min-w-[200px]">
                    <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-1">Order Status</label>
                    {(() => {
                      const isPaid = selectedOrder.payment_status === 'paid' || selectedOrder.payment_status === 'Paid';
                      let currentStatusVal = selectedOrder.order_status || selectedOrder.procurement_status || 'pending_payment';
                      if (isPaid && (currentStatusVal === 'pending_payment' || currentStatusVal === 'new' || currentStatusVal === 'pending')) {
                        currentStatusVal = 'processing';
                      }
                      return (
                        <select value={currentStatusVal} onChange={(e) => handleStatusChange(selectedOrder.id, e.target.value)} disabled={isPending || readOnly} className="w-full bg-zinc-950 border border-zinc-800 rounded-lg py-2 pl-3 pr-8 text-sm text-white focus:outline-none focus:border-indigo-500 appearance-none">
                          {STATUS_OPTIONS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                        </select>
                      );
                    })()}
                  </div>
                  <div className="w-full sm:flex-1 sm:min-w-[200px]">
                    <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-1">Payment Status</label>
                    <select value={selectedOrder.payment_status || 'pending'} onChange={(e) => handlePaymentStatusChange(selectedOrder.id, e.target.value)} disabled={isPending || readOnly} className="w-full bg-zinc-950 border border-zinc-800 rounded-lg py-2 pl-3 pr-8 text-sm text-white focus:outline-none focus:border-indigo-500 appearance-none">
                      <option value="pending">Pending</option>
                      <option value="paid">Paid</option>
                      <option value="failed">Failed</option>
                      <option value="refunded">Refunded</option>
                    </select>
                  </div>
                </div>

                {/* Top Info Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                        <span className="text-white font-medium">₵{selectedOrder.total ? Number(selectedOrder.total).toFixed(2) : '0.00'}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-zinc-400 text-sm">Status</span>
                        {(() => {
                          const isPaid = selectedOrder.payment_status === 'paid' || selectedOrder.payment_status === 'Paid';
                          let displayStatus = selectedOrder.order_status || selectedOrder.procurement_status || 'pending_payment';
                          if (isPaid && (displayStatus === 'pending_payment' || displayStatus === 'new' || displayStatus === 'pending')) {
                            displayStatus = 'processing';
                          }
                          return getStatusBadge(displayStatus);
                        })()}
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

                  {/* Shipping Fee Card */}
                  <div className="bg-zinc-950/50 border border-zinc-800/50 rounded-xl p-5 flex flex-col justify-between">
                    <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-500 mb-4 flex items-center gap-2"><CreditCard className="w-4 h-4" /> Invoice Shipping Fee</h3>
                    <form onSubmit={handleInvoiceShipping} className="space-y-3">
                      <div className="flex gap-2">
                        <div className="relative flex-1">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 font-medium">₵</span>
                          <input 
                            type="number" step="0.01" 
                            value={shippingFeeInput} onChange={e => setShippingFeeInput(e.target.value)}
                            className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-2 pl-8 pr-4 text-sm text-white outline-none focus:border-indigo-500"
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
                                  price: item.cny_price || item.price || 0,
                                quantity: item.qty || item.quantity,
                                screenshot_url: item.screenshotUrl || item.screenshot_url,
                                tracking_number: item.tracking_number,
                                status: item.status,
                                notes: item.notes || item.note
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

                     const exchangeRate = selectedOrder.cny_price && selectedOrder.total && selectedOrder.cny_price > 0 
                       ? (Number(selectedOrder.total) / Number(selectedOrder.cny_price)) 
                       : 0;

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
                                     <span className="text-sm text-white font-medium">¥{Number(item.cny_price || item.price || 0).toFixed(2)}</span>
                                     {exchangeRate > 0 && <span className="text-[10px] text-zinc-400 block mt-0.5">≈ ₵{(Number(item.cny_price || item.price || 0) * exchangeRate).toFixed(2)}</span>}
                                   </div>
                                   <div>
                                     <span className="text-xs text-zinc-500 block mb-0.5">Quantity</span>
                                     <span className="text-sm text-white font-medium">{item.quantity || 1}</span>
                                   </div>
                                   <div>
                                     <span className="text-xs text-zinc-500 block mb-0.5">Total</span>
                                     <span className="text-sm text-indigo-400 font-medium">¥{(Number(item.cny_price || item.price || 0) * Number(item.quantity || 1)).toFixed(2)}</span>
                                     {exchangeRate > 0 && <span className="text-[10px] text-zinc-400 block mt-0.5">≈ ₵{(Number(item.cny_price || item.price || 0) * Number(item.quantity || 1) * exchangeRate).toFixed(2)}</span>}
                                   </div>
                                 </div>

                                 {(item.notes || item.note) && (
                                   <div className="mb-3 px-3 py-2 bg-amber-500/10 border border-amber-500/20 rounded-lg">
                                     <span className="text-[10px] text-amber-400 font-bold uppercase tracking-wider block mb-1">📝 Customer Notes</span>
                                     <p className="text-sm text-zinc-300 whitespace-pre-wrap">{item.notes || item.note}</p>
                                   </div>
                                 )}
                                 <div className="flex flex-wrap gap-4">
                                   <div className="flex-1">
                                     <span className="text-xs text-zinc-500 block mb-0.5">Tracking #</span>
                                     <form onSubmit={(e) => handleUpdateTracking(e, idx)} className="flex gap-2">
                                       <input 
                                         type="text" 
                                         value={trackingInputs[idx] !== undefined ? trackingInputs[idx] : (item.tracking_number || '')}
                                         onChange={(e) => setTrackingInputs(prev => ({...prev, [idx]: e.target.value}))}
                                         className="w-full bg-zinc-950 px-2 py-1.5 rounded border border-zinc-800/50 text-sm text-zinc-300 focus:border-indigo-500 outline-none"
                                         placeholder="Enter tracking #"
                                       />
                                       <button type="submit" disabled={isPending} className="px-3 py-1.5 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 text-xs font-bold rounded border border-indigo-500/20 transition-colors disabled:opacity-50">
                                         Save
                                       </button>
                                     </form>
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

export default function AdminLinkOrdersPage() {
  return <LinkOrdersView readOnly={false} />;
}
