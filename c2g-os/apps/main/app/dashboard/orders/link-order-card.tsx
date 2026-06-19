"use client";

import { Link as LinkIcon, Plane, Ship, CreditCard, Edit, Map } from "lucide-react";
import { useRouter } from "next/navigation";

export function LinkOrderCard({ order }: { order: any }) {
  const router = useRouter();

  // Helper to format currency
  const formatCurrency = (amount: number) => `₵${parseFloat((amount || 0).toString()).toFixed(2)}`;
  
  // Format dates
  const formattedDate = new Date(order.created_at).toLocaleDateString('en-GB', {
    year: 'numeric', month: 'short', day: 'numeric'
  });

  const isPaid = order.payment_status === 'paid' || order.payment_status === 'Paid';

  return (
    <div 
      className="glass-panel p-6 overflow-hidden flex flex-col relative transition-all duration-300 hover:border-primary/50 cursor-pointer group"
      onClick={() => router.push(`/dashboard/orders/${order.id}`)}
    >
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

      {/* Order Details Header */}
      <div className="flex items-center gap-3 mb-6">
        <span className="font-mono text-sm font-bold text-primary truncate max-w-[200px]">
          {String(order.id).split('-').pop()?.substring(0, 8) || order.id}
        </span>
        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-medium bg-secondary text-secondary-foreground border border-border">
          {formattedDate}
        </span>
      </div>
      
      {/* Order Content */}
      <div className="flex flex-col md:flex-row gap-6 mb-2">
        <div className="flex gap-4 md:w-[40%]">
          <div className="w-20 h-20 rounded-lg bg-secondary/50 flex items-center justify-center shrink-0 border border-border overflow-hidden">
            <LinkIcon className="w-8 h-8 text-muted-foreground group-hover:text-primary transition-colors" />
          </div>
          <div className="flex flex-col justify-center overflow-hidden">
            <h3 className="font-bold text-base leading-tight mb-1 pr-16 truncate" title={order.product_name}>
              {order.product_name || 'Link Order Items'}
            </h3>
            <p className="text-xs text-muted-foreground mb-1">Qty: {order.quantity || 1}</p>
            <p className="text-sm font-black text-primary">
              {formatCurrency(order.total || 0)}
              {order.cny_price && <span className="text-xs font-normal text-muted-foreground ml-2">≈ ¥{order.cny_price}</span>}
            </p>
          </div>
        </div>

        <div className="space-y-3 md:w-[30%] flex flex-col justify-center">
          <div className="flex items-center justify-between text-sm border-b border-border/50 pb-2">
            <span className="text-muted-foreground">Shipping Mode</span>
            <span className="font-semibold flex items-center gap-1.5 capitalize">
              {order.shipping_mode === "sea" ? <Ship className="w-4 h-4 text-green-500" /> : <Plane className="w-4 h-4 text-blue-500" />}
              {order.shipping_mode || 'Air Express'}
            </span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Current Status</span>
            <span className="font-bold text-accent capitalize">{order.order_status?.replace(/_/g, ' ') || 'Pending'}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="md:w-[30%] flex items-center justify-end md:pl-6 border-t md:border-t-0 md:border-l border-border/50 pt-4 md:pt-0 mt-2 md:mt-0 gap-2">
          {!isPaid ? (
            <>
              <button 
                onClick={(e) => { e.stopPropagation(); router.push(`/dashboard/orders/edit/${order.id}`); }}
                className="p-2 rounded-md hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors border border-transparent hover:border-border"
                title="Edit Order"
              >
                <Edit className="w-5 h-5" />
              </button>
              <button 
                onClick={(e) => { e.stopPropagation(); /* Handle Pay via Hubtel */ }}
                className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors bg-destructive text-destructive-foreground hover:bg-destructive/90 h-10 px-4 gap-2 flex-1 shadow-lg shadow-destructive/20"
              >
                <CreditCard className="w-4 h-4" /> Pay Now
              </button>
            </>
          ) : (
            <button 
              onClick={(e) => { e.stopPropagation(); router.push(`/dashboard/orders/${order.id}?track=true`); }}
              className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 gap-2 flex-1"
            >
              <Map className="w-4 h-4" /> Track Shipment
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
