import type {
  ProductChannel,
  StandardProductDetail,
  StandardProductList,
} from "./types";
import { unstable_cache } from "next/cache";

export class HiobuyApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public code?: string,
    public requestId?: string,
  ) {
    super(message);
    this.name = "HiobuyApiError";
  }
}

function requireApiKey(): string {
  const key = process.env.HIOBUY_API_KEY?.trim();
  if (!key || key.includes("xxxxxxxx")) {
    throw new HiobuyApiError(
      "Missing HIOBUY_API_KEY. Copy .env.example to .env.local and paste your Developer Portal API key.",
      500,
      "MISSING_API_KEY",
    );
  }
  return key;
}

/** Upstream HIOBuy API host. Browser traffic must go through `/api/products/*`. */
function apiBase(): string {
  return (process.env.HIOBUY_API_BASE_URL || "https://api.hiobuy.com").replace(
    /\/$/,
    "",
  );
}

function defaultLanguage(): string {
  return process.env.HIOBUY_DEFAULT_LANGUAGE?.trim() || "en";
}

export async function hiobuyFetch<T>(
  path: string,
  body?: Record<string, unknown>,
  method: "POST" | "GET" = "POST"
): Promise<T> {
  const apiKey = requireApiKey();
  let fetchUrl = `${apiBase()}${path}`;
  const headers: HeadersInit = {
    Authorization: `Bearer ${apiKey}`,
    Accept: "application/json",
  };

  let fetchBody: string | undefined;
  const requestData = {
    language: defaultLanguage(),
    response_format: "standard",
    ...(body || {}),
  };

  if (method === "GET") {
    const params = new URLSearchParams();
    for (const [key, value] of Object.entries(requestData)) {
      if (value !== undefined && value !== null) {
        if (Array.isArray(value)) {
          value.forEach(v => params.append(key, String(v)));
        } else {
          params.append(key, String(value));
        }
      }
    }
    const queryString = params.toString();
    if (queryString) {
      fetchUrl += fetchUrl.includes('?') ? `&${queryString}` : `?${queryString}`;
    }
  } else {
    headers["Content-Type"] = "application/json";
    fetchBody = JSON.stringify(requestData);
  }

  const res = await fetch(fetchUrl, {
    method,
    headers,
    body: fetchBody,
    // Cache all GET requests for 24 hours (86400 seconds) to protect API quota
    ...(method === "GET" ? { next: { revalidate: 86400 } } : { cache: "no-store" }),
  });

  const data = (await res.json().catch(() => ({}))) as any;

  // Hiobuy sometimes returns 200 OK but with an error payload { code: 429, msg: "..." }
  const isErrorPayload = !!data.error || (data.code && data.code !== 200 && data.code !== '200');

  if (!res.ok || isErrorPayload) {
    let errorMessage = data.error?.message || data.msg || data.message || `Marketplace connection error (${res.status})`;
    
    // Sanitize backend provider names and handle rate limits gracefully
    const lowerError = String(errorMessage).toLowerCase();
    if (lowerError.includes('hiobuy') || lowerError.includes('quota') || res.status === 429 || data.code === 429 || data.code === '429') {
      if (res.status === 429 || data.code === 429 || data.code === '429' || lowerError.includes('quota')) {
        errorMessage = 'Our China marketplace connection is currently experiencing extremely high demand. Please try again in a few minutes.';
      } else {
        errorMessage = 'We encountered an error connecting to our China suppliers. Please try again later.';
      }
    }

    throw new HiobuyApiError(
      errorMessage,
      res.status === 200 && data.code ? (typeof data.code === 'number' ? data.code : 400) : res.status,
      data.error?.code || String(data.code || 'API_ERROR'),
      data.error?.request_id || data.request_id,
    );
  }

  return data as T;
}

export type ProductSearchSortField = "price" | "sales" | "credit";
export type ProductSearchSortOrder = "asc" | "desc";

export type ProductSearchFilters = {
  page?: number;
  page_size?: number;
  price_start?: number | string;
  price_end?: number | string;
  sort_field?: ProductSearchSortField;
  sort_order?: ProductSearchSortOrder;
};

function searchFilterBody(input: ProductSearchFilters): Record<string, unknown> {
  const body: Record<string, unknown> = {
    page: input.page ?? 1,
    page_size: input.page_size ?? 20,
  };

  const priceStart =
    input.price_start === undefined || input.price_start === ""
      ? undefined
      : Number(input.price_start);
  const priceEnd =
    input.price_end === undefined || input.price_end === ""
      ? undefined
      : Number(input.price_end);

  if (priceStart != null && Number.isFinite(priceStart) && priceStart >= 0) {
    body.price_start = priceStart;
  }
  if (priceEnd != null && Number.isFinite(priceEnd) && priceEnd >= 0) {
    body.price_end = priceEnd;
  }
  if (input.sort_field) {
    body.sort_field = input.sort_field;
    body.sort_order = input.sort_order ?? "asc";
  }

  return body;
}

const getCachedSearch = unstable_cache(
  async (channel: string, keyword: string, filterStr: string) => {
    return hiobuyFetch<StandardProductList>("/v1/products/search", {
      channel,
      keyword,
      ...JSON.parse(filterStr),
    });
  },
  ['hiobuy-product-search'],
  { revalidate: 86400 } // 24 hour cache
);

export async function searchProducts(input: {
  channel: ProductChannel;
  keyword: string;
} & ProductSearchFilters): Promise<StandardProductList> {
  return getCachedSearch(input.channel, input.keyword, JSON.stringify(searchFilterBody(input)));
}

export async function searchProductsByImage(input: {
  channel: ProductChannel;
  image_base64?: string;
  image_url?: string;
  keyword?: string;
} & ProductSearchFilters): Promise<StandardProductList> {
  return hiobuyFetch<StandardProductList>("/v1/products/search-by-image", {
    channel: input.channel,
    ...(input.image_base64 ? { image_base64: input.image_base64 } : {}),
    ...(input.image_url ? { image_url: input.image_url } : {}),
    ...(input.keyword ? { keyword: input.keyword } : {}),
    ...searchFilterBody(input),
  });
}

export async function parseProduct(input: {
  url: string;
  channel?: ProductChannel;
}): Promise<{ product: StandardProductDetail; request_id?: string }> {
  return hiobuyFetch<{ product: StandardProductDetail; request_id?: string }>(
    "/v1/products/parse",
    {
      url: input.url,
      ...(input.channel ? { channel: input.channel } : {}),
    },
  );
}

const getCachedProductDetail = unstable_cache(
  async (channel: string, id: string | undefined, url: string | undefined) => {
    return hiobuyFetch<{ product: StandardProductDetail; request_id?: string }>(
      "/v1/products/detail",
      {
        channel,
        ...(id ? { id } : {}),
        ...(url ? { url } : {}),
      },
    );
  },
  ['hiobuy-product-detail'],
  { revalidate: 86400 } // 24 hours cache
);

export async function getProductDetail(input: {
  channel: ProductChannel;
  id?: string;
  url?: string;
}): Promise<{ product: StandardProductDetail; request_id?: string }> {
  const id = input.id?.trim();
  const url = input.url?.trim();
  if (!id && !url) {
    throw new Error("id or url is required");
  }
  return getCachedProductDetail(input.channel, id, url);
}

const getCachedFreightEstimate = unstable_cache(
  async (channel: string, receiver: any, lines: any[]) => {
    return hiobuyFetch<{
      estimate?: { freight?: { amount: number; currency: string } };
      monetary_unit?: string;
      request_id?: string;
    }>("/v1/products/freight/estimate", {
      channel,
      receiver,
      lines,
    });
  },
  ['hiobuy-freight-estimate'],
  { revalidate: 3600 } // 1 hour cache
);

export async function estimateFreight(input: {
  channel: ProductChannel;
  receiver: {
    name: string;
    mobile: string;
    address: string;
    province: string;
    city: string;
    district?: string;
  };
  lines: Array<{
    id: string; // product id
    spec_id?: string; // variant id
    quantity: number;
  }>;
}): Promise<{
  estimate?: {
    freight?: { amount: number; currency: string };
  };
  monetary_unit?: string;
  request_id?: string;
}> {
  return getCachedFreightEstimate(input.channel, input.receiver, input.lines);
}
