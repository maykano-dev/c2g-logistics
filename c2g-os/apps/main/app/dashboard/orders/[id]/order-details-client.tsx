"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Link as LinkIcon, ArrowLeft, CheckCircle2, Clock, Map, Plane, Ship, ExternalLink, CreditCard, Settings, ShoppingCart, Building, Navigation, Circle, ShieldCheck, MapPin } from "lucide-react";
import TrackerClient from "../../packages/[id]/tracker-client";
import { useModal } from "@/components/providers/modal-provider";

export function OrderDetailsClient({ order, initialTrack }: { order: any, initialTrack: boolean }) {
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

  if (showTracker) {
    const adapterPkg = {
      id: order.id,
      tracking_number: order.id,
      items_description: order.product_name || 'Link Order Items',
      method: order.shipping_mode === 'sea' ? 'sea_normal' : 'air_normal',
      status: order.order_status,
      created_at: order.created_at,
      weight: order.weight,
      cbm: order.cbm,
      shipment_start_date: ['in_transit', 'clearance', 'available_for_pickup', 'delivered'].includes(order.order_status) 
        ? (order.history?.find((h: any) => h.status === 'in_transit')?.changed_at || order.created_at) 
        : null,
      registration_fee_paid: null, // Null to skip the registration fee overlay
    };

    return (
      <TrackerClient 
        pkg={adapterPkg} 
        onBack={() => setShowTracker(false)} 
        backLabel="Back to Order Details" 
      />
    );
  }

  return (
    <div className="space-y-8 animate-fade-in max-w-6xl mx-auto">
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
                        showAlert({ title: 'Payment Error', message: data.error || 'Failed to initialize payment', type: 'danger' });
                        btn.disabled = false;
                        btn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-credit-card w-4 h-4"><rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/></svg> Pay Order Now';
                      }
                    } catch (err) {
                      showAlert({ title: 'Network Error', message: 'Network error. Please try again.', type: 'danger' });
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
        </div>        {/* Timeline Horizontal Layout */}
        <div className="w-full">
          <div className="glass-panel p-6">
            <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2 mb-8">
              <Clock className="w-4 h-4" /> Timeline
            </h3>
            
            <div className="relative flex flex-col md:flex-row gap-6 md:gap-4 overflow-x-auto pb-6 pt-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
              {/* Horizontal Connecting Line (Desktop) */}
              <div className="hidden md:block absolute top-[23px] left-[5%] right-[5%] h-[2px] bg-secondary z-0"></div>
              {/* Vertical Connecting Line (Mobile) */}
              <div className="md:hidden absolute left-[15px] top-4 bottom-4 w-[2px] bg-secondary z-0"></div>
              
              {timeline.map((step, i) => {
                const Icon = step.Icon;
                return (
                  <div key={i} className={`relative flex md:flex-col items-start md:items-center gap-4 md:gap-4 flex-1 min-w-[160px] transition-all duration-500 ${step.completed ? 'opacity-100' : 'opacity-40 grayscale'}`}>
                    {/* Timeline Node */}
                    <div className={`relative z-10 w-8 h-8 shrink-0 rounded-full flex items-center justify-center border-[3px] transition-all duration-500 ${
                      step.isCurrent
                        ? 'bg-primary border-background text-primary-foreground shadow-[0_0_20px_rgba(var(--primary),0.6)] scale-125 animate-pulse'
                        : step.completed 
                          ? 'bg-primary border-background text-primary-foreground scale-110' 
                          : 'bg-secondary border-background text-muted-foreground'
                    }`}>
                      {step.completed && !step.isCurrent ? <CheckCircle2 className="w-4 h-4" /> : <Icon className="w-4 h-4" />}
                    </div>
                    
                    {/* Timeline Content Card */}
                    <div className={`mt-0 md:mt-2 text-left md:text-center w-full p-4 rounded-2xl border backdrop-blur-md transition-all duration-300 hover:-translate-y-1 ${
                      step.isCurrent 
                        ? 'bg-primary/10 border-primary/40 shadow-lg shadow-primary/5' 
                        : step.completed
                          ? 'bg-secondary/40 border-border/60 hover:bg-secondary/60 hover:shadow-md'
                          : 'bg-background/50 border-border/30'
                    }`}>
                      <p className={`text-sm font-bold tracking-wide leading-tight ${step.isCurrent ? 'text-primary' : step.completed ? 'text-foreground' : 'text-muted-foreground'}`}>
                        {step.status}
                      </p>
                      {step.date ? (
                        <p className="text-[11px] text-muted-foreground mt-1.5 font-medium uppercase tracking-wider">{step.date}</p>
                      ) : step.completed ? (
                        <p className="text-[11px] text-muted-foreground mt-1.5 font-medium uppercase tracking-wider">Completed</p>
                      ) : (
                        <p className="text-[11px] text-muted-foreground/50 mt-1.5 italic uppercase tracking-wider">Pending</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
