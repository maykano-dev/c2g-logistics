import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { refreshAlibabaToken } from '@/lib/alibaba/client';

/**
 * POST /api/alibaba/refresh
 * 
 * Manually force a refresh of the Alibaba OAuth access token.
 * This is useful for cron jobs or admin dashboards.
 */
export async function POST(request: Request) {
  try {
    // Basic security check - only allow POSTs (could add an auth token check here)
    
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json({ error: 'Supabase credentials missing' }, { status: 500 });
    }

    const supabase = createClient(supabaseUrl, supabaseKey);
    const { data, error } = await supabase
      .from('alibaba_credentials')
      .select('refresh_token')
      .eq('id', 'default')
      .single();

    if (error || !data?.refresh_token) {
      return NextResponse.json({ error: 'No active refresh_token found in database' }, { status: 404 });
    }

    console.log('[Alibaba] Forcing token refresh...');
    const newToken = await refreshAlibabaToken(data.refresh_token);

    return NextResponse.json({ 
      success: true, 
      message: 'Token successfully refreshed',
      token_preview: newToken.substring(0, 10) + '***'
    });

  } catch (error: any) {
    console.error('[Alibaba] Refresh Endpoint Error:', error);
    return NextResponse.json({ 
      error: 'Failed to refresh token', 
      details: error.message 
    }, { status: 500 });
  }
}
