'use client';

import { useState } from 'react';
import { Package, PlaneTakeoff, Ship, CheckCircle2, Wallet, RefreshCcw, Box, Link as LinkIcon, ShoppingBag, Clock } from 'lucide-react';
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
  const { showAlert } = useModal();
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

  const handleReserveAndPay = async () => {
    if (selectedItems.length === 0) return showAlert({ title: "Selection Required", message: "Select at least one item to reserve space for.", type: "danger" });
    if (!canAfford) return showAlert({ title: "Insufficient Funds", message: "Insufficient wallet balance for this deposit.", type: "danger" });
    
    setIsProcessing(true);
    try {
      // For mall orders, we must pass the parent order IDs to reserve them
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
      
      showAlert({ title: "Success", message: "Shipment Space Reserved Successfully!", type: "success" });
      setSelectedItems([]);
      setActiveTab('history');
      router.refresh();
    } catch (err: any) {
      showAlert({ title: "Reservation Error", message: err.message || "An error occurred while reserving shipment.", type: "danger" });
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePayExisting = async (reservationId: string) => {
    setIsProcessing(true);
    try {
      await payReservationDeposit(reservationId);
      showAlert({ title: "Payment Success", message: "Shipping Advance paid successfully!", type: "success" });
      router.refresh();
    } catch (err: any) {
      showAlert({ title: "Payment Failed", message: err.message || "Payment failed", type: "danger" });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="flex bg-accent/20 p-1 rounded-xl w-max border border-border/50">
        <button 
          onClick={() => setActiveTab('new')}
          className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-all ${activeTab === 'new' ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground hover:bg-white/5'}`}
        >
          Reserve Space
        </button>
        <button 
          onClick={() => setActiveTab('history')}
          className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-all ${activeTab === 'history' ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground hover:bg-white/5'}`}
        >
          My Reservations
        </button>
      </div>

      {activeTab === 'new' ? (
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Items Selection */}
          <div className="lg:col-span-2 space-y-4">
            <div className="glass p-6 rounded-2xl border border-border/50">
              <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                <Box className="w-5 h-5 text-primary" />
                Select Items to Ship
              </h2>
              {allAvailable.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground bg-accent/5 rounded-xl border border-dashed border-border/50">
                  <Package className="w-12 h-12 mx-auto mb-3 opacity-20" />
                  <p>You have no items currently sitting in the warehouse.</p>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between mb-4 bg-secondary/20 p-3 rounded-lg border border-border/50">
                    <label className="flex items-center gap-2 cursor-pointer select-none font-semibold text-sm">
                      <input 
                        type="checkbox" 
                        checked={selectedItems.length === allAvailable.length && allAvailable.length > 0}
                        onChange={handleSelectAll}
                        className="w-4 h-4 rounded border-border text-primary focus:ring-primary/20 bg-background/50"
                      />
                      Select All Ready Items
                    </label>
                    <span className="text-xs text-muted-foreground font-medium">{selectedItems.length} selected</span>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {allAvailable.map((item) => {
                      const isSelected = !!selectedItems.find(i => i.id === item.id);
                      return (
                      <button
                        key={item.id}
                        onClick={() => toggleSelection(item)}
                        className={`flex items-center text-left gap-3 p-4 rounded-xl border transition-all ${
                          isSelected 
                            ? 'border-primary bg-primary/5 ring-1 ring-primary/20' 
                            : 'border-border/50 hover:border-primary/30 hover:bg-accent/5'
                        }`}
                      >
                        <div className={`shrink-0 w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${isSelected ? 'border-primary bg-primary' : 'border-border'}`}>
                          {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
                        </div>
                        {item.imageUrl ? (
                          <img src={item.imageUrl} alt="" className="w-12 h-12 rounded bg-black/20 object-cover shrink-0" />
                        ) : (
                          <div className="w-12 h-12 rounded bg-secondary/30 flex items-center justify-center shrink-0">
                            <Package className="w-6 h-6 opacity-30" />
                          </div>
                        )}
                        <div className="min-w-0">
                          <p className="font-semibold text-sm truncate text-foreground">{item.label}</p>
                          <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1.5">
                            {item.type === 'warehouse_package' && <Package className="w-3 h-3" />}
                            {item.type === 'link_order' && <LinkIcon className="w-3 h-3" />}
                            {item.type === 'mall_order' && <ShoppingBag className="w-3 h-3" />}
                            {item.desc}
                          </p>
                        </div>
                      </button>
                    )
                  })}
                  </div>
                </>
              )}
            </div>

            {/* Information Card */}
            <div className="glass p-6 rounded-2xl border border-border/50 bg-blue-500/5">
              <h2 className="text-sm font-bold text-blue-600 dark:text-blue-400 mb-2 flex items-center gap-2">
                <Box className="w-4 h-4" /> About Shipping Advance
              </h2>
              <p className="text-sm text-blue-700/80 dark:text-blue-300/80 leading-relaxed">
                You currently have {allAvailable.length} package{allAvailable.length === 1 ? '' : 's'} ready for shipment. To ship your items to Ghana, a Shipping Advance is required. This payment forms part of your final shipping fee and is not an extra charge.
              </p>
            </div>

            {/* Shipping Mode Dropdown */}
            <div className="glass p-6 rounded-2xl border border-border/50">
              <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                <PlaneTakeoff className="w-5 h-5 text-primary" />
                Shipping Method
              </h2>
              <select 
                value={shippingMode}
                onChange={(e) => setShippingMode(e.target.value as any)}
                className="w-full bg-background border border-input rounded-xl h-12 px-4 focus:ring-2 focus:ring-primary outline-none font-medium"
              >
                <option value="air_normal">Air Normal (12-16 Days) - ${depositRates?.air_normal_deposit_usd || 25} per kg</option>
                <option value="air_express">Air Express (3-7 Days) - ${depositRates?.air_express_deposit_usd || 44} per kg</option>
                <option value="sea">Sea Freight (50-60 Days) - ${depositRates?.sea_deposit_usd || 260} per cbm</option>
              </select>
            </div>
          </div>

          {/* Checkout Panel */}
          <div className="glass p-6 rounded-2xl border border-primary/20 bg-gradient-to-b from-background to-primary/5 h-fit sticky top-[100px]">
            <h3 className="font-bold text-lg mb-6 flex items-center gap-2">
              <Wallet className="w-5 h-5 text-primary" />
              Reservation Summary
            </h3>
            
            <div className="space-y-4 text-sm mb-6">
              <div className="flex justify-between items-center text-muted-foreground">
                <span>Selected Items</span>
                <span className="font-bold text-foreground">{selectedItems.length}</span>
              </div>
              <div className="flex justify-between items-center text-muted-foreground">
                <span>Shipping Method</span>
                <span className="font-bold text-foreground capitalize">{shippingMode.replace('_', ' ')}</span>
              </div>
              <div className="pt-4 border-t border-border/50">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-foreground">Shipping Advance</span>
                  <span className="text-2xl font-bold tracking-tight text-primary">₵{totalAdvance.toFixed(2)}</span>
                </div>
                <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                  This advance will be deducted from your final shipping invoice when your shipment arrives in Ghana.
                </p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-background/50 border border-border/50 mb-6">
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Available Wallet Balance</span>
                <span className={`font-bold ${canAfford ? 'text-green-500' : 'text-destructive'}`}>
                  ₵{walletBalance.toFixed(2)}
                </span>
              </div>
            </div>

            <button
              onClick={handleReserveAndPay}
              disabled={isProcessing || selectedItems.length === 0 || !canAfford}
              className="w-full relative group overflow-hidden rounded-xl bg-primary px-4 py-3.5 font-bold text-primary-foreground transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:hover:scale-100 shadow-xl shadow-primary/20 flex items-center justify-center gap-2"
            >
              {isProcessing ? <RefreshCcw className="w-5 h-5 animate-spin" /> : <CheckCircle2 className="w-5 h-5" />}
              {isProcessing ? 'Processing...' : 'Reserve Shipment Space'}
            </button>
            {!canAfford && (
              <p className="text-xs text-center text-destructive mt-3 font-medium">
                Insufficient funds. Please top up your wallet.
              </p>
            )}
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {reservations.length === 0 ? (
            <div className="text-center py-16 glass rounded-2xl border border-border/50">
              <PlaneTakeoff className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-30" />
              <h3 className="text-lg font-bold text-foreground">No reservations yet</h3>
              <p className="text-muted-foreground mt-1">Select items from your warehouse to reserve shipment space.</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {reservations.map(res => (
                <div key={res.id} className="glass p-5 rounded-2xl border border-border/50 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-colors hover:bg-white/5">
                  <div className="space-y-1">
                    <div className="flex items-center gap-3">
                      <span className="font-bold font-mono text-lg text-primary">{res.id}</span>
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${res.deposit_paid ? 'bg-green-500/10 text-green-500 border border-green-500/20' : 'bg-orange-500/10 text-orange-500 border border-orange-500/20'}`}>
                        {res.status.replace(/_/g, ' ')}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1.5"><Package className="w-4 h-4" /> {res.total_items} Items</span>
                      <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" /> {new Date(res.created_at).toLocaleDateString()}</span>
                      <span className="capitalize">{res.shipping_mode.replace('_', ' ')}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 md:justify-end">
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">Shipping Advance</p>
                      <p className="font-bold text-lg text-foreground">₵{Number(res.deposit_amount).toFixed(2)}</p>
                    </div>
                    
                    {!res.deposit_paid && (
                      <button 
                        onClick={() => handlePayExisting(res.id)}
                        disabled={isProcessing}
                        className="px-4 py-2 bg-primary text-primary-foreground font-bold rounded-lg hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20 text-sm whitespace-nowrap"
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
