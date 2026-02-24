/**
 * Utility functions for handling product image URLs.
 * Centralizes the logic for resolving image URLs from various sources
 * (S3, local uploads, etc.) into displayable URLs.
 */

/**
 * Resolves a product image URL to a displayable format.
 * - S3 URLs (amazonaws.com): proxied through /api/image-proxy to handle private bucket access
 * - Other full HTTP/HTTPS URLs: proxied through /api/image-proxy for consistency
 * - Paths starting with / (e.g., /uploads/ or /images/): passed directly to image-proxy
 * - Bare filenames: passed to image-proxy (which will prepend /uploads/)
 * - Empty/null/undefined: returns empty string
 */
export function getProductImageUrl(url: string | undefined | null): string {
  if (!url) return '';

  // S3 URLs and other HTTP URLs - proxy through image-proxy
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return `/api/image-proxy?path=${encodeURIComponent(url)}`;
  }

  // Paths starting with / (e.g. /uploads/products/... or /images/CATALOG IMAGES/...)
  // We pass the full path to the proxy
  if (url.startsWith('/')) {
    return `/api/image-proxy?path=${encodeURIComponent(url)}`;
  }

  // Bare filename - proxy through image-proxy (proxy will handle prepending /uploads/)
  return `/api/image-proxy?path=${encodeURIComponent(url)}`;
}

/**
 * Gets the URL for the first image of a product.
 */
export function getFirstProductImageUrl(images: Array<{ url?: string }> | undefined | null): string {
  if (!images || images.length === 0) return '';
  return getProductImageUrl(images[0]?.url);
}
