import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { aliexpressRequest } from "@/lib/aliexpress/client";

// Maximum Vercel execution time
export const maxDuration = 60;

export async function GET(request: Request) {
  const authHeader = request.headers.get('authorization');
  if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    console.log("[CRON] Starting Smart Gateway Catalog Refresh...");
    const supabase = await createClient();

    // 1. Fetch 50 products that haven't been synced in 24 hours
    const { data: products, error: prodError } = await supabase
      .from('products')
      .select('id, aliexpress_id, price_snapshot_usd, title')
      .not('aliexpress_id', 'is', null)
      .lte('last_synced', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
      .limit(50);

    if (prodError || !products || products.length === 0) {
      console.log("[CRON] No products need refreshing at this time.");
      return NextResponse.json({ success: true, message: "No products needed refreshing." });
    }

    console.log(`[CRON] Selected ${products.length} products for 24h refresh check.`);
    let updatedCount = 0;
    let deletedCount = 0;

    for (const product of products) {
      try {
        const res = await aliexpressRequest({
          apiMethod: 'aliexpress.ds.product.get',
          params: {
            product_id: product.aliexpress_id,
            ship_to_country: 'US',
            target_currency: 'USD',
            target_language: 'en',
          }
        });

        const raw = res?.aliexpress_ds_product_get_response?.result;
        
        // Product no longer exists or is banned on AliExpress
        if (res?.aliexpress_ds_product_get_response?.rsp_code === 605 || !raw) {
          console.log(`[CRON] Product ${product.aliexpress_id} unavailable. Deleting.`);
          await supabase.from('products').delete().eq('id', product.id);
          deletedCount++;
          continue;
        }

        // Product exists. Check price and stock.
        const baseInfo = raw.ae_item_base_info_dto;
        const newPrice = parseFloat(baseInfo?.product_price || baseInfo?.app_sale_price || '0');
        const stockStatus = raw.ae_item_sku_info_dtos?.ae_item_sku_info_d_t_o?.some((s:any) => s.sk_quantity > 0) || true;

        if (!stockStatus) {
            console.log(`[CRON] Product ${product.aliexpress_id} out of stock. Deleting from featured catalog.`);
            await supabase.from('products').delete().eq('id', product.id);
            deletedCount++;
            continue;
        }

        // Update price and last_synced
        await supabase
          .from('products')
          .update({ 
              price_snapshot_usd: newPrice > 0 ? newPrice : product.price_snapshot_usd,
              last_synced: new Date().toISOString()
          })
          .eq('id', product.id);
          
        updatedCount++;
      } catch (err) {
        console.error(`[CRON] Failed to refresh product ${product.aliexpress_id}:`, err);
      }
    }

    console.log(`[CRON] Completed. Updated ${updatedCount}, Deleted ${deletedCount}.`);
    
    return NextResponse.json({ 
      success: true, 
      updatedCount,
      deletedCount
    });

  } catch (error: any) {
    console.error("[CRON] Refresh Catalog Failed:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
