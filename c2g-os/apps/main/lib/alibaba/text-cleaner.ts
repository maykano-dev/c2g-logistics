/**
 * C2G Product Normalization Utility
 * 
 * Cleans up notoriously messy, keyword-stuffed Alibaba product titles
 * using a deterministic, heuristic approach (No AI API required).
 */

const SPAM_KEYWORDS = [
  'hot sale', 'hotsale', '2023', '2024', '2025', 'new arrival', 'new design',
  'wholesale', 'dropshipping', 'dropship', 'factory direct', 'factory price',
  'cheap', 'high quality', 'top quality', 'premium quality', 'oem', 'odm',
  'fast shipping', 'ready to ship', 'free shipping', 'custom logo', 'customized',
  'amazon', 'ebay', 'hot selling', 'bestseller', 'best seller', 'in stock',
  'manufacture', 'manufacturer', 'supplier'
];

/**
 * Normalizes an Alibaba product title into a clean, retail-friendly name.
 */
export function normalizeProductTitle(title: string): string {
  if (!title) return '';

  let cleanTitle = title.toLowerCase();

  // 1. Remove spam keywords
  for (const keyword of SPAM_KEYWORDS) {
    const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
    cleanTitle = cleanTitle.replace(regex, '');
  }

  // 2. Remove weird brackets and promotional punctuation
  cleanTitle = cleanTitle.replace(/[【】\[\]\(\)\*\!\?]/g, ' ');

  // 3. Remove multiple spaces
  cleanTitle = cleanTitle.replace(/\s+/g, ' ').trim();

  // 4. Title Case (capitalize first letter of each word)
  cleanTitle = cleanTitle
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  // 5. Truncate if ridiculously long (keep the most descriptive first 60 chars)
  if (cleanTitle.length > 70) {
    // Try to cut off at the last space before 70 chars
    const cutPos = cleanTitle.lastIndexOf(' ', 70);
    cleanTitle = cutPos > 0 ? cleanTitle.substring(0, cutPos) : cleanTitle.substring(0, 70);
    cleanTitle += '...';
  }

  // If the cleanup completely destroyed the title (rare), fallback to a truncated original
  if (cleanTitle.length < 5) {
    return title.substring(0, 50) + '...';
  }

  return cleanTitle;
}
