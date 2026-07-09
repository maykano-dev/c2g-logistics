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
    console.log("[CRON] Starting Smart Gateway Catalog Sync...");
    const supabase = await createClient();

    // 1. Fetch 5 categories that need syncing (oldest first, or null last_synced)
    // We only take 5 to avoid Vercel timeouts (60s).
    const { data: categories, error: catError } = await supabase
      .from('aliexpress_categories')
      .select('id, name')
      .order('last_synced', { ascending: true, nullsFirst: true })
      .limit(5);

    if (catError || !categories || categories.length === 0) {
      throw new Error("Failed to fetch categories or no categories available.");
    }

    console.log(`[CRON] Selected ${categories.length} categories for sync.`);
    let totalUpserted = 0;

    for (const category of categories) {
      console.log(`[CRON] Fetching products for category: ${category.name} (${category.id})`);
      
      let allCategoryItems: any[] = [];
      
      // Fetch 2 pages of 50 items (100 total items per category)
      for (let page = 1; page <= 2; page++) {
        const res = await aliexpressRequest({
          apiMethod: 'aliexpress.ds.text.search',
          params: {
            categoryId: category.id,
            category_id: category.id,
            pageNo: String(page),
            page_no: String(page),
            pageSize: '50',
            page_size: '50',
            sort: 'default', // Popularity by default
            currency: 'USD',
            local: 'en_US',
            countryCode: 'GH',
            shipToCountry: 'GH',
          }
        });

        const wrapper = res?.aliexpress_ds_text_search_response || res;
        let items: any[] = [];
        
        if (Array.isArray(wrapper?.data?.products?.selection_search_product)) {
          items = wrapper.data.products.selection_search_product;
        } else if (Array.isArray(wrapper?.data?.products)) {
          items = wrapper.data.products;
        }

        if (items.length > 0) {
          allCategoryItems.push(...items);
        }
      }

      if (allCategoryItems.length > 0) {
        // Map data to DB schema
        const records = allCategoryItems.map((p: any) => {
          const usdPrice = parseFloat(p.product_price || p.target_sale_price || p.app_sale_price || '0');
          return {
            id: String(p.product_id), // UUID or AE ID
            aliexpress_id: String(p.product_id),
            title: p.product_title || p.title || 'Unknown Product',
            price_snapshot_usd: usdPrice,
            thumbnail_url: p.product_main_image_url || p.image || '',
            category_id: category.id,
            catalog_type: 'featured', // Keep it permanent
            purchase_count: 0,
            last_synced: new Date().toISOString()
          };
        });

        // Upsert the 100 items
        const { error: upsertError } = await supabase
          .from('products')
          .upsert(records, { onConflict: 'aliexpress_id' }); // Conflict on AE ID
          
        if (upsertError) {
           console.error(`[CRON] Error upserting products for ${category.name}:`, upsertError);
        } else {
           totalUpserted += records.length;
           
           // Update category last_synced timestamp
           await supabase
             .from('aliexpress_categories')
             .update({ last_synced: new Date().toISOString() })
             .eq('id', category.id);
        }
      } else {
        // If no products found, still update last_synced so we don't get stuck in a loop trying to fetch empty categories
        await supabase
             .from('aliexpress_categories')
             .update({ last_synced: new Date().toISOString() })
             .eq('id', category.id);
      }
    }

    console.log(`[CRON] Completed. Upserted ${totalUpserted} products.`);
    
    return NextResponse.json({ 
      success: true, 
      syncedCategories: categories.map(c => c.name),
      productsUpserted: totalUpserted
    });

  } catch (error: any) {
    console.error("[CRON] Sync Catalog Failed:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
