"use client";

import { LinkIcon, UploadCloud, Info, Calculator, Ship, Plane, Zap, Loader2, Plus, Trash2, ImageIcon, ChevronDown } from "lucide-react";
import Link from "next/link";
import { useState, useActionState, useEffect, startTransition } from "react";
import { createLinkOrder } from "../actions";
import { useRouter } from "next/navigation";
import { useModal } from "@/components/providers/modal-provider";

export function NewLinkOrderForm({ 
  exchangeRate, 
  serviceFeePercentage, 
  minServiceFee,
  localDeliveryPercentage,
  minLocalDeliveryFee 
}: { 
  exchangeRate: number, 
  serviceFeePercentage: number, 
  minServiceFee: number,
  localDeliveryPercentage: number,
  minLocalDeliveryFee: number 
}) {
  const router = useRouter();
  const { showConfirm } = useModal();
  
  // Multi-item State
  const [items, setItems] = useState([
    { id: 'item_1', product_link: '', cny_price: 0, quantity: 1, notes: '' }
  ]);
  
  const [itemFileNames, setItemFileNames] = useState<Record<string, string>>({});
  const [itemPreviews, setItemPreviews] = useState<Record<string, string>>({});
  const [shippingMode, setShippingMode] = useState<string>('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  const [state, action, isPending] = useActionState(createLinkOrder, null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (state?.success && state?.redirectUrl) {
      router.push(state.redirectUrl);
    }
  }, [state, router]);

  // Calculations
  const itemCostCny = items.reduce((sum, item) => sum + (item.cny_price * item.quantity), 0);
  const itemCostGhs = itemCostCny / exchangeRate;
  
  const calculatedServiceFee = itemCostGhs * (serviceFeePercentage / 100);
  const serviceFee = Math.max(calculatedServiceFee, minServiceFee);
  
  const calculatedLocalDelivery = itemCostGhs * (localDeliveryPercentage / 100);
  const localDelivery = Math.max(calculatedLocalDelivery, minLocalDeliveryFee); 
  
  const totalGhs = itemCostGhs + serviceFee + localDelivery;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};
    let hasError = false;

    items.forEach((item, index) => {
      if (!item.product_link) { newErrors[`link_${item.id}`] = "Product link is required"; hasError = true; }
      if (!item.cny_price || item.cny_price <= 0) { newErrors[`price_${item.id}`] = "Price must be greater than 0"; hasError = true; }
      if (!item.quantity || item.quantity <= 0) { newErrors[`qty_${item.id}`] = "Quantity must be at least 1"; hasError = true; }
      if (!itemFileNames[item.id]) { newErrors[`screenshot_${item.id}`] = "Screenshot is mandatory for this item"; hasError = true; }
    });

    if (!shippingMode) { newErrors['shipping'] = "Please select a shipping mode"; hasError = true; }

    if (totalGhs <= 0) {
      newErrors['total'] = "Total cost must be greater than 0 to initialize payment";
      hasError = true;
    }

    if (hasError) {
      setErrors(newErrors);
      return;
    }
    
    setErrors({});
    
    // Create FormData from the form and trigger action
    const formData = new FormData(e.currentTarget);
    startTransition(() => {
      action(formData);
    });
  };

  const handleAddItem = () => {
    setItems([...items, { id: Date.now().toString(), product_link: '', cny_price: 0, quantity: 1, notes: '' }]);
  };

  const handleRemoveItem = async (idToRemove: string) => {
    if (items.length === 1) return; // Must have at least one item
    const confirmed = await showConfirm({
      title: "Remove Item",
      message: "Are you sure you want to remove this item?",
      type: "danger",
      confirmText: "Remove"
    });
    
    if (confirmed) {
      setItems(items.filter(item => item.id !== idToRemove));
      
      const newNames = {...itemFileNames};
      delete newNames[idToRemove];
      setItemFileNames(newNames);
      
      const newPreviews = {...itemPreviews};
      delete newPreviews[idToRemove];
      setItemPreviews(newPreviews);
      
      const newErrors = {...errors};
      delete newErrors[`link_${idToRemove}`];
      delete newErrors[`price_${idToRemove}`];
      delete newErrors[`qty_${idToRemove}`];
      delete newErrors[`screenshot_${idToRemove}`];
      setErrors(newErrors);
    }
  };

  const updateItem = (id: string, field: string, value: any) => {
    setItems(items.map(item => item.id === id ? { ...item, [field]: value } : item));
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="grid grid-cols-1 lg:grid-cols-3 gap-8">
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
                      className="text-red-500 hover:bg-red-500/10 p-2 rounded-md transition-colors flex items-center gap-2 text-sm font-semibold"
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
                    onChange={(e) => {
                      updateItem(item.id, 'product_link', e.target.value);
                      if (errors[`link_${item.id}`]) setErrors(prev => ({...prev, [`link_${item.id}`]: ''}));
                    }}
                    placeholder="e.g., https://item.taobao.com/item.htm?id=..." 
                    className={`flex h-11 w-full rounded-md border bg-background/50 px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 transition-colors backdrop-blur-sm ${
                      errors[`link_${item.id}`] ? 'border-destructive bg-destructive/5' : 'border-input'
                    }`}
                  />
                  {errors[`link_${item.id}`] && (
                    <p className="text-destructive text-sm font-bold mt-1 bg-destructive/10 px-2 py-1 rounded w-max">{errors[`link_${item.id}`]}</p>
                  )}
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
                        onChange={(e) => {
                          updateItem(item.id, 'cny_price', parseFloat(e.target.value) || 0);
                          if (errors[`price_${item.id}`]) setErrors(prev => ({...prev, [`price_${item.id}`]: ''}));
                        }}
                        className={`flex h-11 w-full rounded-md border bg-background/50 pl-8 pr-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring transition-colors ${
                          errors[`price_${item.id}`] ? 'border-destructive bg-destructive/5' : 'border-input'
                        }`} 
                      />
                    </div>
                    {errors[`price_${item.id}`] && (
                      <p className="text-destructive text-sm font-bold mt-1 bg-destructive/10 px-2 py-1 rounded w-max">{errors[`price_${item.id}`]}</p>
                    )}
                  </div>

                  {/* Quantity */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Quantity <span className="text-destructive">*</span></label>
                    <input 
                      type="number" 
                      min="1" 
                      value={item.quantity}
                      onChange={(e) => {
                        updateItem(item.id, 'quantity', parseInt(e.target.value) || 1);
                        if (errors[`qty_${item.id}`]) setErrors(prev => ({...prev, [`qty_${item.id}`]: ''}));
                      }}
                      className={`flex h-11 w-full rounded-md border bg-background/50 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring transition-colors ${
                        errors[`qty_${item.id}`] ? 'border-destructive bg-destructive/5' : 'border-input'
                      }`} 
                    />
                    {errors[`qty_${item.id}`] && (
                      <p className="text-destructive text-sm font-bold mt-1 bg-destructive/10 px-2 py-1 rounded w-max">{errors[`qty_${item.id}`]}</p>
                    )}
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
                <div className="space-y-3 mt-6 pt-6 border-t border-border/50">
                  <label className="text-sm font-semibold flex items-center gap-2">
                    Item Screenshot <span className="text-amber-500">(MANDATORY) *</span>
                  </label>
                  <div className="grid grid-cols-2 gap-4 h-32">
                    {/* Upload Side */}
                    <div className={`relative border-2 border-dashed rounded-xl p-4 flex flex-col items-center justify-center bg-secondary/10 hover:bg-secondary/20 transition-colors cursor-pointer group h-full ${
                      errors[`screenshot_${item.id}`] ? 'border-destructive bg-destructive/5' : 'border-border/50'
                    }`}>
                      <input 
                        type="file" 
                        name={`screenshot_${item.id}`}
                        accept="image/*" 
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                        onChange={(e) => {
                          if (e.target.files && e.target.files[0]) {
                            const file = e.target.files[0];
                            setItemFileNames(prev => ({...prev, [item.id]: file.name}));
                            setItemPreviews(prev => ({...prev, [item.id]: URL.createObjectURL(file)}));
                            if (errors[`screenshot_${item.id}`]) setErrors(prev => ({...prev, [`screenshot_${item.id}`]: ''}));
                          }
                        }}
                      />
                      <div className="p-3 bg-background rounded-full mb-2 group-hover:scale-110 transition-transform shadow-sm">
                        <UploadCloud className={`w-5 h-5 ${errors[`screenshot_${item.id}`] ? 'text-destructive' : 'text-primary'}`} />
                      </div>
                      <p className="text-xs font-medium text-center text-muted-foreground px-2 line-clamp-1">
                        {itemFileNames[item.id] || "Click to browse"}
                      </p>
                    </div>

                    {/* Preview Side */}
                    <div className="border border-border/50 rounded-xl flex items-center justify-center bg-black/20 h-full overflow-hidden relative">
                      {itemPreviews[item.id] ? (
                        <img src={itemPreviews[item.id]} alt="Preview" className="w-full h-full object-cover" />
                      ) : (
                        <div className="flex flex-col items-center justify-center text-muted-foreground/50">
                          <ImageIcon className="w-8 h-8 mb-1 opacity-50" />
                          <span className="text-[10px] uppercase font-bold tracking-wider">Preview</span>
                        </div>
                      )}
                    </div>
                  </div>
                  {errors[`screenshot_${item.id}`] && (
                    <p className="text-destructive text-sm font-bold mt-2 bg-destructive/10 px-2 py-1 rounded w-max inline-block">{errors[`screenshot_${item.id}`]}</p>
                  )}
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
            <div className="space-y-3 relative">
              <label className="text-sm font-medium">Shipping Mode <span className="text-destructive">*</span></label>
              <input type="hidden" name="shipping" value={shippingMode} />
              
              <button 
                  type="button"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className={`flex items-center justify-between h-12 w-full rounded-md border bg-background/50 px-4 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring transition-colors cursor-pointer shadow-sm hover:bg-secondary/20 ${
                    errors['shipping'] ? 'border-destructive bg-destructive/5' : 'border-input'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {shippingMode === 'express' ? <><Zap className="w-4 h-4 text-orange-500" /> Air Express</> : 
                     shippingMode === 'normal' ? <><Plane className="w-4 h-4 text-blue-500" /> Air Normal</> : 
                     shippingMode === 'sea' ? <><Ship className="w-4 h-4 text-green-500" /> Sea Freight</> : 
                     <span className="text-muted-foreground">Select a shipping mode</span>}
                  </div>
                  <ChevronDown className="w-4 h-4 opacity-50" />
                </button>
                {errors['shipping'] && (
                  <p className="text-destructive text-sm font-bold mt-1 bg-destructive/10 px-2 py-1 rounded w-max">{errors['shipping']}</p>
                )}

                {isDropdownOpen && (
                  <div className="absolute top-[72px] left-0 right-0 bg-background border border-border rounded-xl shadow-2xl overflow-hidden z-[100] animate-in fade-in zoom-in-95 duration-100">
                    <button 
                      type="button"
                      onClick={() => { 
                        setShippingMode('express'); 
                        setIsDropdownOpen(false); 
                        if (errors['shipping']) setErrors(prev => ({...prev, shipping: ''}));
                      }}
                      className="w-full text-left px-4 py-3 text-sm hover:bg-secondary/50 flex items-center gap-3 border-b border-border/50"
                    >
                      <Zap className="w-5 h-5 text-orange-500" />
                      <div>
                        <div className="font-semibold text-orange-500">Air Express</div>
                        <div className="text-xs text-muted-foreground">3 Days • $44/kg</div>
                      </div>
                    </button>
                    <button 
                      type="button"
                      onClick={() => { 
                        setShippingMode('normal'); 
                        setIsDropdownOpen(false); 
                        if (errors['shipping']) setErrors(prev => ({...prev, shipping: ''}));
                      }}
                      className="w-full text-left px-4 py-3 text-sm hover:bg-secondary/50 flex items-center gap-3 border-b border-border/50"
                    >
                      <Plane className="w-5 h-5 text-blue-500" />
                      <div>
                        <div className="font-semibold text-blue-500">Air Normal</div>
                        <div className="text-xs text-muted-foreground">12 Days • $25/kg</div>
                      </div>
                    </button>
                    <button 
                      type="button"
                      onClick={() => { setShippingMode('sea'); setIsDropdownOpen(false); }}
                      className="w-full text-left px-4 py-3 text-sm hover:bg-secondary/50 flex items-center gap-3"
                    >
                      <Ship className="w-5 h-5 text-green-500" />
                      <div>
                        <div className="font-semibold text-green-500">Sea Freight</div>
                        <div className="text-xs text-muted-foreground">50-60 Days • $250/CBM</div>
                      </div>
                    </button>
                  </div>
                )}
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
                The shipping fee will be invoiced to your dashboard once the item gets to Ghana. Rates above are estimates.
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
            {errors['total'] && (
              <p className="text-destructive text-sm font-bold bg-destructive/10 px-3 py-2 rounded-md mb-2">{errors['total']}</p>
            )}
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
              <p className="text-left leading-tight font-bold">The shipping fee will be invoiced once the items get to Ghana.</p>
            </div>
            <div className="mt-6 flex flex-col gap-3">
              {errors['total'] && (
                <div className="bg-destructive/10 border border-destructive/20 p-3 rounded-lg flex items-center gap-2 text-destructive">
                  <Info className="w-4 h-4 shrink-0" />
                  <p className="text-sm font-bold leading-tight">{errors['total']}</p>
                </div>
              )}
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
