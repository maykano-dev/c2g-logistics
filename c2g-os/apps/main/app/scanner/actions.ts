'use server';

import { createClient as createAdminClient } from '@supabase/supabase-js';
import { revalidatePath } from 'next/cache';

export async function processScannedPackage(candidates: string[]) {
  const supabase = createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
  
  try {
    let finalStatus = 'not_found';
    let customerName = 'Unknown';
    let trackingNumberMatched = candidates[0];
    let currentStatus = '';
    let shipmentMatch: any = null;

    // 1. Call Atomic RPC for instant lookup and update
    const { data: rpcData, error: rpcError } = await supabase.rpc('process_scanned_package_bulk', {
        candidates: candidates
    });

    if (rpcError) {
      throw new Error(rpcError.message);
    }

    if (rpcData && rpcData.status !== 'not_found') {
      finalStatus = rpcData.status;
      customerName = rpcData.customer_name || 'Unknown';
      trackingNumberMatched = rpcData.tracking_number || candidates[0];
      currentStatus = rpcData.current_status || '';
      
      // Best effort insert to scan logs
      await supabase.from('scan_logs').insert({
        tracking_number: trackingNumberMatched,
        status: finalStatus,
        customer_name: customerName,
        message: `Package type: ${rpcData.type || 'unknown'}, ID: ${rpcData.id || 'none'}`
      });
    } else {
      // Not found
      await supabase.from('scan_logs').insert({
        tracking_number: candidates[0],
        status: 'not_found'
      });
    }

    revalidatePath('/scanner');
    return { success: true, data: { status: finalStatus, customer_name: customerName, current_status: currentStatus, tracking_number: trackingNumberMatched } };
    
  } catch (err: any) {
    console.error('Scan Error:', err);
    return { success: false, error: err.message || 'Server error during scan' };
  }
}
