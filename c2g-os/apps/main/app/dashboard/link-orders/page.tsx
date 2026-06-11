"use client";

import { Link as LinkIcon, Plus, Plane, Ship, CreditCard, Edit, Map } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LinkOrdersPage() {
  const router = useRouter();

  const mockOrders = [
    {
      id: "ORD-992-11A",
      item: "Nike Air Max Pro",
      price: "¥ 450.00",
      qty: 2,
      status: "Supplier Shipped",
      paymentStatus: "Paid",
      date: "2026-06-10",
      shippingMode: "Air Express",
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
    }
  ];

  return (
    <div className="space-y-8 animate-fade-in max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Link Orders</h1>
          <p className="text-muted-foreground mt-1">Manage and track your "Buy For Me" orders.</p>
        </div>
        <Link 
          href="/dashboard/link-orders/new" 
          className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 gap-2 shadow-lg shadow-primary/25 hover:scale-[1.02]"
        >
          <Plus className="w-4 h-4" />
          Place Link Order
        </Link>
      </div>

      <div className="space-y-4">
        {mockOrders.map((order, idx) => (
          <div 
            key={idx} 
            className="glass-panel p-6 overflow-hidden flex flex-col relative transition-all duration-300 hover:border-primary/50 cursor-pointer group"
            onClick={() => router.push(`/dashboard/link-orders/${order.id}`)}
          >
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

            {/* Order Details Header */}
            <div className="flex items-center gap-3 mb-6">
              <span className="font-mono text-sm font-bold text-primary">{order.id}</span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-medium bg-secondary text-secondary-foreground border border-border">
                {order.date}
              </span>
            </div>
            
            {/* Order Content */}
            <div className="flex flex-col md:flex-row gap-6 mb-2">
              <div className="flex gap-4 md:w-[40%]">
                <div className="w-20 h-20 rounded-lg bg-secondary/50 flex items-center justify-center shrink-0 border border-border overflow-hidden">
                  <LinkIcon className="w-8 h-8 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
                <div className="flex flex-col justify-center">
                  <h3 className="font-bold text-base leading-tight mb-1 pr-16">{order.item}</h3>
                  <p className="text-xs text-muted-foreground mb-1">Qty: {order.qty}</p>
                  <p className="text-sm font-black text-primary">{order.price}</p>
                </div>
              </div>

              <div className="space-y-3 md:w-[30%] flex flex-col justify-center">
                <div className="flex items-center justify-between text-sm border-b border-border/50 pb-2">
                  <span className="text-muted-foreground">Shipping Mode</span>
                  <span className="font-semibold flex items-center gap-1.5">
                    {order.shippingMode === "Sea Freight" ? <Ship className="w-4 h-4 text-green-500" /> : <Plane className="w-4 h-4 text-blue-500" />}
                    {order.shippingMode}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Current Status</span>
                  <span className="font-bold text-accent">{order.status}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="md:w-[30%] flex items-center justify-end md:pl-6 border-t md:border-t-0 md:border-l border-border/50 pt-4 md:pt-0 mt-2 md:mt-0 gap-2">
                {order.paymentStatus === 'Unpaid' ? (
                  <>
                    <button 
                      onClick={(e) => { e.stopPropagation(); /* Handle Edit */ }}
                      className="p-2 rounded-md hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors border border-transparent hover:border-border"
                      title="Edit Order"
                    >
                      <Edit className="w-5 h-5" />
                    </button>
                    <button 
                      onClick={(e) => { e.stopPropagation(); /* Handle Pay */ }}
                      className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors bg-destructive text-destructive-foreground hover:bg-destructive/90 h-10 px-4 gap-2 flex-1 shadow-lg shadow-destructive/20"
                    >
                      <CreditCard className="w-4 h-4" /> Pay Now
                    </button>
                  </>
                ) : (
                  <button 
                    onClick={(e) => { e.stopPropagation(); router.push(`/dashboard/link-orders/${order.id}?track=true`); }}
                    className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 gap-2 flex-1"
                  >
                    <Map className="w-4 h-4" /> Track Shipment
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
