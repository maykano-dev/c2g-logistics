import { NextResponse } from 'next/server';
import { alibabaRequest, saveAlibabaToken } from '@/lib/alibaba/client';

/**
 * GET /api/alibaba/auth
 * 
 * OAuth Callback endpoint for Alibaba Open Platform (Buyer Sourcing Solution).
 * The user will authorize the app in Alibaba, and Alibaba will redirect back to:
 * `https://[your-domain]/api/alibaba/auth?code=XXXXXX`
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');

    if (!code) {
      // 1. If no code, redirect the user to the Alibaba Authorization URL
      // This URL allows the user to log in and grant permissions.
      const appKey = process.env.ALIBABA_APP_KEY;
      if (!appKey) {
        return NextResponse.json({ error: 'Missing ALIBABA_APP_KEY' }, { status: 500 });
      }

      // We need to determine the redirect URI dynamically or from env
      const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
      const redirectUri = encodeURIComponent(`${baseUrl}/api/alibaba/auth`);

      // NOTE: The documentation states the oversea environment authorization URL is openapi-auth.alibaba.com/oauth/authorize
      const authUrl = `https://openapi-auth.alibaba.com/oauth/authorize?response_type=code&client_id=${appKey}&redirect_uri=${redirectUri}&state=1212&view=web&sp=ICBU`;
      
      return NextResponse.redirect(authUrl);
    }

    // 2. We have the code! Exchange it for an access token
    console.log('[Alibaba] Received OAuth code, exchanging for token...');
    
    // Per documentation: endpoint is /auth/token/create
    const tokenData = await alibabaRequest({
      apiMethod: '/auth/token/create',
      params: { code },
      isAuthCall: true,
    });

    const accessToken = tokenData?.access_token || tokenData?.result?.access_token;
    if (!accessToken) {
      console.error('[Alibaba] Token exchange failed:', tokenData);
      return NextResponse.json({ 
        error: 'Failed to retrieve access token from Alibaba',
        rawResponse: tokenData
      }, { status: 400 });
    }

    // 3. Save the token to Supabase
    await saveAlibabaToken({
      access_token: accessToken,
      refresh_token: tokenData.refresh_token || tokenData?.result?.refresh_token,
      expires_in: tokenData.expires_in || (tokenData.expire_time ? Math.floor((tokenData.expire_time - Date.now()) / 1000) : undefined),
      refresh_expires_in: tokenData.refresh_expires_in || (tokenData.refresh_token_valid_time ? Math.floor((tokenData.refresh_token_valid_time - Date.now()) / 1000) : undefined),
      account_id: tokenData.account_id,
      user_info: tokenData.user_nick ? { user_nick: tokenData.user_nick } : undefined,
    });

    console.log('[Alibaba] Successfully authorized and saved credentials!');
    
    // Redirect to the admin dashboard or shop root with a success message
    return NextResponse.redirect(new URL('/shop?alibaba_auth=success', request.url));

  } catch (error: any) {
    console.error('[Alibaba] Auth Callback Error:', error);
    return NextResponse.json({ 
      error: 'Authorization failed', 
      details: error.message 
    }, { status: 500 });
  }
}
