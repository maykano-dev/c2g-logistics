'use client';

import { LifeBuoy, Clock, CheckCircle2, AlertTriangle, User, XCircle, Send, Copy, ExternalLink, MessageSquare, Loader2 } from 'lucide-react';
import { useState, useEffect, useTransition, useCallback } from 'react';
import { getMyAssignedOrders, getOrderDetail, updateOrderStatus, addTrackingNumber, addOrderNote } from './actions';
import { formatDistanceToNow } from 'date-fns';

export default function MyQueueView() {
  const [activeTab, setActiveTab] = useState<'orders' | 'tickets'>('orders');
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [selectedOrderLoading, setSelectedOrderLoading] = useState(false);
  const [isPending, startTransition] = useTransition();

  // Form states
  const [newStatus, setNewStatus] = useState('');
  const [trackingInput, setTrackingInput] = useState('');
  const [noteInput, setNoteInput] = useState('');
  const [actionFeedback, setActionFeedback] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    const result = await getMyAssignedOrders();
    if (result.success) {
      setOrders(result.data);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const selectOrder = async (orderId: string) => {
    setSelectedOrderLoading(true);
    setActionFeedback(null);
    const result = await getOrderDetail(orderId);
    if (result.success) {
      setSelectedOrder(result.data);
      setNewStatus(result.data.order_status || result.data.status || '');
      setTrackingInput(result.data.tracking_number || '');
    }
    setSelectedOrderLoading(false);
  };

  const handleStatusUpdate = () => {
    if (!selectedOrder || !newStatus) return;
    startTransition(async () => {
      const result = await updateOrderStatus(selectedOrder.id, newStatus);
      if (result.success) {
        setActionFeedback({ type: 'success', msg: 'Status updated successfully.' });
        fetchOrders();
        selectOrder(selectedOrder.id);
      } else {
        setActionFeedback({ type: 'error', msg: result.error || 'Failed to update status.' });
      }
    });
  };

  const handleTrackingSubmit = () => {
    if (!selectedOrder || !trackingInput) return;
    startTransition(async () => {
      const result = await addTrackingNumber(selectedOrder.id, trackingInput);
      if (result.success) {
        setActionFeedback({ type: 'success', msg: 'Tracking number saved.' });
        selectOrder(selectedOrder.id);
      } else {
        setActionFeedback({ type: 'error', msg: result.error || 'Failed to save tracking.' });
      }
    });
  };

  const handleNoteSubmit = () => {
    if (!selectedOrder || !noteInput.trim()) return;
    startTransition(async () => {
      const result = await addOrderNote(selectedOrder.id, noteInput);
      if (result.success) {
        setNoteInput('');
        setActionFeedback({ type: 'success', msg: 'Note added.' });
        selectOrder(selectedOrder.id);
      } else {
        setActionFeedback({ type: 'error', msg: result.error || 'Failed to add note.' });
      }
    });
  };

  const getUrgency = (createdAt: string) => {
    const ageHours = (Date.now() - new Date(createdAt).getTime()) / (1000 * 60 * 60);
    if (ageHours > 72) return 'urgent';
    if (ageHours > 48) return 'high';
    return 'normal';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': case 'new': case 'pending_payment': return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
      case 'processing': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      case 'purchased': return 'bg-indigo-500/10 text-indigo-500 border-indigo-500/20';
      case 'arrived_warehouse': return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
      case 'shipped': return 'bg-purple-500/10 text-purple-500 border-purple-500/20';
      case 'delivered': return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
      case 'cancelled': return 'bg-red-500/10 text-red-500 border-red-500/20';
      default: return 'bg-zinc-500/10 text-zinc-500 border-zinc-500/20';
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-in fade-in duration-500 pb-10">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-3">
            <LifeBuoy className="w-6 h-6 text-indigo-500" /> My Service Queue
          </h1>
          <p className="text-zinc-400 mt-1">Live orders from the database. Every action is audit-logged.</p>
        </div>
        <div className="flex bg-zinc-900 border border-zinc-800 rounded-xl p-1">
          <button 
            onClick={() => setActiveTab('orders')}
            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'orders' ? 'bg-zinc-800 text-white shadow-sm' : 'text-zinc-500 hover:text-zinc-300'}`}
          >
            Orders ({orders.length})
          </button>
          <button 
            onClick={() => setActiveTab('tickets')}
            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'tickets' ? 'bg-zinc-800 text-white shadow-sm' : 'text-zinc-500 hover:text-zinc-300'}`}
          >
            Support Tickets
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* The Live Order Queue */}
        <div className="lg:col-span-1 bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden flex flex-col h-[700px]">
          <div className="p-4 border-b border-zinc-800 bg-zinc-950/50 flex justify-between items-center">
            <h2 className="text-xs font-bold uppercase tracking-widest text-zinc-500">Live Orders</h2>
            <button onClick={fetchOrders} className="text-xs text-indigo-400 hover:text-indigo-300 font-bold">Refresh</button>
          </div>
          <div className="flex-1 overflow-y-auto p-2 space-y-2">
            {loading ? (
              <div className="flex items-center justify-center h-full">
                <Loader2 className="w-6 h-6 text-indigo-500 animate-spin" />
              </div>
            ) : orders.length === 0 ? (
              <div className="p-6 text-center text-zinc-500 text-sm">
                <CheckCircle2 className="w-8 h-8 mx-auto mb-2 text-emerald-500" />
                No orders in queue. Great job!
              </div>
            ) : (
              orders.map((order) => {
                const urgency = getUrgency(order.created_at);
                const isSelected = selectedOrder?.id === order.id;
                return (
                  <div
                    key={order.id}
                    onClick={() => selectOrder(order.id)}
                    className={`p-4 border rounded-xl transition-all cursor-pointer group ${
                      isSelected 
                        ? 'bg-indigo-500/10 border-indigo-500/40'
                        : 'bg-zinc-950/50 border-zinc-800/50 hover:border-indigo-500/50 hover:bg-zinc-800/30'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-mono font-bold text-white text-sm group-hover:text-indigo-400">
                        {order.order_id || `#${String(order.id).substring(0, 8)}`}
                      </span>
                      {urgency !== 'normal' && (
                        <span className={`w-2 h-2 rounded-full ${urgency === 'urgent' ? 'bg-red-500 animate-pulse' : 'bg-amber-500'}`}></span>
                      )}
                    </div>
                    <p className="text-xs text-zinc-400 font-medium mb-3 flex items-center gap-1">
                      <User className="w-3 h-3" /> {order.customer_name || order.customers?.name || 'Unknown'}
                    </p>
                    <div className="flex justify-between items-center text-[10px]">
                      <span className={`px-2 py-0.5 rounded border font-bold uppercase tracking-wider ${getStatusColor(order.order_status || order.status)}`}>
                        {(order.order_status || order.status || 'unknown').replace(/_/g, ' ')}
                      </span>
                      <span className="text-zinc-500 flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {formatDistanceToNow(new Date(order.created_at), { addSuffix: true })}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Action Pane — Order Detail */}
        <div className="lg:col-span-2 bg-zinc-900 border border-zinc-800 rounded-2xl flex flex-col h-[700px] overflow-hidden">
          
          {!selectedOrder ? (
            <div className="flex-1 flex flex-col justify-center items-center text-center p-6">
              <div className="w-20 h-20 bg-indigo-500/10 text-indigo-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h2 className="text-xl font-bold text-white mb-2">Select an order to action</h2>
              <p className="text-zinc-400 text-sm max-w-sm">
                Click any order from the live queue to view details, update its status, or add tracking numbers.
              </p>
              <div className="p-4 bg-zinc-950 border border-zinc-800 rounded-xl text-left mt-6 w-full max-w-sm">
                <p className="text-xs text-zinc-500 uppercase font-bold tracking-widest mb-3 border-b border-zinc-800 pb-2">Permitted Actions</p>
                <div className="space-y-3">
                  {[
                    { text: 'Update Order Status', allowed: true },
                    { text: 'Enter Tracking Number', allowed: true },
                    { text: 'Add Internal Note', allowed: true },
                    { text: 'Change Payment Status', allowed: false },
                  ].map((perm, i) => (
                    <div key={i} className={`flex items-center justify-between text-sm ${!perm.allowed ? 'opacity-50' : ''}`}>
                      <span className={perm.allowed ? 'text-zinc-300' : 'text-zinc-500 line-through'}>{perm.text}</span>
                      {perm.allowed ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <XCircle className="w-4 h-4 text-red-500" />}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : selectedOrderLoading ? (
            <div className="flex-1 flex items-center justify-center">
              <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
            </div>
          ) : (
            <>
              {/* Order Header */}
              <div className="p-6 border-b border-zinc-800 bg-zinc-950/50">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-xl font-bold text-white">{selectedOrder.product_name || 'Order Details'}</h2>
                    <div className="flex items-center gap-3 mt-2 text-sm text-zinc-400">
                      <span className="font-mono">{selectedOrder.order_id || `#${String(selectedOrder.id).substring(0, 8)}`}</span>
                      <span>•</span>
                      <span>{selectedOrder.customers?.name || selectedOrder.customer_name || 'Unknown Customer'}</span>
                      {selectedOrder.customers?.email && (
                        <>
                          <span>•</span>
                          <span className="text-zinc-500">{selectedOrder.customers.email}</span>
                        </>
                      )}
                    </div>
                  </div>
                  <span className={`px-3 py-1.5 rounded-lg border text-xs font-bold uppercase tracking-wider ${getStatusColor(selectedOrder.payment_status || 'pending')}`}>
                    {(selectedOrder.payment_status || 'pending').replace(/_/g, ' ')}
                  </span>
                </div>
              </div>

              {/* Scrollable Content */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                
                {/* Feedback */}
                {actionFeedback && (
                  <div className={`p-3 rounded-xl text-sm font-bold flex items-center gap-2 ${
                    actionFeedback.type === 'success' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' : 'bg-red-500/10 text-red-500 border border-red-500/20'
                  }`}>
                    {actionFeedback.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                    {actionFeedback.msg}
                  </div>
                )}

                {/* Product Link */}
                {selectedOrder.product_link && (
                  <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4">
                    <p className="text-xs text-zinc-500 uppercase font-bold tracking-widest mb-2">Product Link</p>
                    <div className="flex items-center gap-2">
                      <p className="text-sm text-indigo-400 truncate flex-1 font-mono">{selectedOrder.product_link}</p>
                      <button onClick={() => navigator.clipboard.writeText(selectedOrder.product_link)} className="p-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg transition-colors shrink-0">
                        <Copy className="w-4 h-4 text-zinc-400" />
                      </button>
                      <a href={selectedOrder.product_link} target="_blank" rel="noopener noreferrer" className="p-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg transition-colors shrink-0">
                        <ExternalLink className="w-4 h-4 text-zinc-400" />
                      </a>
                    </div>
                  </div>
                )}

                {/* Price & Shipping */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4">
                    <p className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest">Total (GHS)</p>
                    <p className="text-lg font-black text-white mt-1">₵{parseFloat(selectedOrder.total || 0).toFixed(2)}</p>
                  </div>
                  <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4">
                    <p className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest">Price (CNY)</p>
                    <p className="text-lg font-black text-zinc-300 mt-1">¥{parseFloat(selectedOrder.cny_price || 0).toFixed(2)}</p>
                  </div>
                  <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4">
                    <p className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest">Shipping</p>
                    <p className="text-lg font-black text-zinc-300 mt-1 capitalize">{selectedOrder.shipping_mode || 'N/A'}</p>
                  </div>
                  <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4">
                    <p className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest">Payment</p>
                    <p className={`text-lg font-black mt-1 capitalize ${selectedOrder.payment_status === 'paid' ? 'text-emerald-500' : 'text-amber-500'}`}>
                      {(selectedOrder.payment_status || 'pending').replace(/_/g, ' ')}
                    </p>
                  </div>
                </div>

                {/* Customer Notes */}
                {selectedOrder.notes && (
                  <div className="bg-amber-500/5 border border-amber-500/20 rounded-xl p-4">
                    <p className="text-xs text-amber-500 uppercase font-bold tracking-widest mb-2">Customer Notes</p>
                    <p className="text-sm text-zinc-300">{selectedOrder.notes}</p>
                  </div>
                )}

                {/* Update Status */}
                <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4">
                  <p className="text-xs text-zinc-500 uppercase font-bold tracking-widest mb-3">Update Order Status</p>
                  <div className="flex gap-3">
                    <select
                      value={newStatus}
                      onChange={(e) => setNewStatus(e.target.value)}
                      className="flex-1 bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors"
                    >
                      <option value="pending">Pending</option>
                      <option value="processing">Processing</option>
                      <option value="purchased">Purchased</option>
                      <option value="arrived_warehouse">Arrived Warehouse</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="on_hold">On Hold</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                    <button
                      onClick={handleStatusUpdate}
                      disabled={isPending}
                      className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white px-6 py-2.5 rounded-lg font-bold text-sm transition-colors flex items-center gap-2"
                    >
                      {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                      Update
                    </button>
                  </div>
                </div>

                {/* Enter Tracking Number */}
                <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4">
                  <p className="text-xs text-zinc-500 uppercase font-bold tracking-widest mb-3">Tracking Number</p>
                  <div className="flex gap-3">
                    <input
                      type="text"
                      value={trackingInput}
                      onChange={(e) => setTrackingInput(e.target.value)}
                      placeholder="e.g. YT89938221123"
                      className="flex-1 bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-2.5 text-sm text-white font-mono focus:outline-none focus:border-indigo-500 transition-colors"
                    />
                    <button
                      onClick={handleTrackingSubmit}
                      disabled={isPending || !trackingInput}
                      className="bg-zinc-800 hover:bg-zinc-700 disabled:opacity-50 text-white px-6 py-2.5 rounded-lg font-bold text-sm transition-colors"
                    >
                      Save
                    </button>
                  </div>
                </div>

                {/* Add Note */}
                <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4">
                  <p className="text-xs text-zinc-500 uppercase font-bold tracking-widest mb-3 flex items-center gap-2">
                    <MessageSquare className="w-4 h-4" /> Internal Activity Log
                  </p>

                  {/* Existing notes */}
                  {selectedOrder.activity_feed && selectedOrder.activity_feed.length > 0 && (
                    <div className="space-y-3 mb-4 max-h-40 overflow-y-auto">
                      {selectedOrder.activity_feed.map((note: any, i: number) => (
                        <div key={i} className="p-3 bg-zinc-900 border border-zinc-800 rounded-lg text-sm">
                          <p className="text-zinc-300">{note.content}</p>
                          <p className="text-[10px] text-zinc-500 mt-1 font-mono">
                            {new Date(note.created_at).toLocaleString()} • {note.activity_type}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="flex gap-3">
                    <input
                      type="text"
                      value={noteInput}
                      onChange={(e) => setNoteInput(e.target.value)}
                      placeholder="Add an internal note..."
                      className="flex-1 bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors"
                      onKeyDown={(e) => e.key === 'Enter' && handleNoteSubmit()}
                    />
                    <button
                      onClick={handleNoteSubmit}
                      disabled={isPending || !noteInput.trim()}
                      className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white px-4 py-2.5 rounded-lg font-bold text-sm transition-colors"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

      </div>
    </div>
  );
}
