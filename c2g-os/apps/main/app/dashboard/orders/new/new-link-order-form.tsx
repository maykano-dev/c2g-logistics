"use client";

import { LinkIcon, Info, Calculator, Loader2, Plus, Trash2, Camera, ChevronDown } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { createLinkOrder, payLinkOrder } from "../actions";
import { useRouter } from "next/navigation";
import { useModal } from "@/components/providers/modal-provider";
import WalletPaymentModal from "@/components/wallet/wallet-payment-modal";

export function NewLinkOrderForm({ 
  exchangeRate, 
  serviceFeePercentage, 
  minServiceFee,
  localDeliveryPercentage,
  minLocalDeliveryFee,
  walletBalance = 0
}: { 
  exchangeRate: number, 
  serviceFeePercentage: number, 
  minServiceFee: number,
  localDeliveryPercentage: number,
  minLocalDeliveryFee: number,
  walletBalance?: number
}) {
  const router = useRouter();
  const { showConfirm } = useModal();
  
  // Multi-item State
  const [items, setItems] = useState([
    { id: 'item_1', product_link: '', cny_price: 0, quantity: 1, notes: '' }
  ]);
  
  const [itemFileNames, setItemFileNames] = useState<Record<string, string>>({});
  const [itemPreviews, setItemPreviews] = useState<Record<string, string>>({});
  const [itemFiles, setItemFiles] = useState<Record<string, File>>({}); // raw File objects for client-side compression
  
  const [isPending, setIsPending] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [isModalProcessing, setIsModalProcessing] = useState(false);
  const [createdOrderId, setCreatedOrderId] = useState<string | null>(null);
  
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Compress image in-browser using Canvas before sending to server (~80% quality, max 1920px)
  const compressImageFile = (file: File): Promise<File> =>
    new Promise((resolve) => {
      const img = new Image();
      const objUrl = URL.createObjectURL(file);
      img.onload = () => {
        URL.revokeObjectURL(objUrl);
        const MAX = 1920;
        let { width, height } = img;
        if (width > MAX) { height = Math.round(height * MAX / width); width = MAX; }
        else if (height > MAX) { width = Math.round(width * MAX / height); height = MAX; }
        const canvas = document.createElement('canvas');
        canvas.width = width; canvas.height = height;
        canvas.getContext('2d')!.drawImage(img, 0, 0, width, height);
        canvas.toBlob(
          (blob) => resolve(blob
            ? new File([blob], file.name.replace(/\.[^.]+$/, '.jpg'), { type: 'image/jpeg' })
            : file),
          'image/jpeg', 0.82
        );
      };
      img.onerror = () => { URL.revokeObjectURL(objUrl); resolve(file); };
      img.src = objUrl;
    });

  // Handled entirely manually now



  // Calculations
  const itemCostCny = items.reduce((sum, item) => sum + (item.cny_price * item.quantity), 0);
  const itemCostGhs = itemCostCny / exchangeRate;
  
  const calculatedServiceFee = itemCostGhs * (serviceFeePercentage / 100);
  const serviceFee = Math.max(calculatedServiceFee, minServiceFee);
  
  const calculatedLocalDelivery = itemCostGhs * (localDeliveryPercentage / 100);
  const localDelivery = Math.max(calculatedLocalDelivery, minLocalDeliveryFee); 
  
  const totalGhs = itemCostGhs + serviceFee + localDelivery;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};
    let hasError = false;

    items.forEach((item) => {
      if (!item.product_link) { 
        newErrors[`link_${item.id}`] = "Product link is required"; 
        hasError = true; 
      } else {
        try {
          const url = new URL(item.product_link);
          if (url.protocol !== 'http:' && url.protocol !== 'https:') {
            throw new Error('Invalid protocol');
          }
        } catch {
          newErrors[`link_${item.id}`] = "Please enter a valid URL (e.g., https://example.com)";
          hasError = true;
        }
      }
      if (!item.cny_price || item.cny_price <= 0) { newErrors[`price_${item.id}`] = "Price must be greater than 0"; hasError = true; }
      if (!item.quantity || item.quantity <= 0) { newErrors[`qty_${item.id}`] = "Quantity must be at least 1"; hasError = true; }
      if (!itemFileNames[item.id]) { newErrors[`screenshot_${item.id}`] = "Image is required for this item"; hasError = true; }
    });

    if (totalGhs <= 0) {
      newErrors['total'] = "Total cost must be greater than 0 to initialize payment";
      hasError = true;
    }

    if (hasError) {
      setErrors(newErrors);
      setTimeout(() => {
        const firstError = document.querySelector('.error-highlight');
        if (firstError) firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 100);
      return;
    }

    setErrors({});

    // Build FormData manually so we can compress images client-side first
    const formData = new FormData(e.currentTarget);

    // Replace each file entry with a compressed version
    for (const item of items) {
      const file = itemFiles[item.id];
      if (file) {
        const compressed = await compressImageFile(file);
        formData.set(`screenshot_${item.id}`, compressed, compressed.name);
      }
    }

    setIsPending(true);
    setSubmitError(null);
    const res = await createLinkOrder(null, formData);
    if (res.success && res.orderId) {
      setCreatedOrderId(res.orderId);
      setIsPending(false);
      setIsSubmitModalOpen(true);
    } else {
      setSubmitError(res.error || 'Failed to create order');
      setIsPending(false);
    }
  };

  const handleAddItem = () => {
    if (items.length >= 10) return; // max 10 items per order
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

      const newFiles = {...itemFiles};
      delete newFiles[idToRemove];
      setItemFiles(newFiles);
      
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
    <>
      <form onSubmit={handleSubmit} noValidate className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-6">
        <div className="space-y-6">
          {submitError && (
            <div className="p-4 text-sm font-medium bg-red-100 border border-red-200 shadow-sm text-red-600 rounded-xl border border-destructive/20">
              {submitError}
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
                    Product Link (From 1688, Taobao, etc.) <span className="text-red-600">*</span>
                  </label>
                  <input 
                    type="url" 
                    value={item.product_link}
                    onChange={(e) => {
                      let val = e.target.value;
                      // Auto-extract clean URL from messy pasted text (like Taobao share blocks)
                      const urlMatch = val.match(/(https?:\/\/[a-zA-Z0-9-._~:/?#[\]@!$&'()*+,;=%]+)/);
                      if (urlMatch && urlMatch[1] && val.length > urlMatch[1].length) {
                        val = urlMatch[1];
                      }
                      updateItem(item.id, 'product_link', val);
                      if (errors[`link_${item.id}`]) {
                        setErrors(prev => {
                          const newErrors = { ...prev };
                          delete newErrors[`link_${item.id}`];
                          return newErrors;
                        });
                      }
                    }}
                    placeholder="e.g., https://item.taobao.com/item.htm?id=..." 
                    className={`flex h-11 w-full rounded-md border bg-background/50 px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 transition-colors backdrop-blur-sm ${
                      errors[`link_${item.id}`] ? 'border-red-500 bg-red-500/5 error-highlight' : 'border-input'
                    }`}
                  />
                  {errors[`link_${item.id}`] && (
                    <p className="text-red-600 text-sm font-bold mt-1 bg-red-100 border border-red-200 shadow-sm px-2 py-1 rounded w-max">{errors[`link_${item.id}`]}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Item Price */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Item Price (in Chinese Yuan ¥) <span className="text-red-600">*</span></label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">¥</span>
                      <input 
                        type="text"
                        inputMode="decimal"
                        value={item.cny_price || ''}
                        placeholder="0.00" 
                        onChange={(e) => {
                          const val = e.target.value.replace(/[^0-9.]/g, '');
                          updateItem(item.id, 'cny_price', parseFloat(val) || 0);
                          if (errors[`price_${item.id}`]) {
                            setErrors(prev => {
                              const newErrors = { ...prev };
                              delete newErrors[`price_${item.id}`];
                              delete newErrors['total'];
                              return newErrors;
                            });
                          }
                        }}
                        className={`flex h-11 w-full rounded-md border bg-background/50 pl-8 pr-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring transition-colors ${
                           errors[`price_${item.id}`] ? 'border-red-500 bg-red-500/5 error-highlight' : 'border-input'
                         }`} 
                      />
                    </div>
                    {errors[`price_${item.id}`] && (
                      <p className="text-red-600 text-sm font-bold mt-1 bg-red-100 border border-red-200 shadow-sm px-2 py-1 rounded w-max">{errors[`price_${item.id}`]}</p>
                    )}
                  </div>

                  {/* Quantity */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Quantity <span className="text-red-600">*</span></label>
                    <input 
                      type="text"
                      inputMode="numeric"
                      value={item.quantity}
                      placeholder="1"
                      onChange={(e) => {
                        const val = e.target.value.replace(/[^0-9]/g, '');
                        updateItem(item.id, 'quantity', parseInt(val) || 1);
                        if (errors[`qty_${item.id}`]) {
                          setErrors(prev => {
                            const newErrors = { ...prev };
                            delete newErrors[`qty_${item.id}`];
                            delete newErrors['total'];
                            return newErrors;
                          });
                        }
                      }}
                      className={`flex h-11 w-full rounded-md border bg-background/50 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring transition-colors ${
                        errors[`qty_${item.id}`] ? 'border-red-500 bg-red-500/5 error-highlight' : 'border-input'
                      }`} 
                    />
                    {errors[`qty_${item.id}`] && (
                      <p className="text-red-600 text-sm font-bold mt-1 bg-red-100 border border-red-200 shadow-sm px-2 py-1 rounded w-max">{errors[`qty_${item.id}`]}</p>
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
                <div className={`mt-6 pt-6 border-t border-border/50 space-y-2 ${errors[`screenshot_${item.id}`] ? 'error-highlight' : ''}`}>
                  <label className="text-sm font-semibold flex items-center gap-1.5">
                    Item Image <span className="text-amber-500">(MANDATORY) *</span>
                  </label>

                  {/* Full-width card — same design as package registration */}
                  <div className={`rounded-2xl overflow-hidden border-2 ${errors[`screenshot_${item.id}`] ? 'border-red-500' : 'border-border/50'} bg-secondary/10`}>
                    <div className="relative w-full aspect-video sm:aspect-auto sm:h-44 bg-black/30 overflow-hidden group cursor-pointer select-none">
                      {itemPreviews[item.id] ? (
                        <>
                          <img
                            src={itemPreviews[item.id]}
                            alt="Item preview"
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                          />
                          {/* Tap-to-change overlay */}
                          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 group-active:opacity-100 transition-opacity duration-200 flex flex-col items-center justify-center gap-2">
                            <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                              <Camera className="w-6 h-6 text-white" />
                            </div>
                            <span className="text-white text-sm font-bold tracking-wide">Change Photo</span>
                          </div>
                          {/* Photo added pill */}
                          <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-sm text-white text-[11px] font-semibold px-3 py-1 rounded-full flex items-center gap-1.5">
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                            Photo added
                          </div>
                          {/* Item label */}
                          <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-sm text-white text-[11px] font-bold px-2.5 py-1 rounded-full">
                            Item {index + 1}
                          </div>
                        </>
                      ) : (
                        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                          <div className={`w-16 h-16 rounded-full flex items-center justify-center border-2 border-dashed ${errors[`screenshot_${item.id}`] ? 'bg-red-500/10 border-red-400/60' : 'bg-primary/10 border-primary/40'}`}>
                            <Camera className={`w-7 h-7 ${errors[`screenshot_${item.id}`] ? 'text-red-400' : 'text-primary/60'}`} />
                          </div>
                          <div className="text-center px-4">
                            <p className={`text-sm font-semibold ${errors[`screenshot_${item.id}`] ? 'text-red-500' : 'text-foreground/80'}`}>Tap to add item photo</p>
                            <p className="text-xs text-muted-foreground mt-0.5">Item {index + 1} · JPEG, PNG or WebP</p>
                          </div>
                        </div>
                      )}
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
                            setItemFiles(prev => ({...prev, [item.id]: file}));
                            if (errors[`screenshot_${item.id}`]) setErrors(prev => ({...prev, [`screenshot_${item.id}`]: ''}));
                          }
                        }}
                      />
                    </div>
                  </div>

                  {errors[`screenshot_${item.id}`] && (
                    <p className="text-red-600 text-sm font-bold mt-1 bg-red-100 border border-red-200 shadow-sm px-2 py-1 rounded w-max">{errors[`screenshot_${item.id}`]}</p>
                  )}
                </div>
              </div>
            ))}
          </div>

          <button 
            type="button" 
            onClick={handleAddItem}
            disabled={items.length >= 10}
            className="w-full border-2 border-dashed border-primary/50 text-primary hover:bg-primary/10 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent rounded-xl p-4 flex items-center justify-center gap-2 font-bold transition-colors"
          >
            <Plus className="w-5 h-5" />
            {items.length >= 10 ? 'Max 10 items reached' : `Add Another Item (${items.length}/10)`}
          </button>

          <div className="glass-panel p-6 md:p-8 space-y-6">
            {/* Shipping Method Information */}
            <div>
              <h3 className="font-bold mb-4 flex items-center gap-2">
                <Info className="w-4 h-4 text-primary" />
                Shipping Method
              </h3>
              
              <div className="space-y-3 text-sm">
                <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-700 dark:text-blue-400">
                  <p className="leading-relaxed">
                    You don't need to choose a shipping method now. Once your items arrive at our China warehouse, you'll be able to choose Air Normal, Air Express, or Sea Shipping from the <strong>Reservations</strong> page before your goods are shipped to Ghana.
                  </p>
                </div>
              </div>
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
              <p className="text-red-600 text-sm font-bold bg-red-100 border border-red-200 shadow-sm px-3 py-2 rounded-md mb-2">{errors['total']}</p>
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
                <div className="bg-red-100 border border-red-200 shadow-sm border border-destructive/20 p-3 rounded-lg flex items-center gap-2 text-red-600">
                  <Info className="w-4 h-4 shrink-0" />
                  <p className="text-sm font-bold leading-tight">{errors['total']}</p>
                </div>
              )}
              <button 
                type="submit" 
                disabled={isPending || Object.keys(errors).length > 0}
                className="w-full inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-bold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring bg-primary text-primary-foreground hover:bg-primary/90 hover:scale-[1.02] h-12 shadow-lg shadow-primary/25 disabled:opacity-50 disabled:pointer-events-none"
              >
                {isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Saving Order...
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
    
    <WalletPaymentModal
      isOpen={isSubmitModalOpen}
      onClose={() => {
        setIsSubmitModalOpen(false);
        if (createdOrderId) router.push('/dashboard/orders');
      }}
      onConfirm={async () => {
        if (!createdOrderId) return;
        setIsModalProcessing(true);
        try {
          const payRes = await payLinkOrder(createdOrderId);
          if (!payRes.success) throw new Error(payRes.error);
        } finally {
          setIsModalProcessing(false);
        }
      }}
      amount={totalGhs}
      walletBalance={walletBalance}
      itemName={`Link Order (${items.length} item${items.length !== 1 ? 's' : ''})`}
      isProcessing={isModalProcessing}
      onSuccessRedirect={() => router.push('/dashboard/orders')}
      secondaryAction={{
        label: "Save & Pay Later",
        onClick: () => {
          setIsModalProcessing(true);
          if (createdOrderId) router.push('/dashboard/orders');
        }
      }}
    />
  </>);
}
