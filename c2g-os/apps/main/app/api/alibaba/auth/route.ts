import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const ALIBABA_APP_KEY = process.env.ALIBABA_APP_KEY;
  if (!ALIBABA_APP_KEY) {
    return NextResponse.json({ error: 'ALIBABA_APP_KEY is missing' }, { status: 500 });
  }

  // Ensure we use the correct absolute URL for the callback
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://c2g-logistics.com';
  const callbackUrl = `${baseUrl}/api/alibaba/callback`;

  // ICBU OAuth uses the Taobao OAuth system (NOT oauth.alibaba.com)
  // Reference: https://developer.alibaba.com/en/doc.htm (Auth flow)
  const oauthUrl = new URL('https://oauth.taobao.com/authorize');
  oauthUrl.searchParams.append('client_id', ALIBABA_APP_KEY);
  oauthUrl.searchParams.append('redirect_uri', callbackUrl);
  oauthUrl.searchParams.append('response_type', 'code');
  oauthUrl.searchParams.append('state', 'c2g_oauth_init');
  oauthUrl.searchParams.append('view', 'web');

  return NextResponse.redirect(oauthUrl.toString());
}
