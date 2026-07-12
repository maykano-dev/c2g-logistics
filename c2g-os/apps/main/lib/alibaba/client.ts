import crypto from 'crypto';
import { createClient } from '@supabase/supabase-js';

/**
 * Alibaba Open Platform (ISV / Buyer Sourcing Solution) API Client
 *
 * Uses the IOP architecture with HMAC-SHA256 signing.
 * Gateways (Standard):
 *   Auth (GET):      https://auth.alibaba.com/rest (or https://api.taobao.com/router/rest depending on specific ICBU routing)
 *   Business (POST): https://api.taobao.com/router/rest
 */

const ALIBABA_APP_KEY = process.env.ALIBABA_APP_KEY;
const ALIBABA_APP_SECRET = process.env.ALIBABA_APP_SECRET;

// Update these if the Dropshipping docs specify a different gateway
const ALIBABA_AUTH_GATEWAY = 'https://api.taobao.com/router/rest';
const ALIBABA_API_GATEWAY = 'https://api.taobao.com/router/rest';

export interface AlibabaRequestOptions {
  /** The API method name, e.g. 'alibaba.sourcing.product.search' */
  apiMethod: string;
  /** Business-specific parameters for this API call */
  params?: Record<string, any>;
  /** Optional: provide access token directly (otherwise auto-fetched from Supabase) */
  accessToken?: string;
  /** If true, use GET to the REST gateway (for auth token ops). Default: false */
  isAuthCall?: boolean;
  /** The HTTP method to use. Defaults to GET for auth calls, POST for business calls. */
  httpMethod?: 'GET' | 'POST';
}

/**
 * Builds the IOP HMAC-SHA256 signature for Alibaba.
 */
function generateSignature(params: Record<string, string>, apiPath: string, isAuthCall: boolean): string {
  if (!ALIBABA_APP_SECRET) {
    throw new Error('ALIBABA_APP_SECRET is missing from environment variables.');
  }

  const sortedKeys = Object.keys(params)
    .filter(k => k !== 'sign')
    .sort();

  const str = sortedKeys.reduce((acc, key) => acc + key + params[key], '');
  // Auth calls might require the apiPath prefixed to the string
  const stringToSign = isAuthCall ? (apiPath + str) : str;

  const hmac = crypto.createHmac('sha256', ALIBABA_APP_SECRET);
  hmac.update(stringToSign, 'utf8');
  return hmac.digest('hex').toUpperCase();
}

/**
 * Refreshes the Alibaba token using the refresh_token.
 */
export async function refreshAlibabaToken(refreshToken: string): Promise<string> {
  const tokenData = await alibabaRequest({
    apiMethod: '/auth/token/refresh',
    params: { refresh_token: refreshToken },
    isAuthCall: true,
  });

  const newToken = tokenData?.access_token || tokenData?.result?.access_token;
  if (!newToken) {
    throw new Error(tokenData?.msg || 'Failed to refresh Alibaba access_token');
  }

  await saveAlibabaToken({
    access_token: newToken,
    refresh_token: tokenData.refresh_token || tokenData?.result?.refresh_token,
    expires_in: tokenData.expire_time
      ? Math.floor((tokenData.expire_time - Date.now()) / 1000)
      : undefined,
    refresh_expires_in: tokenData.refresh_token_valid_time,
    user_info: tokenData.user_nick ? { user_nick: tokenData.user_nick } : undefined,
  });

  return newToken;
}

/**
 * Fetches the stored Alibaba access token from Supabase.
 * Returns null if no token exists or it's expired/expiring soon.
 */
async function fetchStoredToken(): Promise<string | null> {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!supabaseUrl || !supabaseKey) return null;

    const supabase = createClient(supabaseUrl, supabaseKey);
    const { data } = await supabase
      .from('alibaba_credentials')
      .select('access_token, expires_in, refresh_token, updated_at')
      .eq('id', 'default')
      .single();

    if (!data?.access_token) return null;

    // Reject if expired (5 min buffer). Alibaba stores expires_in as seconds relative to updated_at
    if (data.expires_in && data.updated_at) {
      const updatedAt = new Date(data.updated_at).getTime();
      const expiresAt = updatedAt + (data.expires_in * 1000);
      
      if (Date.now() + 5 * 60 * 1000 >= expiresAt) {
        console.warn('[Alibaba] Token expired — auto-refreshing...');
        if (data.refresh_token) {
          try {
            return await refreshAlibabaToken(data.refresh_token);
          } catch (err) {
            console.error('[Alibaba] Auto-refresh failed:', err);
            return null;
          }
        }
        return null;
      }
    }

    return data.access_token;
  } catch (e) {
    console.warn('[Alibaba] Could not fetch token from DB:', e);
    return null;
  }
}

/**
 * Makes a signed request to the Alibaba Open Platform.
 */
export async function alibabaRequest<T = any>({
  apiMethod,
  params = {},
  accessToken,
  isAuthCall = false,
  httpMethod,
}: AlibabaRequestOptions): Promise<T> {
  if (!ALIBABA_APP_KEY) {
    throw new Error('ALIBABA_APP_KEY is missing from environment variables.');
  }

  // Auto-fetch OAuth token for non-auth calls
  if (!accessToken && !isAuthCall) {
    const stored = await fetchStoredToken();
    if (stored) {
      accessToken = stored;
    } else {
      console.warn(
        `[Alibaba] No valid session token for ${apiMethod}. ` +
        `Complete OAuth first: /api/alibaba/auth`
      );
    }
  }

  // System parameters
  const systemParams: Record<string, string> = {
    app_key: ALIBABA_APP_KEY,
    timestamp: String(Date.now()),
    sign_method: 'sha256',
    v: '2.0',
    format: 'json', // Some Alibaba gateways require format
  };

  if (!isAuthCall) {
    systemParams.method = apiMethod;
  }

  if (accessToken) {
    systemParams.session = accessToken;
  }

  // Merge & stringify all values
  const allParams: Record<string, string> = {};
  for (const [key, value] of Object.entries({ ...systemParams, ...params })) {
    if (value !== undefined && value !== null) {
      allParams[key] = typeof value === 'object' ? JSON.stringify(value) : String(value);
    }
  }

  // Sign
  const sign = generateSignature(allParams, apiMethod, isAuthCall);
  allParams.sign = sign;

  // Execute
  // By default, auth calls use GET. Business calls use POST unless overridden.
  const finalMethod = httpMethod || (isAuthCall ? 'GET' : 'POST');

  if (finalMethod === 'GET') {
    // GET → REST gateway
    const url = new URL(ALIBABA_API_GATEWAY + apiMethod);
    for (const [key, value] of Object.entries(allParams)) {
      url.searchParams.append(key, value);
    }
    const response = await fetch(url.toString(), { method: 'GET' });
    const data = await response.json();
    if (data.error_response) {
      const err = data.error_response;
      throw new Error(`Alibaba API Error: ${err.msg} (code: ${err.code}, sub: ${err.sub_msg || err.sub_code})`);
    }
    if (data.code !== undefined && data.code !== "0" && data.code !== 200 && data.code !== "200") {
       throw new Error(`Alibaba API Error: ${data.message || data.msg} (code: ${data.code})`);
    }
    return data as T;
  } else {
    // POST → SYNC gateway
    const body = new URLSearchParams();
    for (const [key, value] of Object.entries(allParams)) {
      body.append(key, value);
    }
    
    // Global Open Platform requires the apiMethod in the URL path
    const url = new URL(ALIBABA_API_GATEWAY + apiMethod).toString();
    
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8' },
      body: body.toString(),
    });
    const data = await response.json();
    if (data.error_response) {
      const err = data.error_response;
      console.error(`[Alibaba] API Error [${apiMethod}]:`, err);
      throw new Error(`Alibaba API Error: ${err.msg} (code: ${err.code}, sub: ${err.sub_msg || err.sub_code})`);
    }
    if (data.code !== undefined && data.code !== "0" && data.code !== 200 && data.code !== "200") {
       console.error(`[Alibaba] API Error [${apiMethod}]:`, data);
       throw new Error(`Alibaba API Error: ${data.message || data.msg} (code: ${data.code})`);
    }
    return data as T;
  }
}

/**
 * Saves an Alibaba access token to the alibaba_credentials table.
 */
export async function saveAlibabaToken(tokenData: {
  access_token: string;
  refresh_token?: string;
  expires_in?: number;
  refresh_expires_in?: number;
  account_id?: string;
  user_info?: any;
}): Promise<void> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  const supabase = createClient(supabaseUrl, supabaseKey);

  const { error } = await supabase
    .from('alibaba_credentials')
    .upsert({
      id: 'default',
      access_token: tokenData.access_token,
      refresh_token: tokenData.refresh_token || null,
      expires_in: tokenData.expires_in || null,
      refresh_expires_in: tokenData.refresh_expires_in || null,
      account_id: tokenData.account_id || null,
      user_info: tokenData.user_info || null,
      updated_at: new Date().toISOString(),
    }, { onConflict: 'id' });

  if (error) {
    throw new Error(`Failed to save Alibaba token: ${error.message}`);
  }
}
