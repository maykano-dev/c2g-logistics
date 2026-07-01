"use client";

import { Link as LinkIcon, Plane, Ship, CreditCard, Edit, Map, Loader2, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { useModal } from "@/components/providers/modal-provider";
import { deleteLinkOrder } from "./actions";
import WalletPaymentModal from "@/components/wallet/wallet-payment-modal";

export function LinkOrderCard({ order, walletBalance = 0 }: { order: any, walletBalance?: number }) {
  const router = useRouter();
  const [isPaying, setIsPaying] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isPendingDelete, startDelete] = useTransition();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { showAlert, showConfirm } = useModal();

  // Helper to format currency
  const formatCurrency = (amount: number) => `₵${parseFloat((amount || 0).toString()).toFixed(2)}`;
  
  // Format dates
  const formattedDate = new Date(order.created_at).toLocaleDateString('en-GB', {
    year: 'numeric', month: 'short', day: 'numeric'
  });

  const isPaid = order.payment_status === 'paid' || order.payment_status === 'Paid';

  // Automatically advance status if payment went through but order_status is lagging
  let displayStatus = order.order_status;
  if ((!displayStatus || displayStatus === 'new' || displayStatus === 'pending_payment') && isPaid) {
    displayStatus = 'processing';
  }

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
        const result = await deleteLinkOrder(order.id);
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
      onClick={() => router.push(`/dashboard/orders/${order.id}`)}
    >
      <WalletPaymentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={async () => {
          setIsPaying(true);
          const res = await import('./actions').then(m => m.payLinkOrder(order.id));
          setIsPaying(false);
          if (res.success) {
            router.refresh();
          } else {
            throw new Error(res.error || 'Failed to process payment');
          }
        }}
        amount={parseFloat(order.total) || 0}
        walletBalance={walletBalance}
        itemName={order.product_name || "Link Order"}
        isProcessing={isPaying}
      />
      
      {/* Absolute Payment Status Badge */}
      <div className="absolute top-6 right-6 flex items-center gap-2">
          {!isPaid && (
            <button 
              onClick={handleDelete}
              disabled={isPendingDelete || isPaying || isEditing}
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
            </p>
          </div>
        </div>

        <div className="space-y-3 md:w-[30%] flex flex-col justify-center">
          <div className="flex items-center justify-between text-sm border-b border-border/50 pb-2">
            <span className="text-muted-foreground">Shipping Mode</span>
            <span className="font-semibold flex items-center gap-1.5 capitalize">
              {order.shipping_mode === "sea" ? <Ship className="w-4 h-4 text-green-500" /> : <Plane className="w-4 h-4 text-blue-500" />}
              {order.shipping_mode?.replace('_', ' ') || 'Air Express'}
            </span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Current Status</span>
            <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border capitalize tracking-wider ${getStatusBadgeClass(displayStatus)}`}>
              {displayStatus?.replace(/_/g, ' ') || 'Pending'}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="md:w-[30%] flex items-center justify-end md:pl-6 border-t md:border-t-0 md:border-l border-border/50 pt-4 md:pt-0 mt-2 md:mt-0 gap-2">
          {!isPaid ? (
            <>
              <button 
                onClick={(e) => { 
                  e.stopPropagation(); 
                  setIsEditing(true);
                  router.push(`/dashboard/orders/edit/${order.id}`); 
                }}
                disabled={isEditing || isPaying || isPendingDelete}
                className="p-2 rounded-md hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors border border-transparent hover:border-border disabled:opacity-50"
                title="Edit Order"
              >
                {isEditing ? <Loader2 className="w-5 h-5 animate-spin text-primary" /> : <Edit className="w-5 h-5" />}
              </button>
              <button 
                onClick={(e) => { 
                  e.stopPropagation(); 
                  if (isPaying) return;
                  setIsModalOpen(true);
                }}
                disabled={isPaying || !order.total || parseFloat(order.total) <= 0}
                className={`inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors h-10 px-4 gap-2 flex-1 shadow-lg disabled:opacity-50 disabled:pointer-events-none ${
                  (!order.total || parseFloat(order.total) <= 0) 
                    ? 'bg-muted text-muted-foreground shadow-none cursor-not-allowed' 
                    : 'bg-primary text-primary-foreground hover:bg-primary/90 shadow-primary/20'
                }`}
                title={(!order.total || parseFloat(order.total) <= 0) ? "Wait for an admin to set the price" : "Pay Now"}
              >
                <CreditCard className="w-4 h-4" /> Pay {formatCurrency(order.total || 0)}
              </button>
            </>
          ) : (
            <button 
              onClick={(e) => { e.stopPropagation(); router.push(`/dashboard/reservations`); }}
              className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 gap-2 flex-1"
            >
              <Map className="w-4 h-4" /> Track Reservation
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
