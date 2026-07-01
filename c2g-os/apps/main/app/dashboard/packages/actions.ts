'use server';

import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';
import { RegisterPackagesSchema } from '@/utils/security-schemas';
import { deductFromWallet } from '../wallet/actions';
import { createNotification } from '@/utils/notifications';

export async function getRegistrationFee() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('platform_settings')
    .select('setting_value')
    .eq('setting_key', 'package_registration_fee')
    .single();

  if (error || !data) {
    // Fallback to default if table/row not found
    return 5;
  }
  return Number(data.setting_value);
}

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
  const imageUrlsRaw = formData.getAll('image_urls') as string[];
  const storeNameRaw = formData.get('store_name') as string;
  const descriptionRaw = formData.get('description') as string;

  const validation = RegisterPackagesSchema.safeParse({
    tracking_numbers: trackingNumbersRaw,
    store_name: storeNameRaw,
    description: descriptionRaw,
  });

  if (!validation.success) {
    throw new Error(validation.error.issues[0]?.message || 'Validation failed');
  }

  const { tracking_numbers: trackingNumbers, store_name: storeName, description } = validation.data;

  // Get customer info for insertion
  const { data: customer } = await supabase
    .from('customers')
    .select('name, customer_unique_id, phone')
    .eq('id', user.id)
    .single();

  const payloads = trackingNumbers.map((tracking, index) => ({
    customer_id: user.id,
    customer_name: customer?.name || 'Customer',
    customer_unique_id: customer?.customer_unique_id || '',
    tracking_number: tracking,
    items_description: `${storeName}: ${description}`,
    status: 'pending_payment',
    registration_fee_paid: false,
    method: 'pending',
    customer_contact: customer?.phone || '',
    image_url: imageUrlsRaw[index] || null
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

  // 2. Fetch dynamic fee
  const feeAmount = await getRegistrationFee();
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
    message: `Your payment of ₵${feeAmount} for package ${pkg.tracking_number} was successful. It will now be processed.`,
    type: 'package_fee_paid',
    priority: 'info',
    link: `/dashboard/packages/${packageId}`
  }).catch(e => console.warn('Failed to dispatch notification:', e));

  supabase.functions.invoke('telegram-notify', {
    body: {
        customer_id: user.id,
        type: 'package_registered',
        title: '📦 Registration Fee Paid!',
        message: `Your registration fee of ₵${feeAmount} for package ${pkg.tracking_number} was successfully paid.\n\nIt is now visible to admins and awaiting arrival.`,
        data: {
            'Tracking #': pkg.tracking_number || 'N/A',
            'Amount': `₵${feeAmount}`
        },
        priority: 'medium'
    }
  }).catch(e => console.warn('Failed to send telegram:', e));

  supabase.functions.invoke('telegram-admin-notify', {
    body: {
        type: 'package_registered',
        title: '🆕 Package Fee Paid',
        message: `A package registration fee was paid.`,
        data: {
            'Tracking #': pkg.tracking_number || 'N/A',
            'Customer': user.id
        },
        priority: 'low'
    }
  }).catch(e => console.warn('Failed to send admin telegram:', e));

  revalidatePath('/dashboard/packages');
  return { success: true };
}

export async function payBulkPackageRegistrationFees(packageIds: string[]) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: 'Unauthorized' };

  if (!packageIds || packageIds.length === 0) {
    return { success: false, error: 'No packages selected' };
  }

  // 1. Fetch the packages to ensure they belong to the user and are unpaid
  const { data: packages, error: fetchError } = await supabase
    .from('shipments')
    .select('id, registration_fee_paid, tracking_number')
    .in('id', packageIds)
    .eq('customer_id', user.id);

  if (fetchError || !packages) return { success: false, error: 'Failed to fetch packages' };

  const unpaidPackages = packages.filter(p => !p.registration_fee_paid);
  
  if (unpaidPackages.length === 0) {
    return { success: false, error: 'All selected packages are already paid.' };
  }

  const unpaidIds = unpaidPackages.map(p => p.id);
  const count = unpaidIds.length;

  // 2. Fetch dynamic fee
  const feePerPackage = await getRegistrationFee();
  const totalAmount = feePerPackage * count;

  // 3. Deduct from wallet atomically
  const ref = `BULK-REG-${Date.now()}`;
  const description = `Bulk Registration Fee for ${count} package(s)`;
  
  const deductRes = await deductFromWallet(totalAmount, 'package_fee', description, ref);
  
  if (!deductRes.success) {
    return { success: false, error: deductRes.error || 'Failed to deduct from wallet' };
  }

  // 4. Update shipment statuses
  const { error } = await supabase
    .from('shipments')
    .update({
        registration_fee_paid: true,
        status: 'awaiting_arrival',
        registration_fee_payment_reference: ref
    })
    .in('id', unpaidIds);

  if (error) {
    console.error('Error updating bulk shipments after fee payment:', error);
    return { success: false, error: 'Failed to update package statuses, but wallet was deducted. Please contact support.' };
  }

  createNotification({
    userId: user.id,
    title: 'Bulk Registration Fee Paid',
    message: `Your bulk payment of ₵${totalAmount} for ${count} package(s) was successful.`,
    type: 'package_fee_paid',
    priority: 'info',
    link: `/dashboard/packages`
  }).catch(e => console.warn('Failed to dispatch notification:', e));

  supabase.functions.invoke('telegram-notify', {
    body: {
        customer_id: user.id,
        type: 'package_registered',
        title: '📦 Bulk Registration Paid!',
        message: `Your bulk payment of ₵${totalAmount} for ${count} packages was successful.\n\nThey are now visible to admins and awaiting arrival.`,
        data: {
            'Packages Count': count,
            'Total Amount': `₵${totalAmount}`
        },
        priority: 'medium'
    }
  }).catch(e => console.warn('Failed to send telegram:', e));

  supabase.functions.invoke('telegram-admin-notify', {
    body: {
        type: 'package_registered',
        title: '🆕 Bulk Package Fees Paid',
        message: `A bulk package registration fee was paid.`,
        data: {
            'Packages Count': count,
            'Total Amount': `₵${totalAmount}`,
            'Customer': user.id
        },
        priority: 'low'
    }
  }).catch(e => console.warn('Failed to send admin telegram:', e));

  revalidatePath('/dashboard/packages');
  return { success: true, count, totalAmount };
}
