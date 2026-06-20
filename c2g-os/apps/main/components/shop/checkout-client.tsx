"use client";

import { useState, useEffect } from "react";
import { useCart } from "./cart-context";
import { useRouter } from "next/navigation";
import { createEcomOrder } from "../../app/checkout/actions";
import { CheckCircle2, ChevronRight, MapPin, CreditCard, Ship, ShoppingBag, ShieldCheck, Calculator, Info, Plane, Zap, Loader2 } from "lucide-react";
import { useModal } from "@/components/providers/modal-provider";
import Link from "next/link";

export default function CheckoutClient({ 
  initialProfile, 
  exchangeRate,
  serviceFeePercentage,
  minServiceFee,
  localDeliveryPercentage,
  minLocalDeliveryFee
}: { 
  initialProfile: any, 
  exchangeRate: number,
  serviceFeePercentage: number,
  minServiceFee: number,
  localDeliveryPercentage: number,
  minLocalDeliveryFee: number
}) {
  const { items, cartTotalGhs, clearCart } = useCart();
  const router = useRouter();
  const { showAlert } = useModal();

  const [loading, setLoading] = useState(false);
  const [shippingMethod, setShippingMethod] = useState("sea");
  const [formData, setFormData] = useState({
    name: initialProfile?.name || "",
    phone: initialProfile?.phone || "",
    address: "",
    notes: ""
  });

  useEffect(() => {
    if (items.length === 0 && !loading) {
      router.push("/cart");
    }
  }, [items, router, loading]);

  // DB-driven Calculations
  const calculatedServiceFee = cartTotalGhs * (serviceFeePercentage / 100);
  const serviceFee = Math.max(calculatedServiceFee, minServiceFee);
  
  const calculatedLocalDelivery = cartTotalGhs * (localDeliveryPercentage / 100);
  const localDelivery = Math.max(calculatedLocalDelivery, minLocalDeliveryFee); 
  
  const totalAmount = cartTotalGhs + serviceFee + localDelivery; // Exclude shipping cost until it arrives

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return;
    setLoading(true);

    const reference = `C2G_${Date.now()}_${Math.random().toString(36).substring(2, 9).toUpperCase()}`;

    const payload = {
      shippingName: formData.name,
      shippingPhone: formData.phone,
      shippingAddress: formData.address,
      shippingNotes: formData.notes,
      shippingMethod,
      items,
      subtotal: cartTotalGhs,
      serviceFee,
      shippingCost: localDelivery, // Maps local delivery to the DB's initial shipping_cost
      totalAmount,
      exchangeRate,
      reference,
      paymentGateway: "paystack"
    };

    const res = await createEcomOrder(payload);

    if (res.success) {
      clearCart();
      // Call Hubtel to initialize payment
      try {
        const hubtelRes = await fetch('/api/hubtel/initialize', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ orderId: res.id, type: 'mall_order' })
        });
        const hubtelData = await hubtelRes.json();

        if (hubtelData.checkoutUrl) {
          window.location.href = hubtelData.checkoutUrl;
        } else {
          showAlert({ title: 'Payment Error', message: 'Failed to initialize payment gateway. Please try again from your orders page.', type: 'danger' });
          router.push(`/dashboard/mall-orders`);
        }
      } catch (err) {
        showAlert({ title: 'Network Error', message: 'Network error initializing payment.', type: 'danger' });
        router.push(`/dashboard/mall-orders`);
      }
    } else {
      showAlert({ title: 'Error', message: res.error || "An unknown error occurred", type: 'danger' });
      setLoading(false);
    }
  };

  if (items.length === 0) return null;

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      {/* Checkout Form */}
      <div className="flex-1 space-y-6">
        <form id="checkout-form" onSubmit={handleCheckout} className="space-y-6">
          
          {/* 1. Contact & Shipping */}
          <div className="glass-panel p-6">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2 border-b border-border/50 pb-4">
              <MapPin className="w-5 h-5 text-primary" /> Delivery Information
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Full Name <span className="text-red-600">*</span></label>
                <input required type="text" value={formData.name} onChange={(e) => setFormData(p => ({ ...p, name: e.target.value }))} className="flex h-12 w-full rounded-md border border-input bg-background/50 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Phone Number <span className="text-red-600">*</span></label>
                <input required type="tel" value={formData.phone} onChange={(e) => setFormData(p => ({ ...p, phone: e.target.value }))} className="flex h-12 w-full rounded-md border border-input bg-background/50 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50" />
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-medium">Delivery Address (Ghana) <span className="text-red-600">*</span></label>
                <textarea required rows={3} value={formData.address} onChange={(e) => setFormData(p => ({ ...p, address: e.target.value }))} placeholder="Street, Neighborhood, City..." className="flex w-full rounded-md border border-input bg-background/50 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50" />
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-medium">Additional Notes (Optional)</label>
                <input type="text" value={formData.notes} onChange={(e) => setFormData(p => ({ ...p, notes: e.target.value }))} className="flex h-12 w-full rounded-md border border-input bg-background/50 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50" />
              </div>
            </div>
          </div>

          {/* 2. Shipping Method */}
          <div className="glass-panel p-6">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2 border-b border-border/50 pb-4">
              <Ship className="w-5 h-5 text-primary" /> International Shipping Method
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <label className={`relative flex flex-col items-start p-4 cursor-pointer rounded-xl border-2 transition-all ${shippingMethod === "sea" ? "border-primary bg-primary/5 shadow-sm" : "border-border bg-background hover:bg-secondary/50"}`}>
                <input type="radio" name="shipping" value="sea" className="sr-only" checked={shippingMethod === "sea"} onChange={() => setShippingMethod("sea")} />
                <div className="flex items-center justify-between w-full mb-1">
                  <span className="font-bold flex items-center gap-2"><Ship className="w-4 h-4 text-green-500" /> Sea Freight</span>
                  {shippingMethod === "sea" && <CheckCircle2 className="w-5 h-5 text-primary" />}
                </div>
                <span className="text-sm text-muted-foreground mt-1">50 - 60 Days</span>
                <span className="text-xs font-medium text-green-500 mt-2">$250/CBM</span>
              </label>

              <label className={`relative flex flex-col items-start p-4 cursor-pointer rounded-xl border-2 transition-all ${shippingMethod === "normal" ? "border-primary bg-primary/5 shadow-sm" : "border-border bg-background hover:bg-secondary/50"}`}>
                <input type="radio" name="shipping" value="normal" className="sr-only" checked={shippingMethod === "normal"} onChange={() => setShippingMethod("normal")} />
                <div className="flex items-center justify-between w-full mb-1">
                  <span className="font-bold flex items-center gap-2"><Plane className="w-4 h-4 text-blue-500" /> Air Normal</span>
                  {shippingMethod === "normal" && <CheckCircle2 className="w-5 h-5 text-primary" />}
                </div>
                <span className="text-sm text-muted-foreground mt-1">10 - 14 Days</span>
                <span className="text-xs font-medium text-blue-500 mt-2">$25/kg</span>
              </label>

              <label className={`relative flex flex-col items-start p-4 cursor-pointer rounded-xl border-2 transition-all md:col-span-2 ${shippingMethod === "express" ? "border-primary bg-primary/5 shadow-sm" : "border-border bg-background hover:bg-secondary/50"}`}>
                <input type="radio" name="shipping" value="express" className="sr-only" checked={shippingMethod === "express"} onChange={() => setShippingMethod("express")} />
                <div className="flex items-center justify-between w-full mb-1">
                  <span className="font-bold flex items-center gap-2"><Zap className="w-4 h-4 text-orange-500" /> Air Express</span>
                  {shippingMethod === "express" && <CheckCircle2 className="w-5 h-5 text-primary" />}
                </div>
                <span className="text-sm text-muted-foreground mt-1">3 - 5 Days</span>
                <span className="text-xs font-medium text-orange-500 mt-2">$44/kg</span>
              </label>
            </div>
            
            <p className="text-xs text-muted-foreground leading-relaxed">
              The international shipping fee will be invoiced to your dashboard once the items arrive in Ghana. The rates above are estimates and subject to change.
            </p>
          </div>

        </form>
      </div>

      {/* Right Column: Order Summary & Payment */}
      <div className="w-full lg:w-[400px] shrink-0 space-y-6">
        
        {/* Order Items Preview */}
        <div className="glass-panel p-6">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2 border-b border-border/50 pb-4">
            <ShoppingBag className="w-5 h-5 text-primary" /> Cart Items
          </h2>
          <div className="space-y-4 max-h-64 overflow-y-auto pr-2">
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

        {/* Live Cost Summary */}
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
                <span className="font-medium">₵{localDelivery.toFixed(2)}</span>
              </div>
            </div>

            <div className="border-t border-border/50 pt-4 mt-2">
              <div className="flex justify-between items-center">
                <span className="font-bold">Total Estimated Cost</span>
                <span className="font-bold text-primary text-xl tracking-tight">₵{totalAmount.toFixed(2)}</span>
              </div>
              <p className="text-[10px] text-muted-foreground text-right mt-1">(Excl. Int. Shipping)</p>
            </div>

            <div className="mt-4 text-xs text-center text-muted-foreground flex items-start gap-2 bg-background p-3 rounded-lg">
              <Info className="w-4 h-4 shrink-0 text-blue-500" />
              <p className="text-left leading-tight font-bold">The international shipping fee will be invoiced once the items get to Ghana.</p>
            </div>

            <div className="mt-6 flex flex-col gap-3">
              <button 
                type="submit"
                form="checkout-form"
                disabled={loading || items.length === 0}
                className="w-full inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-bold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring bg-primary text-primary-foreground hover:bg-primary/90 hover:scale-[1.02] h-12 shadow-lg shadow-primary/25 disabled:opacity-50 disabled:pointer-events-none gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Processing Payment...
                  </>
                ) : (
                  <>Pay ₵{totalAmount.toFixed(2)} <ChevronRight className="w-5 h-5" /></>
                )}
              </button>
              
              <div className="mt-2 flex items-center justify-center gap-2 text-xs text-muted-foreground font-medium">
                <ShieldCheck className="w-4 h-4 text-green-500" /> Secure SSL Encrypted Checkout
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
