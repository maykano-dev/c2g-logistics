import crypto from 'crypto';
import { createClient } from '@supabase/supabase-js';

/**
 * Alibaba ICBU API Client
 *
 * Built precisely against the official Alibaba.com developer documentation:
 * https://developer.alibaba.com/en/doc.htm
 *
 * Gateway: https://eco.taobao.com/router/rest  (TOP/ICBU Single-Endpoint Gateway)
 *
 * Key facts from docs:
 * - All ICBU APIs use a single POST endpoint — routing is done via the `method` parameter.
 * - Required system params: method, app_key, timestamp, v, sign_method, sign
 * - Timestamp must be "yyyy-MM-dd HH:mm:ss" in GMT+8
 * - Access token is passed as the `session` parameter
 * - Signature: HMAC-SHA256 of sorted key-value pairs (no path prefix)
 * - Always POST with application/x-www-form-urlencoded body
 */

const ALIBABA_APP_KEY = process.env.ALIBABA_APP_KEY;
const ALIBABA_APP_SECRET = process.env.ALIBABA_APP_SECRET;

// Official ICBU/TOP gateway URL per documentation CURL examples
const ALIBABA_GATEWAY = 'https://eco.taobao.com/router/rest';

interface AlibabaRequestOptions {
  /** The API method name, e.g. 'alibaba.icbu.product.list' */
  apiMethod: string;
  /** Business-specific parameters for this API call */
  params?: Record<string, any>;
  /** Optional: provide access token directly (otherwise auto-fetched from Supabase) */
  accessToken?: string;
}

/**
 * Formats the current time as "yyyy-MM-dd HH:mm:ss" in UTC+8 (GMT+8)
 * Required by Alibaba — server allows max 10 minutes of drift.
 */
function getTimestampGMT8(): string {
  const now = new Date();
  // UTC+8 offset = 8 * 60 * 60 * 1000 ms
  const gmt8 = new Date(now.getTime() + 8 * 60 * 60 * 1000);
  const yyyy = gmt8.getUTCFullYear();
  const MM   = String(gmt8.getUTCMonth() + 1).padStart(2, '0');
  const dd   = String(gmt8.getUTCDate()).padStart(2, '0');
  const HH   = String(gmt8.getUTCHours()).padStart(2, '0');
  const mm   = String(gmt8.getUTCMinutes()).padStart(2, '0');
  const ss   = String(gmt8.getUTCSeconds()).padStart(2, '0');
  return `${yyyy}-${MM}-${dd} ${HH}:${mm}:${ss}`;
}

/**
 * Generates the Alibaba ICBU/TOP API HMAC-SHA256 signature.
 *
 * Algorithm (per official docs):
 * 1. Sort all parameters alphabetically by key (including 'method', 'app_key', etc.)
 * 2. Concatenate as key1value1key2value2... (no separators)
 * 3. HMAC-SHA256 with ALIBABA_APP_SECRET as the key
 * 4. Return as uppercase hex
 *
 * NOTE: Unlike some IOP gateways, the TOP gateway does NOT prepend the API path.
 * The 'method' parameter is already included in the sorted param list.
 */
function generateSignature(params: Record<string, string>): string {
  if (!ALIBABA_APP_SECRET) throw new Error('ALIBABA_APP_SECRET is missing from environment variables.');

  // Sort keys alphabetically
  const sortedKeys = Object.keys(params).sort();

  // Concatenate all key-value pairs
  const concatenated = sortedKeys.reduce((acc, key) => acc + key + params[key], '');

  // HMAC-SHA256 with secret as key, return uppercase hex
  const hmac = crypto.createHmac('sha256', ALIBABA_APP_SECRET);
  hmac.update(concatenated, 'utf8');
  return hmac.digest('hex').toUpperCase();
}

/**
 * Executes a request to the Alibaba ICBU Open Platform via the TOP gateway.
 *
 * All requests are POST to https://eco.taobao.com/router/rest with
 * application/x-www-form-urlencoded body.
 */
export async function alibabaRequest<T = any>({
  apiMethod,
  params = {},
  accessToken,
}: AlibabaRequestOptions): Promise<T> {
  if (!ALIBABA_APP_KEY) throw new Error('ALIBABA_APP_KEY is missing from environment variables.');

  // Auto-fetch access token from Supabase (unless caller provided one)
  if (!accessToken && apiMethod !== 'alibaba.auth.token.create') {
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
      console.warn('Could not fetch Alibaba access token from database:', e);
    }
  }

  // Build system parameters (all required by docs)
  const systemParams: Record<string, string> = {
    method:      apiMethod,           // e.g. "alibaba.icbu.product.list"
    app_key:     ALIBABA_APP_KEY,
    timestamp:   getTimestampGMT8(), // "yyyy-MM-dd HH:mm:ss" in GMT+8
    v:           '2.0',              // API protocol version
    sign_method: 'hmac-sha256',      // Signature method
    format:      'json',             // Response format
  };

  // Add session token if available (docs call it 'session', not 'access_token')
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

  // Generate signature (over ALL params including system params)
  const signature = generateSignature(allParams);
  allParams.sign = signature;

  // Build form-encoded body (all params go in POST body per docs)
  const body = new URLSearchParams();
  for (const [key, value] of Object.entries(allParams)) {
    body.append(key, value);
  }

  try {
    const response = await fetch(ALIBABA_GATEWAY, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
      },
      body: body.toString(),
    });

    const data = await response.json();

    // Standard error response shape: { error_response: { code, msg, sub_code, sub_msg } }
    if (data.error_response) {
      const err = data.error_response;
      console.error(`Alibaba API Error [${apiMethod}]:`, err);
      throw new Error(`Alibaba API Error: ${err.msg} (code: ${err.code}, sub: ${err.sub_msg || err.sub_code})`);
    }

    return data as T;
  } catch (error) {
    console.error(`Failed Alibaba request [${apiMethod}]:`, error);
    throw error;
  }
}
