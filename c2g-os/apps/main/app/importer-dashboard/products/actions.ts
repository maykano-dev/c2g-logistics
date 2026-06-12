'use server';

import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';

export async function addImporterProduct(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { success: false, error: 'Unauthorized' };

  // Get importer ID
  const { data: importer } = await supabase
    .from('importers')
    .select('id')
    .eq('user_id', user.id)
    .single();

  if (!importer) return { success: false, error: 'Importer not found' };

  const name = formData.get('name') as string;
  const description = formData.get('description') as string;
  const sourcePlatform = formData.get('sourcePlatform') as string;
  const sourceUrl = formData.get('sourceUrl') as string;
  const costPriceCny = parseFloat(formData.get('costPriceCny') as string);
  const sellingPriceGhs = parseFloat(formData.get('sellingPriceGhs') as string);
  const category = formData.get('category') as string;
  const primaryImage = formData.get('primaryImage') as string;

  if (!name || isNaN(costPriceCny) || isNaN(sellingPriceGhs)) {
    return { success: false, error: 'Please provide valid name and pricing.' };
  }

  // We set price to an arbitrary number because selling_price_ghs handles the real price.
  // We'll set price = costPriceCny and price_cny = costPriceCny for standard columns just to be safe.
  
  const { data: product, error: productError } = await supabase
    .from('products')
    .insert({
      importer_id: importer.id,
      name,
      description,
      category: category || 'general',
      source_platform: sourcePlatform,
      source_url: sourceUrl,
      cost_price_cny: costPriceCny,
      selling_price_ghs: sellingPriceGhs,
      price: costPriceCny, // legacy support
      price_cny: costPriceCny, // legacy support
      stock: 999, // default
      status: 'published',
      sku: `P-${Date.now()}`
    })
    .select('id, product_code')
    .single();

  if (productError || !product) {
    console.error('Error adding product:', productError);
    return { success: false, error: productError?.message || 'Failed to add product' };
  }

  // Add primary image if provided
  if (primaryImage) {
    await supabase.from('product_images').insert({
      product_id: product.id,
      image_url: primaryImage,
      is_primary: true
    });
  }

  // Auto-generate a default variant using selling_price_ghs for now
  await supabase.from('product_variants').insert({
    product_id: product.id,
    sku: `${product.product_code}-DEFAULT`,
    price: sellingPriceGhs, 
    price_cny: costPriceCny,
    stock: 999
  });

  revalidatePath('/importer-dashboard/products');
  
  return { success: true, productCode: product.product_code };
}
