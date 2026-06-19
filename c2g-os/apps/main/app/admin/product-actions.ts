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
