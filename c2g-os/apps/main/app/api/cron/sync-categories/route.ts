import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { getAliExpressCategories } from "@/lib/aliexpress/categories";

// Allow execution for up to 60 seconds (App router standard limit for complex jobs)
export const maxDuration = 60; 

function generateSlug(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
}

export async function GET(request: Request) {
  // Simple security measure: check for a cron secret in the Authorization header
  // (In production, you'd set CRON_SECRET in your Vercel/environment vars)
  const authHeader = request.headers.get('authorization');
  if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    console.log("[CRON] Starting AliExpress category sync...");
    const supabase = await createClient();
    
    // Fetch from AliExpress API
    const aeCategories = await getAliExpressCategories();
    
    if (!aeCategories || aeCategories.length === 0) {
      console.warn("[CRON] No categories fetched from AliExpress.");
      return NextResponse.json({ success: false, message: "No categories returned from API" }, { status: 500 });
    }

    console.log(`[CRON] Fetched ${aeCategories.length} categories. Starting database upsert...`);

    // Prepare data for upsert
    const records = aeCategories.map(cat => ({
      id: String(cat.category_id),
      name: cat.category_name,
      slug: generateSlug(cat.category_name) + '-' + cat.category_id, // append id to ensure uniqueness
      parent_id: cat.parent_category_id ? String(cat.parent_category_id) : null,
      last_synced: new Date().toISOString()
    }));

    // Upsert in batches of 500 to avoid request size limits
    const BATCH_SIZE = 500;
    let successCount = 0;
    
    for (let i = 0; i < records.length; i += BATCH_SIZE) {
      const batch = records.slice(i, i + BATCH_SIZE);
      
      const { error } = await supabase
        .from('aliexpress_categories')
        .upsert(batch, { onConflict: 'id' });
        
      if (error) {
        console.error(`[CRON] Batch Upsert Error at index ${i}:`, error);
        throw error;
      }
      
      successCount += batch.length;
    }

    console.log(`[CRON] Successfully synced ${successCount} categories.`);
    
    return NextResponse.json({ 
      success: true, 
      count: successCount,
      message: "Categories synchronized successfully."
    });

  } catch (error: any) {
    console.error("[CRON] Category Sync Failed:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
