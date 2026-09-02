"use client";

import { useState, useEffect } from "react";
import { useCart } from "./cart-context";
import { useRouter } from "next/navigation";
import { createEcomOrder, verifyCartInventory, getCartFreightEstimate, saveCheckoutAddress, setPrimaryAddress, deleteAddress } from "../../app/checkout/actions";
import { CheckCircle2, ChevronRight, MapPin, CreditCard, Ship, ShoppingBag, ShieldCheck, Calculator, Info, Plane, Zap, Loader2, Plus, Trash2, Star } from "lucide-react";
import { useModal } from "@/components/providers/modal-provider";
import Link from "next/link";
import WalletPaymentModal from "@/components/wallet/wallet-payment-modal";

export default function CheckoutClient({ 
  initialProfile, 
  savedAddresses,
  exchangeRate,
  serviceFeePercentage,
  minServiceFee,
  localDeliveryPercentage,
  minLocalDeliveryFee,
  walletBalance
}: { 
  initialProfile: any, 
  savedAddresses: any[],
  exchangeRate: number,
  serviceFeePercentage: number,
  minServiceFee: number,
  localDeliveryPercentage: number,
  minLocalDeliveryFee: number,
  walletBalance: number
}) {
  const { items, cartTotalGhs, clearCart, isLoaded } = useCart();
  const router = useRouter();
  const { showAlert } = useModal();

  const [loading, setLoading] = useState(false);
  const [addressLoading, setAddressLoading] = useState(false);
  
  // Track selected address ID
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(
    savedAddresses?.find(a => a.is_primary)?.id || savedAddresses?.[0]?.id || null
  );
  
  // Form state for adding new address
  const [showAddressForm, setShowAddressForm] = useState(savedAddresses?.length === 0);
  const [newAddress, setNewAddress] = useState({
    name: initialProfile?.name || "",
    phone: initialProfile?.phone || "",
    street_address: "",
    city: "",
    region: ""
  });
  
  const [notes, setNotes] = useState("");

  const [exactFreightGhs, setExactFreightGhs] = useState<number | null>(null);
  const [isFetchingFreight, setIsFetchingFreight] = useState(true);

  useEffect(() => {
    if (isLoaded && items.length === 0 && !loading) {
      router.push("/cart");
    } else if (isLoaded && items.length > 0 && exactFreightGhs === null) {
      // Fetch the exact domestic freight for the checkout payload
      getCartFreightEstimate(items).then(res => {
        if (res.success && res.freightGhs !== undefined) {
          setExactFreightGhs(res.freightGhs);
        } else {
          // Fallback to old percentage logic if API fails
          const calculatedLocalDelivery = cartTotalGhs * (localDeliveryPercentage / 100);
          setExactFreightGhs(Math.max(calculatedLocalDelivery, minLocalDeliveryFee));
        }
        setIsFetchingFreight(false);
      });
    }
  }, [items, router, loading, exactFreightGhs, cartTotalGhs, localDeliveryPercentage, minLocalDeliveryFee]);

  // DB-driven Calculations
  const calculatedServiceFee = cartTotalGhs * (serviceFeePercentage / 100);
  const serviceFee = Math.max(calculatedServiceFee, minServiceFee);
  
  const localDelivery = exactFreightGhs || 0; 
  
  const totalAmount = cartTotalGhs + serviceFee + localDelivery; // Exclude shipping cost until it arrives

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCheckoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return;
    if (!selectedAddressId) {
      showAlert({ title: "Address Required", message: "Please select a delivery address.", type: "warning" });
      return;
    }
    
    setLoading(true);
    
    // LIVE ALIBABA INVENTORY CHECK
    const verifyRes = await verifyCartInventory(items);
    if (!verifyRes.success) {
      setLoading(false);
      if (verifyRes.outOfStock) {
        showAlert({ 
          title: 'Inventory Alert', 
          message: `The following items are no longer available from the supplier: ${verifyRes.outOfStock.join(', ')}. Please remove them from your cart to proceed.`, 
          type: 'danger' 
        });
      } else {
        showAlert({ title: 'Error', message: verifyRes.error || "Failed to verify inventory.", type: 'danger' });
      }
      return;
    }
    
    setLoading(false);
    setIsModalOpen(true);
  };

  const handleSaveNewAddress = async () => {
    setAddressLoading(true);
    const res = await saveCheckoutAddress(newAddress);
    setAddressLoading(false);
    if (res.success) {
      // Reload page to fetch new addresses
      router.refresh();
      setShowAddressForm(false);
    } else {
      showAlert({ title: 'Error', message: res.error || "Failed to save address", type: 'danger' });
    }
  };

  const handleSetPrimary = async (id: string) => {
    setAddressLoading(true);
    await setPrimaryAddress(id);
    setAddressLoading(false);
    router.refresh();
  };

  const handleDeleteAddress = async (id: string) => {
    if (!confirm("Are you sure you want to delete this address?")) return;
    setAddressLoading(true);
    await deleteAddress(id);
    if (selectedAddressId === id) setSelectedAddressId(null);
    setAddressLoading(false);
    router.refresh();
  };

  const processPayment = async () => {
    setLoading(true);

    const reference = `C2G_${Date.now()}_${Math.random().toString(36).substring(2, 9).toUpperCase()}`;
    
    const selectedAddress = savedAddresses?.find(a => a.id === selectedAddressId);
    if (!selectedAddress) {
      setLoading(false);
      return;
    }

    const payload = {
      shippingName: selectedAddress.name,
      shippingPhone: selectedAddress.phone,
      shippingAddress: `${selectedAddress.street_address}, ${selectedAddress.city}, ${selectedAddress.region}`,
      shippingNotes: notes,
      shippingMethod: "pending",
      items,
      subtotal: cartTotalGhs,
      serviceFee,
      shippingCost: localDelivery, // Maps local delivery to the DB's initial shipping_cost
      totalAmount,
      exchangeRate,
      reference,
      paymentGateway: "wallet" // Uses the wallet!
    };

    const res = await createEcomOrder(payload);

    if (!res.success) {
      showAlert({ title: 'Error', message: res.error || "An unknown error occurred", type: 'danger' });
      setLoading(false);
      throw new Error(res.error || "An unknown error occurred");
    }
  };

  const isInsufficient = walletBalance < totalAmount;

  if (items.length === 0) return null;

  return (
    <div className="space-y-6">
      <WalletPaymentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={processPayment}
        amount={totalAmount}
        walletBalance={walletBalance}
        itemName="C2G Mall Order"
        isProcessing={loading}
        onSuccessRedirect={() => {
          clearCart();
          router.push(`/dashboard/mall-orders`);
        }}
      />

      {/* 1. Cart Items — always first */}
      <div className="glass-panel p-6">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2 border-b border-border/50 pb-4">
          <ShoppingBag className="w-5 h-5 text-primary" /> Cart Items
        </h2>
        <div className="space-y-4 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
          {items.map(item => (
            <div key={item.id} className="flex gap-3 text-sm">
              <img src={item.imageUrl} alt="" className="w-12 h-12 rounded object-cover border border-border" />
              <div className="flex-1">
                <div className="font-medium line-clamp-1">{item.name}</div>
                <div className="text-muted-foreground text-xs mt-0.5">Qty: {item.quantity}</div>
              </div>
              <div className="font-bold text-right shrink-0">
                ₵{(item.priceGhs * item.quantity).toFixed(2)}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 2. Two-column layout: Delivery Info (left) + Cost Summary (right) */}
      <div className="flex flex-col lg:flex-row gap-6">

        {/* Left: Delivery Info + Shipping Method */}
        <div className="flex-1 space-y-6">
          <form id="checkout-form" onSubmit={handleCheckoutSubmit} className="space-y-6">

            {/* Delivery Information */}
            <div className="glass-panel p-6">
              <div className="flex items-center justify-between mb-6 border-b border-border/50 pb-4">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-primary" /> Delivery Addresses
                </h2>
                {savedAddresses.length > 0 && savedAddresses.length < 3 && !showAddressForm && (
                  <button 
                    type="button" 
                    onClick={() => setShowAddressForm(true)}
                    className="text-sm font-medium text-primary flex items-center gap-1 hover:underline"
                  >
                    <Plus className="w-4 h-4" /> Add New
                  </button>
                )}
              </div>
              
              <div className="space-y-4 mb-6">
                {savedAddresses.map(address => (
                  <div 
                    key={address.id} 
                    onClick={() => setSelectedAddressId(address.id)}
                    className={`relative p-4 rounded-xl border transition-all cursor-pointer ${
                      selectedAddressId === address.id 
                        ? 'border-primary bg-primary/5 ring-1 ring-primary' 
                        : 'border-border/50 bg-card hover:border-primary/50'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-3">
                        <div className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${
                          selectedAddressId === address.id ? 'border-primary bg-primary' : 'border-muted-foreground'
                        }`}>
                          {selectedAddressId === address.id && <CheckCircle2 className="w-3.5 h-3.5 text-primary-foreground" />}
                        </div>
                        <div>
                          <div className="font-bold flex items-center gap-2">
                            {address.name} 
                            {address.is_primary && (
                              <span className="text-[10px] uppercase font-bold bg-primary/20 text-primary px-1.5 py-0.5 rounded-sm">Default</span>
                            )}
                          </div>
                          <div className="text-sm text-muted-foreground mt-0.5">{address.phone}</div>
                          <div className="text-sm mt-1">{address.street_address}</div>
                          <div className="text-sm">{address.city}, {address.region}</div>
                        </div>
                      </div>
                      
                      <div className="flex flex-col items-end gap-2">
                        <button
                          type="button"
                          onClick={(e) => { e.stopPropagation(); handleDeleteAddress(address.id); }}
                          disabled={addressLoading}
                          className="p-1.5 text-muted-foreground hover:text-red-500 hover:bg-red-500/10 rounded-md transition-colors"
                          title="Delete Address"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                        {!address.is_primary && (
                          <button
                            type="button"
                            onClick={(e) => { e.stopPropagation(); handleSetPrimary(address.id); }}
                            disabled={addressLoading}
                            className="text-xs font-medium text-muted-foreground hover:text-primary transition-colors flex items-center gap-1"
                          >
                            <Star className="w-3 h-3" /> Set Default
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                
                {savedAddresses.length === 0 && !showAddressForm && (
                  <div className="text-center py-6 text-muted-foreground">
                    You have no saved addresses. Please add one.
                  </div>
                )}
              </div>

              {showAddressForm && (
                <div className="bg-secondary/30 rounded-xl p-5 border border-border/50 animate-in fade-in slide-in-from-top-4">
                  <h3 className="font-bold mb-4 flex items-center gap-2">
                    <MapPin className="w-4 h-4" /> Add New Address
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Full Name <span className="text-red-600">*</span></label>
                      <input required type="text" value={newAddress.name} onChange={(e) => setNewAddress(p => ({ ...p, name: e.target.value }))} className="flex h-11 w-full rounded-md border border-input bg-background/50 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Phone Number <span className="text-red-600">*</span></label>
                      <input required type="tel" value={newAddress.phone} onChange={(e) => setNewAddress(p => ({ ...p, phone: e.target.value }))} className="flex h-11 w-full rounded-md border border-input bg-background/50 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50" />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <label className="text-sm font-medium">Street Address <span className="text-red-600">*</span></label>
                      <input required type="text" value={newAddress.street_address} onChange={(e) => setNewAddress(p => ({ ...p, street_address: e.target.value }))} placeholder="House No., Street Name..." className="flex h-11 w-full rounded-md border border-input bg-background/50 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">City <span className="text-red-600">*</span></label>
                      <input required type="text" value={newAddress.city} onChange={(e) => setNewAddress(p => ({ ...p, city: e.target.value }))} placeholder="e.g. Accra" className="flex h-11 w-full rounded-md border border-input bg-background/50 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Region <span className="text-red-600">*</span></label>
                      <input required type="text" value={newAddress.region} onChange={(e) => setNewAddress(p => ({ ...p, region: e.target.value }))} placeholder="e.g. Greater Accra" className="flex h-11 w-full rounded-md border border-input bg-background/50 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50" />
                    </div>
                  </div>
                  <div className="flex justify-end gap-3 mt-6">
                    {savedAddresses.length > 0 && (
                      <button type="button" onClick={() => setShowAddressForm(false)} className="px-4 py-2 rounded-lg text-sm font-medium hover:bg-secondary transition-colors">
                        Cancel
                      </button>
                    )}
                    <button type="button" onClick={handleSaveNewAddress} disabled={addressLoading || !newAddress.street_address || !newAddress.city} className="px-6 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-bold shadow-md hover:bg-primary/90 disabled:opacity-50">
                      {addressLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save Address"}
                    </button>
                  </div>
                </div>
              )}

              <div className="mt-6 border-t border-border/50 pt-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Order Notes (Optional)</label>
                  <input type="text" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Any special instructions..." className="flex h-11 w-full rounded-md border border-input bg-background/50 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50" />
                </div>
              </div>
            </div>

            {/* Shipping Method Info */}
            <div className="glass-panel p-6">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2 border-b border-border/50 pb-4">
                <Ship className="w-5 h-5 text-primary" /> Shipping Selection
              </h2>
              
              <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-700 dark:text-blue-400">
                <p className="leading-relaxed">
                  Your shipping method will be selected after your items arrive at our China warehouse. Once they're ready, simply visit the <strong>Reservations</strong> page to choose your preferred shipping option and prepare your shipment.
                </p>
              </div>
            </div>

          </form>
        </div>

        {/* Right: Live Cost Summary + Pay */}
        <div className="w-full lg:w-[400px] shrink-0">
          <div className="glass-panel overflow-hidden sticky top-24">
            <div className="bg-primary/10 p-4 border-b border-border/50 flex items-center gap-2">
              <Calculator className="w-5 h-5 text-primary" />
              <h3 className="font-bold text-lg">Live Cost Summary</h3>
            </div>
            
            <div className="p-5 space-y-4">
              <div className="bg-secondary/30 p-3 rounded-lg border border-border/50 text-xs">
                <p className="font-semibold mb-1">Using Platform Rate: 1 GHS = {exchangeRate.toFixed(4)} CNY</p>
                <p className="text-muted-foreground">The exchange rates used on C2G reflect the actual rates applied in mainland China, not the rates shown on Google.</p>
              </div>

              <div className="space-y-3 pt-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Items Subtotal</span>
                  <span className="font-medium">₵{cartTotalGhs.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Service Fee</span>
                  <span className="font-medium">₵{serviceFee.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Local Delivery (China)</span>
                  <span className="font-medium">
                    {isFetchingFreight ? <span className="animate-pulse">Estimating...</span> : `₵${localDelivery.toFixed(2)}`}
                  </span>
                </div>
              </div>

              <div className="border-t border-border/50 pt-4 mt-2">
                <div className="flex justify-between items-center">
                  <span className="font-bold">Total Estimated Cost</span>
                  <span className="font-bold text-primary text-xl tracking-tight">₵{totalAmount.toFixed(2)}</span>
                </div>
                <p className="text-[10px] text-muted-foreground text-right mt-1">(Excl. Int. Shipping)</p>
              </div>

              <div className="border-t border-border/50 pt-4 mt-4">
                <div className="flex justify-between items-center text-sm mb-2">
                  <span className="text-muted-foreground">Available Wallet Balance</span>
                  <span className="font-bold text-lg">₵{walletBalance.toFixed(2)}</span>
                </div>
              </div>

              <div className="mt-4 flex flex-col gap-3">
                {isInsufficient ? (
                  <button 
                    type="button"
                    onClick={() => setIsModalOpen(true)}
                    className="w-full inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-bold transition-all bg-zinc-800 text-white hover:bg-zinc-700 h-12 shadow-lg gap-2"
                  >
                    Pay ₵{totalAmount.toFixed(2)}
                  </button>
                ) : (
                  <button 
                    type="submit"
                    form="checkout-form"
                    disabled={loading || items.length === 0 || isFetchingFreight}
                    className="w-full inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-bold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring bg-primary text-primary-foreground hover:bg-primary/90 hover:scale-[1.02] h-12 shadow-lg shadow-primary/25 disabled:opacity-50 disabled:pointer-events-none gap-2"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" /> Processing...
                      </>
                    ) : (
                      <>
                        Pay ₵{totalAmount.toFixed(2)} <ChevronRight className="w-5 h-5" />
                      </>
                    )}
                  </button>
                )}
                
                <div className="mt-2 flex items-center justify-center gap-2 text-xs text-muted-foreground font-medium">
                  <ShieldCheck className="w-4 h-4 text-green-500" /> Secure Automatic Deduction
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
