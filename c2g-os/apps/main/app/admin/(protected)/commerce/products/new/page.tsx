'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Package } from 'lucide-react';
import { ProductForm } from '@/components/admin/product-form';
import { adminCreateProduct } from '@/app/admin/product-actions';
import { useModal } from '@/components/providers/modal-provider';

export default function NewProductView() {
  const router = useRouter();
  const { showAlert } = useModal();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (data: any) => {
    setIsSubmitting(true);
    
    // Convert numeric fields from string to number before submission
    const payload = {
      ...data,
      price: data.price ? parseFloat(data.price) : 0,
      cost_price: data.cost_price ? parseFloat(data.cost_price) : 0,
      stock: data.stock ? parseInt(data.stock) : 0,
    };

    const res = await adminCreateProduct(payload);
    
    setIsSubmitting(false);

    if (res.success) {
      showAlert({ title: 'Success', message: 'Product created successfully!', type: 'success' });
      router.push('/admin/commerce/products');
    } else {
      showAlert({ title: 'Error', message: res.error || 'Failed to create product', type: 'danger' });
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
            <Package className="w-6 h-6 text-indigo-500" /> Create New Product
          </h1>
          <p className="text-zinc-400 mt-1">Add a new item to the C2G Mall catalog.</p>
        </div>
      </div>

      <ProductForm 
        onSubmit={handleSubmit}
        onCancel={() => router.back()}
        isSubmitting={isSubmitting}
      />
      
    </div>
  );
}
