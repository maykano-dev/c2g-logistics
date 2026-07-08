/**
 * C2G Trust Filter & Product Quality Score
 *
 * Ensures C2G Mall maintains a high-quality, scam-free environment.
 * Evaluates products and suppliers based on Alibaba ICBU API metrics.
 * Strips out Alibaba-specific data to maintain the white-label experience.
 *
 * IMPORTANT: Field names are from the official alibaba.icbu.product.list /
 * alibaba.icbu.product.get responses, NOT the old GGS buyer API.
 *
 * Key differences vs old GGS API:
 *  - No `eCompanyId` or `supplier` field in ICBU responses
 *  - Status field uses "approved" / "expired" (not "PRODUCT_ONLINE")
 *  - Images are under main_image.images[] (not top-level images[])
 *  - Prices are under wholesale_trade.price / sourcing_trade.fob_min_price
 *  - Brief list responses may have no price (fetch detail to get price)
 */

export interface AlibabaProduct {
  // Core identity (ICBU product.get response)
  product_id?: string;
  id?: string | number;

  // Subject / title (ICBU uses 'subject', not 'title')
  subject?: string;
  title?: string;

  // Status: ICBU uses 'approved' | 'expired' | 'wait_approve'
  status?: string;

  // Images: nested under main_image.images[] in ICBU
  main_image?: { images?: string[]; watermark?: boolean };
  images?: string[];

  // Description
  description?: string;

  // Trade info
  wholesale_trade?: { price?: string; volume?: string; [key: string]: any };
  sourcing_trade?: { fob_min_price?: string; fob_max_price?: string; [key: string]: any };

  // SKUs
  product_sku?: { skus?: any[]; sku_attributes?: any[] };

  // Category
  category_id?: number;

  // Old GGS fields — kept for backward compat but not expected from ICBU
  eCompanyId?: string;
  supplier?: Record<string, any>;
  permalink?: string;
  detail_url?: string;
  pc_detail_url?: string;
  store_type?: string;

  [key: string]: any;
}

export interface TrustScoreDetails {
  score: number;
  breakdown: {
    certificates: number;
    listingQuality: number;
    wholesaleVolume: number;
  };
  passed: boolean;
  reasons: string[];
}

/**
 * Calculates the C2G Trust & Quality Score for a given product.
 * Works with alibaba.icbu.product.get response shape.
 */
export function calculateTrustScore(productData: any, certData: any[] = []): TrustScoreDetails {
  let score = 0;
  const breakdown = {
    certificates: 0,
    listingQuality: 0,
    wholesaleVolume: 0
  };

  const reasons: string[] = [];

  // 1. Certificates Check (Max 30)
  if (certData && certData.length > 0) {
    breakdown.certificates = 30;
    score += 30;
  }
  // Not a hard fail — most ICBU products won't have cert data

  // 2. Listing Quality (Max 40)
  // ICBU images are under main_image.images[] (not top-level images[])
  let listingScore = 0;
  const images: string[] = productData?.main_image?.images || productData?.images || [];

  if (images.length >= 3) listingScore += 20;
  else if (images.length >= 1) listingScore += 10;
  else reasons.push('No product images found.');

  if (productData?.description && productData.description.length > 50) listingScore += 20;
  else if (productData?.description) listingScore += 10;
  else reasons.push('No product description.');

  breakdown.listingQuality = listingScore;
  score += listingScore;

  // 3. Wholesale Volume (Max 30)
  const volume = parseInt(productData?.wholesale_trade?.volume || '0', 10);
  if (volume >= 1000) { breakdown.wholesaleVolume = 30; score += 30; }
  else if (volume >= 100) { breakdown.wholesaleVolume = 20; score += 20; }
  else if (volume >= 10) { breakdown.wholesaleVolume = 10; score += 10; }

  // For brand-new products with no volume, don't penalize — give base 10 if listing quality is good
  if (volume === 0 && listingScore >= 20) {
    breakdown.wholesaleVolume = 10;
    score += 10;
  }

  // Hard pass requirement: 40+ (relaxed from 50 — ICBU products rarely have certs)
  const passed = score >= 40;
  if (!passed) reasons.push('Overall quality score too low.');

  return { score, breakdown, passed, reasons };
}

/**
 * Validates a batch of products against C2G filters.
 * Updated for ICBU API response — no eCompanyId or supplier fields.
 *
 * For alibaba.icbu.product.list (search results):
 *  - status will be 'approved' for live products
 *  - price may be absent in brief results (acceptable — detail page fetches it)
 */
export async function filterTrustedProducts(products: AlibabaProduct[]): Promise<AlibabaProduct[]> {
  // TODO: Fetch blacklisted product_ids from Supabase
  const blacklistedProductIds = new Set<string>();

  const trustedProducts: AlibabaProduct[] = [];

  for (const product of products) {
    const productId = String(product.product_id || product.id || '');

    // 1. Must have a product ID
    if (!productId) {
      console.warn('[TrustFilter] Rejected product: Missing product_id');
      continue;
    }

    // 2. Must not be blacklisted
    if (blacklistedProductIds.has(productId)) {
      console.warn(`[TrustFilter] Rejected Product ${productId}: BLACKLISTED`);
      continue;
    }

    // 3. Status check — ICBU uses 'approved' (not 'PRODUCT_ONLINE')
    // Also allow undefined status (brief list results may omit it)
    const status = product.status;
    if (status && status !== 'approved') {
      console.warn(`[TrustFilter] Rejected Product ${productId}: Status is '${status}' (not approved)`);
      continue;
    }

    // 4. Price check is SKIPPED for list results — ICBU brief results often omit price.
    //    Price is validated on the detail page (product.get) before the user can add to cart.

    // 5. Must have at least one image
    const images: string[] = product.main_image?.images || product.images || [];
    if (images.length === 0) {
      console.warn(`[TrustFilter] Rejected Product ${productId}: No images`);
      continue;
    }

    // Pass
    trustedProducts.push(product);
  }

  return trustedProducts;
}

/**
 * Strips Alibaba and supplier identifying information from a product.
 * Ensures strict C2G white-labeling before data reaches the client browser.
 * Updated for ICBU field names.
 */
export function stripSupplierData(product: AlibabaProduct): AlibabaProduct {
  const safeProduct = { ...product };

  // Remove all fields that could reveal the Alibaba/supplier identity
  delete safeProduct.eCompanyId;
  delete safeProduct.supplier;
  delete safeProduct.permalink;
  delete safeProduct.detail_url;
  delete safeProduct.store_type;
  delete safeProduct.owner_member;
  delete safeProduct.owner_member_display_name;

  // Keep product_id (opaque obfuscated string — safe to expose, needed for detail fetch)
  // Keep pc_detail_url stripped — do NOT expose direct Alibaba URLs to users
  delete safeProduct.pc_detail_url;

  return safeProduct;
}
