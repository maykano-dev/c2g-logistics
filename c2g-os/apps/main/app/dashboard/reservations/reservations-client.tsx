'use client';

import { useState } from 'react';
import { Package, PlaneTakeoff, Ship, CheckCircle2, Wallet, RefreshCcw, Box, Link as LinkIcon, ShoppingBag, Clock, ShieldCheck, AlertTriangle } from 'lucide-react';
import { createReservation, payReservationDeposit } from './actions';
import { useRouter } from 'next/navigation';
import { useModal } from '@/components/providers/modal-provider';

type Item = { id: string, type: 'warehouse_package' | 'link_order' | 'mall_order', label: string, desc?: string, imageUrl?: string };

export default function ReservationsClient({ 
  availableItems, 
  depositRates, 
  reservations,
  walletBalance 
}: { 
  availableItems: any, 
  depositRates: any, 
  reservations: any[],
  walletBalance: number 
}) {
  const router = useRouter();
  const { showAlert, showConfirm } = useModal();
  const [activeTab, setActiveTab] = useState<'new' | 'history'>('new');
  
  // Selection State
  const [selectedItems, setSelectedItems] = useState<Item[]>([]);
  const [shippingMode, setShippingMode] = useState<'air_normal' | 'air_express' | 'sea'>('air_normal');
  const [isProcessing, setIsProcessing] = useState(false);

  // Flatten available items into a single selectable list
  const allAvailable: Item[] = [
    ...(availableItems.packages || []).map((p: any) => ({ id: p.id, type: 'warehouse_package' as const, label: p.tracking_number, desc: p.items_description || 'Warehouse Package', imageUrl: p.image_url })),
    ...(availableItems.linkOrders || []).map((o: any) => ({ id: o.id, type: 'link_order' as const, label: `LNK-${o.id.substring(0, 8).toUpperCase()}`, desc: o.product_name || 'Link Order', imageUrl: o.screenshot_url })),
    ...(availableItems.mallOrders || []).map((m: any) => ({ id: m.item_id, type: 'mall_order' as const, label: m.order_id || `ECOM-${m.id.substring(0, 8).toUpperCase()}`, desc: m.product_name || 'Mall Order Item', imageUrl: m.image_url, parentId: m.id }))
  ];

  const handleSelectAll = () => {
    if (selectedItems.length === allAvailable.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(allAvailable);
    }
  };

  const toggleSelection = (item: Item) => {
    if (selectedItems.find(i => i.id === item.id)) {
      setSelectedItems(selectedItems.filter(i => i.id !== item.id));
    } else {
      setSelectedItems([...selectedItems, item]);
    }
  };

  const totalAdvance = selectedItems.length > 0 ? (depositRates?.reservation_fee_ghs || 200) : 0;
  const canAfford = walletBalance >= totalAdvance;

  const shippingModeLabel = (mode: string) => {
    switch (mode) {
      case 'air_normal': return 'Air Normal';
      case 'air_express': return 'Air Express';
      case 'sea': return 'Sea Freight';
      default: return mode.replace(/_/g, ' ');
    }
  };

  const handleReserveAndPay = async () => {
    if (selectedItems.length === 0) return showAlert({ title: "Selection Required", message: "Select at least one item to reserve space for.", type: "danger" });
    if (!canAfford) return showAlert({ title: "Insufficient Funds", message: "Insufficient wallet balance for this deposit. Please top up your wallet first.", type: "danger" });
    
    // Show payment confirmation
    const confirmed = await showConfirm({
      title: "Confirm Shipping Advance",
      message: `You are about to pay ₵${totalAdvance.toFixed(2)} from your wallet to reserve shipment space for ${selectedItems.length} item${selectedItems.length > 1 ? 's' : ''} via ${shippingModeLabel(shippingMode)}.\n\nThis amount will be deducted from your final shipping invoice.\n\nWallet Balance: ₵${walletBalance.toFixed(2)}\nAfter Payment: ₵${(walletBalance - totalAdvance).toFixed(2)}`,
      type: "warning",
      confirmText: `Pay ₵${totalAdvance.toFixed(2)}`,
      cancelText: "Cancel",
    });

    if (!confirmed) return;

    setIsProcessing(true);
    try {
      const itemsToSubmit = selectedItems.map(i => {
        if (i.type === 'mall_order') {
          return { type: i.type, id: (i as any).parentId };
        }
        return { type: i.type, id: i.id };
      });
      // 1. Create the reservation
      const resResult = await createReservation(shippingMode, itemsToSubmit, totalAdvance);
      
      // 2. Process the atomic payment immediately
      await payReservationDeposit(resResult.reservationId);
      
      showAlert({ title: "Success!", message: "Shipment space reserved and advance paid successfully. Your items are now queued for the next shipment.", type: "success" });
      setSelectedItems([]);
      setActiveTab('history');
      router.refresh();
    } catch (err: any) {
      showAlert({ title: "Reservation Error", message: err.message || "An error occurred while reserving shipment.", type: "danger" });
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePayExisting = async (reservationId: string, depositAmount: number) => {
    // Show payment confirmation
    const confirmed = await showConfirm({
      title: "Confirm Payment",
      message: `You are about to pay ₵${depositAmount.toFixed(2)} from your wallet for reservation ${reservationId}.\n\nWallet Balance: ₵${walletBalance.toFixed(2)}\nAfter Payment: ₵${(walletBalance - depositAmount).toFixed(2)}`,
      type: "warning",
      confirmText: `Pay ₵${depositAmount.toFixed(2)}`,
      cancelText: "Cancel",
    });

    if (!confirmed) return;

    setIsProcessing(true);
    try {
      await payReservationDeposit(reservationId);
      showAlert({ title: "Payment Success", message: "Shipping advance paid successfully!", type: "success" });
      router.refresh();
    } catch (err: any) {
      showAlert({ title: "Payment Failed", message: err.message || "Payment failed", type: "danger" });
    } finally {
      setIsProcessing(false);
    }
  };

  const getStatusBadge = (status: string, depositPaid: boolean) => {
    const label = status.replace(/_/g, ' ');
    if (depositPaid) {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] sm:text-[11px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 whitespace-nowrap">
          <CheckCircle2 className="w-3 h-3 shrink-0" />
          <span className="hidden xs:inline">Reserved</span>
          <span className="xs:hidden">Paid</span>
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] sm:text-[11px] font-bold uppercase tracking-wider bg-amber-500/10 text-amber-500 border border-amber-500/20 whitespace-nowrap">
        <Clock className="w-3 h-3 shrink-0" />
        <span>Awaiting Payment</span>
      </span>
    );
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Tabs */}
      <div className="flex bg-accent/20 p-1 rounded-xl w-full sm:w-max border border-border/50">
        <button 
          onClick={() => setActiveTab('new')}
          className={`flex-1 sm:flex-none px-4 sm:px-6 py-2.5 rounded-lg text-sm font-medium transition-all ${activeTab === 'new' ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground hover:bg-white/5'}`}
        >
          Reserve Space
        </button>
        <button 
          onClick={() => setActiveTab('history')}
          className={`flex-1 sm:flex-none px-4 sm:px-6 py-2.5 rounded-lg text-sm font-medium transition-all ${activeTab === 'history' ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground hover:bg-white/5'}`}
        >
          My Reservations
        </button>
      </div>

      {activeTab === 'new' ? (
        <div className="space-y-4 sm:space-y-6">
          {/* Items Selection */}
          <div className="glass p-4 sm:p-6 rounded-2xl border border-border/50">
            <h2 className="text-base sm:text-lg font-bold mb-3 sm:mb-4 flex items-center gap-2">
              <Box className="w-5 h-5 text-primary" />
              Select Items to Ship
            </h2>
            {allAvailable.length === 0 ? (
              <div className="text-center py-10 sm:py-12 text-muted-foreground bg-accent/5 rounded-xl border border-dashed border-border/50">
                <Package className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-3 opacity-20" />
                <p className="text-sm sm:text-base">You have no items currently sitting in the warehouse.</p>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between mb-3 sm:mb-4 bg-secondary/20 p-2.5 sm:p-3 rounded-lg border border-border/50">
                  <label className="flex items-center gap-2 cursor-pointer select-none font-semibold text-xs sm:text-sm">
                    <input 
                      type="checkbox" 
                      checked={selectedItems.length === allAvailable.length && allAvailable.length > 0}
                      onChange={handleSelectAll}
                      className="w-4 h-4 rounded border-border text-primary focus:ring-primary/20 bg-background/50"
                    />
                    Select All
                  </label>
                  <span className="text-xs text-muted-foreground font-medium">{selectedItems.length}/{allAvailable.length}</span>
                </div>
                <div className="grid gap-2.5 sm:grid-cols-2 sm:gap-3">
                  {allAvailable.map((item) => {
                    const isSelected = !!selectedItems.find(i => i.id === item.id);
                    return (
                    <button
                      key={item.id}
                      onClick={() => toggleSelection(item)}
                      className={`flex items-center text-left gap-2.5 sm:gap-3 p-3 sm:p-4 rounded-xl border transition-all ${
                        isSelected 
                          ? 'border-primary bg-primary/5 ring-1 ring-primary/20' 
                          : 'border-border/50 hover:border-primary/30 hover:bg-accent/5'
                      }`}
                    >
                      <div className={`shrink-0 w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${isSelected ? 'border-primary bg-primary' : 'border-border'}`}>
                        {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
                      </div>
                      {item.imageUrl ? (
                        <img src={item.imageUrl} alt="" className="w-10 h-10 sm:w-12 sm:h-12 rounded bg-black/20 object-cover shrink-0" />
                      ) : (
                        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded bg-secondary/30 flex items-center justify-center shrink-0">
                          <Package className="w-5 h-5 sm:w-6 sm:h-6 opacity-30" />
                        </div>
                      )}
                      <div className="min-w-0 flex-1">
                        <p className="font-semibold text-xs sm:text-sm truncate text-foreground">{item.label}</p>
                        <p className="text-[11px] sm:text-xs text-muted-foreground mt-0.5 flex items-center gap-1.5 truncate">
                          {item.type === 'warehouse_package' && <Package className="w-3 h-3 shrink-0" />}
                          {item.type === 'link_order' && <LinkIcon className="w-3 h-3 shrink-0" />}
                          {item.type === 'mall_order' && <ShoppingBag className="w-3 h-3 shrink-0" />}
                          <span className="truncate">{item.desc}</span>
                        </p>
                      </div>
                    </button>
                  )
                })}
                </div>
              </>
            )}
          </div>

          {/* Shipping Mode */}
          <div className="glass p-4 sm:p-6 rounded-2xl border border-border/50">
            <h2 className="text-base sm:text-lg font-bold mb-3 sm:mb-4 flex items-center gap-2">
              <PlaneTakeoff className="w-5 h-5 text-primary" />
              Shipping Method
            </h2>
            <select 
              value={shippingMode}
              onChange={(e) => setShippingMode(e.target.value as any)}
              className="w-full bg-background border border-input rounded-xl h-11 sm:h-12 px-3 sm:px-4 text-sm focus:ring-2 focus:ring-primary outline-none font-medium"
            >
              <option value="air_normal">Air Normal (12-16 Days) - ${depositRates?.air_normal_deposit_usd || 25}/kg</option>
              <option value="air_express">Air Express (3-7 Days) - ${depositRates?.air_express_deposit_usd || 44}/kg</option>
              <option value="sea">Sea Freight (50-60 Days) - ${depositRates?.sea_deposit_usd || 260}/cbm</option>
            </select>
          </div>

          {/* Information Card */}
          <div className="glass p-4 sm:p-6 rounded-2xl border border-border/50 bg-blue-500/5">
            <h2 className="text-xs sm:text-sm font-bold text-blue-600 dark:text-blue-400 mb-1.5 sm:mb-2 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 shrink-0" /> About Shipping Advance
            </h2>
            <p className="text-xs sm:text-sm text-blue-700/80 dark:text-blue-300/80 leading-relaxed">
              To ship your items to Ghana, a Shipping Advance is required. This payment forms part of your final shipping fee and is not an extra charge.
            </p>
          </div>

          {/* Checkout Summary — always visible, sticky on mobile */}
          <div className="glass p-4 sm:p-6 rounded-2xl border border-primary/20 bg-gradient-to-b from-background to-primary/5 sm:sticky sm:top-[100px]">
            <h3 className="font-bold text-base sm:text-lg mb-4 sm:mb-6 flex items-center gap-2">
              <Wallet className="w-5 h-5 text-primary" />
              Reservation Summary
            </h3>
            
            <div className="space-y-3 text-sm mb-4 sm:mb-6">
              <div className="flex justify-between items-center text-muted-foreground">
                <span>Selected Items</span>
                <span className="font-bold text-foreground">{selectedItems.length}</span>
              </div>
              <div className="flex justify-between items-center text-muted-foreground">
                <span>Shipping Method</span>
                <span className="font-bold text-foreground">{shippingModeLabel(shippingMode)}</span>
              </div>
              <div className="pt-3 border-t border-border/50">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-foreground">Shipping Advance</span>
                  <span className="text-xl sm:text-2xl font-bold tracking-tight text-primary">₵{totalAdvance.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div className="p-3 sm:p-4 rounded-xl bg-background/50 border border-border/50 mb-4 sm:mb-6">
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Wallet Balance</span>
                <span className={`font-bold ${canAfford ? 'text-green-500' : 'text-destructive'}`}>
                  ₵{walletBalance.toFixed(2)}
                </span>
              </div>
            </div>

            <button
              onClick={handleReserveAndPay}
              disabled={isProcessing || selectedItems.length === 0 || !canAfford}
              className="w-full relative group overflow-hidden rounded-xl bg-primary px-4 py-3 sm:py-3.5 font-bold text-sm sm:text-base text-primary-foreground transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:hover:scale-100 shadow-xl shadow-primary/20 flex items-center justify-center gap-2"
            >
              {isProcessing ? <RefreshCcw className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" /> : <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5" />}
              {isProcessing ? 'Processing...' : `Reserve & Pay ₵${totalAdvance.toFixed(2)}`}
            </button>
            {!canAfford && selectedItems.length > 0 && (
              <p className="text-xs text-center text-destructive mt-2 sm:mt-3 font-medium flex items-center justify-center gap-1">
                <AlertTriangle className="w-3 h-3" /> Insufficient funds. Top up your wallet.
              </p>
            )}
          </div>
        </div>
      ) : (
        <div className="space-y-3 sm:space-y-4">
          {reservations.length === 0 ? (
            <div className="text-center py-12 sm:py-16 glass rounded-2xl border border-border/50">
              <PlaneTakeoff className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-3 sm:mb-4 text-muted-foreground opacity-30" />
              <h3 className="text-base sm:text-lg font-bold text-foreground">No reservations yet</h3>
              <p className="text-sm text-muted-foreground mt-1">Select items from your warehouse to reserve shipment space.</p>
            </div>
          ) : (
            <div className="grid gap-3 sm:gap-4">
              {reservations.map(res => (
                <div key={res.id} className="glass p-4 sm:p-5 rounded-2xl border border-border/50 transition-colors hover:bg-white/5">
                  {/* Top row: ID + Badge */}
                  <div className="flex items-start justify-between gap-2 mb-2 sm:mb-3">
                    <span className="font-bold font-mono text-sm sm:text-lg text-primary truncate">{res.id}</span>
                    {getStatusBadge(res.status, res.deposit_paid)}
                  </div>

                  {/* Meta row */}
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs sm:text-sm text-muted-foreground mb-3">
                    <span className="flex items-center gap-1">
                      <Package className="w-3.5 h-3.5" /> {res.total_items} Item{res.total_items > 1 ? 's' : ''}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" /> {new Date(res.created_at).toLocaleDateString()}
                    </span>
                    <span className="capitalize flex items-center gap-1">
                      {res.shipping_mode.includes('air') ? <PlaneTakeoff className="w-3.5 h-3.5" /> : <Ship className="w-3.5 h-3.5" />}
                      {shippingModeLabel(res.shipping_mode)}
                    </span>
                  </div>

                  {/* Bottom row: Amount + Pay button */}
                  <div className="flex items-center justify-between gap-3 pt-2 sm:pt-3 border-t border-border/30">
                    <div>
                      <p className="text-[11px] sm:text-xs text-muted-foreground">Shipping Advance</p>
                      <p className="font-bold text-base sm:text-lg text-foreground">₵{Number(res.deposit_amount).toFixed(2)}</p>
                    </div>
                    
                    {!res.deposit_paid && (
                      <button 
                        onClick={() => handlePayExisting(res.id, Number(res.deposit_amount))}
                        disabled={isProcessing}
                        className="px-4 py-2 bg-primary text-primary-foreground font-bold rounded-lg hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 text-xs sm:text-sm whitespace-nowrap active:scale-95"
                      >
                        {isProcessing ? 'Processing...' : 'Pay Advance'}
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
