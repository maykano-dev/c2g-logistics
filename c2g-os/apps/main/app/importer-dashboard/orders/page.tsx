"use client";

import { Search, Filter, Eye, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { getImporterOrders } from "./actions";

export default function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadOrders() {
      const { success, orders } = await getImporterOrders();
      if (success && orders) {
        setOrders(orders);
      }
      setLoading(false);
    }
    loadOrders();
  }, []);

  const handleViewOrder = (id: string) => alert(`Opening details for Order: ${id}`);
  const handleFilter = () => alert("Filter orders modal opened.");

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto animate-fade-in pb-24">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Orders</h1>
        <p className="text-muted-foreground mt-1">Track and manage customer orders from your store.</p>
      </div>

      <div className="glass-panel shadow-lg border-border/50 overflow-hidden">
        <div className="p-4 border-b border-border/50 flex flex-col sm:flex-row gap-4 justify-between items-center bg-secondary/10">
          <div className="relative w-full sm:w-96">
            <input 
              type="text" 
              placeholder="Search by Order ID or Customer..." 
              className="w-full h-10 pl-10 pr-4 bg-background border border-input rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary text-sm"
            />
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          </div>
          <div className="flex items-center gap-2">
            <button onClick={handleFilter} className="flex items-center gap-2 px-4 h-10 rounded-lg border border-border bg-background hover:bg-secondary transition-colors text-sm font-medium">
              <Filter className="w-4 h-4" /> Filter
            </button>
          </div>
        </div>

        {/* Desktop Table View */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[900px]">
            <thead>
              <tr className="bg-secondary/20">
                <th className="py-4 px-6 text-sm font-semibold text-muted-foreground">Order ID & Date</th>
                <th className="py-4 px-6 text-sm font-semibold text-muted-foreground">Customer</th>
                <th className="py-4 px-6 text-sm font-semibold text-muted-foreground">Items</th>
                <th className="py-4 px-6 text-sm font-semibold text-muted-foreground">Total (₵)</th>
                <th className="py-4 px-6 text-sm font-semibold text-muted-foreground">Status</th>
                <th className="py-4 px-6 text-sm font-semibold text-muted-foreground text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-muted-foreground">
                    No orders found.
                  </td>
                </tr>
              )}
              {orders.map((order) => (
                <tr key={order.id} className="border-b border-border/10 last:border-0 hover:bg-secondary/10 transition-colors">
                  <td className="py-4 px-6">
                    <div className="font-bold text-sm text-primary">{order.id}</div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {new Date(order.date).toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short' })}
                    </div>
                  </td>
                  <td className="py-4 px-6 text-sm font-medium">
                    {order.customer_name}
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex -space-x-2 overflow-hidden">
                      {order.items.map((item: any, idx: number) => {
                        const imgUrl = item.image_url || item.product_images?.[0]?.image_url || "https://placehold.co/100x100?text=No+Image";
                        return (
                          <img 
                            key={idx} 
                            className="inline-block h-8 w-8 rounded-full ring-2 ring-background object-cover bg-secondary" 
                            src={imgUrl} 
                            alt={item.name} 
                            title={item.name}
                          />
                        );
                      })}
                    </div>
                  </td>
                  <td className="py-4 px-6 font-bold text-sm">₵{order.amount_ghs.toFixed(2)}</td>
                  <td className="py-4 px-6">
                    <span className={`px-2.5 py-1.5 rounded-md text-xs font-bold uppercase tracking-wider ${
                      order.status === 'delivered' ? 'bg-green-500/10 text-green-500 border border-green-500/20' :
                      order.status === 'processing' || order.status === 'pending_payment' ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20' :
                      order.status === 'shipped' ? 'bg-blue-500/10 text-blue-500 border border-blue-500/20' :
                      'bg-secondary text-muted-foreground border border-border'
                    }`}>
                      {order.status.replace(/_/g, ' ')}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center justify-end">
                      <button onClick={() => handleViewOrder(order.id)} className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-primary hover:bg-primary/10 rounded-md transition-colors border border-primary/20">
                        <Eye className="w-3.5 h-3.5" /> View
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Card View */}
        <div className="md:hidden flex flex-col gap-4">
          {orders.length === 0 && (
            <div className="py-12 text-center text-sm text-muted-foreground">
              No orders found.
            </div>
          )}
          {orders.map((order) => (
            <div key={order.id} className="p-4 flex flex-col gap-3 bg-card border border-border/50 rounded-xl shadow-sm">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-bold text-sm text-primary">{order.id}</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {new Date(order.date).toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short' })}
                  </p>
                </div>
                <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                  order.status === 'delivered' ? 'bg-green-500/10 text-green-500 border border-green-500/20' :
                  order.status === 'processing' || order.status === 'pending_payment' ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20' :
                  order.status === 'shipped' ? 'bg-blue-500/10 text-blue-500 border border-blue-500/20' :
                  'bg-secondary text-muted-foreground border border-border'
                }`}>
                  {order.status.replace(/_/g, ' ')}
                </span>
              </div>

              <div className="bg-secondary/20 rounded-lg p-3 flex items-center justify-between border border-border/30">
                <div>
                  <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider mb-0.5">Customer</p>
                  <p className="text-sm font-medium text-foreground">{order.customer_name}</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider mb-0.5">Total</p>
                  <p className="text-sm font-bold text-primary">₵{order.amount_ghs.toFixed(2)}</p>
                </div>
              </div>

              <div className="flex items-center justify-between mt-1 pt-2 border-t border-border/30">
                <div className="flex -space-x-2 overflow-hidden">
                  {order.items.map((item: any, idx: number) => {
                    const imgUrl = item.image_url || item.product_images?.[0]?.image_url || "https://placehold.co/100x100?text=No+Image";
                    return (
                      <img 
                        key={idx} 
                        className="inline-block h-8 w-8 rounded-full ring-2 ring-background object-cover bg-secondary" 
                        src={imgUrl} 
                        alt={item.name} 
                      />
                    );
                  })}
                  {order.items.length > 3 && (
                    <div className="h-8 w-8 rounded-full ring-2 ring-background bg-secondary flex items-center justify-center text-[10px] font-bold text-muted-foreground">
                      +{order.items.length - 3}
                    </div>
                  )}
                </div>
                <button onClick={() => handleViewOrder(order.id)} className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-primary hover:bg-primary/10 rounded-md transition-colors border border-primary/20">
                  <Eye className="w-3.5 h-3.5" /> View
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
