import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { aliexpressRequest, saveAliExpressToken, refreshAliExpressToken } from '@/lib/aliexpress/client';

/**
 * AliExpress Token Refresh Endpoint
 * Called automatically when access_token is near expiry.
 * Uses /auth/token/security/refresh with the stored refresh_token.
 */
export async function POST() {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const { data, error } = await supabase
      .from('aliexpress_credentials')
      .select('refresh_token')
      .eq('id', 'default')
      .single();

    if (error || !data?.refresh_token) {
      return NextResponse.json({ error: 'No refresh token available' }, { status: 400 });
    }

    await refreshAliExpressToken(data.refresh_token);

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error('[AliExpress] Token refresh failed:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
