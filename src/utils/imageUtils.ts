/**
 * Resolves a product image URL for display.
 * Handles S3 URLs, local /uploads/ paths, and relative filenames.
 */
export function getProductImageUrl(url: string | undefined | null): string {
  if (!url) return '/images/placeholder-product.svg';

  // Full HTTP(S) URL — use directly (S3, CDN, external)
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }

  // Local upload path — proxy through our API route
  if (url.startsWith('/uploads/')) {
    const filename = url.replace('/uploads/', '');
    return `/api/image-proxy?path=${encodeURIComponent(filename)}`;
  }

  // Bare filename (e.g. "product-123456.webp") — proxy it
  return `/api/image-proxy?path=${encodeURIComponent(url)}`;
}

/**
 * Gets the display URL for the first image of a product,
 * with fallback to placeholder.
 */
export function getFirstProductImageUrl(product: any): string {
  const url = product?.images?.[0]?.url || product?.image;
  return getProductImageUrl(url);
}
