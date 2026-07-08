import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { alibabaRequest } from '@/lib/alibaba/client';

export const maxDuration = 60; // 1 min max duration for cron
export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  // 1. Authenticate Cron (Standard Vercel Cron header or internal secret)
  const authHeader = request.headers.get('authorization');
  if (
    authHeader !== `Bearer ${process.env.CRON_SECRET}` && 
    request.headers.get('x-vercel-cron') !== '1' && 
    process.env.NODE_ENV === 'production'
  ) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

  let cacheCleared = 0;
  let trackedOrders = 0;
  let trackErrors = 0;
  let promotedProducts = 0;
  let syncedCategories = 0;

  try {
    // ==========================================
    // TASK 1: AUTO-PROMOTION ENGINE
    // ==========================================
    // Find procured orders in the last 24 hours to promote their items to Level 1
    const { data: recentJobs } = await supabase
      .from('procurement_jobs')
      .select('ecom_orders(items)')
      .eq('status', 'procured')
      .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
      .limit(50);
      
    if (recentJobs && recentJobs.length > 0) {
      const productIdsToPromote = new Set<string>();
      recentJobs.forEach((job: any) => {
        if (job.ecom_orders?.items) {
          job.ecom_orders.items.forEach((item: any) => {
            if (item.product_id) productIdsToPromote.add(String(item.product_id));
          });
        }
      });
      
      const idsArray = Array.from(productIdsToPromote);
      
      if (idsArray.length > 0) {
        // Check which ones are already in DB
        const { data: existing } = await supabase
          .from('products')
          .select('id')
          .in('id', idsArray);
          
        const existingIds = new Set(existing?.map(e => e.id) || []);
        const newIds = idsArray.filter(id => !existingIds.has(id));
        
        // Fetch and insert new ones
        for (const id of newIds) {
          try {
            const req = await alibabaRequest({
              apiPath: '/eco/buyer/product/description',
              params: { query_req: JSON.stringify({ product_id: id }) }
            });
            const p = req?.result?.result_data;
            if (p) {
               await supabase.from('products').insert({
                 id: id,
                 title: p.title,
                 slug: `auto-promoted-${id}`,
                 thumbnail_url: p.main_image,
                 price_snapshot_usd: parseFloat(p.wholesale_trade?.price || 0),
                 catalog_type: 'promoted',
                 purchase_count: 1
               });
               promotedProducts++;
            }
          } catch (e) {
            console.error("Auto-promotion failed for:", id, e);
          }
        }
        
        // Increment purchase_count for existing ones
        if (existingIds.size > 0) {
           for (const id of Array.from(existingIds)) {
             const { data: p } = await supabase.from('products').select('purchase_count').eq('id', id).single();
             await supabase.from('products').update({ purchase_count: (p?.purchase_count || 0) + 1 }).eq('id', id);
           }
        }
      }
    }

    // ==========================================
    // TASK 2: CLEAN UP STALE SEARCH CACHE
    // ==========================================
    const { count, error: cacheError } = await supabase
      .from('search_query_cache')
      .delete()
      .lt('expires_at', new Date().toISOString());

    if (!cacheError && count) {
      cacheCleared = count;
    }

    // ==========================================
    // TASK 2: SYNC LOGISTICS & TRACKING
    // ==========================================
    // Find all procured orders that don't have tracking numbers yet
    const { data: pendingOrders } = await supabase
      .from('ecom_orders')
      .select('id, alibaba_trade_id')
      .not('alibaba_trade_id', 'is', null)
      .is('alibaba_tracking_number', null)
      .limit(20); // Process in small batches

    if (pendingOrders && pendingOrders.length > 0) {
      for (const order of pendingOrders) {
        try {
          // Fetch from Alibaba Logistics API
          const payload = JSON.stringify({ order_id: order.alibaba_trade_id });
          const logRes = await alibabaRequest({
            apiPath: '/order/logistics/tracking/get',
            params: { query_req: payload }
          });

          const trackingData = logRes?.result?.result_data;
          
          if (trackingData && trackingData.tracking_number) {
            await supabase
              .from('ecom_orders')
              .update({
                alibaba_tracking_number: trackingData.tracking_number,
                alibaba_carrier: trackingData.carrier_name || 'Alibaba Logistics',
                order_status: 'shipped_internationally' // Push status forward
              })
              .eq('id', order.id);
            
            trackedOrders++;
          }
        } catch (err) {
          console.error(`Failed to track order ${order.id}:`, err);
          trackErrors++;
        }
      }
    }

    // ==========================================
    // TASK 4: SYNC ALIBABA CATEGORIES (WEEKLY)
    // ==========================================
    // Only run if categories are empty or last_synced is older than 7 days
    const { data: catCheck } = await supabase
      .from('alibaba_categories')
      .select('last_synced')
      .order('last_synced', { ascending: false })
      .limit(1);

    const needsSync = !catCheck || catCheck.length === 0 || 
      (new Date(catCheck[0]?.last_synced || 0).getTime() < Date.now() - 7 * 24 * 60 * 60 * 1000);

    if (needsSync) {
      try {
        const catRes = await alibabaRequest({
          apiPath: '/icbu/product/category/get',
          params: { cat_id: '0' } // Get root categories
        });

        const categories = catRes?.result?.category_info_list;
        
        if (categories && Array.isArray(categories)) {
          const insertData = categories.map((cat: any) => ({
            id: cat.category_id,
            name: cat.name || cat.category_name,
            slug: (cat.name || cat.category_name).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''),
            parent_id: null,
            last_synced: new Date().toISOString()
          }));

          const { error: upsertErr } = await supabase
            .from('alibaba_categories')
            .upsert(insertData, { onConflict: 'id' });

          if (!upsertErr) {
            syncedCategories = insertData.length;
          } else {
            console.error("Failed to upsert categories:", upsertErr);
          }
        }
      } catch (catError) {
        console.error("Category Sync Failed:", catError);
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Alibaba Background Sync Completed',
      cacheCleared,
      trackedOrders,
      trackErrors,
      promotedProducts,
      syncedCategories
    });

  } catch (error: any) {
    console.error('Alibaba Cron Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
