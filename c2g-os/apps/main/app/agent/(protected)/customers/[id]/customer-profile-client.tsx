'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { 
  User, 
  Phone, 
  Mail, 
  Calendar, 
  CreditCard, 
  Package, 
  ShoppingCart,
  Ship,
  Clock,
  MessageSquare,
  AlertCircle
} from 'lucide-react';
import { format } from 'date-fns';

interface CustomerProfileClientProps {
  customer: any;
  linkOrders: any[];
  mallOrders: any[];
  shipments: any[];
}

export default function CustomerProfileClient({ customer, linkOrders, mallOrders, shipments }: CustomerProfileClientProps) {
  const [activeTab, setActiveTab] = useState('timeline'); // Actually the right panel tab
  const router = useRouter();

  // Calculate Quick Stats
  const totalOrders = linkOrders.length + mallOrders.length;
  const totalShipments = shipments.length;
  
  // Lifetime Value Calculation
  const linkOrdersTotal = linkOrders.reduce((sum, order) => sum + (Number(order.total) || 0) + (Number(order.shipping_cost) || 0), 0);
  const mallOrdersTotal = mallOrders.reduce((sum, order) => sum + (Number(order.total_amount) || 0) + (Number(order.shipping_cost) || 0), 0);
  const shipmentsTotal = shipments.reduce((sum, ship) => sum + (Number(ship.shipping_cost) || 0), 0);
  
  const lifetimeValue = linkOrdersTotal + mallOrdersTotal + shipmentsTotal;
  const isVip = lifetimeValue > 10000;

  // Build Timeline Events
  const timelineEvents = useMemo(() => {
    const events: any[] = [];
    
    linkOrders.forEach(order => {
      events.push({
        id: `lnk-${order.id}`,
        type: 'link_order',
        date: new Date(order.created_at),
        title: 'Link Order Placed',
        description: `Customer placed an order for ${order.product_name || 'items'}`,
        icon: Package,
        color: 'text-purple-500'
      });
    });

    mallOrders.forEach(order => {
      events.push({
        id: `mall-${order.id}`,
        type: 'mall_order',
        date: new Date(order.created_at),
        title: 'Mall Order Placed',
        description: `Customer purchased items from the Mall (Order ID: ${order.order_id || order.id})`,
        icon: ShoppingCart,
        color: 'text-pink-500'
      });
    });

    shipments.forEach(shipment => {
      events.push({
        id: `ship-${shipment.id}`,
        type: 'shipment',
        date: new Date(shipment.created_at),
        title: shipment.status === 'in_warehouse' ? 'Package Registered' : 'Shipment Created',
        description: `${shipment.items_description || 'Items'} registered (${shipment.tracking_number})`,
        icon: Ship,
        color: 'text-blue-500'
      });
    });

    // Sort descending by date
    return events.sort((a, b) => b.date.getTime() - a.date.getTime());
  }, [linkOrders, mallOrders, shipments]);

  const packages = shipments.filter(s => s.status === 'in_warehouse' || !s.shipment_start_date);
  const actualShipments = shipments.filter(s => s.shipment_start_date || s.status === 'in_transit' || s.status === 'delivered');

  return (
    <div className="flex flex-col lg:flex-row h-[calc(100vh-2rem)] gap-4 animate-in fade-in max-w-[1600px] mx-auto">
      
      {/* LEFT PANEL: Customer Snapshot */}
      <div className="w-full lg:w-80 flex-shrink-0 flex flex-col gap-4">
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 relative overflow-hidden flex flex-col h-full">
          <div className="absolute top-0 left-0 w-full h-1 bg-indigo-500"></div>
          
          <div className="flex items-center gap-4 mb-6 mt-2">
            <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center text-2xl font-black">
              {customer.name?.charAt(0).toUpperCase() || 'C'}
            </div>
            <div>
              <h2 className="text-lg font-bold text-white leading-tight">{customer.name}</h2>
              <p className="text-xs font-mono text-zinc-500 mt-1">{customer.customer_unique_id}</p>
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
                <p className="text-lg font-bold text-white">{totalOrders}</p>
                <p className="text-[10px] text-zinc-500 uppercase font-semibold">Total Orders</p>
              </div>
              <div className="bg-zinc-950 p-3 rounded-xl border border-zinc-800/50">
                <p className="text-lg font-bold text-white">{totalShipments}</p>
                <p className="text-[10px] text-zinc-500 uppercase font-semibold">Shipments</p>
              </div>
              <div className="bg-zinc-950 p-3 rounded-xl border border-zinc-800/50 col-span-2 flex justify-between items-center">
                <div>
                  <p className="text-[10px] text-zinc-500 uppercase font-semibold mb-1">Lifetime Value</p>
                  <p className="text-lg font-bold text-white">₵ {lifetimeValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                </div>
                {isVip && <div className="bg-indigo-500/10 text-indigo-400 text-[10px] font-bold uppercase px-2 py-1 rounded">VIP</div>}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CENTER PANEL: Timeline */}
      <div className="flex-1 flex flex-col bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden relative">
        <div className="p-4 border-b border-zinc-800 bg-zinc-950/50 backdrop-blur flex justify-between items-center sticky top-0 z-10">
          <h2 className="text-sm font-bold uppercase tracking-widest text-white flex items-center gap-2">
            <Clock className="w-4 h-4 text-indigo-500" /> Activity Timeline
          </h2>
        </div>
        
        <div className="flex-1 overflow-y-auto p-6 space-y-6 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {timelineEvents.length === 0 ? (
            <div className="text-center py-10 text-zinc-500">No activity recorded for this customer yet.</div>
          ) : (
            <div className="relative pl-6 border-l-2 border-zinc-800 space-y-8 before:absolute before:-left-[9px] before:top-0 before:w-4 before:h-4 before:rounded-full before:bg-zinc-900 before:border-2 before:border-indigo-500">
              {timelineEvents.map((event, idx) => {
                const Icon = event.icon;
                return (
                  <div key={event.id} className={idx === 0 ? "" : "relative before:absolute before:-left-[33px] before:top-0 before:w-4 before:h-4 before:rounded-full before:bg-zinc-900 before:border-2 before:border-zinc-700"}>
                    <p className={`text-xs font-bold mb-1 ${idx === 0 ? 'text-indigo-400' : 'text-zinc-500'}`}>
                      {format(event.date, 'MMM d, yyyy, HH:mm a')}
                    </p>
                    <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4 hover:border-zinc-700 transition-colors">
                      <div className="flex items-center gap-2 mb-2">
                        <Icon className={`w-4 h-4 ${event.color}`} />
                        <span className="text-sm font-bold text-white">{event.title}</span>
                      </div>
                      <p className="text-sm text-zinc-400">{event.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
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
        
        <div className="flex-1 overflow-y-auto p-4 bg-zinc-950/30 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {activeTab === 'mall' && (
            <div className="space-y-3">
              {mallOrders.length === 0 ? (
                <div className="text-center py-8 text-xs text-zinc-500">No Mall Orders found.</div>
              ) : mallOrders.map((o) => (
                <div 
                  key={o.id} 
                  onClick={() => router.push(`/agent/global-orders/mall-orders?search=${o.id}`)}
                  className="bg-zinc-900 border border-zinc-800 rounded-xl p-3 hover:border-zinc-700 transition-colors cursor-pointer"
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-xs font-bold text-white">{o.order_id || `MALL-${o.id.substring(0,8).toUpperCase()}`}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-500 font-bold uppercase">{o.order_status || 'Pending'}</span>
                  </div>
                  <p className="text-xs text-zinc-400 truncate">Total: ₵{o.total_amount || 0}</p>
                </div>
              ))}
            </div>
          )}
          {activeTab === 'links' && (
            <div className="space-y-3">
              {linkOrders.length === 0 ? (
                <div className="text-center py-8 text-xs text-zinc-500">No Link Orders found.</div>
              ) : linkOrders.map((o) => (
                <div 
                  key={o.id} 
                  onClick={() => router.push(`/agent/global-orders/link-orders?search=${o.id}`)}
                  className="bg-zinc-900 border border-zinc-800 rounded-xl p-3 hover:border-zinc-700 transition-colors cursor-pointer"
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-xs font-bold text-white">LNK-{o.id.toString().substring(0,8).toUpperCase()}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/10 text-amber-500 font-bold uppercase">{o.order_status || 'Pending'}</span>
                  </div>
                  <p className="text-xs text-zinc-400 truncate">{o.product_name || 'Link Order'}</p>
                </div>
              ))}
            </div>
          )}
          {activeTab === 'packages' && (
            <div className="space-y-3">
              {packages.length === 0 ? (
                <div className="text-center py-8 text-xs text-zinc-500">No Packages in warehouse.</div>
              ) : packages.map((p) => (
                <div 
                  key={p.id} 
                  onClick={() => router.push(`/agent/shipments?search=${p.tracking_number}`)}
                  className="bg-zinc-900 border border-zinc-800 rounded-xl p-3 hover:border-zinc-700 transition-colors cursor-pointer"
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-xs font-bold text-white">{p.tracking_number}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-purple-500/10 text-purple-400 font-bold uppercase">{p.status || 'In Warehouse'}</span>
                  </div>
                  <p className="text-xs text-zinc-400 truncate">{p.items_description || 'Package'}</p>
                </div>
              ))}
            </div>
          )}
          {activeTab === 'shipments' && (
             <div className="space-y-3">
              {actualShipments.length === 0 ? (
                <div className="text-center py-8 text-xs text-zinc-500">No Active Shipments found.</div>
              ) : actualShipments.map((s) => (
               <div 
                 key={s.id} 
                 onClick={() => router.push(`/agent/shipments?search=${s.tracking_number}`)}
                 className="bg-zinc-900 border border-zinc-800 rounded-xl p-3 hover:border-zinc-700 transition-colors cursor-pointer relative overflow-hidden"
               >
                 <div className="absolute top-0 left-0 w-1 h-full bg-blue-500"></div>
                 <div className="flex justify-between items-start mb-2 pl-2">
                   <span className="text-xs font-bold text-white">{s.tracking_number}</span>
                   <span className="text-[10px] px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 font-bold uppercase">{s.status || 'In Transit'}</span>
                 </div>
                 <p className="text-xs text-zinc-400 pl-2 truncate">{s.items_description || 'Shipment'}</p>
               </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
