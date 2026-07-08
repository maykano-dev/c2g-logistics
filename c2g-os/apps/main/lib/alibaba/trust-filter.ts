/**
 * C2G Trust Filter & Product Quality Score
 * 
 * Ensures C2G Mall maintains a high-quality, scam-free environment.
 * Evaluates products and suppliers based on Alibaba metrics.
 * Strips out Alibaba-specific data to maintain the white-label experience.
 */

// We will import Supabase client here later to check the blacklist
// import { createClient } from '@/utils/supabase/server';

export interface AlibabaProduct {
  id: string | number;
  title: string;
  price: string | number;
  status?: string;
  store_type?: string;
  eCompanyId?: string;
  supplier?: Record<string, any>;
  permalink?: string;
  detail_url?: string;
  main_image?: string;
  images?: string[];
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
 * NOTE: The Alibaba Dropshipping API does not provide supplier ratings, age, or response rates.
 * We score purely on Listing Quality, Wholesale Volume, and API Certificates.
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
  } else {
    reasons.push('No verified certificates available.');
  }

  // 2. Listing Quality (Max 40)
  let listingScore = 0;
  if (productData?.images && productData.images.length >= 3) listingScore += 15; 
  else if (productData?.images && productData.images.length > 0) listingScore += 5;

  if (productData?.video_url) listingScore += 10; 
  if (productData?.description && productData.description.length > 100) listingScore += 15; 
  
  breakdown.listingQuality = listingScore;
  score += listingScore;

  if (listingScore < 15) reasons.push('Poor listing quality (missing images, videos, or description).');

  // 3. Wholesale Volume (Max 30)
  // productData.wholesale_trade.volume is returned by the description API
  const volume = parseInt(productData?.wholesale_trade?.volume || '0', 10);
  if (volume >= 1000) { breakdown.wholesaleVolume = 30; score += 30; }
  else if (volume >= 100) { breakdown.wholesaleVolume = 20; score += 20; }
  else if (volume >= 10) { breakdown.wholesaleVolume = 10; score += 10; }
  else { reasons.push('Low wholesale/trade volume.'); }

  // Hard pass requirement (Score >= 50 for the new metric system)
  const passed = score >= 50;

  return { score, breakdown, passed, reasons };
}

/**
 * Validates a batch of products against C2G Hard Filters.
 * Removes scams, unverified stores, and blacklisted suppliers.
 */
export async function filterTrustedProducts(products: AlibabaProduct[]): Promise<AlibabaProduct[]> {
  // TODO: Fetch blacklisted eCompanyIds from Supabase
  // const supabase = createClient();
  // const { data: blacklist } = await supabase.from('supplier_blacklist').select('e_company_id');
  // const blacklistedIds = new Set(blacklist?.map(b => b.e_company_id) || []);
  const blacklistedIds = new Set<string>(); // Placeholder

  const trustedProducts: AlibabaProduct[] = [];

  for (const product of products) {
    // HARD CHECKS
    
    // 1. Must have valid company ID
    if (!product.eCompanyId && !product.supplier?.eCompanyId) {
      console.warn(`[TrustFilter] Rejected Product ${product.id}: Missing eCompanyId`);
      continue;
    }

    const companyId = product.eCompanyId || product.supplier?.eCompanyId;

    // 2. Must not be blacklisted
    if (blacklistedIds.has(companyId)) {
      console.warn(`[TrustFilter] Rejected Product ${product.id}: Supplier is BLACKLISTED`);
      continue;
    }

    // 3. Must be online
    if (product.status && product.status !== 'PRODUCT_ONLINE' && product.status !== 'online') {
      console.warn(`[TrustFilter] Rejected Product ${product.id}: Not online`);
      continue;
    }

    // 4. Must have price
    if (!product.price || parseFloat(product.price as string) <= 0) {
      console.warn(`[TrustFilter] Rejected Product ${product.id}: Invalid price`);
      continue;
    }

    // Pass the product
    trustedProducts.push(product);
  }

  return trustedProducts;
}

/**
 * Strips all Alibaba and supplier identifying information from a product.
 * Ensures strict C2G white-labeling before data reaches the client browser.
 */
export function stripSupplierData(product: AlibabaProduct): Partial<AlibabaProduct> {
  const safeProduct = { ...product };

  // Delete all fields that could leak Alibaba or supplier identity
  delete safeProduct.eCompanyId;
  delete safeProduct.supplier;
  delete safeProduct.permalink;
  delete safeProduct.detail_url;
  delete safeProduct.store_type;
  
  // Note: We leave `id` so we can still fetch details via API, 
  // but it's just an opaque string to the user.

  return safeProduct;
}
