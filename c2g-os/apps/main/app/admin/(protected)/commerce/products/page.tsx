'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { Search, Filter, Plus, Edit, Trash2, Package, Tag, ArrowUpRight, Copy, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { useRouter } from 'next/navigation';
import { adminDeleteProduct } from '@/app/admin/product-actions';
import { useModal } from "@/components/providers/modal-provider";

export default function ProductsCatalogView() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const router = useRouter();
  const { showConfirm, showAlert } = useModal();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    const supabase = createClient();
    
    // Fetch products with their variants and importer details
    const { data, error } = await supabase
      .from('products')
      .select('*, product_variants(id, price, stock, sku, variant_options), importers(business_name)')
      .order('created_at', { ascending: false });

    if (data && !error) {
      setProducts(data);
    }
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    const confirmed = await showConfirm({
      title: 'Delete Product',
      message: 'Are you sure you want to delete this product? This action cannot be undone.',
      type: 'danger',
      confirmText: 'Yes, Delete'
    });
    
    if (!confirmed) return;
    
    setDeletingId(id);
    const res = await adminDeleteProduct(id);
    setDeletingId(null);

    if (res.success) {
      setProducts(prev => prev.filter(p => p.id !== id));
      showAlert({ title: 'Success', message: 'Product deleted successfully', type: 'success' });
    } else {
      showAlert({ title: 'Error', message: 'Failed to delete: ' + res.error, type: 'danger' });
    }
  };

  const handleEdit = (id: string) => {
    router.push(`/admin/commerce/products/${id}/edit`);
  };

  const handleView = (id: string) => {
    router.push(`/admin/commerce/products/${id}`);
  };

  const filtered = products.filter(p => 
    p.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.sku?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-7xl mx-auto pb-10">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-3">
            <Package className="w-6 h-6 text-indigo-500" /> Catalog & Inventory
          </h1>
          <p className="text-zinc-400 mt-1">Manage C2G Mall products, variants, and stock levels.</p>
        </div>
        <button 
          onClick={() => router.push('/admin/commerce/products/new')}
          className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-indigo-900/20 transition-all flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Add Product
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 p-4 bg-zinc-900 border border-zinc-800 rounded-2xl">
        <div className="relative flex-1">
          <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
          <input 
            type="text"
            placeholder="Search products by Name or SKU..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full h-10 bg-zinc-950 border border-zinc-800 rounded-lg pl-10 pr-4 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors"
          />
        </div>
        <button className="px-4 h-10 border border-zinc-800 bg-zinc-950 text-white rounded-lg text-sm font-medium flex items-center gap-2 hover:bg-zinc-800 transition-colors shrink-0">
          <Filter className="w-4 h-4" /> Filters
        </button>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto hidden md:block">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-zinc-800 bg-zinc-950/50">
                <th className="p-4 text-xs font-semibold text-zinc-400 uppercase tracking-wider">Product Info</th>
                <th className="p-4 text-xs font-semibold text-zinc-400 uppercase tracking-wider">Origin & Category</th>
                <th className="p-4 text-xs font-semibold text-zinc-400 uppercase tracking-wider">Pricing</th>
                <th className="p-4 text-xs font-semibold text-zinc-400 uppercase tracking-wider">Inventory Status</th>
                <th className="p-4 text-xs font-semibold text-zinc-400 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800">
              {loading ? (
                <tr><td colSpan={5} className="p-8 text-center text-zinc-500 animate-pulse">Loading catalog...</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={5} className="p-8 text-center text-zinc-500">No products found.</td></tr>
              ) : (
                filtered.map(product => {
                  const totalStock = product.product_variants && product.product_variants.length > 0 
                    ? product.product_variants.reduce((acc: number, v: any) => acc + (v.stock || 0), 0)
                    : product.stock || 0;

                  const mainImage = product.image_url || product.image;

                  return (
                    <tr key={product.id} className="hover:bg-zinc-800/50 transition-colors group">
                      <td className="p-4 flex items-center gap-4">
                        <div className="w-12 h-12 rounded-lg bg-zinc-800 border border-zinc-700 overflow-hidden flex-shrink-0">
                          {mainImage ? (
                            <img src={mainImage} alt={product.name} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-zinc-600"><Package className="w-5 h-5"/></div>
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-white leading-snug line-clamp-2 max-w-[300px] group-hover:text-indigo-400 transition-colors">{product.name}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-[10px] font-mono text-zinc-500">{product.sku || 'NO-SKU'}</span>
                            <button className="text-zinc-600 hover:text-zinc-400"><Copy className="w-3 h-3"/></button>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 space-y-1">
                        <div>
                          {product.importer_id ? (
                            <span className="px-2 py-0.5 bg-purple-500/10 text-purple-400 text-[9px] font-bold uppercase tracking-wider rounded border border-purple-500/20">
                              {product.importers?.business_name || 'Importer'}
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 bg-indigo-500/10 text-indigo-400 text-[9px] font-bold uppercase tracking-wider rounded border border-indigo-500/20">
                              C2G Admin
                            </span>
                          )}
                        </div>
                        <div>
                          <span className="px-2 py-0.5 bg-zinc-800 text-zinc-300 text-[9px] font-bold uppercase tracking-wider rounded border border-zinc-700">
                            {product.category || 'Uncategorized'}
                          </span>
                        </div>
                      </td>
                      <td className="p-4">
                        {product.product_variants && product.product_variants.length > 0 ? (
                          <div className="text-sm text-zinc-300 font-medium">
                            <span className="text-xs text-zinc-500 mr-1">from</span>
                            ₵{Math.min(...product.product_variants.map((v:any) => v.price)).toLocaleString(undefined, {minimumFractionDigits: 2})}
                          </div>
                        ) : (
                          <div className="text-sm text-zinc-300 font-medium">₵{parseFloat(product.price).toLocaleString(undefined, {minimumFractionDigits: 2})}</div>
                        )}
                        {product.cost_price && <div className="text-[10px] text-zinc-500 mt-1">Cost: ¥{product.cost_price}</div>}
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${totalStock > 20 ? 'bg-emerald-500' : totalStock > 0 ? 'bg-amber-500' : 'bg-red-500'}`}></div>
                          <span className={`text-sm font-bold ${totalStock > 20 ? 'text-white' : totalStock > 0 ? 'text-amber-400' : 'text-red-400'}`}>
                            {totalStock} in stock
                          </span>
                        </div>
                        {product.product_variants && product.product_variants.length > 0 && (
                          <p className="text-[10px] text-zinc-500 mt-1">Across {product.product_variants.length} variants</p>
                        )}
                      </td>
                      <td className="p-4 text-right">
                         <div className="flex items-center justify-end gap-2">
                           <button onClick={() => handleView(product.id)} className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors" title="View Details">
                             <ArrowUpRight className="w-4 h-4" />
                           </button>
                           <button onClick={() => handleEdit(product.id)} className="p-2 text-indigo-400 hover:text-white hover:bg-indigo-500/20 rounded-lg transition-colors" title="Edit Product">
                             <Edit className="w-4 h-4" />
                           </button>
                           <button onClick={() => handleDelete(product.id)} disabled={deletingId === product.id} className="p-2 text-red-400 hover:text-white hover:bg-red-500/20 rounded-lg transition-colors disabled:opacity-50" title="Delete">
                             {deletingId === product.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                           </button>
                         </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Card Layout */}
        <div className="md:hidden flex flex-col divide-y divide-zinc-800">
          {loading ? (
            <div className="p-8 text-center text-zinc-500 animate-pulse">Loading catalog...</div>
          ) : filtered.length === 0 ? (
            <div className="p-8 text-center text-zinc-500">No products found.</div>
          ) : (
            filtered.map(product => {
              const totalStock = product.product_variants && product.product_variants.length > 0 
                ? product.product_variants.reduce((acc: number, v: any) => acc + (v.stock || 0), 0)
                : product.stock || 0;

              const mainImage = product.image_url || product.image;

              return (
                <div key={product.id} className="p-4 flex flex-col gap-4 hover:bg-zinc-800/20 transition-colors">
                  <div className="flex gap-4">
                    <div className="w-16 h-16 rounded-lg bg-zinc-800 border border-zinc-700 overflow-hidden flex-shrink-0">
                      {mainImage ? (
                        <img src={mainImage} alt={product.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-zinc-600"><Package className="w-6 h-6"/></div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-white leading-snug line-clamp-2">{product.name}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] font-mono text-zinc-500">{product.sku || 'NO-SKU'}</span>
                        <button className="text-zinc-600 hover:text-zinc-400"><Copy className="w-3 h-3"/></button>
                      </div>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {product.importer_id ? (
                          <span className="px-2 py-0.5 bg-purple-500/10 text-purple-400 text-[9px] font-bold uppercase tracking-wider rounded border border-purple-500/20">
                            {product.importers?.business_name || 'Importer'}
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 bg-indigo-500/10 text-indigo-400 text-[9px] font-bold uppercase tracking-wider rounded border border-indigo-500/20">
                            C2G Admin
                          </span>
                        )}
                        <span className="px-2 py-0.5 bg-zinc-800 text-zinc-300 text-[9px] font-bold uppercase tracking-wider rounded border border-zinc-700">
                          {product.category || 'Uncategorized'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 bg-zinc-950 p-3 rounded-xl border border-zinc-800/50">
                    <div>
                      <p className="text-xs text-zinc-500 mb-1">Pricing</p>
                      {product.product_variants && product.product_variants.length > 0 ? (
                        <div className="text-sm text-zinc-300 font-medium">
                          <span className="text-xs text-zinc-500 mr-1">from</span>
                          ₵{Math.min(...product.product_variants.map((v:any) => v.price)).toLocaleString(undefined, {minimumFractionDigits: 2})}
                        </div>
                      ) : (
                        <div className="text-sm text-zinc-300 font-medium">₵{parseFloat(product.price).toLocaleString(undefined, {minimumFractionDigits: 2})}</div>
                      )}
                    </div>
                    <div>
                      <p className="text-xs text-zinc-500 mb-1">Inventory</p>
                      <div className="flex items-center gap-1.5">
                        <div className={`w-2 h-2 rounded-full ${totalStock > 20 ? 'bg-emerald-500' : totalStock > 0 ? 'bg-amber-500' : 'bg-red-500'}`}></div>
                        <span className={`text-sm font-bold ${totalStock > 20 ? 'text-white' : totalStock > 0 ? 'text-amber-400' : 'text-red-400'}`}>
                          {totalStock} in stock
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-1">
                    <div>
                      {product.product_variants && product.product_variants.length > 0 && (
                        <p className="text-[10px] text-zinc-500">Across {product.product_variants.length} variants</p>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <button onClick={() => handleView(product.id)} className="p-2 bg-zinc-800/50 text-zinc-400 hover:text-white rounded-xl transition-colors">
                        <ArrowUpRight className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleEdit(product.id)} className="p-2 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded-xl transition-colors">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(product.id)} disabled={deletingId === product.id} className="p-2 bg-red-500/10 text-red-400 border border-red-500/20 rounded-xl transition-colors disabled:opacity-50">
                        {deletingId === product.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
