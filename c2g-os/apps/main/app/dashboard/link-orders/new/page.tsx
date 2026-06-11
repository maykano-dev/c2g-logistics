"use client";

import { LinkIcon, UploadCloud, Info, Calculator, Ship, Plane, PlaneTakeoff, Zap } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function NewLinkOrderPage() {
  const [price, setPrice] = useState<number>(0);
  const [quantity, setQuantity] = useState<number>(1);
  
  // Example dummy logic for Live Cost Summary
  const exchangeRate = 0.5200; // 1 GHS = 0.5200 CNY
  const itemCostCny = price * quantity;
  const itemCostGhs = itemCostCny / exchangeRate;
  const serviceFee = itemCostGhs * 0.05; // 5% fee example
  const localDelivery = 0; // Assume 0 for this estimate
  const totalGhs = itemCostGhs + serviceFee + localDelivery;

  return (
    <div className="space-y-8 animate-fade-in max-w-5xl mx-auto">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Link href="/dashboard/link-orders" className="text-sm text-muted-foreground hover:text-primary transition-colors">
            Link Orders
          </Link>
          <span className="text-muted-foreground">/</span>
          <span className="text-sm font-medium">New Request</span>
        </div>
        <h1 className="text-3xl font-bold tracking-tight">Place a New Link Order</h1>
        <p className="text-muted-foreground mt-1">Found a product on a Chinese site? We'll buy it and ship it to you.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <form className="glass-panel p-6 md:p-8 space-y-6">
            {/* Supplier Link */}
            <div className="space-y-2">
              <label className="text-sm font-semibold flex items-center gap-2">
                <LinkIcon className="w-4 h-4 text-primary" />
                Product Link (From 1688, Taobao, etc.) <span className="text-destructive">*</span>
              </label>
              <input 
                type="url" 
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
                    placeholder="0.00" 
                    required
                    onChange={(e) => setPrice(parseFloat(e.target.value) || 0)}
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
                  defaultValue="1" 
                  required 
                  onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                  className="flex h-11 w-full rounded-md border border-input bg-background/50 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring transition-colors" 
                />
              </div>
            </div>

            {/* Notes */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Notes (Size, Color, Voltage, etc.)</label>
              <textarea 
                rows={3} 
                placeholder="e.g., Please ensure the seller includes original packaging, Size 42, Black color..."
                className="flex w-full rounded-md border border-input bg-background/50 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring transition-colors resize-none"
              />
            </div>

            {/* Shipping Mode */}
            <div className="space-y-3">
              <label className="text-sm font-medium">Shipping Mode <span className="text-destructive">*</span></label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <label className="relative flex cursor-pointer rounded-xl border border-input bg-background/50 p-4 hover:bg-accent hover:text-accent-foreground has-[:checked]:border-primary has-[:checked]:bg-primary/5">
                  <input type="radio" name="shipping" value="express" className="peer sr-only" required />
                  <div className="flex flex-col gap-1 w-full text-center items-center">
                    <Zap className="w-6 h-6 text-orange-500 mb-1" />
                    <span className="font-semibold text-sm">Air Express</span>
                  </div>
                </label>
                <label className="relative flex cursor-pointer rounded-xl border border-input bg-background/50 p-4 hover:bg-accent hover:text-accent-foreground has-[:checked]:border-primary has-[:checked]:bg-primary/5">
                  <input type="radio" name="shipping" value="normal" className="peer sr-only" required />
                  <div className="flex flex-col gap-1 w-full text-center items-center">
                    <Plane className="w-6 h-6 text-blue-500 mb-1" />
                    <span className="font-semibold text-sm">Air Normal</span>
                  </div>
                </label>
                <label className="relative flex cursor-pointer rounded-xl border border-input bg-background/50 p-4 hover:bg-accent hover:text-accent-foreground has-[:checked]:border-primary has-[:checked]:bg-primary/5">
                  <input type="radio" name="shipping" value="sea" className="peer sr-only" required />
                  <div className="flex flex-col gap-1 w-full text-center items-center">
                    <Ship className="w-6 h-6 text-green-500 mb-1" />
                    <span className="font-semibold text-sm">Sea Freight</span>
                  </div>
                </label>
              </div>
            </div>

            {/* Image Upload */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-destructive flex items-center gap-2">
                Item Screenshot (MANDATORY) *
              </label>
              <div className="border-2 border-dashed border-border/50 rounded-xl p-8 flex flex-col items-center justify-center bg-secondary/10 hover:bg-secondary/20 transition-colors cursor-pointer group">
                <div className="p-3 bg-background rounded-full mb-3 group-hover:scale-110 transition-transform shadow-sm">
                  <UploadCloud className="w-6 h-6 text-primary" />
                </div>
                <p className="text-sm font-medium">Click to browse or drag and drop</p>
                <p className="text-xs text-muted-foreground mt-1">SVG, PNG, JPG or GIF</p>
              </div>
            </div>

            <div className="pt-4 border-t border-border/50 flex justify-end gap-3">
              <button type="button" className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring border border-input bg-background hover:bg-accent hover:text-accent-foreground h-11 px-8">
                Cancel
              </button>
              <button type="button" className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring bg-primary text-primary-foreground hover:bg-primary/90 hover:scale-[1.02] h-11 px-8 shadow-lg shadow-primary/25">
                Submit Request
              </button>
            </div>
          </form>
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
            </div>
          </div>

          {/* Shipping Mode Information */}
          <div className="glass-panel p-5">
            <h3 className="font-bold mb-4 flex items-center gap-2">
              <Info className="w-4 h-4 text-primary" />
              Shipping Mode Information
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
  );
}
