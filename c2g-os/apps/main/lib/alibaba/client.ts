import crypto from 'crypto';
import { createClient } from '@supabase/supabase-js';

/**
 * Alibaba IOP (International Open Platform) API Client
 * Built precisely according to Alibaba's dropshipping and procurement API specifications.
 * Handles HMAC-SHA256 signing, authentication headers, and request formatting.
 */

const ALIBABA_APP_KEY = process.env.ALIBABA_APP_KEY;
const ALIBABA_APP_SECRET = process.env.ALIBABA_APP_SECRET;
const ALIBABA_API_URL = 'https://openapi-api.alibaba.com/rest'; // Correct IOP/GGS Gateway

interface AlibabaRequestOptions {
  apiPath: string;
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  params?: Record<string, any>;
  accessToken?: string;
}

/**
 * Generates the Alibaba IOP HMAC-SHA256 signature.
 * 
 * Rules:
 * 1. Sort all parameters (including common headers mapped as query params) alphabetically by key.
 * 2. Concatenate them as `key1value1key2value2`.
 * 3. Prepend the API path (e.g., `/eco/buyer/product/search`).
 * 4. Hash using HMAC-SHA256 with the App Secret.
 * 5. Convert to uppercase HEX.
 */
function generateSignature(apiPath: string, params: Record<string, string>): string {
  if (!ALIBABA_APP_SECRET) throw new Error('ALIBABA_APP_SECRET is missing from environment variables.');

  // Sort keys alphabetically
  const sortedKeys = Object.keys(params).sort();

  // Concatenate keys and values
  let concatenatedString = sortedKeys.reduce((acc, key) => {
    return acc + key + params[key];
  }, '');

  // Prepend the API path
  const stringToSign = apiPath + concatenatedString;

  // Generate HMAC-SHA256
  const hmac = crypto.createHmac('sha256', ALIBABA_APP_SECRET);
  hmac.update(stringToSign, 'utf8');
  
  // Return as Uppercase Hex
  return hmac.digest('hex').toUpperCase();
}

/**
 * Executes a request to the Alibaba Open Platform.
 */
export async function alibabaRequest<T = any>({
  apiPath,
  method = 'GET',
  params = {},
  accessToken,
}: AlibabaRequestOptions): Promise<T> {
  if (!ALIBABA_APP_KEY) throw new Error('ALIBABA_APP_KEY is missing from environment variables.');

  const systemParams: Record<string, string> = {
    app_key: ALIBABA_APP_KEY,
    timestamp: Date.now().toString(),
    sign_method: 'sha256',
  };

  // Automatically fetch access token if not explicitly provided and not calling the auth endpoint
  if (!accessToken && apiPath !== '/auth/token/create') {
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

  if (accessToken) {
    systemParams.access_token = accessToken;
  }

  // Combine system params with API-specific params for signing
  // Alibaba IOP typically sends parameters in the query string or body depending on the method,
  // but all parameters must be signed.
  const allParams = { ...systemParams, ...params };
  
  // Stringify all values for signing
  const stringParams: Record<string, string> = {};
  for (const [key, value] of Object.entries(allParams)) {
    if (value !== undefined && value !== null) {
      stringParams[key] = typeof value === 'object' ? JSON.stringify(value) : String(value);
    }
  }

  // Generate the signature
  const signature = generateSignature(apiPath, stringParams);
  
  // Add signature to system params
  stringParams.sign = signature;

  // Construct URL
  const url = new URL(ALIBABA_API_URL + apiPath);
  
  let fetchOptions: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
    },
  };

  // For GET, put all params in the query string
  if (method === 'GET') {
    Object.keys(stringParams).forEach(key => {
      if (stringParams[key] !== undefined) {
        url.searchParams.append(key, stringParams[key] as string);
      }
    });
  } else {
    // For POST/PUT, system params (auth/sign) can go in URL or body. Standard IOP supports body payload.
    // Putting system params in query string, and business params in body is standard, 
    // or passing everything as form url-encoded.
    const urlSearchParams = new URLSearchParams();
    Object.keys(stringParams).forEach(key => {
      if (stringParams[key] !== undefined) {
        urlSearchParams.append(key, stringParams[key] as string);
      }
    });
    fetchOptions.body = urlSearchParams.toString();
  }

  try {
    const response = await fetch(url.toString(), fetchOptions);
    const data = await response.json();

    // Check for Alibaba API level errors
    if (data.error_response) {
      console.error('Alibaba API Error:', data.error_response);
      throw new Error(`Alibaba API Error: ${data.error_response.msg} (${data.error_response.code})`);
    }

    if (data.code && data.code !== '0' && data.code !== 0) {
        console.error('Alibaba API Error:', data);
        throw new Error(`Alibaba API Error: ${data.message || data.msg || 'Unknown Error'} (${data.code})`);
    }

    return data as T;
  } catch (error) {
    console.error(`Failed to execute Alibaba API request to ${apiPath}:`, error);
    throw error;
  }
}
