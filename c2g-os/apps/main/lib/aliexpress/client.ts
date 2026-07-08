import crypto from 'crypto';
import { createClient } from '@supabase/supabase-js';

/**
 * AliExpress Open Platform API Client
 *
 * Built against the official AliExpress Open Platform documentation:
 * https://openservice.aliexpress.com/doc/api.htm
 *
 * Gateway: https://api-sg.aliexpress.com/rest  (international/SG endpoint)
 *
 * Key facts from docs:
 * - All DS APIs use a single POST endpoint; routing via the `method` body param.
 * - Auth APIs (/auth/token/*) use GET with query params.
 * - Required system params: method, app_key, timestamp, v, sign_method, sign
 * - Timestamp must be Unix epoch in MILLISECONDS (not the old "yyyy-MM-dd" format)
 * - Access token passed as `session` parameter
 * - Signature: HMAC-SHA256 of the API path + sorted key-value pairs
 *   e.g. sign = HMAC_SHA256(appSecret, "/auth/token/createapp_key538994code...")
 * - Auth endpoints use https://api-sg.aliexpress.com/rest  (GET)
 * - DS business APIs use https://api-sg.aliexpress.com/sync (POST)
 */

const ALIEXPRESS_APP_KEY    = process.env.ALIEXPRESS_APP_KEY;
const ALIEXPRESS_APP_SECRET = process.env.ALIEXPRESS_APP_SECRET;

// Gateway for auth (GET) and business API (POST)
const ALIEXPRESS_AUTH_GATEWAY = 'https://api-sg.aliexpress.com/rest';
const ALIEXPRESS_API_GATEWAY  = 'https://api-sg.aliexpress.com/sync';

export interface AliExpressRequestOptions {
  /** The API method name, e.g. 'aliexpress.ds.text.search' */
  apiMethod: string;
  /** Business-specific parameters for this API call */
  params?: Record<string, any>;
  /** Optional: provide access token directly (otherwise auto-fetched from Supabase) */
  accessToken?: string;
  /** If true, use GET to the REST gateway (for auth token ops). Default: false (POST to sync) */
  isAuthCall?: boolean;
}

/**
 * Generates the AliExpress OPEN PLATFORM HMAC-SHA256 signature.
 *
 * Algorithm (per official docs):
 * 1. Sort all parameters alphabetically by key
 * 2. Concatenate: apiPath + key1value1key2value2...
 *    (For DS methods the "path" is the method name itself)
 * 3. HMAC-SHA256 with ALIEXPRESS_APP_SECRET as the key
 * 4. Return as uppercase hex
 *
 * NOTE: Unlike ICBU/TOP, AliExpress PREPENDS the API path to the sorted params.
 */
function generateSignature(apiPath: string, params: Record<string, string>): string {
  if (!ALIEXPRESS_APP_SECRET) {
    throw new Error('ALIEXPRESS_APP_SECRET is missing from environment variables.');
  }

  // Sort keys alphabetically
  const sortedKeys = Object.keys(params).sort();

  // Prepend the apiPath then concatenate all key-value pairs
  const concatenated = apiPath + sortedKeys.reduce((acc, key) => acc + key + params[key], '');

  // HMAC-SHA256 with secret as key, return uppercase hex
  const hmac = crypto.createHmac('sha256', ALIEXPRESS_APP_SECRET);
  hmac.update(concatenated, 'utf8');
  return hmac.digest('hex').toUpperCase();
}

/**
 * Returns current timestamp in Unix milliseconds (required by AliExpress Open Platform).
 */
function getTimestampMs(): string {
  return String(Date.now());
}

/**
 * Fetches the stored AliExpress access token from Supabase.
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

    // Check if token is expired (with 5 min buffer)
    if (data.expires_at) {
      const expiresAt = new Date(data.expires_at);
      const buffer = 5 * 60 * 1000; // 5 minutes
      if (new Date().getTime() + buffer >= expiresAt.getTime()) {
        console.warn('[AliExpress] Access token is expired or expiring soon. Needs refresh.');
        return null;
      }
    }

    return data.access_token;
  } catch (e) {
    console.warn('[AliExpress] Could not fetch access token from database:', e);
    return null;
  }
}

/**
 * Executes a request to the AliExpress Open Platform.
 *
 * - DS Business APIs: POST to https://api-sg.aliexpress.com/sync
 * - Auth APIs:        GET  to https://api-sg.aliexpress.com/rest
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

  // Auto-fetch access token from Supabase for non-auth calls
  if (!accessToken && !isAuthCall) {
    const stored = await fetchStoredToken();
    if (stored) accessToken = stored;
  }

  // Build system parameters
  const systemParams: Record<string, string> = {
    app_key:     ALIEXPRESS_APP_KEY,
    timestamp:   getTimestampMs(),
    sign_method: 'sha256',
    v:           '2.0',
    format:      'json',
  };

  // For DS business API calls, the method goes in the params
  if (!isAuthCall) {
    systemParams.method = apiMethod;
  }

  // Add session/access token if available
  if (accessToken) {
    systemParams.session = accessToken;
  }

  // Merge system + business params; stringify all values for signing
  const allParams: Record<string, string> = {};
  for (const [key, value] of Object.entries({ ...systemParams, ...params })) {
    if (value !== undefined && value !== null) {
      allParams[key] = typeof value === 'object' ? JSON.stringify(value) : String(value);
    }
  }

  // For auth APIs the path is the URL path (e.g. /auth/token/security/create)
  // For DS method APIs the "path" in the signature is the method name
  const signPath = isAuthCall ? apiMethod : apiMethod;

  // Generate signature
  const signature = generateSignature(signPath, allParams);
  allParams.sign = signature;

  if (isAuthCall) {
    // GET request to REST gateway with query string
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
    // POST request to SYNC gateway with form-encoded body
    const body = new URLSearchParams();
    for (const [key, value] of Object.entries(allParams)) {
      body.append(key, value);
    }

    const response = await fetch(ALIEXPRESS_API_GATEWAY, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8' },
      body: body.toString(),
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
 * Saves an AliExpress access token (and related data) to Supabase.
 * Creates the row if it doesn't exist, updates otherwise.
 */
export async function saveAliExpressToken(tokenData: {
  access_token: string;
  refresh_token?: string;
  expires_in?: number;        // seconds
  refresh_token_valid_time?: number; // ms epoch
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
      id:                      'default',
      access_token:            tokenData.access_token,
      refresh_token:           tokenData.refresh_token  || null,
      buyer_access_token:      tokenData.buyer_access_token || null,
      expires_at:              expiresAt,
      refresh_token_expires_at: refreshExpiresAt,
      user_nick:               tokenData.user_nick      || null,
      updated_at:              new Date().toISOString(),
    }, { onConflict: 'id' });

  if (error) {
    throw new Error(`Failed to save AliExpress token: ${error.message}`);
  }
}
