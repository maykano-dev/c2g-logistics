'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, Edit, Package, Tag, Layers, Link as LinkIcon, DollarSign, Calendar, Info, MapPin } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';
import { format } from 'date-fns';

export default function ViewProductDetails() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    setLoading(true);
    const supabase = createClient();
    const { data, error } = await supabase
      .from('products')
      .select('*, product_variants(*), importers(business_name, store_slug)')
      .eq('id', id)
      .single();

    if (data) {
      setProduct(data);
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-20 text-zinc-500">
        <div className="animate-spin w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full mb-4"></div>
        <p>Loading product details...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center p-20 text-zinc-500">
        <Package className="w-12 h-12 mb-4 opacity-50" />
        <p>Product not found.</p>
        <button onClick={() => router.back()} className="mt-4 text-indigo-400 hover:text-indigo-300">Go Back</button>
      </div>
    );
  }

  const mainImage = product.image_url || product.image;
  const totalStock = product.product_variants && product.product_variants.length > 0 
    ? product.product_variants.reduce((acc: number, v: any) => acc + (v.stock || 0), 0)
    : product.stock || 0;

  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-5xl mx-auto pb-10">
      
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => router.back()}
            className="p-2 bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white rounded-xl transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-3">
              <Package className="w-6 h-6 text-indigo-500" /> {product.name}
            </h1>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-zinc-500 font-mono text-sm">{product.sku || 'NO-SKU'}</span>
              <span className="w-1 h-1 rounded-full bg-zinc-700"></span>
              <span className="text-zinc-500 text-sm">Created {product.created_at ? format(new Date(product.created_at), 'MMM dd, yyyy') : 'Unknown'}</span>
            </div>
          </div>
        </div>

        <button 
          onClick={() => router.push(`/admin/commerce/products/${id}/edit`)}
          className="bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20 px-4 py-2 rounded-xl text-sm font-bold border border-indigo-500/20 transition-all flex items-center gap-2"
        >
          <Edit className="w-4 h-4" /> Edit Product
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Image & Meta */}
        <div className="space-y-6">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden aspect-square flex items-center justify-center relative group">
            {mainImage ? (
              <img src={mainImage} alt={product.name} className="w-full h-full object-cover" />
            ) : (
              <div className="text-zinc-600 flex flex-col items-center">
                <Package className="w-12 h-12 mb-2" />
                <span>No Image Provided</span>
              </div>
            )}
            {product.is_active === false && (
              <div className="absolute top-4 right-4 px-3 py-1 bg-red-500/90 text-white text-xs font-bold uppercase tracking-wider rounded-lg shadow-lg">
                Inactive
              </div>
            )}
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
            <h3 className="text-sm font-bold text-white uppercase tracking-widest mb-4 flex items-center gap-2">
              <Info className="w-4 h-4 text-zinc-500" /> Ownership
            </h3>
            <div className="space-y-4">
              <div>
                <p className="text-xs text-zinc-500 mb-1">Provider</p>
                {product.importer_id ? (
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-1 bg-purple-500/10 text-purple-400 text-xs font-bold rounded-lg border border-purple-500/20">
                      {product.importers?.business_name || 'Unknown Importer'}
                    </span>
                    <a href={`/admin/commerce/importers`} className="text-zinc-500 hover:text-white p-1">
                      <LinkIcon className="w-3 h-3" />
                    </a>
                  </div>
                ) : (
                  <span className="px-2 py-1 bg-indigo-500/10 text-indigo-400 text-xs font-bold rounded-lg border border-indigo-500/20">
                    C2G Mall Admin
                  </span>
                )}
              </div>
              
              <div>
                <p className="text-xs text-zinc-500 mb-1">Category</p>
                <div className="flex items-center gap-2">
                  <Tag className="w-4 h-4 text-zinc-600" />
                  <span className="text-zinc-300 font-medium">{product.category || 'Uncategorized'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Details & Inventory */}
        <div className="lg:col-span-2 space-y-6">
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4">
              <p className="text-xs text-zinc-500 mb-1">Selling Price</p>
              <p className="text-xl font-bold text-emerald-400">₵{parseFloat(product.price).toLocaleString(undefined, {minimumFractionDigits: 2})}</p>
            </div>
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4">
              <p className="text-xs text-zinc-500 mb-1">Cost Price</p>
              <p className="text-xl font-bold text-amber-400">{product.cost_price ? `¥${product.cost_price}` : 'N/A'}</p>
            </div>
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4">
              <p className="text-xs text-zinc-500 mb-1">Total Inventory</p>
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${totalStock > 20 ? 'bg-emerald-500' : totalStock > 0 ? 'bg-amber-500' : 'bg-red-500'}`}></div>
                <p className="text-xl font-bold text-white">{totalStock}</p>
              </div>
            </div>
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4">
              <p className="text-xs text-zinc-500 mb-1">Variants</p>
              <p className="text-xl font-bold text-white">{product.product_variants?.length || 0}</p>
            </div>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
            <h3 className="text-sm font-bold text-white uppercase tracking-widest mb-4">Description</h3>
            <div className="prose prose-invert max-w-none text-zinc-300 text-sm whitespace-pre-wrap">
              {product.description || <span className="text-zinc-600 italic">No description provided.</span>}
            </div>
          </div>

          {/* Variants Table if applicable */}
          {product.product_variants && product.product_variants.length > 0 && (
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
              <h3 className="text-sm font-bold text-white uppercase tracking-widest mb-4 flex items-center gap-2">
                <Layers className="w-4 h-4 text-zinc-500" /> Variant Inventory
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-zinc-800 text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                      <th className="pb-3">SKU</th>
                      <th className="pb-3">Options</th>
                      <th className="pb-3">Price</th>
                      <th className="pb-3 text-right">Stock</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800/50">
                    {product.product_variants.map((variant: any) => (
                      <tr key={variant.id} className="text-sm">
                        <td className="py-3 font-mono text-zinc-400">{variant.sku || '-'}</td>
                        <td className="py-3 text-zinc-300">
                          {typeof variant.variant_options === 'object' 
                            ? Object.entries(variant.variant_options || {}).map(([k, v]) => `${k}: ${v}`).join(', ')
                            : JSON.stringify(variant.variant_options)}
                        </td>
                        <td className="py-3 text-emerald-400 font-medium">₵{parseFloat(variant.price || product.price).toLocaleString()}</td>
                        <td className="py-3 text-right">
                          <span className={`px-2 py-1 rounded-md text-xs font-bold ${variant.stock > 10 ? 'bg-emerald-500/10 text-emerald-500' : variant.stock > 0 ? 'bg-amber-500/10 text-amber-500' : 'bg-red-500/10 text-red-500'}`}>
                            {variant.stock || 0}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
