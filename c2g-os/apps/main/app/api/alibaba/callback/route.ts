import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

/**
 * Alibaba OAuth Token Exchange Callback
 *
 * Per official docs, the authorization code is exchanged for tokens via
 * a direct POST to the Taobao OAuth endpoint (NOT via the TOP API gateway).
 *
 * Reference: https://developer.alibaba.com/en/doc.htm (Auth flow docs)
 * Token endpoint: https://oauth.taobao.com/token
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code  = searchParams.get('code');
  const error = searchParams.get('error');
  const error_description = searchParams.get('error_description');

  if (error || !code) {
    return new NextResponse(
      `Alibaba Authorization Failed: ${error_description || 'Missing authorization code'}`,
      { status: 400 }
    );
  }

  const ALIBABA_APP_KEY    = process.env.ALIBABA_APP_KEY;
  const ALIBABA_APP_SECRET = process.env.ALIBABA_APP_SECRET;

  if (!ALIBABA_APP_KEY || !ALIBABA_APP_SECRET) {
    return new NextResponse('Server configuration error: Alibaba credentials missing.', { status: 500 });
  }

  try {
    // Direct OAuth token exchange endpoint (bypasses TOP gateway signing)
    // POST https://oauth.taobao.com/token with grant_type=authorization_code
    const baseUrl      = process.env.NEXT_PUBLIC_APP_URL || 'https://c2glogistics.netlify.app';
    const redirectUri  = `${baseUrl}/api/alibaba/callback`;

    const body = new URLSearchParams({
      grant_type:    'authorization_code',
      code,
      client_id:     ALIBABA_APP_KEY,
      client_secret: ALIBABA_APP_SECRET,
      redirect_uri:  redirectUri,
      view:          'web',
    });

    const tokenRes = await fetch('https://oauth.taobao.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8' },
      body: body.toString(),
    });

    const tokenData = await tokenRes.json();

    if (!tokenData.access_token) {
      console.error('Alibaba token exchange failed:', tokenData);
      throw new Error(tokenData.error_description || tokenData.zh_desc || 'Failed to retrieve access token.');
    }

    // Save tokens securely in Supabase
    const supabaseUrl            = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
    const supabase               = createClient(supabaseUrl, supabaseServiceRoleKey);

    const { error: dbError } = await supabase
      .from('alibaba_credentials')
      .upsert({
        id:                 'default',
        access_token:       tokenData.access_token,
        refresh_token:      tokenData.refresh_token,
        expires_in:         tokenData.expires_in         ? parseInt(String(tokenData.expires_in), 10)         : null,
        refresh_expires_in: tokenData.refresh_token_timeout ? parseInt(String(tokenData.refresh_token_timeout), 10) : null,
        taobao_user_id:     tokenData.taobao_user_id,
        taobao_user_nick:   tokenData.taobao_user_nick,
        updated_at:         new Date().toISOString(),
      }, { onConflict: 'id' });

    if (dbError) {
      console.error('Failed to save Alibaba tokens to database:', dbError);
      return new NextResponse('Authorization successful, but failed to save tokens securely.', { status: 500 });
    }

    // Redirect to admin with success flag
    return NextResponse.redirect(`${baseUrl}/admin?alibaba_connected=true`);
  } catch (err: any) {
    console.error('Error during Alibaba token exchange:', err);
    return new NextResponse(`Alibaba Token Exchange Failed: ${err.message}`, { status: 500 });
  }
}
