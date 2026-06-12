'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { addImporterProduct } from '../actions';
import { Loader2, Calculator, ArrowRight, PackagePlus } from 'lucide-react';

export default function NewProductClient({ exchangeRate }: { exchangeRate: number }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Auto-calculation state
  const [costYuan, setCostYuan] = useState<number>(0);
  const [sellingGhs, setSellingGhs] = useState<number>(0);

  const costGhs = costYuan * exchangeRate;
  const profitGhs = sellingGhs - costGhs;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    formData.append('costPriceCny', costYuan.toString());
    formData.append('sellingPriceGhs', sellingGhs.toString());

    const res = await addImporterProduct(formData);

    if (res.success) {
      router.push('/importer-dashboard/products?success=true&code=' + res.productCode);
    } else {
      setError(res.error || 'Failed to add product');
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in pb-24 md:pb-0">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
          <PackagePlus className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Add New Product</h1>
          <p className="text-muted-foreground text-sm">Upload a product from China to your store.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form Column */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="glass-panel p-6 sm:p-8 space-y-6">
            
            {error && (
              <div className="p-4 rounded-xl bg-destructive/10 text-destructive border border-destructive/30 text-sm">
                {error}
              </div>
            )}

            <div className="space-y-4">
              <h3 className="font-bold border-b border-border/50 pb-2">Product Details</h3>
              
              <div className="space-y-2">
                <label className="text-sm font-semibold">Product Name <span className="text-destructive">*</span></label>
                <input 
                  name="name"
                  type="text" 
                  required
                  className="w-full flex h-11 rounded-xl border border-input bg-background/50 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary transition-all" 
                  placeholder="e.g. Xiaomi Air Fryer 4L"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-semibold">Category</label>
                  <select name="category" className="w-full flex h-11 rounded-xl border border-input bg-background/50 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary transition-all">
                    <option value="electronics">Electronics</option>
                    <option value="fashion">Fashion & Apparel</option>
                    <option value="home">Home & Kitchen</option>
                    <option value="beauty">Beauty & Health</option>
                    <option value="general">General</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold">Primary Image URL</label>
                  <input 
                    name="primaryImage"
                    type="url" 
                    className="w-full flex h-11 rounded-xl border border-input bg-background/50 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary transition-all" 
                    placeholder="https://..."
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold">Description</label>
                <textarea 
                  name="description"
                  className="w-full min-h-[100px] flex rounded-xl border border-input bg-background/50 px-3 py-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary transition-all resize-y"
                  placeholder="Describe the product features..."
                />
              </div>
            </div>

            <div className="space-y-4 pt-4">
              <h3 className="font-bold border-b border-border/50 pb-2">Sourcing & Pricing</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-semibold">Source Platform <span className="text-destructive">*</span></label>
                  <select name="sourcePlatform" required className="w-full flex h-11 rounded-xl border border-input bg-background/50 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary transition-all">
                    <option value="1688">1688.com</option>
                    <option value="taobao">Taobao</option>
                    <option value="pinduoduo">Pinduoduo</option>
                    <option value="alibaba">Alibaba</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold">Source URL <span className="text-destructive">*</span></label>
                  <input 
                    name="sourceUrl"
                    type="url" 
                    required
                    className="w-full flex h-11 rounded-xl border border-input bg-background/50 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary transition-all" 
                    placeholder="Link to item on 1688..."
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-semibold">Cost Price (Yuan / ¥) <span className="text-destructive">*</span></label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">¥</span>
                    <input 
                      type="number" 
                      step="0.01"
                      required
                      value={costYuan || ''}
                      onChange={(e) => setCostYuan(parseFloat(e.target.value) || 0)}
                      className="w-full flex h-11 rounded-xl border border-input bg-background/50 pl-8 pr-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary transition-all font-mono font-bold text-blue-500" 
                      placeholder="35.00"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold">Your Selling Price (GHS / ₵) <span className="text-destructive">*</span></label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">₵</span>
                    <input 
                      type="number" 
                      step="0.01"
                      required
                      value={sellingGhs || ''}
                      onChange={(e) => setSellingGhs(parseFloat(e.target.value) || 0)}
                      className="w-full flex h-11 rounded-xl border border-input bg-background/50 pl-8 pr-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary transition-all font-mono font-bold text-green-500" 
                      placeholder="120.00"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-6">
              <button 
                type="submit" 
                disabled={loading || profitGhs < 0 || costYuan <= 0 || sellingGhs <= 0}
                className="w-full h-14 bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-xl shadow-lg shadow-primary/25 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
              >
                {loading && <Loader2 className="w-5 h-5 animate-spin" />}
                {loading ? 'Generating Product Code...' : 'Save Product & Generate Code'}
              </button>
            </div>
          </form>
        </div>

        {/* Live Calculation Sidebar */}
        <div className="lg:col-span-1">
          <div className="glass-panel p-6 sticky top-24 border-primary/20 bg-primary/5">
            <div className="flex items-center gap-2 mb-6">
              <Calculator className="w-5 h-5 text-primary" />
              <h3 className="font-bold tracking-tight">Smart Calculator</h3>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center pb-4 border-b border-border/50">
                <span className="text-sm text-muted-foreground">Exchange Rate</span>
                <span className="font-mono font-semibold">¥1 = ₵{exchangeRate.toFixed(2)}</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Product Cost</span>
                <span className="font-mono font-bold text-blue-500">¥{costYuan.toFixed(2)}</span>
              </div>

              <div className="flex justify-center text-muted-foreground py-1">
                <ArrowRight className="w-4 h-4 rotate-90 sm:rotate-0" />
              </div>

              <div className="flex justify-between items-center pb-4 border-b border-border/50">
                <span className="text-sm text-muted-foreground">Cost in GHS</span>
                <span className="font-mono font-bold">₵{costGhs.toFixed(2)}</span>
              </div>

              <div className="flex justify-between items-center pt-2">
                <span className="text-sm text-muted-foreground">Selling Price</span>
                <span className="font-mono font-bold text-green-500">₵{sellingGhs.toFixed(2)}</span>
              </div>

              <div className={`mt-6 p-4 rounded-xl border ${profitGhs >= 0 ? 'bg-green-500/10 border-green-500/30' : 'bg-red-500/10 border-red-500/30'}`}>
                <span className="text-xs font-bold uppercase tracking-wider mb-1 block opacity-70">
                  {profitGhs >= 0 ? 'Your Profit Margin' : 'Loss Warning'}
                </span>
                <span className={`text-2xl font-black font-mono ${profitGhs >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {profitGhs >= 0 ? '+' : ''}₵{profitGhs.toFixed(2)}
                </span>
                {profitGhs >= 0 && costGhs > 0 && (
                  <span className="text-xs font-medium text-green-500 block mt-1">
                    {((profitGhs / costGhs) * 100).toFixed(1)}% ROI
                  </span>
                )}
              </div>
              
              <div className="mt-4 text-xs text-muted-foreground flex flex-col gap-2">
                <p>This profit will be added to your wallet automatically once C2G procures and fulfills the order for your customer.</p>
                <p>Shipping fees are billed directly to the customer.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
