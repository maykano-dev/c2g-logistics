'use server';

import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';
import { RegisterPackagesSchema } from '@/utils/security-schemas';
import { deductFromWallet } from '../wallet/actions';
import { createNotification } from '@/utils/notifications';

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
    .in('status', ['awaiting_arrival', 'in_warehouse', 'pending_payment', 'pending', 'clearing_customs'])
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
  const trackingNumbersRaw = formData.getAll('tracking_numbers') as string[];
  const storeNameRaw = formData.get('store_name') as string;
  const descriptionRaw = formData.get('description') as string;
  const shippingModeRaw = formData.get('shipping_mode') as string;

  const validation = RegisterPackagesSchema.safeParse({
    tracking_numbers: trackingNumbersRaw,
    store_name: storeNameRaw,
    description: descriptionRaw,
    shipping_mode: shippingModeRaw,
  });

  if (!validation.success) {
    throw new Error(validation.error.issues[0]?.message || 'Validation failed');
  }

  const { tracking_numbers: trackingNumbers, store_name: storeName, description, shipping_mode: shippingMode } = validation.data;

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

  // Notify user
  import('@/utils/notifications').then(({ createNotification }) => {
    if (data && data.length > 0) {
      createNotification({
        userId: user.id,
        title: 'Package Registered',
        message: `Successfully registered ${data.length} package(s). Please pay the registration fee to proceed.`,
        type: 'package_registered',
        link: `/dashboard/packages`
      });
    }
  }).catch(e => console.warn('Failed to dispatch notification:', e));

  revalidatePath('/dashboard/packages');
  return { success: true, count: trackingNumbers.length };
}

export async function updatePackageStatus(id: string, status: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error('Unauthorized');

  const { error } = await supabase
    .from('shipments')
    .update({ status })
    .eq('id', id)
    .eq('customer_id', user.id);

  if (error) {
    console.error('Error updating status:', error);
    throw new Error('Failed to update status');
  }

  revalidatePath(`/dashboard/packages/${id}`);
  revalidatePath('/dashboard/packages');
  return { success: true };
}

export async function deletePackage(id: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { error: 'Unauthorized' };

  // Verify it's unpaid
  const { data: pkg } = await supabase
    .from('shipments')
    .select('registration_fee_paid')
    .eq('id', id)
    .eq('customer_id', user.id)
    .single();
    
  if (!pkg) return { error: 'Package not found' };
  if (pkg.registration_fee_paid) return { error: 'Cannot delete a paid package' };

  const { error } = await supabase
    .from('shipments')
    .delete()
    .eq('id', id)
    .eq('customer_id', user.id);

  if (error) {
    console.error('Error deleting package:', error);
    return { error: 'Failed to delete package' };
  }

  revalidatePath('/dashboard/packages');
  return { success: true };
}

export async function payPackageRegistrationFee(packageId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: 'Unauthorized' };

  // 1. Check if package belongs to user and is unpaid
  const { data: pkg } = await supabase
    .from('shipments')
    .select('registration_fee_paid, tracking_number')
    .eq('id', packageId)
    .eq('customer_id', user.id)
    .single();

  if (!pkg) return { success: false, error: 'Package not found' };
  if (pkg.registration_fee_paid) return { success: false, error: 'Fee already paid' };

  // 2. Deduct from wallet
  const feeAmount = 5; // Flat fee of 5 GHS
  const ref = `REG-${packageId}`;
  
  const deductRes = await deductFromWallet(feeAmount, 'package_fee', `Package Registration Fee for ${pkg.tracking_number}`, packageId);
  
  if (!deductRes.success) {
    return { success: false, error: deductRes.error || 'Failed to deduct from wallet' };
  }

  // 3. Update shipment status
  const { error } = await supabase
    .from('shipments')
    .update({
        registration_fee_paid: true,
        status: 'awaiting_arrival',
        registration_fee_payment_reference: ref
    })
    .eq('id', packageId);

  if (error) {
    console.error('Error updating shipment after fee payment:', error);
    return { success: false, error: 'Failed to update package status, but wallet was deducted. Please contact support.' };
  }

  createNotification({
    userId: user.id,
    title: 'Registration Fee Paid',
    message: `Your payment of ₵5 for package ${pkg.tracking_number} was successful. It will now be processed.`,
    type: 'package_fee_paid',
    priority: 'info',
    link: `/dashboard/packages/${packageId}`
  }).catch(e => console.warn('Failed to dispatch notification:', e));

  revalidatePath('/dashboard/packages');
  return { success: true };
}
