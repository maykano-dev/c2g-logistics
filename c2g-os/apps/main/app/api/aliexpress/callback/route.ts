import { NextResponse } from 'next/server';
import { aliexpressRequest, saveAliExpressToken } from '@/lib/aliexpress/client';

/**
 * AliExpress OAuth Token Exchange Callback
 *
 * Per official AliExpress Open Platform docs:
 * - Token endpoint: /auth/token/security/create (via GET to api-sg.aliexpress.com/rest)
 * - Required params: code (authorization code from redirect)
 * - Standard signed request: app_key, sign, timestamp, sign_method
 *
 * Reference: https://openservice.aliexpress.com (System Tool › generateSecurityToken)
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code  = searchParams.get('code');
  const error = searchParams.get('error');
  const error_description = searchParams.get('error_description');

  if (error || !code) {
    return new NextResponse(
      `AliExpress Authorization Failed: ${error_description || 'Missing authorization code'}`,
      { status: 400 }
    );
  }

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://c2glogistics.netlify.app';

  try {
    // Call /auth/token/create via the client (GET to REST gateway)
    const tokenData = await aliexpressRequest({
      apiMethod: '/auth/token/create',
      params:    { code },
      isAuthCall: true,
    });

    // Response shape: { access_token, refresh_token, expire_time, refresh_token_valid_time, user_nick, ... }
    const token = tokenData?.access_token || tokenData?.result?.access_token;
    if (!token) {
      console.error('[AliExpress] Token exchange failed:', tokenData);
      throw new Error(tokenData?.msg || tokenData?.error_description || 'Failed to retrieve access_token');
    }

    // Save tokens securely in Supabase
    await saveAliExpressToken({
      access_token:             token,
      refresh_token:            tokenData.refresh_token         || tokenData?.result?.refresh_token,
      expires_in:               tokenData.expire_time
                                  ? Math.floor((tokenData.expire_time - Date.now()) / 1000)
                                  : undefined,
      refresh_token_valid_time: tokenData.refresh_token_valid_time,
      user_nick:                tokenData.user_nick             || tokenData?.result?.user_nick,
      buyer_access_token:       tokenData.buyer_access_token,
    });

    // Redirect to admin with success flag
    return NextResponse.redirect(`${baseUrl}/admin?aliexpress_connected=true`);
  } catch (err: any) {
    console.error('[AliExpress] Error during token exchange:', err);
    return new NextResponse(`AliExpress Token Exchange Failed: ${err.message}`, { status: 500 });
  }
}
