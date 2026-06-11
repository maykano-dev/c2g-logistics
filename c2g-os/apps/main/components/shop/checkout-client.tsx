"use client";

import { useState, useEffect } from "react";
import { useCart } from "./cart-context";
import { useRouter } from "next/navigation";
import { createEcomOrder } from "../../app/checkout/actions";
import { CheckCircle2, ChevronRight, MapPin, CreditCard, Ship, ShoppingBag, ShieldCheck } from "lucide-react";

export default function CheckoutClient({ initialProfile, exchangeRate }: { initialProfile: any, exchangeRate: number }) {
  const { items, cartTotalGhs, clearCart } = useCart();
  const router = useRouter();

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

  const serviceFee = cartTotalGhs * 0.05; // 5% service fee
  const totalAmount = cartTotalGhs + serviceFee; // Exclude shipping cost until it arrives

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
      shippingCost: 0,
      totalAmount,
      exchangeRate,
      reference,
      paymentGateway: "paystack"
    };

    const res = await createEcomOrder(payload);

    if (res.success) {
      clearCart();
      // In a real flow, redirect to Paystack/Hubtel payment gateway here.
      // For now, redirect to a success page or dashboard.
      router.push(`/dashboard/mall-orders?success=true&orderId=${res.orderId}`);
    } else {
      alert("Error: " + res.error);
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
                <label className="text-sm font-medium">Full Name</label>
                <input required type="text" value={formData.name} onChange={(e) => setFormData(p => ({ ...p, name: e.target.value }))} className="flex h-12 w-full rounded-md border border-input bg-background/50 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Phone Number</label>
                <input required type="tel" value={formData.phone} onChange={(e) => setFormData(p => ({ ...p, phone: e.target.value }))} className="flex h-12 w-full rounded-md border border-input bg-background/50 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50" />
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-medium">Delivery Address (Ghana)</label>
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
              <Ship className="w-5 h-5 text-primary" /> Shipping Method
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <label className={`relative flex flex-col items-start p-4 cursor-pointer rounded-xl border-2 transition-all ${shippingMethod === "sea" ? "border-primary bg-primary/5" : "border-border bg-background hover:bg-secondary/50"}`}>
                <input type="radio" name="shipping" value="sea" className="sr-only" checked={shippingMethod === "sea"} onChange={() => setShippingMethod("sea")} />
                <div className="flex items-center justify-between w-full mb-1">
                  <span className="font-bold">Sea Freight</span>
                  {shippingMethod === "sea" && <CheckCircle2 className="w-5 h-5 text-primary" />}
                </div>
                <span className="text-sm text-muted-foreground">45 - 60 Days</span>
                <span className="text-xs text-muted-foreground mt-2 font-medium bg-secondary px-2 py-1 rounded">Best for heavy/bulky items</span>
              </label>

              <label className={`relative flex flex-col items-start p-4 cursor-pointer rounded-xl border-2 transition-all ${shippingMethod === "normal" ? "border-primary bg-primary/5" : "border-border bg-background hover:bg-secondary/50"}`}>
                <input type="radio" name="shipping" value="normal" className="sr-only" checked={shippingMethod === "normal"} onChange={() => setShippingMethod("normal")} />
                <div className="flex items-center justify-between w-full mb-1">
                  <span className="font-bold">Air Freight</span>
                  {shippingMethod === "normal" && <CheckCircle2 className="w-5 h-5 text-primary" />}
                </div>
                <span className="text-sm text-muted-foreground">10 - 14 Days</span>
                <span className="text-xs text-muted-foreground mt-2 font-medium bg-secondary px-2 py-1 rounded">Fastest delivery</span>
              </label>
            </div>
            <p className="text-xs text-muted-foreground mt-4 flex items-center gap-1.5"><ShieldCheck className="w-4 h-4 text-green-500" /> International shipping costs are calculated and billed when items arrive in Ghana.</p>
          </div>

        </form>
      </div>

      {/* Right Column: Order Summary & Payment */}
      <div className="w-full lg:w-96 shrink-0 space-y-6">
        
        {/* Order Items Summary */}
        <div className="glass-panel p-6">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2 border-b border-border/50 pb-4">
            <ShoppingBag className="w-5 h-5 text-primary" /> Order Details
          </h2>
          <div className="space-y-4 max-h-64 overflow-y-auto pr-2 mb-4">
            {items.map(item => (
              <div key={item.id} className="flex gap-3 text-sm">
                <img src={item.imageUrl} alt="" className="w-12 h-12 rounded object-cover border border-border" />
                <div className="flex-1">
                  <div className="font-medium line-clamp-1">{item.name}</div>
                  <div className="text-muted-foreground">Qty: {item.quantity}</div>
                </div>
                <div className="font-bold text-right">
                  ₵{(item.priceGhs * item.quantity).toFixed(2)}
                </div>
              </div>
            ))}
          </div>
          
          <div className="space-y-3 pt-4 border-t border-border/50 text-sm">
            <div className="flex justify-between text-muted-foreground">
              <span>Items Subtotal</span>
              <span>₵{cartTotalGhs.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-muted-foreground">
              <span>Service Fee (5%)</span>
              <span>₵{serviceFee.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-muted-foreground">
              <span>Int. Shipping</span>
              <span className="text-amber-500 font-medium">Billed later</span>
            </div>
            <div className="flex justify-between items-center pt-3 border-t border-border/50">
              <span className="font-bold">Total to Pay Now</span>
              <span className="text-2xl font-extrabold text-primary">₵{totalAmount.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Payment Button */}
        <div className="glass-panel p-6 sticky top-24">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2 border-b border-border/50 pb-4">
            <CreditCard className="w-5 h-5 text-primary" /> Payment
          </h2>
          <p className="text-sm text-muted-foreground mb-6">
            You will be redirected securely to Paystack to complete your Mobile Money or Card payment.
          </p>
          <button 
            type="submit"
            form="checkout-form"
            disabled={loading}
            className="w-full h-14 inline-flex items-center justify-center whitespace-nowrap rounded-xl text-base font-bold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/25 disabled:opacity-50 gap-2"
          >
            {loading ? (
              <span className="animate-pulse">Processing Secure Checkout...</span>
            ) : (
              <>Pay ₵{totalAmount.toFixed(2)} <ChevronRight className="w-5 h-5" /></>
            )}
          </button>
          
          <div className="mt-4 flex items-center justify-center gap-2 text-xs text-muted-foreground font-medium">
            <ShieldCheck className="w-4 h-4 text-green-500" /> Secure SSL Encrypted Checkout
          </div>
        </div>
      </div>
    </div>
  );
}
