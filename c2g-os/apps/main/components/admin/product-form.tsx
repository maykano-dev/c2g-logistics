'use client';

import { useState, useRef, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { ImagePlus, Loader2, Save, X, Trash2, Calculator, ChevronRight, ChevronLeft, Plus, Settings2, Package, Link as LinkIcon, AlertCircle, Star } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';
import { useModal } from '@/components/providers/modal-provider';

interface ProductFormProps {
  initialData?: any;
  onSubmit: (data: any) => Promise<void>;
  onCancel: () => void;
  isSubmitting: boolean;
}

// Client-side image compression
const compressImage = async (file: File): Promise<File> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 1200;
        const MAX_HEIGHT = 1200;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);
        canvas.toBlob((blob) => {
          if (!blob) return reject(new Error('Canvas is empty'));
          const newFile = new File([blob], file.name.replace(/\.[^/.]+$/, "") + ".jpg", {
            type: 'image/jpeg',
            lastModified: Date.now()
          });
          resolve(newFile);
        }, 'image/jpeg', 0.8); // 80% quality
      };
      img.onerror = (err) => reject(err);
    };
    reader.onerror = (err) => reject(err);
  });
};

export function ProductForm({ initialData, onSubmit, onCancel, isSubmitting }: ProductFormProps) {
  const [step, setStep] = useState(1);
  const { showAlert } = useModal();
  const [platformRate, setPlatformRate] = useState<number>(0.52);
  const [categories, setCategories] = useState<string[]>([
    "Electronics", "Fashion & Clothing", "Shoes & Footwear", "Home & Garden",
    "Beauty & Personal Care", "Health & Wellness", "Sports & Outdoors",
    "Automotive", "Toys & Games", "Groceries & Food", "Office Supplies", "Other"
  ]);

  // STEP 1 STATE: Product Info
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    sku: initialData?.sku || '',
    category: initialData?.category || '',
    description: initialData?.description || '',
    status: initialData?.status || 'active',
    supplier_link: initialData?.supplier_link || initialData?.product_link || '',
    price: initialData?.price || '',
    cost_price: initialData?.cost_price || initialData?.cost_price_cny || '',
    stock: initialData?.stock || 0,
  });

  const [generatingSku, setGeneratingSku] = useState(false);

  // STEP 2 STATE: Images & Variants

  const [mainImages, setMainImages] = useState<any[]>(() => {
    if (!initialData?.product_images) return [];
    return initialData.product_images
      .filter((img: any) => !img.variant_value)
      .map((img: any) => ({ id: img.id, url: img.image_url, isPrimary: img.is_primary, uploading: false }));
  });

  const initialHasVariants = initialData?.product_variants && initialData.product_variants.length > 0;
  const [hasVariants, setHasVariants] = useState(initialHasVariants);
  
  const [options, setOptions] = useState<any[]>(() => {
    if (!initialData?.product_variants || initialData.product_variants.length === 0) return [];
    
    // Reconstruct options from variants
    const optionMap = new Map<string, Set<string>>();
    
    initialData.product_variants.forEach((v: any) => {
      let combo = v.combination || v.variant_options;
      if (typeof combo === 'string') {
        try { combo = JSON.parse(combo); } catch (e) { combo = null; }
      }
      
      if (combo && typeof combo === 'object') {
        Object.entries(combo).forEach(([key, value]) => {
          if (!optionMap.has(key)) optionMap.set(key, new Set());
          optionMap.get(key)!.add(String(value));
        });
      }
    });

    const reconstructedOptions = Array.from(optionMap.entries()).map(([name, valuesSet]) => ({
      id: crypto.randomUUID(),
      name,
      values: Array.from(valuesSet).map((val: string) => {
        const valImages = initialData.product_images
          ?.filter((img: any) => img.variant_value === val)
          .map((img: any) => ({ id: img.id || crypto.randomUUID(), url: img.image_url, isPrimary: img.is_primary, uploading: false })) || [];
        return { id: crypto.randomUUID(), value: val, images: valImages };
      })
    }));

    // Ensure the option that actually has images comes first, so the UI renders the ImageUploader for it
    reconstructedOptions.sort((a, b) => {
      const aHasImages = a.values.some(v => v.images.length > 0);
      const bHasImages = b.values.some(v => v.images.length > 0);
      if (aHasImages && !bHasImages) return -1;
      if (!aHasImages && bHasImages) return 1;
      return 0;
    });

    return reconstructedOptions;
  });

  // STEP 3 STATE: Combinations
  const [combinations, setCombinations] = useState<Array<any>>(() => {
    if (!initialData?.product_variants) return [];
    return initialData.product_variants.map((v: any) => ({
      id: v.id,
      variant_options: typeof v.variant_options === 'string' ? JSON.parse(v.variant_options) : v.variant_options,
      sku: v.sku,
      cost_price_cny: v.cost_price_cny?.toString() || '',
      selling_price_ghs: v.selling_price_ghs?.toString() || '',
      stock: v.stock || 0,
      image_url: v.image_url || null
    }));
  });
  const [bulkAction, setBulkAction] = useState({ cost_price_cny: '', selling_price_ghs: '', stock: '' });

  useEffect(() => {
    const fetchRateAndCategories = async () => {
      const supabase = createClient();
      const { data: settingsData } = await supabase.from("settings").select("rate_shop_products").eq("id", 1).single();
      if (settingsData?.rate_shop_products) {
        setPlatformRate(parseFloat(settingsData.rate_shop_products));
      } else {
        const { data: sysData } = await supabase.from("system_settings").select("value").eq("key", "exchange_rate_cny_ghs").single();
        if (sysData?.value) setPlatformRate(parseFloat(sysData.value));
      }

      const { data: catData } = await supabase.from("products").select("category").not("category", "is", null);
      if (catData && catData.length > 0) {
        setCategories(() => {
          const cats = new Set<string>();
          catData.forEach((p: any) => {
            if (p.category) {
              const trimmed = p.category.trim();
              const formatted = trimmed.charAt(0).toUpperCase() + trimmed.slice(1).toLowerCase();
              cats.add(formatted);
            }
          });
          return Array.from(cats).sort();
        });
      }
    };
    fetchRateAndCategories();
    
    if (!formData.sku && !initialData) {
      generateUniqueSku();
    }
  }, []);

  const generateUniqueSku = async () => {
    setGeneratingSku(true);
    const supabase = createClient();
    let isUnique = false;
    let newSku = '';

    while (!isUnique) {
      const randomPart = Math.random().toString(36).substring(2, 8).toUpperCase();
      newSku = `PRD-${randomPart}`;
      const { data } = await supabase.from('products').select('id').eq('sku', newSku).single();
      if (!data) isUnique = true;
    }
    
    setFormData(prev => ({ ...prev, sku: newSku }));
    setGeneratingSku(false);
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // ════════════════════════════════════════════════════════
  // Step 2 Image Handling (Main Product)
  // ════════════════════════════════════════════════════════
  const handleMainImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    if (mainImages.length + files.length > 5) {
      return showAlert({ title: 'Limit Exceeded', message: 'You can only upload up to 5 main images.', type: 'warning' });
    }

    const newUploads = files.map(file => ({ id: crypto.randomUUID(), file, url: '', isPrimary: false, uploading: true }));
    setMainImages(prev => [...prev, ...newUploads]);

    for (const item of newUploads) {
      try {
        const compressedFile = await compressImage(item.file);
        const form = new FormData();
        form.append('file', compressedFile);
        
        const res = await fetch('/api/upload', { method: 'POST', body: form });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);

        setMainImages(prev => {
          const updated = prev.map(img => img.id === item.id ? { ...img, url: data.url, uploading: false } : img);
          // If it's the first successfully uploaded image, make it primary automatically
          if (!updated.some(img => img.isPrimary) && data.url) {
            const index = updated.findIndex(img => img.id === item.id);
            if (index !== -1) updated[index].isPrimary = true;
          }
          return updated;
        });
      } catch (err: any) {
        showAlert({ title: 'Upload Failed', message: err.message, type: 'danger' });
        setMainImages(prev => prev.filter(img => img.id !== item.id)); // remove failed
      }
    }
  };

  const setMainImagePrimary = (id: string) => {
    setMainImages(prev => prev.map(img => ({ ...img, isPrimary: img.id === id })));
  };

  const removeMainImage = (id: string) => {
    setMainImages(prev => {
      const filtered = prev.filter(img => img.id !== id);
      // Auto-assign primary if we removed the primary one
      if (filtered.length > 0 && !filtered.some(img => img.isPrimary)) {
        filtered[0].isPrimary = true;
      }
      return filtered;
    });
  };

  // ════════════════════════════════════════════════════════
  // Step 2 Variant Handling
  // ════════════════════════════════════════════════════════
  const addOption = (defaultName = '') => {
    setOptions([...options, { id: crypto.randomUUID(), name: defaultName, values: [] }]);
  };

  const updateOptionName = (optionId: string, name: string) => {
    setOptions(options.map(opt => opt.id === optionId ? { ...opt, name } : opt));
  };

  const removeOption = (optionId: string) => {
    setOptions(options.filter(opt => opt.id !== optionId));
  };

  const addOptionValue = (optionId: string, value: string) => {
    if (!value.trim()) return;
    setOptions(options.map(opt => {
      if (opt.id === optionId) {
        if (opt.values.some((v: any) => v.value.toLowerCase() === value.toLowerCase())) return opt;
        return { ...opt, values: [...opt.values, { id: crypto.randomUUID(), value: value.trim(), images: [] }] };
      }
      return opt;
    }));
  };

  const removeOptionValue = (optionId: string, valueId: string) => {
    setOptions(options.map(opt => {
      if (opt.id === optionId) {
        return { ...opt, values: opt.values.filter(v => v.id !== valueId) };
      }
      return opt;
    }));
  };

  const handleVariantImageUpload = async (optionId: string, valueId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    // We need to check how many images are currently in this value
    let currentCount = 0;
    setOptions(opts => {
      opts.forEach(opt => {
        if (opt.id === optionId) {
          opt.values.forEach(v => { if (v.id === valueId) currentCount = v.images.length; });
        }
      });
      return opts;
    });

    if (currentCount + files.length > 5) {
      return showAlert({ title: 'Limit Exceeded', message: 'Up to 5 images per variant value allowed.', type: 'warning' });
    }

    const newUploads = files.map(file => ({ id: crypto.randomUUID(), file, url: '', isPrimary: false, uploading: true }));
    
    // Add placeholders
    setOptions(opts => opts.map(opt => opt.id === optionId ? {
      ...opt, values: opt.values.map(v => v.id === valueId ? { ...v, images: [...v.images, ...newUploads] } : v)
    } : opt));

    // Process uploads
    for (const item of newUploads) {
      try {
        const compressedFile = await compressImage(item.file);
        const form = new FormData();
        form.append('file', compressedFile);
        
        const res = await fetch('/api/upload', { method: 'POST', body: form });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);

        setOptions(opts => opts.map(opt => opt.id === optionId ? {
          ...opt, values: opt.values.map(v => {
            if (v.id === valueId) {
              const updatedImages = v.images.map(img => img.id === item.id ? { ...img, url: data.url, uploading: false } : img);
              if (!updatedImages.some(img => img.isPrimary) && data.url) {
                const index = updatedImages.findIndex(img => img.id === item.id);
                if (index !== -1) updatedImages[index].isPrimary = true;
              }
              return { ...v, images: updatedImages };
            }
            return v;
          })
        } : opt));
      } catch (err: any) {
        showAlert({ title: 'Upload Failed', message: err.message, type: 'danger' });
        // remove failed
        setOptions(opts => opts.map(opt => opt.id === optionId ? {
          ...opt, values: opt.values.map(v => v.id === valueId ? { ...v, images: v.images.filter(img => img.id !== item.id) } : v)
        } : opt));
      }
    }
  };

  const setVariantImagePrimary = (optionId: string, valueId: string, imageId: string) => {
    setOptions(opts => opts.map(opt => opt.id === optionId ? {
      ...opt, values: opt.values.map(v => v.id === valueId ? {
        ...v, images: v.images.map(img => ({ ...img, isPrimary: img.id === imageId }))
      } : v)
    } : opt));
  };

  const removeVariantImage = (optionId: string, valueId: string, imageId: string) => {
    setOptions(opts => opts.map(opt => opt.id === optionId ? {
      ...opt, values: opt.values.map(v => {
        if (v.id === valueId) {
          const filtered = v.images.filter(img => img.id !== imageId);
          if (filtered.length > 0 && !filtered.some((img: any) => img.isPrimary)) {
            filtered[0].isPrimary = true;
          }
          return { ...v, images: filtered };
        }
        return v;
      })
    } : opt));
  };

  // ════════════════════════════════════════════════════════
  // Step 3 Combinations
  // ════════════════════════════════════════════════════════
  const generateCombinations = () => {
    if (options.length === 0 || options.some(o => o.values.length === 0)) return;

    const cartesian = (arrays: any[][]) => {
      return arrays.reduce((a, b) => a.map(x => b.map(y => x.concat([y]))).reduce((c, d) => c.concat(d), []), [[]]);
    };

    const valueArrays = options.map(opt => opt.values.map((v: any) => ({ optionName: opt.name, value: v.value, images: v.images })));
    const combos = cartesian(valueArrays);

    const newCombinations = combos.map((combo: any) => {
      const skuSuffix = combo.map((c: any) => c.value.substring(0, 3).toUpperCase()).join('-');
      const generatedSku = `${formData.sku}-${skuSuffix}`;

      const variant_options = combo.reduce((acc: any, curr: any) => {
        acc[curr.optionName] = curr.value;
        return acc;
      }, {});

      // For the table preview thumbnail, pick the primary image from the FIRST option
      const firstOptionValue = combo.find((c: any) => c.optionName === options[0]?.name);
      const primaryImage = firstOptionValue?.images?.find((img: any) => img.isPrimary)?.url || '';

      const existing = combinations.find(c => {
        const keys1 = Object.keys(c.variant_options);
        const keys2 = Object.keys(variant_options);
        if (keys1.length !== keys2.length) return false;
        return keys1.every(key => c.variant_options[key] === variant_options[key]);
      });

      return existing || {
        id: crypto.randomUUID(),
        sku: generatedSku,
        variant_options,
        cost_price_cny: '',
        selling_price_ghs: '',
        stock: 0,
        image_url: primaryImage,
      };
    });

    setCombinations(newCombinations);
  };

  const handleBulkApply = () => {
    setCombinations(prev => prev.map(c => {
      let updated = { ...c };
      if (bulkAction.cost_price_cny) updated.cost_price_cny = bulkAction.cost_price_cny;
      if (bulkAction.selling_price_ghs) updated.selling_price_ghs = bulkAction.selling_price_ghs;
      if (bulkAction.stock) updated.stock = parseInt(bulkAction.stock);
      return updated;
    }));
  };

  const updateCombination = (id: string, field: string, value: string) => {
    setCombinations(combinations.map(c => c.id === id ? { ...c, [field]: value } : c));
  };

  // ════════════════════════════════════════════════════════
  // Validation & Navigation
  // ════════════════════════════════════════════════════════
  const nextStep = () => {
    if (step === 1) {
      if (!formData.name || !formData.category || !formData.sku) {
        return showAlert({ title: 'Missing Fields', message: 'Please fill in all required fields.', type: 'warning' });
      }
      setStep(2);
    } else if (step === 2) {
      if (mainImages.filter(img => img.url && !img.uploading).length === 0) {
        return showAlert({ title: 'Missing Image', message: 'Please upload at least one Primary Product Image.', type: 'warning' });
      }
      if (hasVariants) {
        if (options.length === 0) return showAlert({ title: 'Variants Required', message: 'Please add at least one option.', type: 'warning' });
        if (options.some(o => o.values.length === 0)) return showAlert({ title: 'Empty Options', message: 'Every option must have at least one value.', type: 'warning' });
        
        const hasAnyVariantImage = options.length > 0 && options[0].values.some((v: any) => v.images && v.images.some((img: any) => img.url && !img.uploading));
        if (!hasAnyVariantImage) {
          return showAlert({ title: 'Missing Variant Image', message: 'Please upload at least one image for your primary variant options.', type: 'warning' });
        }
        
        generateCombinations();
      }
      setStep(3);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step !== 3) return;

    if (!hasVariants) {
      if (!formData.price) return showAlert({ title: 'Missing Price', message: 'Selling price is required.', type: 'warning' });
      
      const costCedi = (parseFloat(formData.cost_price as string) || 0) / platformRate;
      if (costCedi > 0 && parseFloat(formData.price as string) < costCedi) {
        return showAlert({ title: 'Pricing Error', message: 'Selling price cannot be lower than the cost price equivalent.', type: 'danger' });
      }
    } else {
      if (combinations.length === 0) return showAlert({ title: 'Error', message: 'No variants generated.', type: 'danger' });
      if (combinations.some(c => !c.selling_price_ghs)) return showAlert({ title: 'Missing Pricing', message: 'All variants must have a selling price.', type: 'warning' });
      
      const hasLoss = combinations.some(c => {
        const costCedi = (parseFloat(c.cost_price_cny) || 0) / platformRate;
        return costCedi > 0 && parseFloat(c.selling_price_ghs) < costCedi;
      });
      if (hasLoss) {
        return showAlert({ title: 'Pricing Error', message: 'One or more variants have a selling price lower than their cost price equivalent.', type: 'danger' });
      }
    }

    // Prepare payload
    const finalMainImages = mainImages.filter(img => img.url).map(img => ({ url: img.url, isPrimary: img.isPrimary }));
    const finalProductImageUrl = finalMainImages.find(img => img.isPrimary)?.url || finalMainImages[0]?.url || '';

    const payload = {
      product: {
        ...formData,
        has_variants: hasVariants,
        image_url: finalProductImageUrl
      },
      mainImages: finalMainImages,
      options: hasVariants ? options.map(o => ({ 
        name: o.name, 
        values: o.values.map((v: any) => ({
          value: v.value,
          images: v.images.filter((img: any) => img.url).map((img: any) => ({ url: img.url, isPrimary: img.isPrimary }))
        })) 
      })) : [],
      combinations: hasVariants ? combinations : []
    };

    await onSubmit(payload);
  };

  // ════════════════════════════════════════════════════════
  // Render Helpers
  // ════════════════════════════════════════════════════════
  const renderImageGallery = (images: any[], onUpload: (e: any) => void, onSetPrimary: (id: string) => void, onRemove: (id: string) => void) => (
    <div className="flex gap-3 overflow-x-auto pb-2 custom-scrollbar">
      {images.map(img => (
        <div 
          key={img.id} 
          onClick={() => !img.uploading && onSetPrimary(img.id)}
          className={`shrink-0 w-24 h-24 rounded-xl border-2 relative overflow-hidden group cursor-pointer transition-all ${img.isPrimary ? 'border-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.3)]' : 'border-zinc-800 hover:border-zinc-600'}`}
        >
          {img.uploading ? (
            <div className="w-full h-full flex items-center justify-center bg-zinc-900">
              <Loader2 className="w-6 h-6 text-indigo-500 animate-spin" />
            </div>
          ) : (
            <>
              <img src={img.url} alt="Uploaded" className="w-full h-full object-cover" />
              <button 
                type="button" 
                onClick={(e) => { e.stopPropagation(); onRemove(img.id); }}
                className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity z-10"
              >
                <X className="w-3 h-3" />
              </button>
              {img.isPrimary && (
                <div className="absolute bottom-0 left-0 w-full bg-emerald-500 text-[10px] font-bold text-center py-0.5 text-black">
                  PRIMARY
                </div>
              )}
              {!img.isPrimary && (
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                  <Star className="w-5 h-5 text-white/70" />
                </div>
              )}
            </>
          )}
        </div>
      ))}
      
      {images.length < 5 && (
        <label className="shrink-0 w-24 h-24 rounded-xl border-2 border-dashed border-zinc-700 bg-zinc-900 flex flex-col items-center justify-center cursor-pointer hover:border-zinc-500 hover:bg-zinc-800 transition-colors">
          <ImagePlus className="w-6 h-6 text-zinc-500 mb-1" />
          <span className="text-[10px] text-zinc-400 font-bold">Add Photo</span>
          <input type="file" multiple accept="image/*" className="hidden" onChange={onUpload} />
        </label>
      )}
    </div>
  );

  return (
    <div className="bg-zinc-900/50 border border-zinc-800 rounded-3xl p-4 sm:p-8 backdrop-blur-xl">
      <div className="flex items-center justify-between mb-8 relative">
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-zinc-800 rounded-full -z-10"></div>
        <div className={`absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-indigo-500 rounded-full -z-10 transition-all duration-500`} style={{ width: step === 1 ? '0%' : step === 2 ? '50%' : '100%' }}></div>
        {[
          { num: 1, label: 'Product Info' },
          { num: 2, label: 'Images & Variants' },
          { num: 3, label: 'Pricing & Inventory' }
        ].map(s => (
          <div key={s.num} className="flex flex-col items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-colors ${step >= s.num ? 'bg-indigo-500 text-white shadow-[0_0_15px_rgba(99,102,241,0.5)]' : 'bg-zinc-900 border-2 border-zinc-700 text-zinc-500'}`}>
              {s.num}
            </div>
            <span className={`text-xs font-bold uppercase tracking-wider hidden sm:block ${step >= s.num ? 'text-indigo-400' : 'text-zinc-500'}`}>{s.label}</span>
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        
        {step === 1 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-1">Product Name <span className="text-red-500">*</span></label>
                  <input type="text" name="name" required value={formData.name} onChange={handleFormChange} className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500" placeholder="e.g. Vintage Leather Jacket" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-1">Category <span className="text-red-500">*</span></label>
                  <select name="category" required value={formData.category} onChange={handleFormChange} className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 appearance-none">
                    <option value="" disabled>Select a category...</option>
                    {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-1 flex items-center gap-2">
                    <LinkIcon className="w-4 h-4" /> Supplier Link
                  </label>
                  <input type="url" name="supplier_link" value={formData.supplier_link} onChange={handleFormChange} className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500" placeholder="https://1688.com/..." />
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-1">Status</label>
                  <select name="status" value={formData.status} onChange={handleFormChange} className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 appearance-none">
                    <option value="active">Active (Visible)</option>
                    <option value="draft">Draft (Hidden)</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-1">Product SKU</label>
                  <input type="text" name="sku" readOnly value={formData.sku || 'Generating...'} className="w-full bg-zinc-950/50 border border-zinc-800 rounded-xl px-4 py-3 text-zinc-500 font-mono font-bold focus:outline-none cursor-not-allowed" />
                  <p className="text-xs text-emerald-500 mt-2 flex items-start gap-1 font-medium"><AlertCircle className="w-3 h-3 mt-0.5 shrink-0" /> Secure ID auto-generated to prevent competitors from guessing inventory sizes.</p>
                </div>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-zinc-400 mb-1">Description</label>
                <textarea name="description" rows={4} value={formData.description} onChange={handleFormChange} className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 resize-none" placeholder="Detailed product description..." />
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
            
            {/* ALWAYS SHOW MAIN PRODUCT IMAGES */}
            <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-6">
              <h3 className="text-lg font-bold text-white mb-1">Primary Product Images <span className="text-red-500">*</span></h3>
              <p className="text-sm text-zinc-400 mb-6">These are the main images displayed on the shop catalog page. Up to 5 images allowed. Click an image to set it as Primary.</p>
              {renderImageGallery(mainImages, handleMainImageUpload, setMainImagePrimary, removeMainImage)}
            </div>

            <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-6">
              <h3 className="text-lg font-bold text-white mb-2">Does this product have variants?</h3>
              <p className="text-sm text-zinc-400 mb-6">Variants are used for items that have multiple options, like different sizes or colors.</p>
              <div className="flex gap-4">
                <button type="button" onClick={() => setHasVariants(false)} className={`flex-1 py-4 rounded-xl border-2 transition-all font-bold ${!hasVariants ? 'bg-indigo-500/10 border-indigo-500 text-indigo-400' : 'bg-zinc-900 border-zinc-800 text-zinc-500 hover:border-zinc-700'}`}>No, single product</button>
                <button type="button" onClick={() => setHasVariants(true)} className={`flex-1 py-4 rounded-xl border-2 transition-all font-bold ${hasVariants ? 'bg-indigo-500/10 border-indigo-500 text-indigo-400' : 'bg-zinc-900 border-zinc-800 text-zinc-500 hover:border-zinc-700'}`}>Yes, it has variants</button>
              </div>
            </div>

            {hasVariants && (
              <div className="space-y-6">
                <div className="flex flex-wrap gap-2">
                  <span className="text-sm text-zinc-400 py-2 mr-2">Quick Add:</span>
                  {['Color', 'Size', 'Material', 'Style'].map(opt => (
                    <button key={opt} type="button" onClick={() => addOption(opt)} className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-sm font-medium rounded-lg transition-colors flex items-center gap-2"><Plus className="w-4 h-4" /> {opt}</button>
                  ))}
                </div>

                <div className="space-y-4">
                  {options.map((option, index) => (
                    <div key={option.id} className="bg-zinc-950 border border-zinc-800 rounded-2xl p-6 relative group">
                      <button type="button" onClick={() => removeOption(option.id)} className="absolute top-4 right-4 text-zinc-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all"><X className="w-5 h-5" /></button>
                      <div className="mb-4 max-w-sm">
                        <label className="block text-sm font-bold text-zinc-300 mb-1">Option Name</label>
                        <input type="text" value={option.name} onChange={(e) => updateOptionName(option.id, e.target.value)} className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500" placeholder="e.g. Color" />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-zinc-300 mb-2">Values & Variant Images</label>
                        {index === 0 && (
                          <div className="mb-4 p-3 bg-blue-500/10 border border-blue-500/20 rounded-xl text-xs text-blue-400 flex items-start gap-2">
                            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                            <p><strong>Variant Image Assignment:</strong> Because this is your first option, you can upload up to 5 images per value. The shop gallery automatically swaps to these images when a customer selects this option.</p>
                          </div>
                        )}
                        {index === 0 ? (
                          <div className="flex flex-wrap items-start gap-4 mb-6">
                            {option.values.map((val: any) => (
                              <div key={val.id} className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 relative group/val max-w-full">
                                <button type="button" onClick={() => removeOptionValue(option.id, val.id)} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-lg opacity-0 group-hover/val:opacity-100 transition-opacity z-10"><X className="w-3 h-3" /></button>
                                <div className="font-bold text-white bg-zinc-950 py-1.5 px-3 rounded-lg border border-zinc-800 mb-3 inline-block text-sm">{val.value}</div>
                                <div className="mt-1">
                                  {renderImageGallery(
                                    val.images, 
                                    (e) => handleVariantImageUpload(option.id, val.id, e), 
                                    (imgId) => setVariantImagePrimary(option.id, val.id, imgId), 
                                    (imgId) => removeVariantImage(option.id, val.id, imgId)
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="flex flex-wrap gap-2 mb-6">
                            {option.values.map((val: any) => (
                              <div key={val.id} className="bg-zinc-900 border border-zinc-700 hover:border-zinc-500 rounded-lg py-2 px-3 flex items-center gap-2 group/val transition-colors">
                                <span className="font-bold text-white text-sm">{val.value}</span>
                                <button type="button" onClick={() => removeOptionValue(option.id, val.id)} className="text-zinc-500 hover:text-red-400 opacity-50 group-hover/val:opacity-100 transition-colors"><X className="w-3 h-3" /></button>
                              </div>
                            ))}
                          </div>
                        )}
                        <div className="flex gap-2 max-w-sm">
                          <input type="text" id={`add-val-${option.id}`} className="flex-1 bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500" placeholder={`Add ${option.name || 'value'}...`} onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addOptionValue(option.id, e.currentTarget.value); e.currentTarget.value = ''; } }} />
                          <button type="button" onClick={() => { const input = document.getElementById(`add-val-${option.id}`) as HTMLInputElement; if (input) { addOptionValue(option.id, input.value); input.value = ''; } }} className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg font-bold transition-colors">Add</button>
                        </div>
                      </div>
                    </div>
                  ))}
                  <button type="button" onClick={() => addOption('')} className="w-full py-4 rounded-2xl border-2 border-dashed border-zinc-700 text-zinc-400 hover:border-zinc-500 hover:text-zinc-300 font-bold transition-colors flex items-center justify-center gap-2"><Plus className="w-5 h-5" /> Add Another Option</button>
                </div>
              </div>
            )}
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
            {hasVariants ? (
              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                  <div>
                    <h3 className="text-lg font-bold text-white flex items-center gap-2"><Settings2 className="w-5 h-5 text-indigo-400" /> Auto-Generated Combinations</h3>
                    <p className="text-sm text-zinc-400 mt-1">Review your variants and apply bulk pricing.</p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 bg-zinc-950 p-4 pb-6 rounded-xl border border-zinc-800 items-end">
                    <div className="relative">
                      <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-1.5">Set All Cost (CNY)</label>
                      <input type="number" step="0.01" value={bulkAction.cost_price_cny} onChange={(e) => setBulkAction(p => ({ ...p, cost_price_cny: e.target.value }))} className="w-full bg-zinc-900 border border-zinc-700 hover:border-zinc-500 rounded-lg px-3 py-2 text-sm text-white focus:outline-none transition-colors" placeholder="¥0.00" />
                      <div className="h-0 relative">
                        {bulkAction.cost_price_cny && (
                          <div className="absolute top-1.5 left-1 text-[11px] text-emerald-400/90 font-mono font-bold whitespace-nowrap">
                            ≈ ₵{(parseFloat(bulkAction.cost_price_cny) / platformRate).toFixed(2)}
                          </div>
                        )}
                      </div>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-emerald-500/70 uppercase tracking-wider mb-1.5">Set All Selling (GHS)</label>
                      <input type="number" step="0.01" value={bulkAction.selling_price_ghs} onChange={(e) => setBulkAction(p => ({ ...p, selling_price_ghs: e.target.value }))} className="w-full bg-zinc-900 border border-zinc-700 hover:border-emerald-500/50 rounded-lg px-3 py-2 text-sm text-emerald-400 font-bold focus:outline-none transition-colors" placeholder="₵0.00" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-1.5">Set All Stock</label>
                      <input type="number" value={bulkAction.stock} onChange={(e) => setBulkAction(p => ({ ...p, stock: e.target.value }))} className="w-full bg-zinc-900 border border-zinc-700 hover:border-zinc-500 rounded-lg px-3 py-2 text-sm text-white focus:outline-none transition-colors" placeholder="0" />
                    </div>
                    <button type="button" onClick={handleBulkApply} className="w-full bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-xl shadow-indigo-900/20 transition-all h-[38px] flex items-center justify-center">Apply To All</button>
                  </div>
                </div>
                <div className="overflow-x-auto rounded-xl border border-zinc-800">
                  <table className="w-full text-left bg-zinc-950">
                    <thead className="bg-zinc-900 border-b border-zinc-800 text-xs font-bold text-zinc-400 uppercase tracking-wider">
                      <tr><th className="p-4 w-24">IMG</th><th className="p-4">Variant</th><th className="p-4">SKU</th><th className="p-4 w-32">Cost (CNY)</th><th className="p-4 w-32">Selling (GHS)</th><th className="p-4 w-28">Stock</th></tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-800/50">
                      {combinations.map((combo) => (
                        <tr key={combo.id} className="hover:bg-zinc-900/50 transition-colors">
                          <td className="p-4">{combo.image_url ? <img src={combo.image_url} alt="Variant" className="w-16 h-16 rounded-lg border border-zinc-700 object-cover" /> : <div className="w-16 h-16 rounded-lg border border-zinc-800 bg-zinc-900 flex items-center justify-center text-zinc-600"><ImagePlus className="w-6 h-6" /></div>}</td>
                          <td className="p-4 text-sm font-bold text-white">{Object.values(combo.variant_options).join(' / ')}</td>
                          <td className="p-4 font-mono text-xs text-zinc-500">{combo.sku}</td>
                          <td className="p-4 align-top pt-6">
                            <input type="number" step="0.01" value={combo.cost_price_cny} onChange={(e) => updateCombination(combo.id, 'cost_price_cny', e.target.value)} className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none" placeholder="¥0.00" />
                            {combo.cost_price_cny && (
                              <div className="text-xs text-emerald-400/90 mt-1.5 font-mono font-bold">
                                ≈ ₵{(parseFloat(combo.cost_price_cny) / platformRate).toFixed(2)}
                              </div>
                            )}
                          </td>
                          <td className="p-4 align-top pt-6">
                            {(() => {
                              const costCedi = (parseFloat(combo.cost_price_cny) || 0) / platformRate;
                              const selling = parseFloat(combo.selling_price_ghs) || 0;
                              const isLoss = costCedi > 0 && selling > 0 && selling < costCedi;
                              return (
                                <input type="number" step="0.01" value={combo.selling_price_ghs} onChange={(e) => updateCombination(combo.id, 'selling_price_ghs', e.target.value)} className={`w-full bg-zinc-900 border rounded-lg px-3 py-2 text-sm font-bold focus:outline-none transition-colors ${isLoss ? 'border-red-500 text-red-500 focus:border-red-400' : 'border-zinc-700 text-emerald-400 focus:border-emerald-500'}`} placeholder="₵0.00" />
                              );
                            })()}
                          </td>
                          <td className="p-4 align-top pt-6"><input type="number" value={combo.stock} onChange={(e) => updateCombination(combo.id, 'stock', e.target.value)} className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none" placeholder="0" /></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 max-w-3xl mx-auto">
                <h3 className="text-lg font-bold text-white mb-6">Standard Pricing</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div><label className="block text-sm font-medium text-zinc-400 mb-1">Cost Price (CNY)</label><input type="number" step="0.01" name="cost_price" value={formData.cost_price} onChange={handleFormChange} className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition-colors" placeholder="0.00" /></div>
                  <div>
                    <label className="block text-sm font-medium text-zinc-400 mb-1">Selling Price (GHS) *</label>
                    {(() => {
                      const costCedi = (parseFloat(formData.cost_price as string) || 0) / platformRate;
                      const selling = parseFloat(formData.price as string) || 0;
                      const isLoss = costCedi > 0 && selling > 0 && selling < costCedi;
                      return (
                        <input type="number" step="0.01" name="price" value={formData.price} onChange={handleFormChange} className={`w-full bg-zinc-950 border rounded-xl px-4 py-3 font-bold text-lg focus:outline-none transition-colors ${isLoss ? 'border-red-500 text-red-500 focus:border-red-400' : 'border-zinc-800 text-emerald-400 focus:border-emerald-500'}`} placeholder="0.00" />
                      );
                    })()}
                  </div>
                  <div><label className="block text-sm font-medium text-zinc-400 mb-1">Initial Stock</label><input type="number" name="stock" value={formData.stock} onChange={handleFormChange} className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition-colors" placeholder="0" /></div>
                </div>
                {formData.price && formData.cost_price && (
                  <div className="mt-8 bg-indigo-950/30 border border-indigo-500/20 rounded-xl p-6">
                    <h3 className="text-sm font-bold text-indigo-400 mb-4 flex items-center gap-2"><Calculator className="w-5 h-5" /> Profit Calculator</h3>
                    <div className="grid grid-cols-3 gap-6">
                      {(() => {
                        const costCny = parseFloat(formData.cost_price as string) || 0;
                        const sellingGhs = parseFloat(formData.price as string) || 0;
                        const costGhs = costCny / platformRate;
                        const profitGhs = sellingGhs - costGhs;
                        const margin = costGhs > 0 ? (profitGhs / costGhs) * 100 : 0;
                        return (
                          <>
                            <div><p className="text-[10px] text-zinc-500 uppercase tracking-wider font-bold mb-1">Est. Cost (GHS)</p><p className="text-xl font-mono text-zinc-300">₵{costGhs.toFixed(2)}</p></div>
                            <div><p className="text-[10px] text-zinc-500 uppercase tracking-wider font-bold mb-1">Est. Profit</p><p className={`text-xl font-mono ${profitGhs >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>₵{profitGhs.toFixed(2)}</p></div>
                            <div><p className="text-[10px] text-zinc-500 uppercase tracking-wider font-bold mb-1">Margin</p><p className={`text-xl font-mono ${margin >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>{margin.toFixed(1)}%</p></div>
                          </>
                        );
                      })()}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        <div className="flex items-center justify-between pt-8 mt-8 border-t border-zinc-800">
          <button type="button" onClick={step === 1 ? onCancel : () => setStep(step - 1)} disabled={isSubmitting} className="px-6 py-3 rounded-xl text-sm font-bold text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors flex items-center gap-2">
            {step === 1 ? 'Cancel' : <><ChevronLeft className="w-4 h-4" /> Back</>}
          </button>
          
          {step === 3 ? (
            <button key="publish-btn" type="submit" disabled={isSubmitting} className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white px-8 py-3 rounded-xl text-sm font-bold shadow-xl shadow-indigo-900/20 transition-all flex items-center gap-2">
              {isSubmitting ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</> : <><Save className="w-4 h-4" /> Publish Product</>}
            </button>
          ) : (
            <button key="next-btn" type="button" onClick={nextStep} disabled={isSubmitting} className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white px-8 py-3 rounded-xl text-sm font-bold shadow-xl shadow-indigo-900/20 transition-all flex items-center gap-2">
              Next Step <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
