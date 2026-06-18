'use server';

import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';
import { uploadImage } from '@/utils/image-service';
import { AddProductSchema } from '@/utils/security-schemas';

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

  const nameRaw = formData.get('name') as string;
  const descriptionRaw = formData.get('description') as string;
  const sourcePlatformRaw = formData.get('sourcePlatform') as string;
  const sourceUrlRaw = formData.get('sourceUrl') as string;
  const costPriceCnyRaw = parseFloat(formData.get('costPriceCny') as string);
  const sellingPriceGhsRaw = parseFloat(formData.get('sellingPriceGhs') as string);
  const categoryRaw = formData.get('category') as string;
  const primaryImageFile = formData.get('primaryImage') as File | null;

  const validation = AddProductSchema.safeParse({
    name: nameRaw,
    description: descriptionRaw,
    sourcePlatform: sourcePlatformRaw,
    sourceUrl: sourceUrlRaw,
    costPriceCny: costPriceCnyRaw,
    sellingPriceGhs: sellingPriceGhsRaw,
    category: categoryRaw,
  });

  if (!validation.success) {
    return { success: false, error: validation.error.issues[0].message };
  }

  const { name, description, sourcePlatform, sourceUrl, costPriceCny, sellingPriceGhs, category } = validation.data;

  // We set price to an arbitrary number because selling_price_ghs handles the real price.
  // We'll set price = sellingPriceGhs and price_cny = costPriceCny for standard columns just to be safe.
  
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
      price: sellingPriceGhs, // legacy support
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
  if (primaryImageFile && primaryImageFile.size > 0) {
    const buffer = Buffer.from(await primaryImageFile.arrayBuffer());
    const result = await uploadImage(buffer, primaryImageFile.name);
    
    if (result.success && result.url) {
      await supabase.from('product_images').insert({
        product_id: product.id,
        image_url: result.url,
        is_primary: true
      });
    } else {
      console.error('Failed to upload image:', result.error);
      // We still created the product, but without an image
    }
  }

  const variantsDataStr = formData.get('variantsData') as string;
  let variantsData = [];
  if (variantsDataStr) {
    try {
      variantsData = JSON.parse(variantsDataStr);
    } catch (e) {
      console.error('Error parsing variants data', e);
    }
  }

  if (variantsData.length > 0) {
    const variantInserts = variantsData.map((v: any, index: number) => ({
      product_id: product.id,
      sku: `${product.product_code}-V${index + 1}`,
      combination: v.combination,
      cost_price_cny: v.costYuan,
      selling_price_ghs: v.sellingGhs,
      price: v.sellingGhs, // legacy
      price_cny: v.costYuan, // legacy
      stock: v.stock || 999
    }));
    await supabase.from('product_variants').insert(variantInserts);
  } else {
    // Auto-generate a default variant using selling_price_ghs for now
    await supabase.from('product_variants').insert({
      product_id: product.id,
      sku: `${product.product_code}-DEFAULT`,
      cost_price_cny: costPriceCny,
      selling_price_ghs: sellingPriceGhs,
      price: sellingPriceGhs, 
      price_cny: costPriceCny,
      stock: 999
    });
  }

  revalidatePath('/importer-dashboard/products');
  
  return { success: true, productCode: product.product_code };
}
