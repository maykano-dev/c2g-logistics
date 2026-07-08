import crypto from 'crypto';
import { createClient } from '@supabase/supabase-js';

/**
 * AliExpress Open Platform API Client
 *
 * Built against the official AliExpress Open Platform documentation:
 * https://openservice.aliexpress.com/doc/api.htm
 *
 * Gateway:  https://api-sg.aliexpress.com/sync  (International Singapore gateway)
 *
 * Key protocol facts:
 * - All requests are POST to the single gateway endpoint
 * - Required system params: app_key, method, timestamp, sign_method, sign, v, format
 * - Timestamp: Unix milliseconds (NOT yyyy-MM-dd HH:mm:ss — AliExpress uses ms)
 * - Signature: HMAC-SHA256 of (apiPath + sortedKeyValuePairs) in UPPERCASE hex
 * - Access token passed as the `session` parameter
 * - Response envelope wraps result in the method name key
 */

const ALIEXPRESS_APP_KEY    = process.env.ALIEXPRESS_APP_KEY;
const ALIEXPRESS_APP_SECRET = process.env.ALIEXPRESS_APP_SECRET;

// Official AliExpress Open Platform International Gateway
const ALIEXPRESS_GATEWAY = 'https://api-sg.aliexpress.com/sync';

// OAuth endpoints (AliExpress Open Platform)
export const ALIEXPRESS_AUTH_URL   = 'https://oauth.aliexpress.com/authorize';
export const ALIEXPRESS_TOKEN_URL  = 'https://oauth.aliexpress.com/token';

export interface AliExpressRequestOptions {
  /** API method path, e.g. '/aliexpress/ds/product/get' */
  apiMethod: string;
  /** Business parameters for this API call */
  params?: Record<string, any>;
  /** Optional: provide access token directly (otherwise auto-fetched from Supabase) */
  accessToken?: string;
}

/**
 * Generates the AliExpress Open Platform HMAC-SHA256 signature.
 *
 * Algorithm (per official AliExpress docs):
 * 1. Sort all parameters alphabetically by key
 * 2. Concatenate as key1value1key2value2...
 * 3. Prepend the API path (e.g. "/aliexpress/ds/product/get")
 * 4. HMAC-SHA256 with ALIEXPRESS_APP_SECRET as key
 * 5. Return as UPPERCASE hex
 *
 * IMPORTANT: AliExpress requires the API path prefix. This differs from
 * the old Alibaba ICBU/TOP gateway which did NOT use a path prefix.
 */
function generateSignature(apiPath: string, params: Record<string, string>): string {
  if (!ALIEXPRESS_APP_SECRET) {
    throw new Error('ALIEXPRESS_APP_SECRET is missing from environment variables.');
  }

  // Sort keys alphabetically
  const sortedKeys = Object.keys(params).sort();

  // Build the string: API_PATH + key1value1key2value2...
  const concatenated = apiPath + sortedKeys.reduce((acc, key) => acc + key + params[key], '');

  // HMAC-SHA256 with secret as key, return uppercase hex
  const hmac = crypto.createHmac('sha256', ALIEXPRESS_APP_SECRET);
  hmac.update(concatenated, 'utf8');
  return hmac.digest('hex').toUpperCase();
}

/**
 * Executes a signed request to the AliExpress Open Platform gateway.
 *
 * All requests POST to https://api-sg.aliexpress.com/sync with
 * application/x-www-form-urlencoded body.
 */
export async function aliExpressRequest<T = any>({
  apiMethod,
  params = {},
  accessToken,
}: AliExpressRequestOptions): Promise<T> {
  if (!ALIEXPRESS_APP_KEY) {
    throw new Error('ALIEXPRESS_APP_KEY is missing from environment variables.');
  }

  // Auto-fetch access token from Supabase unless provided
  if (!accessToken) {
    try {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
      if (supabaseUrl && supabaseKey) {
        const supabase = createClient(supabaseUrl, supabaseKey);
        const { data } = await supabase
          .from('alibaba_credentials')
          .select('access_token')
          .eq('id', 'default')
          .single();
        if (data?.access_token) {
          accessToken = data.access_token;
        }
      }
    } catch (e) {
      console.warn('Could not fetch AliExpress access token from Supabase:', e);
    }
  }

  // Build system parameters (all required by docs)
  const systemParams: Record<string, string> = {
    method:      apiMethod,
    app_key:     ALIEXPRESS_APP_KEY,
    timestamp:   String(Date.now()),  // Unix milliseconds — AliExpress uses ms NOT formatted date
    sign_method: 'sha256',
    format:      'json',
    v:           '2.0',
  };

  // Add session (access token) if available
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

  // Generate signature using the API method path as prefix
  const signature = generateSignature(apiMethod, allParams);
  allParams.sign = signature;

  // Build form-encoded POST body
  const body = new URLSearchParams();
  for (const [key, value] of Object.entries(allParams)) {
    body.append(key, value);
  }

  try {
    const response = await fetch(ALIEXPRESS_GATEWAY, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
      },
      body: body.toString(),
    });

    const data = await response.json();

    // AliExpress error response shape: { error_response: { code, msg, sub_code, sub_msg, request_id } }
    if (data.error_response) {
      const err = data.error_response;
      console.error(`AliExpress API Error [${apiMethod}]:`, err);
      throw new Error(
        `AliExpress API Error: ${err.msg} (code: ${err.code}, sub: ${err.sub_msg || err.sub_code})`
      );
    }

    return data as T;
  } catch (error) {
    console.error(`Failed AliExpress request [${apiMethod}]:`, error);
    throw error;
  }
}

// Keep legacy export name so other files that import alibabaRequest still compile
// during the transition. Gradually rename callers to aliExpressRequest.
export const alibabaRequest = aliExpressRequest;
