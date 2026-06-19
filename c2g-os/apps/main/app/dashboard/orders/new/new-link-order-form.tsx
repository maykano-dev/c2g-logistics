"use client";

import { LinkIcon, UploadCloud, Info, Calculator, Ship, Plane, Zap, Loader2, Plus, Trash2 } from "lucide-react";
import Link from "next/link";
import { useState, useActionState, useEffect } from "react";
import { createLinkOrder } from "../actions";
import { useRouter } from "next/navigation";

export function NewLinkOrderForm({ exchangeRate }: { exchangeRate: number }) {
  const router = useRouter();
  
  // Multi-item State
  const [items, setItems] = useState([
    { id: Date.now().toString(), product_link: '', cny_price: 0, quantity: 1, notes: '' }
  ]);
  
  const [itemFileNames, setItemFileNames] = useState<Record<string, string>>({});
  
  const [state, action, isPending] = useActionState(createLinkOrder, null);

  useEffect(() => {
    if (state?.success && state?.redirectUrl) {
      router.push(state.redirectUrl);
    }
  }, [state, router]);

  // Calculations
  const itemCostCny = items.reduce((sum, item) => sum + (item.cny_price * item.quantity), 0);
  const itemCostGhs = itemCostCny / exchangeRate;
  const serviceFee = itemCostGhs * 0.05; // 5% fee example
  const localDelivery = 0; // Assume 0 for this estimate
  const totalGhs = itemCostGhs + serviceFee + localDelivery;

  const handleAddItem = () => {
    setItems([...items, { id: Date.now().toString(), product_link: '', cny_price: 0, quantity: 1, notes: '' }]);
  };

  const handleRemoveItem = (idToRemove: string) => {
    if (items.length === 1) return; // Must have at least one item
    setItems(items.filter(item => item.id !== idToRemove));
  };

  const updateItem = (id: string, field: string, value: any) => {
    setItems(items.map(item => item.id === id ? { ...item, [field]: value } : item));
  };

  return (
  return (
    <form action={action} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-6">
        <div className="space-y-6">
          {state?.error && (
            <div className="p-4 text-sm font-medium bg-destructive/10 text-destructive rounded-xl border border-destructive/20">
              {state.error}
            </div>
          )}

          {/* Hidden JSON representation of items to submit with the form */}
          <input type="hidden" name="items_json" value={JSON.stringify(items)} />

          <div className="space-y-6">
            {items.map((item, index) => (
              <div key={item.id} className="glass-panel p-6 md:p-8 space-y-6 relative border border-border/50">
                
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-bold text-lg text-primary flex items-center gap-2">
                    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/20 text-sm">
                      {index + 1}
                    </span>
                    Item Details
                  </h3>
                  {items.length > 1 && (
                    <button 
                      type="button" 
                      onClick={() => handleRemoveItem(item.id)}
                      className="text-destructive hover:bg-destructive/10 p-2 rounded-md transition-colors flex items-center gap-2 text-sm font-semibold"
                    >
                      <Trash2 className="w-4 h-4" /> Remove
                    </button>
                  )}
                </div>

                {/* Supplier Link */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold flex items-center gap-2">
                    <LinkIcon className="w-4 h-4 text-primary" />
                    Product Link (From 1688, Taobao, etc.) <span className="text-destructive">*</span>
                  </label>
                  <input 
                    type="url" 
                    value={item.product_link}
                    onChange={(e) => updateItem(item.id, 'product_link', e.target.value)}
                    placeholder="e.g., https://item.taobao.com/item.htm?id=..." 
                    required
                    className="flex h-11 w-full rounded-md border border-input bg-background/50 px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 transition-colors backdrop-blur-sm"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Item Price */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Item Price (in Chinese Yuan ¥) <span className="text-destructive">*</span></label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">¥</span>
                      <input 
                        type="number" 
                        step="0.01" 
                        min="0"
                        value={item.cny_price || ''}
                        placeholder="0.00" 
                        required
                        onChange={(e) => updateItem(item.id, 'cny_price', parseFloat(e.target.value) || 0)}
                        className="flex h-11 w-full rounded-md border border-input bg-background/50 pl-8 pr-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring transition-colors" 
                      />
                    </div>
                  </div>

                  {/* Quantity */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Quantity <span className="text-destructive">*</span></label>
                    <input 
                      type="number" 
                      min="1" 
                      value={item.quantity}
                      required 
                      onChange={(e) => updateItem(item.id, 'quantity', parseInt(e.target.value) || 1)}
                      className="flex h-11 w-full rounded-md border border-input bg-background/50 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring transition-colors" 
                    />
                  </div>
                </div>

                {/* Notes */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Notes (Size, Color, Voltage, etc.)</label>
                  <textarea 
                    rows={3} 
                    value={item.notes}
                    onChange={(e) => updateItem(item.id, 'notes', e.target.value)}
                    placeholder="e.g., Please ensure the seller includes original packaging, Size 42, Black color..."
                    className="flex w-full rounded-md border border-input bg-background/50 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring transition-colors resize-none"
                  />
                </div>

                {/* Image Upload for Item */}
                <div className="space-y-2 mt-4 pt-4 border-t border-border/50">
                  <label className="text-sm font-medium text-destructive flex items-center gap-2">
                    Item Screenshot (MANDATORY) *
                  </label>
                  <div className="relative border-2 border-dashed border-border/50 rounded-xl p-6 flex flex-col items-center justify-center bg-secondary/10 hover:bg-secondary/20 transition-colors cursor-pointer group">
                    <input 
                      type="file" 
                      name={`screenshot_${item.id}`}
                      accept="image/*" 
                      required 
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          const file = e.target.files[0];
                          setItemFileNames(prev => ({...prev, [item.id]: file.name}));
                        }
                      }}
                    />
                    <div className="p-3 bg-background rounded-full mb-3 group-hover:scale-110 transition-transform shadow-sm">
                      <UploadCloud className="w-5 h-5 text-primary" />
                    </div>
                    <p className="text-sm font-medium text-center">{itemFileNames[item.id] || "Click to browse or drag and drop"}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button 
            type="button" 
            onClick={handleAddItem}
            className="w-full border-2 border-dashed border-primary/50 text-primary hover:bg-primary/10 rounded-xl p-4 flex items-center justify-center gap-2 font-bold transition-colors"
          >
            <Plus className="w-5 h-5" /> Add Another Item
          </button>

          <div className="glass-panel p-6 md:p-8 space-y-6">
            {/* Shipping Mode */}
            <div className="space-y-3">
              <label className="text-sm font-medium">Shipping Mode <span className="text-destructive">*</span></label>
              <select name="shipping" required defaultValue="" className="flex h-12 w-full rounded-md border border-input bg-background/50 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring transition-colors appearance-none cursor-pointer">
                <option value="" disabled>Select a shipping mode</option>
                <option value="express">Air Express</option>
                <option value="normal">Air Normal</option>
                <option value="sea">Sea Freight</option>
              </select>
            </div>

            {/* Shipping Mode Information */}
            <div className="mt-6 pt-6 border-t border-border/50">
              <h3 className="font-bold mb-4 flex items-center gap-2">
                <Info className="w-4 h-4 text-primary" />
                Shipping Mode Details
              </h3>
              
              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between p-3 rounded-lg bg-orange-500/10 border border-orange-500/20">
                  <div className="flex items-center gap-2 font-semibold text-orange-500">
                    <Zap className="w-4 h-4" /> Air Express
                  </div>
                  <div className="text-right">
                    <div className="font-bold">3 days</div>
                    <div className="text-xs opacity-80">$44/kg</div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
                  <div className="flex items-center gap-2 font-semibold text-blue-500">
                    <Plane className="w-4 h-4" /> Air Normal
                  </div>
                  <div className="text-right">
                    <div className="font-bold">12 days</div>
                    <div className="text-xs opacity-80">$25/kg</div>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 rounded-lg bg-green-500/10 border border-green-500/20">
                  <div className="flex items-center gap-2 font-semibold text-green-500">
                    <Ship className="w-4 h-4" /> Sea Freight
                  </div>
                  <div className="text-right">
                    <div className="font-bold">50-60 days</div>
                    <div className="text-xs opacity-80">$250/CBM</div>
                  </div>
                </div>
              </div>

              <p className="text-xs text-muted-foreground mt-4 leading-relaxed">
                Exact shipping fee will be communicated via WhatsApp after your item has been purchased and is ready to ship. Rates above are estimates.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {/* Live Cost Summary */}
        <div className="glass-panel overflow-hidden sticky top-24">
          <div className="bg-primary/10 p-4 border-b border-border/50 flex items-center gap-2">
            <Calculator className="w-5 h-5 text-primary" />
            <h3 className="font-bold">Live Cost Summary</h3>
          </div>
          
          <div className="p-5 space-y-4">
            <div className="bg-secondary/30 p-3 rounded-lg border border-border/50 text-xs">
              <p className="font-semibold mb-1">Using Platform Rate: 1 GHS = {exchangeRate.toFixed(4)} CNY</p>
              <p className="text-muted-foreground">The exchange rates used on C2G reflect the actual rates applied in mainland China, not the rates shown on Google.</p>
            </div>

            <div className="space-y-3 pt-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Item Cost (GHS)</span>
                <span className="font-medium">₵{itemCostGhs.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Service Fee</span>
                <span className="font-medium">₵{serviceFee.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Local Delivery</span>
                <span className="font-medium">₵{localDelivery.toFixed(2)}</span>
              </div>
            </div>

            <div className="border-t border-border/50 pt-4 mt-2">
              <div className="flex justify-between">
                <span className="font-bold">Total Estimated Cost</span>
                <span className="font-bold text-primary text-lg">₵{totalGhs.toFixed(2)}</span>
              </div>
              <p className="text-[10px] text-muted-foreground text-right mt-1">(Excl. Shipping)</p>
            </div>

            <div className="mt-4 text-xs text-center text-muted-foreground flex items-start gap-2 bg-background p-3 rounded-lg">
              <Info className="w-4 h-4 shrink-0 text-blue-500" />
              <p className="text-left leading-tight">Shipping fees are calculated separately and will be updated in your dashboard.</p>
            </div>
            <div className="mt-6 flex flex-col gap-3">
              <button 
                type="submit" 
                disabled={isPending}
                className="w-full inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-bold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring bg-primary text-primary-foreground hover:bg-primary/90 hover:scale-[1.02] h-12 shadow-lg shadow-primary/25 disabled:opacity-50 disabled:pointer-events-none"
              >
                {isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  "Proceed to Payment"
                )}
              </button>
              <Link href="/dashboard/orders" className="w-full inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring border border-input bg-background hover:bg-accent hover:text-accent-foreground h-12">
                Cancel
              </Link>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
