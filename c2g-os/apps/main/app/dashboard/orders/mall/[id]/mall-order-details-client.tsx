"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, CheckCircle2, Map, Plane, Ship, CreditCard, Settings, ShoppingCart, Building, ShieldCheck, MapPin, ExternalLink } from "lucide-react";
import TrackerClient from "../../../packages/[id]/tracker-client";
import { useModal } from "@/components/providers/modal-provider";
import { payMallOrder } from "../../../mall-orders/actions";

export function MallOrderDetailsClient({ order, initialTrack }: { order: any, initialTrack: boolean }) {
  const router = useRouter();
  const [showTracker, setShowTracker] = useState(initialTrack);
  const { showAlert } = useModal();

  const timelineSteps = [
    { key: "new", label: "Awaiting Payment", icon: CreditCard },
    { key: "processing", label: "Processing", icon: Settings },
    { key: "purchased", label: "Purchased", icon: ShoppingCart },
    { key: "in_warehouse", label: "In Warehouse", icon: Building },
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

  if (showTracker) {
    const adapterPkg = {
      id: order.id,
      tracking_number: order.order_id || String(order.id).substring(0,8),
      items_description: primaryItem.name || 'Mall Order Items',
      method: order.shipping_method === 'sea' ? 'sea_normal' : 'air_normal',
      status: order.order_status,
      created_at: order.created_at,
      weight: order.weight,
      cbm: order.cbm,
      shipment_start_date: ['in_transit', 'clearance', 'available_for_pickup', 'delivered'].includes(order.order_status) 
        ? (order.history?.find((h: any) => h.status === 'in_transit')?.changed_at || order.created_at) 
        : null,
      registration_fee_paid: null,
    };

    return (
      <TrackerClient 
        pkg={adapterPkg} 
        onBack={() => setShowTracker(false)} 
        backLabel="Back to Order Details" 
        walletBalance={0}
        registrationFee={0}
      />
    );
  }

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
               <span className={`px-2.5 py-1 rounded-full text-xs font-bold border capitalize ${
                  isPaid 
                    ? 'bg-green-500/10 text-green-500 border-green-500/20' 
                    : 'bg-destructive/10 text-destructive border-destructive/20 animate-pulse'
                }`}>
                  {order.payment_status?.replace('_', ' ') || 'Unpaid'}
                </span>
            </div>

            <div className="flex flex-col sm:flex-row gap-6">
              <div className="w-24 h-24 rounded-xl bg-secondary flex items-center justify-center shrink-0 border border-border overflow-hidden relative">
                {primaryItem.imageUrl ? (
                  <img src={primaryItem.imageUrl} alt="Item" className="w-full h-full object-cover" />
                ) : (
                  <ShoppingCart className="w-8 h-8 text-muted-foreground" />
                )}
              </div>
              <div className="pt-2">
                <h2 className="text-xl font-bold pr-20 truncate" title={primaryItem.name}>{primaryItem.name || 'Mall Order Item'}</h2>
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
              {!isPaid ? (
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
              ) : (
                <button 
                  onClick={() => setShowTracker(true)}
                  className="w-full inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors bg-primary text-primary-foreground hover:bg-primary/90 h-11 px-4 gap-2 shadow-lg shadow-primary/20"
                >
                  <Map className="w-4 h-4" /> Live Tracking Map
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
                {new Date(order.created_at).toLocaleDateString('en-GB', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>

            {/* Items display */}
            {items.length > 0 && (
              <div className="py-4 border-b border-border/50 space-y-3">
                <span className="text-muted-foreground block mb-2">Order Items</span>
                {items.map((item: any, idx: number) => (
                  <div key={item.id || idx} className="bg-secondary/20 p-3 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-2 border border-border/50">
                    <div className="flex flex-col max-w-[50%]">
                      <span className="font-medium text-sm truncate" title={item.name}>{item.name || `Item ${idx + 1}`}</span>
                      {item.selectedOptions && (
                         <span className="text-xs text-muted-foreground mt-1">
                           {Object.entries(item.selectedOptions).map(([k, v]) => `${k}: ${v}`).join(', ')}
                         </span>
                      )}
                    </div>
                    <div className="flex items-center gap-4 text-sm">
                      <span className="text-muted-foreground">Qty: <span className="text-foreground font-medium">{item.quantity}</span></span>
                      <span className="text-muted-foreground">Price: <span className="text-foreground font-medium">₵{item.price}</span></span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="flex justify-between items-center py-2 border-b border-border/50">
              <span className="text-muted-foreground">Items Subtotal</span>
              <span className="font-medium">₵{order.subtotal || 0}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-border/50">
              <span className="text-muted-foreground">Service Fee</span>
              <span className="font-medium">₵{order.service_fee || 0}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-border/50">
              <span className="text-muted-foreground">Local Delivery</span>
              <span className="font-medium">₵{order.shipping_cost || 0}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-border/50">
              <span className="text-muted-foreground">Total Cost (GHS)</span>
              <span className="font-bold text-primary">{formatCurrency(order.total_amount || 0)}</span>
            </div>

            <div className="flex justify-between items-center py-2 border-b border-border/50">
              <span className="text-muted-foreground">Shipping Mode</span>
              <span className="font-medium capitalize flex items-center gap-1.5">
                {order.shipping_method === "sea" ? <Ship className="w-4 h-4 text-green-500" /> : <Plane className="w-4 h-4 text-blue-500" />}
                {order.shipping_method || 'Air Express'}
              </span>
            </div>

            <div className="flex justify-between items-center py-2 border-b border-border/50">
              <span className="text-muted-foreground">Order Status</span>
              <span className="font-medium capitalize">{order.order_status?.replace(/_/g, ' ') || 'Pending Payment'}</span>
            </div>

            <div className="flex justify-between items-center py-2 border-b border-border/50">
              <span className="text-muted-foreground">Payment Status</span>
              <span className="font-medium capitalize">{order.payment_status?.replace(/_/g, ' ') || 'Pending'}</span>
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
      </div>
    </div>
  );
}
