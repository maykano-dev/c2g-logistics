'use client';

import { use, useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import { 
  ArrowLeft, 
  MessageSquare, 
  CheckCircle2, 
  Clock, 
  Send,
  Package,
  Store,
  MapPin,
  CreditCard,
  User,
  Phone
} from 'lucide-react';
import { format } from 'date-fns';

export default function OrderProcurementDetail({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const orderId = resolvedParams.id;
  const router = useRouter();
  const [order, setOrder] = useState<any>(null);
  const [activities, setActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [newNote, setNewNote] = useState('');
  const [savingNote, setSavingNote] = useState(false);

  useEffect(() => {
    fetchOrderDetails();
  }, [orderId]);

  const fetchOrderDetails = async () => {
    setLoading(true);
    const supabase = createClient();
    
    const { data: orderData, error: orderErr } = await supabase
      .from('orders')
      .select('*')
      .eq('id', orderId)
      .single();

    if (orderData) {
      setOrder(orderData);
      
      const { data: activityData } = await supabase
        .from('order_activity_feed')
        .select('*, auth_users:author_id(email)')
        .eq('order_id', orderId)
        .order('created_at', { ascending: true });
        
      setActivities(activityData || []);
    }
    
    setLoading(false);
  };

  const handleUpdateStatus = async (newStatus: string) => {
    const supabase = createClient();
    await supabase.from('orders').update({ status: newStatus }).eq('id', orderId);
    await logActivity('status_change', `Status updated to: ${newStatus}`);
    fetchOrderDetails();
  };

  const logActivity = async (type: string, content: string) => {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    
    await supabase.from('order_activity_feed').insert({
      order_id: orderId,
      author_id: user.id,
      activity_type: type,
      content: content
    });
  };

  const submitNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim()) return;
    
    setSavingNote(true);
    await logActivity('note', newNote);
    setNewNote('');
    fetchOrderDetails();
    setSavingNote(false);
  };

  if (loading) return <div className="p-8 text-zinc-500 animate-pulse">Loading order details...</div>;
  if (!order) return <div className="p-8 text-red-500">Order not found.</div>;

  const steps = [
    { id: 'pending', label: 'Pending' },
    { id: 'purchased', label: 'Purchased' },
    { id: 'arrived_warehouse', label: 'In Warehouse' },
    { id: 'shipped', label: 'Shipped' },
    { id: 'delivered', label: 'Delivered' }
  ];

  const currentStepIndex = steps.findIndex(s => s.id === order.status) >= 0 ? steps.findIndex(s => s.id === order.status) : 0;

  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-6xl mx-auto pb-10">
      
      {/* Header */}
      <div className="flex items-center gap-4 border-b border-zinc-800 pb-6">
        <button onClick={() => router.back()} className="p-2 hover:bg-zinc-800 rounded-full text-zinc-400 hover:text-white transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-black text-white">Order {order.order_id}</h1>
            <span className="px-3 py-1 bg-indigo-500/10 text-indigo-400 text-xs font-bold uppercase tracking-wider rounded-full border border-indigo-500/20">
              {order.platform || 'B4M'}
            </span>
          </div>
          <p className="text-zinc-500 text-sm mt-1">Placed on {format(new Date(order.created_at), 'MMM dd, yyyy HH:mm')}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Details & Pipeline */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Pipeline UI */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
            <h2 className="text-sm font-bold uppercase tracking-widest text-zinc-500 mb-6">Procurement Pipeline</h2>
            <div className="flex items-center justify-between relative">
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-zinc-800 -z-10 rounded-full"></div>
              <div 
                className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-indigo-500 -z-10 rounded-full transition-all duration-500" 
                style={{ width: `${(currentStepIndex / (steps.length - 1)) * 100}%` }}
              ></div>
              
              {steps.map((step, index) => {
                const isCompleted = index <= currentStepIndex;
                const isCurrent = index === currentStepIndex;
                return (
                  <div key={step.id} className="flex flex-col items-center gap-2">
                    <button 
                      onClick={() => handleUpdateStatus(step.id)}
                      className={`w-8 h-8 rounded-full flex items-center justify-center transition-all border-2 ${
                        isCompleted 
                          ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-900/50' 
                          : 'bg-zinc-900 border-zinc-700 text-zinc-500 hover:border-zinc-500'
                      }`}
                    >
                      {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : <div className="w-2 h-2 rounded-full bg-zinc-700"></div>}
                    </button>
                    <span className={`text-xs font-bold uppercase tracking-wider ${isCurrent ? 'text-indigo-400' : isCompleted ? 'text-zinc-300' : 'text-zinc-600'}`}>
                      {step.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Customer & Financials */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
               <h2 className="text-sm font-bold uppercase tracking-widest text-zinc-500 mb-4 flex items-center gap-2"><User className="w-4 h-4"/> Customer</h2>
               <p className="text-white font-medium">{order.customer_name || 'Unknown User'}</p>
               <p className="text-zinc-400 text-sm mt-1">{order.customer_id ? `ID: ${order.customer_id.substring(0,8)}` : ''}</p>
            </div>

            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
               <h2 className="text-sm font-bold uppercase tracking-widest text-zinc-500 mb-4 flex items-center gap-2"><CreditCard className="w-4 h-4"/> Financials</h2>
               <div className="space-y-2">
                 <div className="flex justify-between text-sm">
                   <span className="text-zinc-500">Order Total (CNY)</span>
                   <span className="text-white font-medium">¥{order.total_amount_cny?.toFixed(2) || '0.00'}</span>
                 </div>
                 <div className="flex justify-between text-sm">
                   <span className="text-zinc-500">Service Fee</span>
                   <span className="text-white font-medium">¥{order.service_fee?.toFixed(2) || '0.00'}</span>
                 </div>
                 <div className="flex justify-between text-sm">
                   <span className="text-zinc-500">Payment Status</span>
                   <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${order.payment_status === 'paid' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500'}`}>
                     {order.payment_status}
                   </span>
                 </div>
               </div>
            </div>
          </div>

        </div>

        {/* Right Column: Activity Feed */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-0 flex flex-col h-[600px]">
          <div className="p-4 border-b border-zinc-800">
            <h2 className="text-sm font-bold uppercase tracking-widest text-white flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-indigo-500" /> Procurement Notes
            </h2>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {activities.length === 0 ? (
              <div className="h-full flex items-center justify-center text-zinc-600 text-sm">No activity recorded yet.</div>
            ) : (
              activities.map(act => (
                <div key={act.id} className="bg-zinc-950/50 border border-zinc-800/50 rounded-xl p-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-indigo-400">
                      {act.auth_users?.email?.split('@')[0] || 'System Admin'}
                    </span>
                    <span className="text-[10px] text-zinc-600">{format(new Date(act.created_at), 'MMM dd HH:mm')}</span>
                  </div>
                  <p className="text-sm text-zinc-300 leading-relaxed whitespace-pre-wrap">{act.content}</p>
                </div>
              ))
            )}
          </div>

          <div className="p-4 border-t border-zinc-800 bg-zinc-950/30 rounded-b-2xl">
            <form onSubmit={submitNote} className="flex gap-2">
              <input 
                type="text" 
                value={newNote}
                onChange={e => setNewNote(e.target.value)}
                placeholder="Log supplier contact, alternative items, etc..."
                className="flex-1 bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors"
              />
              <button 
                type="submit" 
                disabled={savingNote || !newNote.trim()}
                className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white p-2 rounded-lg transition-colors flex items-center justify-center"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>

      </div>
    </div>
  );
}
