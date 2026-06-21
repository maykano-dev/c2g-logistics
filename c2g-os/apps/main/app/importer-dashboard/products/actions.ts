'use server';

import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';
import { uploadImage } from '@/utils/image-service';
import { AddProductSchema } from '@/utils/security-schemas';

export async function getImporterProducts() {
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

  const { data: products, error } = await supabase
    .from('products')
    .select(`
      *,
      product_images (id, image_url, is_primary)
    `)
    .eq('importer_id', importer.id)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching importer products:', error);
    return { success: false, error: error.message };
  }

  return { success: true, products: products || [] };
}

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
    return { success: false, error: validation.error.issues[0]?.message || 'Validation failed' };
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

export async function importerCreateProduct(payload: any) {
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: 'Unauthorized' };
  
  const { data: importer } = await supabase
    .from('importers')
    .select('id')
    .eq('user_id', user.id)
    .single();

  if (!importer) return { success: false, error: 'Importer not found' };

  try {
    const { product, options, combinations, mainImages } = payload;

    // Extract non-schema fields
    const { cost_price, has_variants, supplier_link, price, stock, ...restProduct } = product;

    // 1. Insert Product
    const { data: newProduct, error } = await supabase
      .from('products')
      .insert({
        ...restProduct,
        importer_id: importer.id,
        product_link: supplier_link || null,
        price: price ? parseFloat(price) : 0,
        stock: stock ? parseInt(stock) : 0,
        cost_price_cny: cost_price ? parseFloat(cost_price) : null,
      })
      .select()
      .single();

    if (error) throw error;

    // 2. Insert Images into product_images
    const imagesToInsert: any[] = [];
    if (mainImages && mainImages.length > 0) {
      imagesToInsert.push(...mainImages.map((img: any) => ({
        product_id: newProduct.id,
        image_url: img.url,
        is_primary: img.isPrimary,
        media_type: 'image',
      })));
    }
    
    if (product.has_variants && options) {
      options.forEach((opt: any) => {
        opt.values.forEach((val: any) => {
          if (val.images && val.images.length > 0) {
            imagesToInsert.push(...val.images.map((img: any) => ({
              product_id: newProduct.id,
              image_url: img.url,
              is_primary: img.isPrimary,
              media_type: 'image',
              variant_value: val.value
            })));
          }
        });
      });
    }

    if (imagesToInsert.length > 0) {
      const { error: imgError } = await supabase.from('product_images').insert(imagesToInsert);
      if (imgError) console.error("Image insert error:", imgError);
    }

    // 3. Insert Variants if applicable
    if (product.has_variants && combinations && combinations.length > 0) {
      const variantsToInsert = combinations.map((c: any) => {
        const parsedSelling = c.selling_price_ghs ? parseFloat(c.selling_price_ghs) : 0;
        const fallbackPrice = price ? parseFloat(price) : 0;
        return {
          product_id: newProduct.id,
          sku: c.sku,
          variant_options: JSON.stringify(c.variant_options),
          price: parsedSelling || fallbackPrice,
          selling_price_ghs: c.selling_price_ghs ? parseFloat(c.selling_price_ghs) : null,
          cost_price_cny: c.cost_price_cny ? parseFloat(c.cost_price_cny) : null,
          stock: c.stock ? parseInt(c.stock) : 0,
          image_url: c.image_url || null
        };
      });

      const { error: varError } = await supabase.from('product_variants').insert(variantsToInsert);
      if (varError) {
        console.error("Variant insert error:", varError);
      }
    }
    
    revalidatePath('/importer-dashboard/products');
    return { success: true, data: newProduct };
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to create product' };
  }
}

export async function importerUpdateProduct(id: string, payload: any) {
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: 'Unauthorized' };
  
  const { data: importer } = await supabase
    .from('importers')
    .select('id')
    .eq('user_id', user.id)
    .single();

  if (!importer) return { success: false, error: 'Importer not found' };

  try {
    // Verify ownership
    const { data: existingProduct } = await supabase
      .from('products')
      .select('importer_id')
      .eq('id', id)
      .single();

    if (!existingProduct || existingProduct.importer_id !== importer.id) {
      return { success: false, error: 'Not authorized to edit this product' };
    }

    const { product, options, combinations, mainImages } = payload;
    const { cost_price, has_variants, supplier_link, price, stock, ...restProduct } = product;

    // 1. Update Product
    const { data: updatedProduct, error } = await supabase
      .from('products')
      .update({
        ...restProduct,
        product_link: supplier_link || null,
        price: price ? parseFloat(price) : 0,
        stock: stock ? parseInt(stock) : 0,
        cost_price_cny: cost_price ? parseFloat(cost_price) : null,
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    // 2. Wipe old related data
    await supabase.from('product_variants').delete().eq('product_id', id);
    await supabase.from('product_images').delete().eq('product_id', id);

    // 3. Insert Product Images (Main)
    if (mainImages && mainImages.length > 0) {
      const imageInserts = mainImages.filter((img: any) => img.url).map((img: any) => ({
        product_id: id,
        image_url: img.url,
        is_primary: img.isPrimary,
        media_type: 'image'
      }));
      if (imageInserts.length > 0) {
        await supabase.from('product_images').insert(imageInserts);
      }
    }

    // 4. Handle Variants
    if (has_variants && options && combinations) {
      for (const opt of options) {
        for (const val of opt.values) {
          if (val.images && val.images.length > 0) {
            const valImageInserts = val.images.filter((img: any) => img.url).map((img: any) => ({
              product_id: id,
              variant_value: val.value,
              image_url: img.url,
              is_primary: img.isPrimary,
              media_type: 'image'
            }));
            if (valImageInserts.length > 0) {
              await supabase.from('product_images').insert(valImageInserts);
            }
          }
        }
      }

      const variantInserts = combinations.map((combo: any) => {
        const parsedSelling = combo.selling_price_ghs ? parseFloat(combo.selling_price_ghs) : 0;
        const fallbackPrice = price ? parseFloat(price) : 0;
        return {
          product_id: id,
          sku: combo.sku,
          variant_options: JSON.stringify(combo.variant_options),
          price: parsedSelling || fallbackPrice,
          cost_price_cny: combo.cost_price_cny ? parseFloat(combo.cost_price_cny) : null,
          selling_price_ghs: combo.selling_price_ghs ? parseFloat(combo.selling_price_ghs) : null,
          stock: combo.stock ? parseInt(combo.stock) : 0,
          image_url: combo.image_url || null
        };
      });

      if (variantInserts.length > 0) {
        const { error: varError } = await supabase.from('product_variants').insert(variantInserts);
        if (varError) throw varError;
      }
    }
    
    revalidatePath('/importer-dashboard/products');
    return { success: true, data: updatedProduct };
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to update product' };
  }
}
