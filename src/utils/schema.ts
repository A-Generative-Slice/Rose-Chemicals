import { Organization, WithContext } from 'schema-dts';

export const organizationSchema: WithContext<Organization> = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Rose Chemicals',
  description: 'Professional cleaning products and solutions for homes and businesses',
  url: 'https://rosechemicals.com',
  logo: 'https://rosechemicals.com/images/logo.png',
  contactPoint: {
    '@type': 'ContactPoint',
    telephone: '+91-1234567890',
    contactType: 'customer service',
    availableLanguage: ['English', 'Hindi']
  },
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Your Street Address',
    addressLocality: 'Your City',
    addressRegion: 'Your State',
    postalCode: 'Your Pincode',
    addressCountry: 'IN'
  },
  sameAs: [
    'https://www.facebook.com/rosechemicals',
    'https://www.instagram.com/rosechemicals',
    'https://www.linkedin.com/company/rosechemicals'
  ]
};

export const generateProductSchema = (product: any) => {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    image: product.images?.[0] || '/images/placeholder.jpg',
    sku: product.sku,
    brand: {
      '@type': 'Brand',
      name: 'Rose Chemicals'
    },
    category: product.category?.name,
    offers: {
      '@type': 'Offer',
      price: product.price,
      priceCurrency: 'INR',
      availability: product.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      seller: {
        '@type': 'Organization',
        name: 'Rose Chemicals'
      }
    },
    aggregateRating: product.rating ? {
      '@type': 'AggregateRating',
      ratingValue: product.rating.average,
      reviewCount: product.rating.count
    } : undefined
  };
};

export const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'Rose Chemicals',
  url: 'https://rosechemicals.com',
  potentialAction: {
    '@type': 'SearchAction',
    target: 'https://rosechemicals.com/products?search={search_term_string}',
    'query-input': 'required name=search_term_string'
  }
};
