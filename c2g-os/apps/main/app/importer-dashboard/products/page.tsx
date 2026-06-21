"use client";

import { Package, Plus, Search, Edit2, Trash2, Loader2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getImporterProducts } from "./actions";

export default function ProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProducts() {
      const { success, products } = await getImporterProducts();
      if (success && products) {
        setProducts(products);
      }
      setLoading(false);
    }
    loadProducts();
  }, []);

  const handleEdit = (id: string) => alert(`Editing product: ${id}`);
  const handleDelete = (id: string) => {
    if (confirm(`Are you sure you want to delete product: ${id}?`)) {
      alert(`Deleted product: ${id}`);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto animate-fade-in pb-24">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Products</h1>
          <p className="text-muted-foreground mt-1">Manage your storefront inventory and 1688 imports.</p>
        </div>
        <Link 
          href="/importer-dashboard/products/new" 
          className="inline-flex items-center justify-center gap-2 px-6 h-12 rounded-xl bg-primary text-primary-foreground font-bold transition-all hover:bg-primary/90 shadow-[0_0_20px_rgba(var(--primary),0.3)] hover:scale-105"
        >
          <Plus className="w-5 h-5" />
          Add Product
        </Link>
      </div>

      <div className="glass-panel shadow-lg border-border/50 overflow-hidden">
        <div className="p-4 border-b border-border/50 flex flex-col sm:flex-row gap-4 justify-between items-center bg-secondary/10">
          <div className="relative w-full sm:w-96">
            <input 
              type="text" 
              placeholder="Search products..." 
              className="w-full h-10 pl-10 pr-4 bg-background border border-input rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary text-sm"
            />
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground font-medium">
            Total Products: <span className="text-foreground font-bold">{products.length}</span>
          </div>
        </div>

        {/* Desktop Table View */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-secondary/20">
                <th className="py-4 px-6 text-sm font-semibold text-muted-foreground">Product</th>
                <th className="py-4 px-6 text-sm font-semibold text-muted-foreground">Price (₵)</th>
                <th className="py-4 px-6 text-sm font-semibold text-muted-foreground">Cost (¥)</th>
                <th className="py-4 px-6 text-sm font-semibold text-muted-foreground">Stock</th>
                <th className="py-4 px-6 text-sm font-semibold text-muted-foreground">Sales</th>
                <th className="py-4 px-6 text-sm font-semibold text-muted-foreground text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-muted-foreground">
                    No products found. Start by adding a new product.
                  </td>
                </tr>
              )}
              {products.map((product) => {
                const imageUrl = product.product_images?.[0]?.image_url || "https://placehold.co/400x400/1a1a2e/6c757d?text=No+Image";
                const priceGhs = parseFloat(product.selling_price_ghs || product.price || 0);
                const priceCny = parseFloat(product.cost_price_cny || product.price_cny || 0);
                
                return (
                  <tr key={product.id} className="border-b border-border/10 last:border-0 hover:bg-secondary/10 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-lg bg-secondary overflow-hidden shrink-0 border border-border/50">
                          <img src={imageUrl} alt={product.name} className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <div className="font-bold text-sm max-w-[250px] truncate" title={product.name}>{product.name}</div>
                          <div className="text-xs text-muted-foreground mt-0.5">ID: {product.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6 font-bold text-sm">₵{priceGhs.toFixed(2)}</td>
                    <td className="py-4 px-6 text-sm text-muted-foreground">¥{priceCny.toFixed(2)}</td>
                    <td className="py-4 px-6">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                        product.stock > 10 ? 'bg-green-500/10 text-green-500' :
                        product.stock > 0 ? 'bg-amber-500/10 text-amber-500' :
                        'bg-destructive/10 text-destructive'
                      }`}>
                        {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-sm">{product.sales_count || 0}</td>
                    <td className="py-4 px-6">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => handleEdit(product.id)}
                          className="p-2 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-lg transition-colors" title="Edit"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDelete(product.id)}
                          className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors" title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Mobile Card View */}
        <div className="md:hidden flex flex-col gap-4">
          {products.length === 0 && (
            <div className="py-12 text-center text-sm text-muted-foreground">
              No products found. Start by adding a new product.
            </div>
          )}
          {products.map((product) => {
            const imageUrl = product.product_images?.[0]?.image_url || "https://placehold.co/400x400/1a1a2e/6c757d?text=No+Image";
            const priceGhs = parseFloat(product.selling_price_ghs || product.price || 0);
            const priceCny = parseFloat(product.cost_price_cny || product.price_cny || 0);
                
            return (
              <div key={product.id} className="p-4 flex flex-col gap-3 bg-card border border-border/50 rounded-xl shadow-sm">
                <div className="flex items-start gap-3">
                  <div className="w-16 h-16 rounded-lg bg-secondary overflow-hidden shrink-0 border border-border/50">
                    <img src={imageUrl} alt={product.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-sm line-clamp-2 leading-snug mb-1">{product.name}</h3>
                    <p className="text-xs text-muted-foreground">ID: {product.id}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-2 bg-secondary/20 p-2.5 rounded-lg border border-border/30">
                  <div>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold mb-0.5">Price</p>
                    <p className="font-bold text-sm text-primary">₵{priceGhs.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold mb-0.5">Cost</p>
                    <p className="font-medium text-sm text-muted-foreground">¥{priceCny.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold mb-0.5">Sales</p>
                    <p className="font-medium text-sm text-foreground">{product.sales_count || 0}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-1 pt-2 border-t border-border/30">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                    product.stock > 10 ? 'bg-green-500/10 text-green-500' :
                    product.stock > 0 ? 'bg-amber-500/10 text-amber-500' :
                    'bg-destructive/10 text-destructive'
                  }`}>
                    {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                  </span>
                  <div className="flex items-center gap-1">
                    <button 
                      onClick={() => handleEdit(product.id)}
                      className="p-2 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-lg transition-colors border border-transparent hover:border-primary/20" title="Edit"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => handleDelete(product.id)}
                      className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors border border-transparent hover:border-destructive/20" title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
