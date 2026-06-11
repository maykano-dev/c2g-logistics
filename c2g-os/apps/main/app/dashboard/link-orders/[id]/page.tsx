"use client";

import { use, useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Link as LinkIcon, ArrowLeft, CheckCircle2, Clock, Map, Plane, Ship, ExternalLink, CreditCard } from "lucide-react";
import { ShipmentTracker } from "../../../../components/shipment-tracker";

// Mock data fetcher
function getOrderDetails(id: string) {
  const allOrders = [
    {
      id: "ORD-992-11A",
      item: "Nike Air Max Pro",
      price: "¥ 450.00",
      qty: 2,
      status: "Supplier Shipped",
      paymentStatus: "Paid",
      date: "2026-06-10",
      shippingMode: "Air Express",
      image: "https://via.placeholder.com/150",
      timeline: [
        { status: "Pending Payment", date: "2026-06-08 10:00", completed: true },
        { status: "Awaiting Purchase", date: "2026-06-08 14:30", completed: true },
        { status: "Purchased", date: "2026-06-09 09:15", completed: true },
        { status: "Supplier Shipped", date: "2026-06-10 11:20", completed: true },
        { status: "Received In Warehouse", date: null, completed: false },
        { status: "Shipped To Ghana", date: null, completed: false },
        { status: "Arrived Ghana", date: null, completed: false },
        { status: "Ready For Pickup", date: null, completed: false },
        { status: "Completed", date: null, completed: false },
      ]
    },
    {
      id: "ORD-881-22B",
      item: "Mechanical Keyboard Royal Kludge",
      price: "¥ 299.00",
      qty: 1,
      status: "Received In Warehouse",
      paymentStatus: "Paid",
      date: "2026-06-05",
      shippingMode: "Sea Freight",
      image: "https://via.placeholder.com/150",
      timeline: [
        { status: "Pending Payment", date: "2026-06-05 08:00", completed: true },
        { status: "Awaiting Purchase", date: "2026-06-05 10:30", completed: true },
        { status: "Purchased", date: "2026-06-06 14:15", completed: true },
        { status: "Supplier Shipped", date: "2026-06-07 09:20", completed: true },
        { status: "Received In Warehouse", date: "2026-06-10 16:45", completed: true },
        { status: "Shipped To Ghana", date: null, completed: false },
        { status: "Arrived Ghana", date: null, completed: false },
        { status: "Ready For Pickup", date: null, completed: false },
        { status: "Completed", date: null, completed: false },
      ]
    },
    {
      id: "ORD-775-33C",
      item: "Smart LED Lights (10m)",
      price: "¥ 120.00",
      qty: 5,
      status: "Pending Payment",
      paymentStatus: "Unpaid",
      date: "2026-06-11",
      shippingMode: "Air Normal",
      image: "https://via.placeholder.com/150",
      timeline: [
        { status: "Pending Payment", date: null, completed: false },
        { status: "Awaiting Purchase", date: null, completed: false },
        { status: "Purchased", date: null, completed: false },
        { status: "Supplier Shipped", date: null, completed: false },
        { status: "Received In Warehouse", date: null, completed: false },
        { status: "Shipped To Ghana", date: null, completed: false },
        { status: "Arrived Ghana", date: null, completed: false },
        { status: "Ready For Pickup", date: null, completed: false },
        { status: "Completed", date: null, completed: false },
      ]
    }
  ];
  return allOrders.find(o => o.id === id) || allOrders[0];
}

export default function OrderDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const resolvedParams = use(params);
  
  const [showTracker, setShowTracker] = useState(false);
  
  const order = getOrderDetails(resolvedParams.id);

  // Automatically open tracker if ?track=true
  useEffect(() => {
    if (searchParams.get("track") === "true") {
      setShowTracker(true);
    }
  }, [searchParams]);

  if (!order) return null;

  return (
    <div className="space-y-8 animate-fade-in max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button 
          onClick={() => router.push("/dashboard/link-orders")}
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
               <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${
                  order.paymentStatus === 'Paid' 
                    ? 'bg-green-500/10 text-green-500 border-green-500/20' 
                    : 'bg-destructive/10 text-destructive border-destructive/20 animate-pulse'
                }`}>
                  {order.paymentStatus}
                </span>
            </div>

            <div className="flex flex-col sm:flex-row gap-6">
              <div className="w-24 h-24 rounded-xl bg-secondary flex items-center justify-center shrink-0 border border-border">
                <LinkIcon className="w-8 h-8 text-muted-foreground" />
              </div>
              <div className="pt-2">
                <h2 className="text-xl font-bold pr-20">{order.item}</h2>
                <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                  <span>Qty: {order.qty}</span>
                  <span className="w-1 h-1 rounded-full bg-border" />
                  <span className="font-semibold text-primary">{order.price}</span>
                </div>
                <div className="flex items-center gap-2 mt-4 text-sm font-medium">
                  {order.shippingMode === "Sea Freight" ? <Ship className="w-4 h-4 text-green-500" /> : <Plane className="w-4 h-4 text-blue-500" />}
                  {order.shippingMode}
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="mt-8 pt-6 border-t border-border flex flex-col sm:flex-row gap-3">
              {order.paymentStatus === 'Unpaid' ? (
                <button className="w-full inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors bg-destructive text-destructive-foreground hover:bg-destructive/90 h-11 px-4 gap-2 shadow-lg shadow-destructive/20">
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
              <button className="w-full inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors border border-input bg-background hover:bg-accent hover:text-accent-foreground h-11 px-4 gap-2">
                <ExternalLink className="w-4 h-4" /> Source Link
              </button>
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
              
              {order.timeline.map((step, i) => (
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
          shippingModeStr={order.shippingMode}
          shipmentStartDate={order.date}
          onClose={() => setShowTracker(false)}
        />
      )}
    </div>
  );
}
