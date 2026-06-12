'use server';

import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';

export async function getPackages() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('Unauthorized');
  }

  // Fetch packages (shipments stuck in arrival pipeline)
  const { data, error } = await supabase
    .from('shipments')
    .select('*')
    .eq('customer_id', user.id)
    .in('status', ['awaiting_arrival', 'in_warehouse', 'pending_payment', 'pending'])
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching packages:', error);
    return [];
  }

  return data || [];
}

export async function registerPackages(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('Unauthorized');
  }

  // Extract from FormData
  const trackingNumbers = formData.getAll('tracking_numbers') as string[];
  const storeName = formData.get('store_name') as string;
  const description = formData.get('description') as string;
  const shippingMode = formData.get('shipping_mode') as string;

  if (!trackingNumbers.length || !storeName || !description || !shippingMode) {
    throw new Error('All fields are required');
  }

  // Get customer info for insertion
  const { data: customer } = await supabase
    .from('customers')
    .select('name, customer_unique_id, phone')
    .eq('id', user.id)
    .single();

  const payloads = trackingNumbers.map(tracking => ({
    customer_id: user.id,
    customer_name: customer?.name || 'Customer',
    customer_unique_id: customer?.customer_unique_id || '',
    tracking_number: tracking,
    items_description: `${storeName}: ${description}`,
    status: 'pending_payment',
    registration_fee_paid: false,
    method: shippingMode || 'pending',
    customer_contact: customer?.phone || ''
  }));

  const { data, error } = await supabase
    .from('shipments')
    .insert(payloads)
    .select();

  if (error) {
    if (error.code === '23505') {
      throw new Error('One or more tracking numbers have already been registered.');
    }
    console.error('Error inserting package:', error);
    throw new Error('Failed to register package(s)');
  }

  revalidatePath('/dashboard/packages');
  return { success: true, count: trackingNumbers.length };
}
