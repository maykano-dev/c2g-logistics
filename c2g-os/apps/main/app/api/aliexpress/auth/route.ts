import { NextResponse } from 'next/server';

/**
 * AliExpress Open Platform — OAuth Authorization Redirect
 *
 * Redirects the user to AliExpress to grant consent.
 * Per docs: https://openservice.aliexpress.com/doc/api.htm (System Tool / Auth)
 *
 * Authorization URL: https://oauth.aliexpress.com/authorize
 * Required params: response_type=code, client_id (AppKey), redirect_uri, state, view=web, sp=ae
 */
export async function GET(request: Request) {
  const ALIEXPRESS_APP_KEY = process.env.ALIEXPRESS_APP_KEY;
  if (!ALIEXPRESS_APP_KEY) {
    return NextResponse.json({ error: 'ALIEXPRESS_APP_KEY is missing' }, { status: 500 });
  }

  const baseUrl     = process.env.NEXT_PUBLIC_APP_URL || 'https://c2glogistics.netlify.app';
  const callbackUrl = `${baseUrl}/api/aliexpress/callback`;

  // AliExpress OAuth authorization URL
  const oauthUrl = new URL('https://oauth.aliexpress.com/authorize');
  oauthUrl.searchParams.append('response_type', 'code');
  oauthUrl.searchParams.append('client_id',     ALIEXPRESS_APP_KEY);
  oauthUrl.searchParams.append('redirect_uri',  callbackUrl);
  oauthUrl.searchParams.append('state',         'c2g_ae_oauth_init');
  oauthUrl.searchParams.append('view',          'web');
  oauthUrl.searchParams.append('sp',            'ae'); // AliExpress scope identifier

  return NextResponse.redirect(oauthUrl.toString());
}
