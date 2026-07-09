import crypto from 'crypto';
import { createClient } from '@supabase/supabase-js';

/**
 * AliExpress Open Platform (IOP) API Client
 *
 * Reference: https://openservice.aliexpress.com/doc/api.htm
 *
 * Gateways:
 *   Auth (GET):      https://api-sg.aliexpress.com/rest
 *   Business (POST): https://api-sg.aliexpress.com/sync
 *
 * IOP HMAC-SHA256 signing — CONFIRMED correct by live API testing:
 *   1. Collect ALL request params EXCEPT `sign` itself
 *   2. Sort keys alphabetically
 *   3. Concatenate: key1value1 + key2value2 + ...
 *      NO apiPath prefix — unlike some older Alibaba SDKs
 *   4. HMAC-SHA256(appSecret, concatenated) → uppercase hex
 *
 * Note: `sign_method` IS included in the sign string.
 *       This was confirmed by testing all 4 variants against the live API.
 */

const ALIEXPRESS_APP_KEY    = process.env.ALIEXPRESS_APP_KEY;
const ALIEXPRESS_APP_SECRET = process.env.ALIEXPRESS_APP_SECRET;

const ALIEXPRESS_AUTH_GATEWAY = 'https://api-sg.aliexpress.com/rest';
const ALIEXPRESS_API_GATEWAY  = 'https://api-sg.aliexpress.com/sync';

// Only `sign` itself is excluded from the signature string
// (sign_method IS included — confirmed by live test)

export interface AliExpressRequestOptions {
  /** The API method name, e.g. 'aliexpress.ds.text.search' */
  apiMethod: string;
  /** Business-specific parameters for this API call */
  params?: Record<string, any>;
  /** Optional: provide access token directly (otherwise auto-fetched from Supabase) */
  accessToken?: string;
  /** If true, use GET to the REST gateway (for auth token ops). Default: false */
  isAuthCall?: boolean;
}

/**
 * Builds the IOP HMAC-SHA256 signature.
 *
 * For /rest (Auth) calls: String to sign = API_PATH + sortedKey1value1 + ...
 * For /sync (Business) calls: String to sign = sortedKey1value1 + ...
 */
function generateSignature(params: Record<string, string>, apiPath: string, isAuthCall: boolean): string {
  if (!ALIEXPRESS_APP_SECRET) {
    throw new Error('ALIEXPRESS_APP_SECRET is missing from environment variables.');
  }

  const sortedKeys = Object.keys(params)
    .filter(k => k !== 'sign')
    .sort();

  const str = sortedKeys.reduce((acc, key) => acc + key + params[key], '');
  const stringToSign = isAuthCall ? (apiPath + str) : str;

  const hmac = crypto.createHmac('sha256', ALIEXPRESS_APP_SECRET);
  hmac.update(stringToSign, 'utf8');
  return hmac.digest('hex').toUpperCase();
}

/**
 * Fetches the stored AliExpress access token from Supabase.
 * Returns null if no token exists or it's expired/expiring soon.
 */
async function fetchStoredToken(): Promise<string | null> {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!supabaseUrl || !supabaseKey) return null;

    const supabase = createClient(supabaseUrl, supabaseKey);
    const { data } = await supabase
      .from('aliexpress_credentials')
      .select('access_token, expires_at')
      .eq('id', 'default')
      .single();

    if (!data?.access_token) return null;

    // Reject if expired (5 min buffer)
    if (data.expires_at) {
      const expiresAt = new Date(data.expires_at);
      if (new Date().getTime() + 5 * 60 * 1000 >= expiresAt.getTime()) {
        console.warn('[AliExpress] Token expired — call /api/aliexpress/refresh');
        return null;
      }
    }

    return data.access_token;
  } catch (e) {
    console.warn('[AliExpress] Could not fetch token from DB:', e);
    return null;
  }
}

/**
 * Makes a signed request to the AliExpress Open Platform.
 */
export async function aliexpressRequest<T = any>({
  apiMethod,
  params = {},
  accessToken,
  isAuthCall = false,
}: AliExpressRequestOptions): Promise<T> {
  if (!ALIEXPRESS_APP_KEY) {
    throw new Error('ALIEXPRESS_APP_KEY is missing from environment variables.');
  }

  // Auto-fetch OAuth token for non-auth calls
  if (!accessToken && !isAuthCall) {
    const stored = await fetchStoredToken();
    if (stored) {
      accessToken = stored;
    } else {
      console.warn(
        `[AliExpress] No valid session token for ${apiMethod}. ` +
        `Complete OAuth first: /api/aliexpress/auth`
      );
    }
  }

  // ── System parameters ─────────────────────────────────────────────
  // NOTE: `format` is a TOP-era legacy param — NOT used by the IOP /sync gateway
  const systemParams: Record<string, string> = {
    app_key:     ALIEXPRESS_APP_KEY,
    timestamp:   String(Date.now()),  // Unix epoch milliseconds
    sign_method: 'sha256',            // Declares algo but is excluded from sign string
    v:           '2.0',
  };

  // `method` goes in params for /sync (business) calls
  if (!isAuthCall) {
    systemParams.method = apiMethod;
  }

  // `session` = OAuth access token
  if (accessToken) {
    systemParams.session = accessToken;
  }

  // ── Merge & stringify all values ──────────────────────────────────
  const allParams: Record<string, string> = {};
  for (const [key, value] of Object.entries({ ...systemParams, ...params })) {
    if (value !== undefined && value !== null) {
      allParams[key] = typeof value === 'object' ? JSON.stringify(value) : String(value);
    }
  }

  // ── Sign ──────────────────────────────────────────────────────────
  // For /rest we prefix the API path, for /sync we do not.
  const sign = generateSignature(allParams, apiMethod, isAuthCall);
  allParams.sign = sign;

  // ── Dev debug logging ─────────────────────────────────────────────
  if (process.env.NODE_ENV === 'development') {
    const sortedDebugKeys = Object.keys(allParams).filter(k => k !== 'sign').sort();
    const debugStr = sortedDebugKeys.reduce((acc, k) => acc + k + allParams[k], '');
    console.log(`[AliExpress] ${apiMethod} | sign_string[:120]: ${debugStr.substring(0, 120)}`);
    console.log(`[AliExpress] ${apiMethod} | signature: ${sign}`);
    console.log(`[AliExpress] ${apiMethod} | session: ${accessToken ? 'present' : 'MISSING'}`);
  }

  // ── Execute ───────────────────────────────────────────────────────
  if (isAuthCall) {
    // GET → REST gateway
    const url = new URL(ALIEXPRESS_AUTH_GATEWAY + apiMethod);
    for (const [key, value] of Object.entries(allParams)) {
      url.searchParams.append(key, value);
    }
    const response = await fetch(url.toString(), { method: 'GET' });
    const data = await response.json();
    if (data.error_response) {
      const err = data.error_response;
      throw new Error(`AliExpress Auth Error: ${err.msg} (code: ${err.code}, sub: ${err.sub_msg || err.sub_code})`);
    }
    return data as T;

  } else {
    // POST → SYNC gateway (application/x-www-form-urlencoded)
    const body = new URLSearchParams();
    for (const [key, value] of Object.entries(allParams)) {
      body.append(key, value);
    }
    const response = await fetch(ALIEXPRESS_API_GATEWAY, {
      method:  'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8' },
      body:    body.toString(),
    });
    const data = await response.json();
    if (data.error_response) {
      const err = data.error_response;
      console.error(`[AliExpress] API Error [${apiMethod}]:`, err);
      throw new Error(`AliExpress API Error: ${err.msg} (code: ${err.code}, sub: ${err.sub_msg || err.sub_code})`);
    }
    return data as T;
  }
}

/**
 * Saves an AliExpress access token to the aliexpress_credentials table.
 */
export async function saveAliExpressToken(tokenData: {
  access_token: string;
  refresh_token?: string;
  expires_in?: number;               // seconds from now
  refresh_token_valid_time?: number; // epoch ms
  user_nick?: string;
  buyer_access_token?: string;
}): Promise<void> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  const supabase    = createClient(supabaseUrl, supabaseKey);

  const expiresAt = tokenData.expires_in
    ? new Date(Date.now() + tokenData.expires_in * 1000).toISOString()
    : null;

  const refreshExpiresAt = tokenData.refresh_token_valid_time
    ? new Date(tokenData.refresh_token_valid_time).toISOString()
    : null;

  const { error } = await supabase
    .from('aliexpress_credentials')
    .upsert({
      id:                       'default',
      access_token:             tokenData.access_token,
      refresh_token:            tokenData.refresh_token      || null,
      buyer_access_token:       tokenData.buyer_access_token || null,
      expires_at:               expiresAt,
      refresh_token_expires_at: refreshExpiresAt,
      user_nick:                tokenData.user_nick          || null,
      updated_at:               new Date().toISOString(),
    }, { onConflict: 'id' });

  if (error) {
    throw new Error(`Failed to save AliExpress token: ${error.message}`);
  }
}
