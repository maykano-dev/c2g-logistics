import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { alibabaRequest } from '@/lib/alibaba/client';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const error = searchParams.get('error');
  const error_description = searchParams.get('error_description');

  if (error || !code) {
    return new NextResponse(`Alibaba Authorization Failed: ${error_description || 'Missing authorization code'}`, { status: 400 });
  }

  try {
    // Exchange the authorization code for an access token
    // Based on the documentation, this is a POST to /auth/token/create
    const tokenResponse = await alibabaRequest({
      apiPath: '/auth/token/create',
      method: 'POST',
      params: { code, simplify: 'true' }
    });

    if (!tokenResponse.access_token) {
      throw new Error(tokenResponse.message || 'Failed to retrieve access token from Alibaba.');
    }

    // Save tokens securely in Supabase
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
    const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

    const { error: dbError } = await supabase
      .from('alibaba_credentials')
      .upsert({
        id: 'default',
        access_token: tokenResponse.access_token,
        refresh_token: tokenResponse.refresh_token,
        expires_in: tokenResponse.expires_in ? parseInt(tokenResponse.expires_in, 10) : null,
        refresh_expires_in: tokenResponse.refresh_expires_in ? parseInt(tokenResponse.refresh_expires_in, 10) : null,
        account_id: tokenResponse.account_id,
        user_info: tokenResponse.user_info,
        updated_at: new Date().toISOString()
      }, { onConflict: 'id' });

    if (dbError) {
      console.error('Failed to save Alibaba tokens to database:', dbError);
      return new NextResponse('Authorization successful, but failed to save tokens securely.', { status: 500 });
    }

    // Redirect to a success page or dashboard
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://c2g-logistics.com';
    return NextResponse.redirect(`${baseUrl}/admin?alibaba_connected=true`);
  } catch (err: any) {
    console.error('Error exchanging Alibaba code for token:', err);
    return new NextResponse(`Alibaba Token Exchange Failed: ${err.message}`, { status: 500 });
  }
}
