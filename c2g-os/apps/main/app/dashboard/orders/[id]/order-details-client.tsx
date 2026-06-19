"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Link as LinkIcon, ArrowLeft, CheckCircle2, Clock, Map, Plane, Ship, ExternalLink, CreditCard } from "lucide-react";
import { ShipmentTracker } from "../../../../components/shipment-tracker";

export function OrderDetailsClient({ order, initialTrack }: { order: any, initialTrack: boolean }) {
  const router = useRouter();
  const [showTracker, setShowTracker] = useState(initialTrack);

  // Define full timeline based on C2G flow
  const timelineSteps = [
    { key: "pending_payment", label: "Pending Payment" },
    { key: "pending", label: "Awaiting Purchase" },
    { key: "purchased", label: "Purchased" },
    { key: "shipped_from_supplier", label: "Supplier Shipped" },
    { key: "in_warehouse", label: "Received In Warehouse" },
    { key: "in_transit", label: "Shipped To Destination" },
    { key: "arrived", label: "Arrived Destination" },
    { key: "ready_for_pickup", label: "Ready For Pickup" },
    { key: "delivered", label: "Completed" }
  ];

  // Map history to timeline
  const getTimeline = () => {
    let currentReached = false;
    // Iterate from end backwards to find current status
    const currentStepIndex = timelineSteps.findIndex(s => s.key === order.order_status) || 0;

    return timelineSteps.map((step, index) => {
      const historyEntry = order.history?.find((h: any) => h.status === step.key);
      const isCompleted = index <= currentStepIndex;
      const date = historyEntry 
        ? new Date(historyEntry.changed_at).toLocaleString('en-GB', { 
            year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' 
          })
        : null;

      // Special case for creation
      if (step.key === "pending_payment" && !date) {
        return {
          status: step.label,
          completed: true,
          date: new Date(order.created_at).toLocaleString('en-GB', { 
            year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' 
          })
        };
      }

      return {
        status: step.label,
        completed: isCompleted,
        date: date
      };
    });
  };

  const timeline = getTimeline();
  const isPaid = order.payment_status === 'paid' || order.payment_status === 'Paid';
  
  const formatCurrency = (amount: number) => `₵${parseFloat((amount || 0).toString()).toFixed(2)}`;

  return (
    <div className="space-y-8 animate-fade-in max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button 
          onClick={() => router.push("/dashboard/orders")}
          className="p-2 -ml-2 hover:bg-secondary rounded-full transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Order Details</h1>
          <p className="text-muted-foreground font-mono text-sm">{order.id}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Main Info Column */}
        <div className="md:col-span-2 space-y-6">
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
              <div className="w-24 h-24 rounded-xl bg-secondary flex items-center justify-center shrink-0 border border-border overflow-hidden">
                {order.screenshot_url ? (
                  <img src={order.screenshot_url} alt="Item" className="w-full h-full object-cover" />
                ) : (
                  <LinkIcon className="w-8 h-8 text-muted-foreground" />
                )}
              </div>
              <div className="pt-2">
                <h2 className="text-xl font-bold pr-20">{order.product_name || 'Link Order Item'}</h2>
                <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                  <span>Qty: {order.quantity || 1}</span>
                  <span className="w-1 h-1 rounded-full bg-border" />
                  <span className="font-semibold text-primary">{formatCurrency(order.total || 0)}</span>
                </div>
                <div className="flex items-center gap-2 mt-4 text-sm font-medium capitalize">
                  {order.shipping_mode === "sea" ? <Ship className="w-4 h-4 text-green-500" /> : <Plane className="w-4 h-4 text-blue-500" />}
                  {order.shipping_mode || 'Air Express'}
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="mt-8 pt-6 border-t border-border flex flex-col sm:flex-row gap-3">
              {!isPaid ? (
                <button 
                  onClick={async (e) => {
                    const btn = e.currentTarget;
                    btn.disabled = true;
                    btn.innerHTML = '<span class="animate-pulse">Initializing...</span>';
                    try {
                      const res = await fetch('/api/hubtel/initialize', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ orderId: order.id })
                      });
                      const data = await res.json();
                      if (data.checkoutUrl) {
                        window.location.href = data.checkoutUrl;
                      } else {
                        alert(data.error || 'Failed to initialize payment');
                        btn.disabled = false;
                        btn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-credit-card w-4 h-4"><rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/></svg> Pay Order Now';
                      }
                    } catch (err) {
                      alert('Network error. Please try again.');
                      btn.disabled = false;
                      btn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-credit-card w-4 h-4"><rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/></svg> Pay Order Now';
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
              {order.product_link && (
                <a 
                  href={order.product_link} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors border border-input bg-background hover:bg-accent hover:text-accent-foreground h-11 px-4 gap-2"
                >
                  <ExternalLink className="w-4 h-4" /> Source Link
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Timeline Column */}
        <div className="md:col-span-1">
          <div className="glass-panel p-6 h-full">
            <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2 mb-6">
              <Clock className="w-4 h-4" /> Timeline
            </h3>
            
            <div className="relative pl-6 space-y-5">
              <div className="absolute left-[11px] top-2 bottom-2 w-0.5 bg-secondary/80"></div>
              
              {timeline.map((step, i) => (
                <div key={i} className={`relative flex items-start gap-4 ${step.completed ? 'opacity-100' : 'opacity-40'}`}>
                  {/* Timeline Node */}
                  <div className={`absolute -left-6 mt-0.5 w-4 h-4 rounded-full border-2 ${
                    step.completed 
                      ? 'bg-primary border-primary shadow-[0_0_8px_rgba(var(--primary),0.5)]' 
                      : 'bg-background border-muted-foreground'
                  }`}>
                    {step.completed && <CheckCircle2 className="w-full h-full text-primary-foreground p-0.5" />}
                  </div>
                  
                  {/* Timeline Content */}
                  <div className="flex-1 -mt-1">
                    <p className={`text-sm font-medium ${step.completed ? 'text-foreground' : 'text-muted-foreground'}`}>
                      {step.status}
                    </p>
                    {step.date && (
                      <p className="text-xs text-muted-foreground mt-0.5">{step.date}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

      {showTracker && (
        <ShipmentTracker
          trackingId={order.id}
          shippingModeStr={order.shipping_mode}
          shipmentStartDate={order.created_at}
          onClose={() => setShowTracker(false)}
        />
      )}
    </div>
  );
}
