import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// This route should be triggered periodically by a cron service (like Vercel Cron)
// to clean up old abandoned transactions.
export async function GET(req: Request) {
  // Validate basic authorization if you configure a cron secret
  const authHeader = req.headers.get('authorization');
  const cronSecret = process.env.CRON_SECRET;
  
  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
    
    // We must use the service role key since this is a system background task
    const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

    const { data, error } = await supabase.rpc('sweep_abandoned_transactions');

    if (error) {
      console.error("Cron Sweep Error:", error);
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, ...data });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
