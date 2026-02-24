/**
 * Utility functions for handling product image URLs.
 * Centralizes the logic for resolving image URLs from various sources
 * (S3, local uploads, etc.) into displayable URLs.
 */

/**
 * Resolves a product image URL to a displayable format.
 * - S3 URLs (amazonaws.com): proxied through /api/image-proxy to handle private bucket access
 * - Other full HTTP/HTTPS URLs: proxied through /api/image-proxy for consistency
 * - Local /uploads/ paths: proxied through /api/image-proxy
 * - Bare filenames: proxied through /api/image-proxy
 * - Empty/null/undefined: returns empty string
 */
export function getProductImageUrl(url: string | undefined | null): string {
  if (!url) return '';

  // S3 URLs and other HTTP URLs - proxy through image-proxy for consistent access
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return `/api/image-proxy?path=${encodeURIComponent(url)}`;
  }

  // Local uploads path - strip prefix and proxy
  if (url.startsWith('/uploads/')) {
    const filename = url.replace('/uploads/', '');
    return `/api/image-proxy?path=${encodeURIComponent(filename)}`;
  }

  // Bare filename - proxy through image-proxy
  return `/api/image-proxy?path=${encodeURIComponent(url)}`;
}

/**
 * Gets the URL for the first image of a product.
 */
export function getFirstProductImageUrl(images: Array<{ url?: string }> | undefined | null): string {
  if (!images || images.length === 0) return '';
  return getProductImageUrl(images[0]?.url);
}
