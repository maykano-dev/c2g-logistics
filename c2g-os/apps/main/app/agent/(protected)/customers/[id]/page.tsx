'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { 
  User, 
  Phone, 
  Mail, 
  Calendar, 
  CreditCard, 
  Package, 
  Store,
  Ship,
  Clock,
  MessageSquare,
  AlertCircle
} from 'lucide-react';
import { format } from 'date-fns';

export default function UnifiedCustomerViewer() {
  const { id } = useParams();
  const [customer, setCustomer] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('timeline');

  useEffect(() => {
    const fetchCustomerData = async () => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('customers')
        .select('*')
        .eq('id', id)
        .single();
        
      if (!error && data) {
        setCustomer(data);
      }
      setLoading(false);
    };
    
    fetchCustomerData();
  }, [id]);

  if (loading) {
    return <div className="p-8 text-center text-zinc-500 animate-pulse">Loading Customer Operating System...</div>;
  }

  if (!customer) {
    return <div className="p-8 text-center text-zinc-500">Customer not found in the system.</div>;
  }

  return (
    <div className="flex flex-col lg:flex-row h-[calc(100vh-2rem)] gap-4 animate-in fade-in max-w-[1600px] mx-auto">
      
      {/* LEFT PANEL: Customer Snapshot */}
      <div className="w-full lg:w-80 flex-shrink-0 flex flex-col gap-4">
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 relative overflow-hidden flex flex-col h-full">
          <div className="absolute top-0 left-0 w-full h-1 bg-indigo-500"></div>
          
          <div className="flex items-center gap-4 mb-6 mt-2">
            <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center text-2xl font-black">
              {customer.full_name?.charAt(0).toUpperCase() || 'C'}
            </div>
            <div>
              <h2 className="text-lg font-bold text-white leading-tight">{customer.full_name}</h2>
              <p className="text-xs font-mono text-zinc-500 mt-1">{customer.unique_id}</p>
            </div>
          </div>

          <div className="space-y-4 flex-1">
            <div className="flex items-center gap-3 text-sm text-zinc-300">
              <Phone className="w-4 h-4 text-zinc-500" /> {customer.phone || 'No phone'}
            </div>
            <div className="flex items-center gap-3 text-sm text-zinc-300">
              <Mail className="w-4 h-4 text-zinc-500" /> {customer.email}
            </div>
            <div className="flex items-center gap-3 text-sm text-zinc-300">
              <Calendar className="w-4 h-4 text-zinc-500" /> Joined {format(new Date(customer.created_at), 'MMM yyyy')}
            </div>
            <div className="flex items-center gap-3 text-sm text-zinc-300">
              <AlertCircle className="w-4 h-4 text-emerald-500" /> Account Active
            </div>
          </div>

          <div className="border-t border-zinc-800 pt-4 mt-6">
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-3">Quick Stats</h3>
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-zinc-950 p-3 rounded-xl border border-zinc-800/50">
                <p className="text-lg font-bold text-white">12</p>
                <p className="text-[10px] text-zinc-500 uppercase font-semibold">Total Orders</p>
              </div>
              <div className="bg-zinc-950 p-3 rounded-xl border border-zinc-800/50">
                <p className="text-lg font-bold text-white">4</p>
                <p className="text-[10px] text-zinc-500 uppercase font-semibold">Shipments</p>
              </div>
              <div className="bg-zinc-950 p-3 rounded-xl border border-zinc-800/50 col-span-2 flex justify-between items-center">
                <div>
                  <p className="text-[10px] text-zinc-500 uppercase font-semibold mb-1">Lifetime Value</p>
                  <p className="text-lg font-bold text-white">₵ 14,500.00</p>
                </div>
                <div className="bg-indigo-500/10 text-indigo-400 text-[10px] font-bold uppercase px-2 py-1 rounded">VIP</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CENTER PANEL: Timeline & Tickets (Facebook Feed style) */}
      <div className="flex-1 flex flex-col bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden relative">
        <div className="p-4 border-b border-zinc-800 bg-zinc-950/50 backdrop-blur flex justify-between items-center sticky top-0 z-10">
          <h2 className="text-sm font-bold uppercase tracking-widest text-white flex items-center gap-2">
            <Clock className="w-4 h-4 text-indigo-500" /> Activity Timeline
          </h2>
          <button className="text-xs bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-1.5 rounded-lg transition-colors font-bold shadow-lg shadow-indigo-900/20">
            + New Ticket
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Mock Timeline Items */}
          <div className="relative pl-6 border-l-2 border-zinc-800 space-y-8 before:absolute before:-left-[9px] before:top-0 before:w-4 before:h-4 before:rounded-full before:bg-zinc-900 before:border-2 before:border-indigo-500">
            <div>
              <p className="text-xs text-indigo-400 font-bold mb-1">Today, 10:42 AM</p>
              <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <MessageSquare className="w-4 h-4 text-blue-500" />
                  <span className="text-sm font-bold text-white">Customer initiated WhatsApp Chat</span>
                </div>
                <p className="text-sm text-zinc-400">"Hi, my package tracking says delayed, can you help?"</p>
              </div>
            </div>

            <div className="relative before:absolute before:-left-[33px] before:top-0 before:w-4 before:h-4 before:rounded-full before:bg-zinc-900 before:border-2 before:border-zinc-700">
              <p className="text-xs text-zinc-500 font-bold mb-1">Yesterday, 14:15 PM</p>
              <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <CreditCard className="w-4 h-4 text-emerald-500" />
                  <span className="text-sm font-bold text-white">Payment Received</span>
                </div>
                <p className="text-sm text-zinc-400">Customer paid ₵450.00 for Shipment SEA-0042</p>
              </div>
            </div>

            <div className="relative before:absolute before:-left-[33px] before:top-0 before:w-4 before:h-4 before:rounded-full before:bg-zinc-900 before:border-2 before:border-zinc-700">
              <p className="text-xs text-zinc-500 font-bold mb-1">June 20, 2026</p>
              <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Package className="w-4 h-4 text-purple-500" />
                  <span className="text-sm font-bold text-white">Package Registered</span>
                </div>
                <p className="text-sm text-zinc-400">New package PKG-88192 registered at China Warehouse</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Internal Notes input at bottom */}
        <div className="p-4 border-t border-zinc-800 bg-zinc-950">
          <div className="relative">
            <input 
              type="text" 
              placeholder="Leave an internal note for other agents..." 
              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-4 pr-24 py-3 text-sm text-white focus:outline-none focus:border-indigo-500 placeholder-zinc-600"
            />
            <button className="absolute right-2 top-1/2 -translate-y-1/2 bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-bold px-3 py-1.5 rounded-lg transition-colors">
              Save Note
            </button>
          </div>
        </div>
      </div>

      {/* RIGHT PANEL: Unified Order Viewer */}
      <div className="w-full lg:w-[400px] flex-shrink-0 flex flex-col bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
        <div className="flex border-b border-zinc-800 bg-zinc-950 overflow-x-auto [&::-webkit-scrollbar]:hidden">
          <button 
            onClick={() => setActiveTab('mall')}
            className={`flex-1 py-4 text-[10px] font-bold uppercase tracking-widest whitespace-nowrap px-4 border-b-2 transition-colors ${activeTab === 'mall' ? 'border-indigo-500 text-indigo-400 bg-indigo-500/5' : 'border-transparent text-zinc-500 hover:text-zinc-300'}`}
          >
            Mall
          </button>
          <button 
            onClick={() => setActiveTab('links')}
            className={`flex-1 py-4 text-[10px] font-bold uppercase tracking-widest whitespace-nowrap px-4 border-b-2 transition-colors ${activeTab === 'links' ? 'border-indigo-500 text-indigo-400 bg-indigo-500/5' : 'border-transparent text-zinc-500 hover:text-zinc-300'}`}
          >
            Links
          </button>
          <button 
            onClick={() => setActiveTab('packages')}
            className={`flex-1 py-4 text-[10px] font-bold uppercase tracking-widest whitespace-nowrap px-4 border-b-2 transition-colors ${activeTab === 'packages' ? 'border-indigo-500 text-indigo-400 bg-indigo-500/5' : 'border-transparent text-zinc-500 hover:text-zinc-300'}`}
          >
            Pkgs
          </button>
          <button 
            onClick={() => setActiveTab('shipments')}
            className={`flex-1 py-4 text-[10px] font-bold uppercase tracking-widest whitespace-nowrap px-4 border-b-2 transition-colors ${activeTab === 'shipments' ? 'border-indigo-500 text-indigo-400 bg-indigo-500/5' : 'border-transparent text-zinc-500 hover:text-zinc-300'}`}
          >
            Ships
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 bg-zinc-950/30">
          {activeTab === 'mall' && (
            <div className="space-y-3">
              {[1, 2].map((i) => (
                <div key={i} className="bg-zinc-900 border border-zinc-800 rounded-xl p-3 hover:border-zinc-700 transition-colors cursor-pointer">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-xs font-bold text-white">ORD-299{i}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-500 font-bold uppercase">Delivered</span>
                  </div>
                  <p className="text-xs text-zinc-400 truncate">Nike Air Force 1 & 2 other items</p>
                </div>
              ))}
            </div>
          )}
          {activeTab === 'links' && (
            <div className="space-y-3">
              <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-3 hover:border-zinc-700 transition-colors cursor-pointer">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-xs font-bold text-white">LNK-8842</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/10 text-amber-500 font-bold uppercase">Pending</span>
                </div>
                <p className="text-xs text-zinc-400 truncate">Alibaba wholesale purchase</p>
              </div>
            </div>
          )}
          {activeTab === 'shipments' && (
             <div className="space-y-3">
             <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-3 hover:border-zinc-700 transition-colors cursor-pointer relative overflow-hidden">
               <div className="absolute top-0 left-0 w-1 h-full bg-blue-500"></div>
               <div className="flex justify-between items-start mb-2 pl-2">
                 <span className="text-xs font-bold text-white">SEA-0042</span>
                 <span className="text-[10px] px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 font-bold uppercase">In Transit</span>
               </div>
               <p className="text-xs text-zinc-400 pl-2">ETA: July 30, 2026</p>
             </div>
           </div>
          )}
        </div>
      </div>
    </div>
  );
}
