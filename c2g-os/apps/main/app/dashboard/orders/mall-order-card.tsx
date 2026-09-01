"use client";

import { ShoppingCart, Plane, Ship, Map, Eye, Trash2, Loader2, CreditCard } from "lucide-react";
import { useRouter } from "next/navigation";

import { useState, useTransition } from "react";
import { useModal } from "@/components/providers/modal-provider";
import { deleteMallOrder } from "../mall-orders/actions";

export function MallOrderCard({ order }: { order: any }) {
  const router = useRouter();
  const [isPaying, setIsPaying] = useState(false);
  const [isTrackLoading, setIsTrackLoading] = useState(false);
  const [isPendingDelete, startDelete] = useTransition();
  const { showConfirm, showAlert } = useModal();

  const formatCurrency = (amount: number) => `₵${parseFloat((amount || 0).toString()).toFixed(2)}`;
  
  const formattedDate = order.created_at && !isNaN(new Date(order.created_at).getTime())
    ? new Date(order.created_at).toLocaleDateString('en-GB', {
        year: 'numeric', month: 'short', day: 'numeric'
      })
    : 'Pending';

  const isPaid = order.payment_status === 'paid' || order.payment_status === 'Paid';
  
  // Automatically advance status if payment went through but order_status is lagging
  let displayStatus = order.order_status;
  if ((!displayStatus || displayStatus === 'new' || displayStatus === 'pending_payment') && isPaid) {
    displayStatus = 'processing';
  }

  const hasArrivedInWarehouse = ['in_warehouse', 'in_transit', 'clearance', 'available_for_pickup', 'delivered'].includes(displayStatus?.toLowerCase());

  const getStatusBadgeClass = (status: string) => {
    switch(status?.toLowerCase()) {
      case 'delivered':
      case 'available_for_pickup':
        return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
      case 'in_warehouse':
      case 'processing':
      case 'shipped':
      case 'in_transit':
      case 'clearance':
        return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      case 'purchased':
        return 'bg-indigo-500/10 text-indigo-500 border-indigo-500/20';
      case 'new':
      case 'pending':
      case 'pending_payment':
        return 'bg-orange-500/10 text-orange-500 border-orange-500/20';
      case 'cancelled':
        return 'bg-red-500/10 text-red-500 border-red-500/20';
      default:
        return 'bg-zinc-500/10 text-zinc-500 border-zinc-500/20';
    }
  };

  // Assuming items is an array of products
  const items = Array.isArray(order.items) ? order.items : [];
  const primaryItem = items[0] || {};
  const totalQuantity = items.reduce((sum: number, i: any) => sum + (i.quantity || 1), 0);
  const imageUrl = primaryItem.image_url || primaryItem.imageUrl || "https://placehold.co/100x100";

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const confirmed = await showConfirm({
      title: 'Delete Order',
      message: 'Are you sure you want to delete this order? This action cannot be undone.',
      confirmText: 'Delete',
      type: 'danger',
    });
    
    if (confirmed) {
      startDelete(async () => {
        const result = await deleteMallOrder(order.id);
        if (result.error) {
          showAlert({ title: 'Error', message: result.error, type: 'danger' });
        } else {
          router.refresh();
        }
      });
    }
  };

  return (
    <div 
      className="glass-panel p-6 overflow-hidden flex flex-col relative transition-all duration-300 hover:border-primary/50 cursor-pointer group"
      onClick={() => router.push(`/dashboard/orders/mall/${order.id}`)}
    >
      {/* Absolute Payment Status Badge */}
      <div className="absolute top-6 right-6 flex items-center gap-2">
          {!isPaid && (
            <button 
              onClick={handleDelete}
              disabled={isPendingDelete || isPaying}
              className="p-1 rounded-md text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors disabled:opacity-50 border border-transparent"
              title="Delete Order"
            >
              {isPendingDelete ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
            </button>
          )}
          <span className={`px-2.5 py-1 rounded-full text-xs font-bold border capitalize ${
            isPaid 
              ? 'bg-green-500/10 text-green-500 border-green-500/20' 
              : 'bg-red-500/20 text-red-500 border-red-500/30 animate-pulse shadow-[0_0_10px_rgba(239,68,68,0.2)]'
          }`}>
            {order.payment_status?.replace('_', ' ') || 'Unpaid'}
          </span>
      </div>

      {/* Order Details Header */}
      <div className="flex items-center gap-3 mb-6">
        <span className="font-mono text-sm font-bold text-primary truncate max-w-[200px] flex items-center gap-2">
          <ShoppingCart className="w-4 h-4 text-muted-foreground" /> {order.order_id || `C2G-${String(order.id).split('-').pop()?.substring(0, 8)}`}
        </span>
        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-medium bg-secondary text-secondary-foreground border border-border">
          {formattedDate}
        </span>
      </div>
      
      {/* Order Content */}
      <div className="flex flex-col md:flex-row gap-6 mb-2">
        <div className="flex gap-4 md:w-[40%] items-center">
          {items.length > 1 ? (
            <div className="flex items-center">
              {items.slice(0, 3).map((item: any, idx: number) => {
                const imgUrl = item.image_url || item.imageUrl || "https://placehold.co/100x100/1a1a2e/6c757d?text=No+Image";
                return (
                  <div 
                    key={idx} 
                    className={`w-16 h-16 rounded-full bg-secondary flex items-center justify-center shrink-0 border-2 border-background overflow-hidden relative shadow-md ${idx > 0 ? '-ml-6' : ''} z-[${10 - idx}]`}
                    style={{ zIndex: 10 - idx }}
                  >
                    <img src={imgUrl} alt="Product" className="w-full h-full object-cover" />
                  </div>
                );
              })}
              {items.length > 3 && (
                <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center shrink-0 border-2 border-background -ml-5 z-0 shadow-sm">
                  <span className="text-xs font-bold text-foreground">+{items.length - 3}</span>
                </div>
              )}
            </div>
          ) : (
            <div className="w-20 h-20 rounded-full bg-secondary/50 flex items-center justify-center shrink-0 border-2 border-background overflow-hidden relative shadow-md">
              <img src={imageUrl} alt="Product" className="w-full h-full object-cover" />
            </div>
          )}
          
          <div className="flex flex-col justify-center overflow-hidden">
            <h3 className="font-bold text-base leading-tight mb-1 pr-16 truncate" title={primaryItem.name || 'Mall Order'}>
              {primaryItem.name || 'Mall Order'}
            </h3>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-primary/10 text-primary border border-primary/20">
                {totalQuantity} {totalQuantity === 1 ? 'Item' : 'Items'}
              </span>
            </div>
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
            <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border capitalize tracking-wider ${getStatusBadgeClass(displayStatus)}`}>
              {displayStatus?.replace(/_/g, ' ') || 'Pending Payment'}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="md:w-[30%] flex items-center justify-end md:pl-6 border-t md:border-t-0 md:border-l border-border/50 pt-4 md:pt-0 mt-2 md:mt-0 gap-2">
          {!isPaid ? (
            <>
              <button 
                onClick={(e) => { e.stopPropagation(); router.push(`/dashboard/orders/mall/${order.id}`); }}
                disabled={isPaying || isPendingDelete}
                className="p-2 rounded-md hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors border border-transparent hover:border-border disabled:opacity-50"
                title="View Details"
              >
                <Eye className="w-5 h-5" />
              </button>
              <button 
                onClick={async (e) => { 
                  e.stopPropagation(); 
                  if (isPaying) return;
                  setIsPaying(true);
                  try {
                    const res = await fetch('/api/hubtel/initialize', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ orderId: order.id, type: 'mall_order' })
                    });
                    const data = await res.json();
                    if (data.checkoutUrl) {
                      window.location.href = data.checkoutUrl;
                    } else {
                      showAlert({ title: 'Payment Error', message: data.error || 'Failed to initialize payment.', type: 'danger' });
                      setIsPaying(false);
                    }
                  } catch (err) {
                    showAlert({ title: 'Network Error', message: 'Network error. Please try again.', type: 'danger' });
                    setIsPaying(false);
                  }
                }}
                disabled={isPaying || !order.total_amount || parseFloat(order.total_amount) <= 0}
                className={`inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors h-10 px-4 gap-2 flex-1 shadow-lg disabled:opacity-50 disabled:pointer-events-none ${
                  (!order.total_amount || parseFloat(order.total_amount) <= 0) 
                    ? 'bg-muted text-muted-foreground shadow-none cursor-not-allowed' 
                    : 'bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-destructive/20'
                }`}
                title={(!order.total_amount || parseFloat(order.total_amount) <= 0) ? "Invalid Amount" : "Pay Now"}
              >
                <CreditCard className="w-4 h-4" /> {isPaying ? 'Redirecting...' : 'Pay Now'}
              </button>
            </>
          ) : hasArrivedInWarehouse ? (
            <button 
              onClick={(e) => { 
                e.stopPropagation(); 
                setIsTrackLoading(true);
                router.push(`/dashboard/reservations`); 
              }}
              disabled={isTrackLoading}
              className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 gap-2 flex-1 disabled:opacity-50"
            >
              {isTrackLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Map className="w-4 h-4" />} Track Reservation
            </button>
          ) : (
            <button 
              onClick={(e) => { 
                e.stopPropagation(); 
                router.push(`/dashboard/orders/mall/${order.id}`); 
              }}
              className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 gap-2 flex-1 shadow-sm"
            >
              <Eye className="w-4 h-4" /> View Details
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
