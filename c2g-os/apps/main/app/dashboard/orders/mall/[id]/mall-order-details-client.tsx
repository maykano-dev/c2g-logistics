"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, CheckCircle2, Map, Plane, Ship, CreditCard, Settings, ShoppingCart, Building, ShieldCheck, MapPin, ExternalLink, Package, Truck, Loader2 } from "lucide-react";

import { useModal } from "@/components/providers/modal-provider";
import { payMallOrder, fetchOrderTrackingTimeline } from "../../../mall-orders/actions";

export function MallOrderDetailsClient({ order, initialTrack }: { order: any, initialTrack: boolean }) {
  const router = useRouter();
  const { showAlert } = useModal();
  
  const [trackingData, setTrackingData] = useState<any>(null);
  const [isLoadingTracking, setIsLoadingTracking] = useState(true);

  useEffect(() => {
    async function loadTracking() {
      try {
        const res = await fetchOrderTrackingTimeline(order.id);
        if (res.success) {
          setTrackingData(res);
        }
      } catch (err) {
        console.error("Failed to load tracking:", err);
      } finally {
        setIsLoadingTracking(false);
      }
    }
    loadTracking();
  }, [order.id]);

  const timelineSteps = [
    { key: "new", label: "Awaiting Payment", icon: CreditCard },
    { key: "processing", label: "Processing", icon: Settings },
    { key: "purchased", label: "Purchased", icon: ShoppingCart },
    { key: "in_warehouse", label: "China Warehouse", icon: Building },
    { key: "in_transit", label: "In Transit", icon: Plane },
    { key: "clearance", label: "Clearance", icon: ShieldCheck },
    { key: "available_for_pickup", label: "Available for pickup", icon: MapPin },
    { key: "delivered", label: "Delivered", icon: CheckCircle2 }
  ];

  // Map history to timeline
  const getTimeline = () => {
    const isPaid = order.payment_status === 'paid' || order.payment_status === 'Paid';
    
    let currentStepIndex = timelineSteps.findIndex(s => s.key === order.order_status);
    
    // Automatically advance timeline if payment went through but order_status is lagging
    if (currentStepIndex <= 0 && isPaid) {
      currentStepIndex = 1; // Force 'Processing' 
    }
    
    if (currentStepIndex === -1) currentStepIndex = 0;

    return timelineSteps.map((step, index) => {
      const historyEntry = order.history?.find((h: any) => h.status === step.key);
      const isCompleted = index <= currentStepIndex;
      const date = historyEntry 
        ? new Date(historyEntry.changed_at).toLocaleString('en-GB', { 
            year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' 
          })
        : null;

      // Special case for creation
      if (step.key === "new" && !date) {
        return {
          key: step.key,
          status: step.label,
          completed: true,
          isCurrent: index === currentStepIndex,
          Icon: step.icon,
          date: new Date(order.created_at).toLocaleString('en-GB', { 
            year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' 
          })
        };
      }

      return {
        key: step.key,
        status: step.label,
        completed: isCompleted,
        isCurrent: index === currentStepIndex,
        date: date,
        Icon: step.icon
      };
    });
  };

  const timeline = getTimeline();
  const isPaid = order.payment_status === 'paid' || order.payment_status === 'Paid';
  
  const formatCurrency = (amount: number) => `₵${parseFloat((amount || 0).toString()).toFixed(2)}`;

  // Assuming items is an array of products
  const items = Array.isArray(order.items) ? order.items : [];
  const primaryItem = items[0] || {};
  const totalQuantity = items.reduce((sum: number, i: any) => sum + (i.quantity || 1), 0);



  return (
    <div className="space-y-8 animate-fade-in max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button 
          onClick={() => router.push("/dashboard/orders?tab=mall")}
          className="p-2 -ml-2 hover:bg-secondary rounded-full transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Mall Order Details</h1>
          <p className="text-muted-foreground font-mono text-sm">{order.order_id || `C2G-${String(order.id).split('-').pop()?.substring(0, 8)}`}</p>
        </div>
      </div>

      <div className="flex flex-col gap-6 lg:gap-10">
        
        {/* Main Info Card */}
        <div className="space-y-6 w-full">
          <div className="glass-panel p-6 relative overflow-hidden">
             {/* Absolute Payment Status Badge */}
             <div className="absolute top-6 right-6">
               <span className={`px-2.5 py-1 rounded-full text-xs font-bold border whitespace-nowrap capitalize ${
                  isPaid 
                    ? 'bg-green-500/10 text-green-500 border-green-500/20' 
                    : 'bg-destructive/10 text-destructive border-destructive/20 animate-pulse'
                }`}>
                  {order.payment_status?.replace('_', ' ') || 'Unpaid'}
                </span>
            </div>

            <div className="flex flex-col sm:flex-row gap-6">
              <div className="w-24 h-24 rounded-full bg-secondary flex items-center justify-center shrink-0 border border-border overflow-hidden relative shadow-md">
                {items.length > 1 ? (
                  <div className="w-full h-full bg-gradient-to-tr from-blue-700 via-blue-600 to-red-500 flex flex-col items-center justify-center relative overflow-hidden shadow-lg">
                    <span className="text-5xl font-black text-white leading-none tracking-tighter drop-shadow-md z-10 -mt-1">{items.length}</span>
                    <span className="text-[9px] font-extrabold text-white/90 uppercase tracking-[0.2em] mt-1 z-10">Items</span>
                  </div>
                ) : primaryItem.imageUrl || primaryItem.image_url ? (
                  <img src={primaryItem.imageUrl || primaryItem.image_url} alt="Item" className="w-full h-full object-cover" />
                ) : (
                  <ShoppingCart className="w-8 h-8 text-muted-foreground" />
                )}
              </div>
              <div className="pt-2">
                <h2 className="text-xl font-bold pr-20 truncate" title={items.length > 1 ? 'Mall Order Bundle' : primaryItem.name}>
                  {items.length > 1 ? 'Mall Order Bundle' : (primaryItem.name || 'Mall Order Item')}
                </h2>
                <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                  <span>Qty: {totalQuantity}</span>
                  <span className="w-1 h-1 rounded-full bg-border" />
                  <span className="font-semibold text-primary">{formatCurrency(order.total_amount || 0)}</span>
                </div>
                <div className="flex items-center gap-2 mt-4 text-sm font-medium capitalize">
                  {order.shipping_method === "sea" ? <Ship className="w-4 h-4 text-green-500" /> : <Plane className="w-4 h-4 text-blue-500" />}
                  {order.shipping_method || 'Air Express'}
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="mt-8 pt-6 border-t border-border flex flex-col sm:flex-row gap-3">
              {!isPaid && (
                <button 
                  onClick={async (e) => {
                    const btn = e.currentTarget;
                    const originalHtml = btn.innerHTML;
                    btn.disabled = true;
                    btn.innerHTML = '<span class="animate-pulse">Processing...</span>';
                    try {
                      const res = await payMallOrder(order.id);
                      if (res.success) {
                        showAlert({ title: 'Payment Successful', message: 'Order paid successfully from wallet.', type: 'success' });
                        router.refresh();
                      } else {
                        showAlert({ title: 'Payment Error', message: res.error || 'Failed to process payment.', type: 'danger' });
                        btn.disabled = false;
                        btn.innerHTML = originalHtml;
                      }
                    } catch (err) {
                      showAlert({ title: 'System Error', message: 'An unexpected error occurred.', type: 'danger' });
                      btn.disabled = false;
                      btn.innerHTML = originalHtml;
                    }
                  }}
                  className="w-full inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors bg-destructive text-destructive-foreground hover:bg-destructive/90 h-11 px-4 gap-2 shadow-lg shadow-destructive/20 disabled:opacity-50 disabled:pointer-events-none"
                >
                  <CreditCard className="w-4 h-4" /> Pay Order Now
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Order Details Body */}
        <div className="w-full">
          <div className="glass-panel p-6 space-y-4">
            <h3 className="font-bold border-b border-border/50 pb-2 mb-4">Order Summary</h3>
            
            <div className="flex justify-between items-center py-2 border-b border-border/50">
              <span className="text-muted-foreground">Order ID</span>
              <span className="font-mono text-sm font-medium">{order.order_id || `C2G-${String(order.id).split('-').pop()?.substring(0, 8)}`}</span>
            </div>
            
            <div className="flex justify-between items-center py-2 border-b border-border/50">
              <span className="text-muted-foreground">Date Placed</span>
              <span className="font-medium">
                {order.created_at && !isNaN(new Date(order.created_at).getTime()) ? new Date(order.created_at).toLocaleDateString('en-GB', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'Pending'}
              </span>
            </div>

            {/* Items display */}
            {items.length > 0 && (
              <div className="py-4 border-b border-border/50 space-y-3">
                <span className="text-muted-foreground block mb-2">Order Items</span>
                {items.map((item: any, idx: number) => (
                  <div key={item.id || idx} className="bg-secondary/20 p-3 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-3 border border-border/50">
                    <div className="flex items-center gap-3 w-full sm:max-w-[60%]">
                      <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center shrink-0 border border-border overflow-hidden relative shadow-sm">
                        {item.imageUrl || item.image_url ? (
                          <img src={item.imageUrl || item.image_url} alt="Item" className="w-full h-full object-cover rounded-full" />
                        ) : (
                          <Package className="w-5 h-5 text-muted-foreground" />
                        )}
                      </div>
                      <div className="flex flex-col overflow-hidden w-full">
                        <span className="font-medium text-sm truncate" title={item.name}>{item.name || `Item ${idx + 1}`}</span>
                        {item.selectedOptions && (
                           <span className="text-xs text-muted-foreground mt-1 truncate" title={Object.entries(item.selectedOptions).map(([k, v]) => `${k}: ${v}`).join(', ')}>
                             {Object.entries(item.selectedOptions).map(([k, v]) => `${k}: ${v}`).join(', ')}
                           </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-sm mt-3 sm:mt-0 shrink-0">
                      <span className="text-muted-foreground">Qty: <span className="text-foreground font-medium">{item.quantity}</span></span>
                      <span className="text-muted-foreground">Price: <span className="text-foreground font-medium">{formatCurrency(item.price)}</span></span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Payment Summary Receipt */}
            <div className="bg-secondary/10 p-5 rounded-xl border border-border/50 mt-4 space-y-3 shadow-inner">
              <h4 className="text-sm font-bold flex items-center gap-2 mb-2 text-foreground/80">
                <CreditCard className="w-4 h-4" /> Payment Summary
              </h4>
              <div className="flex justify-between items-center py-1">
                <span className="text-muted-foreground text-sm">Items Subtotal</span>
                <span className="font-medium text-sm">₵{order.subtotal || 0}</span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="text-muted-foreground text-sm">Service Fee</span>
                <span className="font-medium text-sm">₵{order.service_fee || 0}</span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="text-muted-foreground text-sm">Local Delivery</span>
                <span className="font-medium text-sm">₵{order.shipping_cost || 0}</span>
              </div>
              <div className="flex justify-between items-center pt-3 mt-1 border-t border-border/50">
                <span className="text-foreground font-semibold">Total Cost</span>
                <span className="font-black text-primary text-lg tracking-tight">{formatCurrency(order.total_amount || 0)}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 mt-2">
              <div className="flex justify-between items-center p-3 rounded-lg border border-border/50 bg-background/50">
                <span className="text-muted-foreground text-sm flex items-center gap-2">
                   {order.shipping_method === "sea" ? <Ship className="w-4 h-4 text-green-500" /> : <Plane className="w-4 h-4 text-blue-500" />}
                   Shipping Mode
                </span>
                <span className="font-semibold text-sm capitalize">
                  {order.shipping_method || 'Air Express'}
                </span>
              </div>

              <div className="flex justify-between items-center p-3 rounded-lg border border-border/50 bg-background/50">
                <span className="text-muted-foreground text-sm flex items-center gap-2">
                  {order.payment_status === 'paid' ? <CheckCircle2 className="w-4 h-4 text-green-500" /> : <Settings className="w-4 h-4 text-orange-500" />}
                  Payment Status
                </span>
                <span className={`font-semibold text-sm capitalize ${order.payment_status === 'paid' ? 'text-green-500' : 'text-orange-500'}`}>
                  {order.payment_status?.replace(/_/g, ' ') || 'Pending'}
                </span>
              </div>

              <div className="flex justify-between items-center p-3 rounded-lg border border-border/50 bg-background/50 sm:col-span-2">
                <span className="text-muted-foreground text-sm flex items-center gap-2">
                  <Package className="w-4 h-4 text-primary" />
                  Order Status
                </span>
                <span className="font-bold text-sm capitalize text-primary">
                  {order.order_status?.replace(/_/g, ' ') || 'Pending Payment'}
                </span>
              </div>
            </div>

            {order.shipping_address && (
              <div className="py-2 border-b border-border/50">
                <span className="text-muted-foreground block mb-1">Shipping Address</span>
                <p className="text-sm font-medium">{order.shipping_address}</p>
                {order.shipping_notes && <p className="text-xs text-muted-foreground mt-1">Note: {order.shipping_notes}</p>}
              </div>
            )}
            
          </div>
        </div>

        {/* Tracking Timeline */}
        <div className="w-full">
          <div className="glass-panel p-6 space-y-4 relative overflow-hidden">
             <h3 className="font-bold border-b border-border/50 pb-2 mb-4 flex items-center gap-2">
               <Map className="w-5 h-5 text-primary" /> Live Tracking Timeline
             </h3>
             
             {isLoadingTracking ? (
                <div className="flex flex-col items-center justify-center py-10 space-y-3">
                  <Loader2 className="w-8 h-8 text-primary animate-spin" />
                  <p className="text-sm text-muted-foreground font-medium animate-pulse">Connecting to China Logistics Network...</p>
                </div>
             ) : (
                <div className="relative border-l-2 border-border ml-3 mt-6 space-y-8 pb-4">
                  {/* Phase 1: Hiobuy/Domestic Trace */}
                  {trackingData?.hiobuyTrace?.logistics_nodes || trackingData?.hiobuyTrace?.data?.logistics_nodes ? (
                     ((trackingData.hiobuyTrace.logistics_nodes || trackingData.hiobuyTrace.data.logistics_nodes) as any[]).map((node, idx) => (
                        <div key={`hiobuy-${idx}`} className="relative pl-6">
                          <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-primary/20 border-2 border-primary shadow-[0_0_10px_rgba(var(--primary),0.3)] z-10" />
                          <div className="flex flex-col">
                            <span className="text-xs font-bold text-muted-foreground mb-1">{node.time}</span>
                            <span className="text-sm font-medium text-foreground">{node.description}</span>
                          </div>
                        </div>
                     ))
                  ) : (
                     <div className="relative pl-6">
                        <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-secondary border-2 border-border z-10" />
                        <div className="flex flex-col">
                          <span className="text-sm font-medium text-muted-foreground">Domestic logistics trace not yet available.</span>
                        </div>
                     </div>
                  )}

                  {/* C2G System Order History */}
                  {(trackingData?.localHistory || []).map((history: any, idx: number) => (
                    <div key={`hist-${idx}`} className="relative pl-6 opacity-80">
                      <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-secondary border-2 border-border z-10" />
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-muted-foreground mb-1">
                          {new Date(history.changed_at).toLocaleString('en-GB', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                        </span>
                        <span className="text-sm font-medium text-foreground capitalize">
                           System Status Updated: {history.status.replace(/_/g, ' ')}
                        </span>
                      </div>
                    </div>
                  ))}
                  
                  {/* Order Placed */}
                  <div className="relative pl-6 opacity-60">
                     <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-secondary border-2 border-border z-10" />
                     <div className="flex flex-col">
                       <span className="text-xs font-bold text-muted-foreground mb-1">
                          {order.created_at && !isNaN(new Date(order.created_at).getTime()) ? new Date(order.created_at).toLocaleString('en-GB', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'Unknown'}
                       </span>
                       <span className="text-sm font-medium text-foreground">
                          Order Placed
                       </span>
                     </div>
                  </div>

                </div>
             )}
          </div>
        </div>
      </div>
    </div>
  );
}
