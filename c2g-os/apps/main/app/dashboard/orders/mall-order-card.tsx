"use client";

import { ShoppingCart, Plane, Ship, Map, Eye } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export function MallOrderCard({ order }: { order: any }) {
  const router = useRouter();

  const formatCurrency = (amount: number) => `₵${parseFloat((amount || 0).toString()).toFixed(2)}`;
  
  const formattedDate = new Date(order.created_at).toLocaleDateString('en-GB', {
    year: 'numeric', month: 'short', day: 'numeric'
  });

  const isPaid = order.payment_status === 'paid' || order.payment_status === 'Paid';
  const isShippingPaid = order.shipping_fee_paid;

  // Assuming items is an array of products
  const items = Array.isArray(order.items) ? order.items : [];
  const primaryItem = items[0] || {};
  const totalQuantity = items.reduce((sum: number, i: any) => sum + (i.quantity || 1), 0);
  const imageUrl = primaryItem.imageUrl || "https://placehold.co/100x100";

  return (
    <div 
      className="glass-panel p-6 overflow-hidden flex flex-col relative transition-all duration-300 hover:border-primary/50 cursor-pointer group"
      onClick={() => router.push(`/dashboard/orders/mall/${order.id}`)}
    >
      {/* Absolute Status Badge */}
      <div className="absolute top-6 right-6 flex flex-col gap-2 items-end">
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
        <span className="font-mono text-sm font-bold text-purple-500 truncate max-w-[200px] flex items-center gap-2">
          <ShoppingCart className="w-4 h-4" /> C2G-{String(order.id).split('-').pop()?.substring(0, 8)}
        </span>
        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-medium bg-secondary text-secondary-foreground border border-border">
          {formattedDate}
        </span>
      </div>
      
      {/* Order Content */}
      <div className="flex flex-col md:flex-row gap-6 mb-2">
        <div className="flex gap-4 md:w-[40%]">
          <div className="w-20 h-20 rounded-lg bg-secondary/50 flex items-center justify-center shrink-0 border border-border overflow-hidden relative">
            <Image src={imageUrl} alt="Product" fill className="object-cover" />
          </div>
          <div className="flex flex-col justify-center overflow-hidden">
            <h3 className="font-bold text-base leading-tight mb-1 pr-16 truncate" title={primaryItem.name || 'Mall Order'}>
              {primaryItem.name || 'Mall Order'}
              {items.length > 1 && ` (+${items.length - 1} more)`}
            </h3>
            <p className="text-xs text-muted-foreground mb-1">Items: {totalQuantity}</p>
            <p className="text-sm font-black text-primary">
              {formatCurrency(order.total_amount || 0)}
            </p>
          </div>
        </div>

        <div className="space-y-3 md:w-[30%] flex flex-col justify-center">
          <div className="flex items-center justify-between text-sm border-b border-border/50 pb-2">
            <span className="text-muted-foreground">Shipping Mode</span>
            <span className="font-semibold flex items-center gap-1.5 capitalize">
              {order.shipping_method === "sea" ? <Ship className="w-4 h-4 text-green-500" /> : <Plane className="w-4 h-4 text-blue-500" />}
              {order.shipping_method || 'Air Express'}
            </span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Current Status</span>
            <span className="font-bold text-accent capitalize">{order.order_status?.replace(/_/g, ' ') || 'Processing'}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="md:w-[30%] flex items-center justify-end md:pl-6 border-t md:border-t-0 md:border-l border-border/50 pt-4 md:pt-0 mt-2 md:mt-0 gap-2">
          <button 
            onClick={(e) => { e.stopPropagation(); router.push(`/dashboard/orders/mall/${order.id}`); }}
            className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 gap-2 flex-1"
          >
            <Eye className="w-4 h-4" /> View Details
          </button>
        </div>
      </div>
    </div>
  );
}
