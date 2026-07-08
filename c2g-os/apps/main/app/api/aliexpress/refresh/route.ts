import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { aliexpressRequest, saveAliExpressToken } from '@/lib/aliexpress/client';

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

    const tokenData = await aliexpressRequest({
      apiMethod: '/auth/token/security/refresh',
      params:    { refresh_token: data.refresh_token },
      isAuthCall: true,
    });

    const newToken = tokenData?.access_token || tokenData?.result?.access_token;
    if (!newToken) {
      throw new Error(tokenData?.msg || 'Failed to refresh access_token');
    }

    await saveAliExpressToken({
      access_token:             newToken,
      refresh_token:            tokenData.refresh_token            || tokenData?.result?.refresh_token,
      expires_in:               tokenData.expire_time
                                  ? Math.floor((tokenData.expire_time - Date.now()) / 1000)
                                  : undefined,
      refresh_token_valid_time: tokenData.refresh_token_valid_time,
      user_nick:                tokenData.user_nick,
      buyer_access_token:       tokenData.buyer_access_token,
    });

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error('[AliExpress] Token refresh failed:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
