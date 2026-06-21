'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, Package, Loader2 } from 'lucide-react';
import { ProductForm } from '@/components/admin/product-form';
import { importerUpdateProduct } from '@/app/importer-dashboard/products/actions';
import { createClient } from '@/utils/supabase/client';
import { useModal } from '@/components/providers/modal-provider';

export default function EditProductView() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const { showAlert } = useModal();
  
  const [initialData, setInitialData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    setLoading(true);
    const supabase = createClient();
    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        product_images(*),
        product_variants(*)
      `)
      .eq('id', id)
      .single();

    if (data) {
      setInitialData(data);
    } else {
      showAlert({ title: 'Error', message: 'Product not found', type: 'danger' });
      router.push('/importer-dashboard/products');
    }
    setLoading(false);
  };

  const handleSubmit = async (data: any) => {
    setIsSubmitting(true);
    
    const payload = data;

    const res = await importerUpdateProduct(id, payload);
    
    setIsSubmitting(false);

    if (res.success) {
      showAlert({ title: 'Success', message: 'Product updated successfully!', type: 'success' });
      router.push('/importer-dashboard/products');
    } else {
      showAlert({ title: 'Error', message: res.error || 'Failed to update product', type: 'danger' });
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-5xl mx-auto pb-10">
      
      {/* Header */}
      <div className="flex items-center gap-4">
        <button 
          onClick={() => router.back()}
          className="p-2 bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white rounded-xl transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-3">
            <Package className="w-6 h-6 text-indigo-500" /> Edit Product
          </h1>
          <p className="text-zinc-400 mt-1">Update inventory and product details.</p>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center p-20 text-zinc-500">
          <Loader2 className="w-8 h-8 animate-spin mb-4" />
          <p>Loading product details...</p>
        </div>
      ) : initialData ? (
        <ProductForm 
          initialData={initialData}
          onSubmit={handleSubmit}
          onCancel={() => router.back()}
          isSubmitting={isSubmitting}
        />
      ) : null}
      
    </div>
  );
}
