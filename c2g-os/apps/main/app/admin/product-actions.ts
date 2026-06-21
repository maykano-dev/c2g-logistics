'use server';

import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';

export async function adminDeleteProduct(productId: string) {
  const supabase = await createClient();
  
  // Enforce admin check
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: 'Unauthorized' };
  
  const { data: admin } = await supabase
    .from('admins')
    .select('*')
    .eq('user_id', user.id)
    .single();

  if (!admin) return { success: false, error: 'Unauthorized' };

  try {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', productId);

    if (error) throw error;
    
    // Log the action
    await supabase.from('audit_logs').insert({
      user_id: user.id,
      action: 'DELETE_PRODUCT',
      entity_type: 'product',
      entity_id: productId,
      ip_address: 'server'
    });

    revalidatePath('/admin/(protected)/commerce/products');
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to delete product' };
  }
}

export async function adminCreateProduct(payload: any) {
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: 'Unauthorized' };
  
  const { data: admin } = await supabase
    .from('admins')
    .select('*')
    .eq('user_id', user.id)
    .single();

  if (!admin) return { success: false, error: 'Unauthorized' };

  try {
    const { product, options, combinations, mainImages } = payload;

    // Extract non-schema fields to map them correctly
    const { cost_price, has_variants, supplier_link, price, stock, ...restProduct } = product;

    // 1. Insert Product
    const { data: newProduct, error } = await supabase
      .from('products')
      .insert({
        ...restProduct,
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
              is_primary: img.isPrimary, // specific to this variant value
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
      const variantsToInsert = combinations.map((c: any) => ({
        product_id: newProduct.id,
        sku: c.sku,
        variant_options: c.variant_options,
        price: c.selling_price_ghs || product.price,
        selling_price_ghs: c.selling_price_ghs,
        cost_price_cny: c.cost_price_cny,
        stock: c.stock,
        image_url: c.image_url
      }));

      const { error: varError } = await supabase.from('product_variants').insert(variantsToInsert);
      if (varError) {
        console.error("Variant insert error:", varError);
        // We shouldn't fail completely if product inserted, but ideally use RPC for transactions.
      }
    }
    
    // Log action
    await supabase.from('audit_logs').insert({
      user_id: user.id,
      action: 'CREATE_PRODUCT',
      entity_type: 'product',
      entity_id: newProduct.id,
      ip_address: 'server'
    });

    revalidatePath('/admin/(protected)/commerce/products');
    return { success: true, data: newProduct };
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to create product' };
  }
}

export async function adminUpdateProduct(id: string, payload: any) {
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: 'Unauthorized' };
  
  const { data: admin } = await supabase
    .from('admins')
    .select('*')
    .eq('user_id', user.id)
    .single();

  if (!admin) return { success: false, error: 'Unauthorized' };

  try {
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
      // Insert Variant Gallery Images
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

      // Insert Combinations
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
        const { error: varError } = await supabase
          .from('product_variants')
          .insert(variantInserts);
        if (varError) throw varError;
      }
    }
    
    // Log action
    await supabase.from('audit_logs').insert({
      user_id: user.id,
      action: 'UPDATE_PRODUCT',
      entity_type: 'product',
      entity_id: id,
      ip_address: 'server'
    });

    revalidatePath('/admin/(protected)/commerce/products');
    revalidatePath(`/admin/(protected)/commerce/products/${id}`);
    revalidatePath(`/admin/(protected)/commerce/products/${id}/edit`);
    return { success: true, data: updatedProduct };
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to update product' };
  }
}
