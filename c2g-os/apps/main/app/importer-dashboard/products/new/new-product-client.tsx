'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { addImporterProduct } from '../actions';
import { Loader2, Calculator, ArrowRight, PackagePlus, Plus, X, ListPlus } from 'lucide-react';

type Option = { id: string; name: string; values: string[] };
type Variant = {
  id: string; // combination hash
  combination: Record<string, string>;
  costYuan: number;
  sellingGhs: number;
  stock: number;
};

export default function NewProductClient({ exchangeRate }: { exchangeRate: number }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Auto-calculation state for global (or no-variant)
  const [costYuan, setCostYuan] = useState<number>(0);
  const [sellingGhs, setSellingGhs] = useState<number>(0);

  // Variant Builder State
  const [hasVariants, setHasVariants] = useState(false);
  const [options, setOptions] = useState<Option[]>([]);
  const [variants, setVariants] = useState<Variant[]>([]);
  
  // Temporary state for adding new value inputs
  const [newValueInputs, setNewValueInputs] = useState<Record<string, string>>({});

  const globalCostGhs = costYuan * exchangeRate;
  const globalProfitGhs = sellingGhs - globalCostGhs;

  // Options Handlers
  const handleAddOption = () => {
    setOptions([...options, { id: crypto.randomUUID(), name: '', values: [] }]);
  };

  const handleRemoveOption = (id: string) => {
    setOptions(options.filter(o => o.id !== id));
  };

  const handleUpdateOptionName = (id: string, name: string) => {
    setOptions(options.map(o => o.id === id ? { ...o, name } : o));
  };

  const handleAddOptionValue = (id: string) => {
    const val = (newValueInputs[id] || '').trim();
    if (!val) return;
    setOptions(options.map(o => o.id === id ? { ...o, values: Array.from(new Set([...o.values, val])) } : o));
    setNewValueInputs(prev => ({ ...prev, [id]: '' }));
  };

  const handleRemoveOptionValue = (id: string, valueToRemove: string) => {
    setOptions(options.map(o => o.id === id ? { ...o, values: o.values.filter(v => v !== valueToRemove) } : o));
  };

  // Generate variants automatically when options change
  useEffect(() => {
    if (!hasVariants) {
      setVariants([]);
      return;
    }

    const validOptions = options.filter(o => o.name.trim() && o.values.length > 0);
    if (validOptions.length === 0) {
      setVariants([]);
      return;
    }

    const generateCombos = (opts: Option[]): Record<string, string>[] => {
      if (opts.length === 0) return [];
      const firstOpt = opts[0];
      if (!firstOpt) return [];
      if (opts.length === 1) return firstOpt.values.map(v => ({ [firstOpt.name]: v }));
      
      const first = opts[0];
      const rest = opts.slice(1);
      if (!first) return [];
      
      const restCombos = generateCombos(rest);
      const combos: Record<string, string>[] = [];
      
      first.values.forEach(v => {
        restCombos.forEach(rc => {
          combos.push({ [first.name]: v, ...rc });
        });
      });
      return combos;
    };

    const newCombos = generateCombos(validOptions);
    
    setVariants(prev => {
      return newCombos.map(combo => {
        const comboId = Object.entries(combo).sort(([k1], [k2]) => k1.localeCompare(k2)).map(([k, v]) => `${k}:${v}`).join('|');
        const existing = prev.find(p => p.id === comboId);
        if (existing) return existing;
        
        // Inherit global pricing as default
        return {
          id: comboId,
          combination: combo,
          costYuan: costYuan || 0,
          sellingGhs: sellingGhs || 0,
          stock: 999
        };
      });
    });
  }, [options, hasVariants]);

  // Apply to all shortcuts
  const handleApplyToAllSelling = (price: number) => {
    setVariants(variants.map(v => ({ ...v, sellingGhs: price })));
  };
  
  const handleApplyToAllCost = (price: number) => {
    setVariants(variants.map(v => ({ ...v, costYuan: price })));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    formData.append('costPriceCny', costYuan.toString());
    formData.append('sellingPriceGhs', sellingGhs.toString());
    
    if (hasVariants && variants.length > 0) {
      formData.append('variantsData', JSON.stringify(variants));
    }

    const res = await addImporterProduct(formData);

    if (res.success) {
      router.push('/importer-dashboard/products?success=true&code=' + res.productCode);
    } else {
      setError(res.error || 'Failed to add product');
      setLoading(false);
    }
  };

  const isFormValid = hasVariants 
    ? variants.length > 0 && variants.every(v => v.costYuan > 0 && v.sellingGhs > 0)
    : costYuan > 0 && sellingGhs > 0 && globalProfitGhs >= 0;

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
                  <label className="text-sm font-semibold">Primary Image <span className="text-destructive">*</span></label>
                  <input 
                    name="primaryImage"
                    type="file" 
                    accept="image/*"
                    required
                    className="w-full flex h-11 rounded-xl border border-input bg-background/50 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary transition-all file:border-0 file:bg-primary/10 file:text-primary file:text-sm file:font-semibold file:mr-4 file:px-4 file:py-1 file:rounded-md hover:file:bg-primary/20" 
                  />
                  <p className="text-xs text-muted-foreground mt-1">Image will be automatically optimized to WebP.</p>
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
              <h3 className="font-bold border-b border-border/50 pb-2">Sourcing & Default Pricing</h3>
              
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
                  <label className="text-sm font-semibold">Default Cost Price (Yuan / ¥) <span className="text-destructive">*</span></label>
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
                  <label className="text-sm font-semibold">Default Selling Price (GHS / ₵) <span className="text-destructive">*</span></label>
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

            {/* VARIANT BUILDER */}
            <div className="space-y-4 pt-4">
              <div className="flex items-center justify-between border-b border-border/50 pb-2">
                <h3 className="font-bold">Product Variants</h3>
                <label className="flex items-center gap-2 text-sm font-medium cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={hasVariants}
                    onChange={(e) => setHasVariants(e.target.checked)}
                    className="w-4 h-4 rounded border-border text-primary focus:ring-primary"
                  />
                  This product has multiple options (e.g., Color, Size)
                </label>
              </div>

              {hasVariants && (
                <div className="space-y-6">
                  {/* Option Definitions */}
                  <div className="space-y-4">
                    {options.map((option, index) => (
                      <div key={option.id} className="p-4 rounded-xl border border-border bg-secondary/20 space-y-3">
                        <div className="flex gap-3">
                          <div className="flex-1 space-y-1">
                            <label className="text-xs font-semibold uppercase text-muted-foreground">Option Name</label>
                            <input 
                              type="text" 
                              value={option.name}
                              onChange={(e) => handleUpdateOptionName(option.id, e.target.value)}
                              className="w-full flex h-9 rounded-lg border border-input bg-background px-3 text-sm focus-visible:ring-2 focus-visible:ring-primary"
                              placeholder="e.g., Color, Size, Storage"
                            />
                          </div>
                          <button 
                            type="button" 
                            onClick={() => handleRemoveOption(option.id)}
                            className="mt-5 px-3 h-9 flex items-center justify-center rounded-lg text-destructive hover:bg-destructive/10 transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                        
                        <div className="space-y-2">
                          <label className="text-xs font-semibold uppercase text-muted-foreground">Values</label>
                          <div className="flex flex-wrap gap-2">
                            {option.values.map(val => (
                              <div key={val} className="flex items-center gap-1 bg-primary/10 text-primary px-2.5 py-1 rounded-md text-sm font-medium">
                                {val}
                                <button type="button" onClick={() => handleRemoveOptionValue(option.id, val)} className="hover:text-destructive transition-colors ml-1">
                                  <X className="w-3 h-3" />
                                </button>
                              </div>
                            ))}
                          </div>
                          
                          <div className="flex gap-2">
                            <input 
                              type="text" 
                              value={newValueInputs[option.id] || ''}
                              onChange={(e) => setNewValueInputs(prev => ({ ...prev, [option.id]: e.target.value }))}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  e.preventDefault();
                                  handleAddOptionValue(option.id);
                                }
                              }}
                              className="flex-1 h-9 rounded-lg border border-input bg-background px-3 text-sm focus-visible:ring-2 focus-visible:ring-primary"
                              placeholder="Add value (e.g. Red) and press Enter"
                            />
                            <button 
                              type="button"
                              onClick={() => handleAddOptionValue(option.id)}
                              className="h-9 px-4 bg-secondary hover:bg-secondary/80 rounded-lg text-sm font-medium transition-colors"
                            >
                              Add Value
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    <button 
                      type="button"
                      onClick={handleAddOption}
                      className="w-full py-3 border-2 border-dashed border-border hover:border-primary/50 hover:bg-primary/5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all text-muted-foreground hover:text-foreground"
                    >
                      <ListPlus className="w-4 h-4" /> Add Another Option
                    </button>
                  </div>

                  {/* Variants Table */}
                  {variants.length > 0 && (
                    <div className="space-y-3 pt-4 border-t border-border/50">
                      <div className="flex items-center justify-between">
                        <h4 className="font-bold text-sm">Configure Pricing per Variant</h4>
                        <div className="flex gap-2">
                          <button type="button" onClick={() => handleApplyToAllCost(costYuan)} className="text-xs text-blue-500 hover:underline">Apply Default Cost to All</button>
                          <button type="button" onClick={() => handleApplyToAllSelling(sellingGhs)} className="text-xs text-green-500 hover:underline">Apply Default Selling to All</button>
                        </div>
                      </div>
                      
                      <div className="overflow-x-auto rounded-xl border border-border">
                        <table className="w-full text-sm text-left">
                          <thead className="bg-secondary/50 text-xs uppercase text-muted-foreground">
                            <tr>
                              <th className="px-4 py-3 font-semibold">Variant</th>
                              <th className="px-4 py-3 font-semibold w-24">Cost (¥)</th>
                              <th className="px-4 py-3 font-semibold w-24">Cost (₵)</th>
                              <th className="px-4 py-3 font-semibold w-28">Selling (₵)</th>
                              <th className="px-4 py-3 font-semibold w-32">Profit / Margin</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-border">
                            {variants.map(variant => {
                              const varCostGhs = variant.costYuan * exchangeRate;
                              const varProfitGhs = variant.sellingGhs - varCostGhs;
                              const varMargin = varCostGhs > 0 ? ((varProfitGhs / varCostGhs) * 100).toFixed(0) : 0;
                              
                              return (
                                <tr key={variant.id} className="hover:bg-secondary/20 transition-colors">
                                  <td className="px-4 py-3 font-medium">
                                    {Object.values(variant.combination).join(' / ')}
                                  </td>
                                  <td className="px-4 py-2">
                                    <input 
                                      type="number" 
                                      step="0.01" 
                                      value={variant.costYuan || ''} 
                                      onChange={(e) => setVariants(variants.map(v => v.id === variant.id ? { ...v, costYuan: parseFloat(e.target.value) || 0 } : v))}
                                      className="w-full h-8 px-2 rounded border border-input bg-background text-sm text-blue-500 font-mono focus:ring-1 focus:ring-primary"
                                    />
                                  </td>
                                  <td className="px-4 py-3 font-mono text-muted-foreground">
                                    ₵{varCostGhs.toFixed(2)}
                                  </td>
                                  <td className="px-4 py-2">
                                    <input 
                                      type="number" 
                                      step="0.01" 
                                      value={variant.sellingGhs || ''} 
                                      onChange={(e) => setVariants(variants.map(v => v.id === variant.id ? { ...v, sellingGhs: parseFloat(e.target.value) || 0 } : v))}
                                      className="w-full h-8 px-2 rounded border border-input bg-background text-sm text-green-500 font-mono focus:ring-1 focus:ring-primary"
                                    />
                                  </td>
                                  <td className="px-4 py-3 font-mono font-bold">
                                    <div className="flex flex-col">
                                      <span className={varProfitGhs >= 0 ? "text-green-500" : "text-red-500"}>
                                        {varProfitGhs >= 0 ? '+' : ''}₵{varProfitGhs.toFixed(2)}
                                      </span>
                                      <span className="text-[10px] text-muted-foreground">{varMargin}%</span>
                                    </div>
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="pt-6">
              <button 
                type="submit" 
                disabled={loading || !isFormValid}
                className="w-full h-14 bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-xl shadow-lg shadow-primary/25 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
              >
                {loading && <Loader2 className="w-5 h-5 animate-spin" />}
                {loading ? 'Generating Product Code...' : 'Save Product & Generate Code'}
              </button>
            </div>
          </form>
        </div>

        {/* Live Calculation Sidebar (Global) */}
        {!hasVariants && (
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
                  <span className="font-mono font-bold">₵{globalCostGhs.toFixed(2)}</span>
                </div>

                <div className="flex justify-between items-center pt-2">
                  <span className="text-sm text-muted-foreground">Selling Price</span>
                  <span className="font-mono font-bold text-green-500">₵{sellingGhs.toFixed(2)}</span>
                </div>

                <div className={`mt-6 p-4 rounded-xl border ${globalProfitGhs >= 0 ? 'bg-green-500/10 border-green-500/30' : 'bg-red-500/10 border-red-500/30'}`}>
                  <span className="text-xs font-bold uppercase tracking-wider mb-1 block opacity-70">
                    {globalProfitGhs >= 0 ? 'Your Profit Margin' : 'Loss Warning'}
                  </span>
                  <span className={`text-2xl font-black font-mono ${globalProfitGhs >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {globalProfitGhs >= 0 ? '+' : ''}₵{globalProfitGhs.toFixed(2)}
                  </span>
                  {globalProfitGhs >= 0 && globalCostGhs > 0 && (
                    <span className="text-xs font-medium text-green-500 block mt-1">
                      {((globalProfitGhs / globalCostGhs) * 100).toFixed(1)}% ROI
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
        )}
      </div>
    </div>
  );
}
