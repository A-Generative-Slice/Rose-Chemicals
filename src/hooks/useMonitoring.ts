'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

// Performance monitoring hook
export const usePerformanceMonitoring = () => {
  const pathname = usePathname();

  useEffect(() => {
    // Log page load performance
    const logPerformance = () => {
      if (typeof window !== 'undefined' && 'performance' in window) {
        const perfData = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
        
        const metrics = {
          page: pathname,
          loadTime: perfData.loadEventEnd - perfData.fetchStart,
          domContentLoaded: perfData.domContentLoadedEventEnd - perfData.fetchStart,
          firstPaint: 0,
          firstContentfulPaint: 0,
        };

        // Get paint metrics
        const paintEntries = performance.getEntriesByType('paint');
        paintEntries.forEach((entry) => {
          if (entry.name === 'first-paint') {
            metrics.firstPaint = entry.startTime;
          } else if (entry.name === 'first-contentful-paint') {
            metrics.firstContentfulPaint = entry.startTime;
          }
        });

        // Log to console in development
        if (process.env.NODE_ENV === 'development') {
          console.log('Performance Metrics:', metrics);
        }

        // In production, you would send this to your analytics service
        // analytics.track('page_performance', metrics);
      }
    };

    // Wait for page to load completely
    const timer = setTimeout(logPerformance, 1000);
    return () => clearTimeout(timer);
  }, [pathname]);
};

// Error boundary for catching JavaScript errors
export class ErrorBoundaryComponent extends Error {
  constructor(message: string, info?: any) {
    super(message);
    this.name = 'ErrorBoundaryComponent';
    
    // Log error to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Error Boundary Caught:', message, info);
    }

    // In production, you would send this to your error tracking service
    // errorTracking.captureException(this, { extra: info });
  }
}

// Hook for API error tracking
export const useErrorTracking = () => {
  const trackError = (error: Error, context?: any) => {
    const errorInfo = {
      message: error.message,
      stack: error.stack,
      context,
      timestamp: new Date().toISOString(),
      userAgent: typeof window !== 'undefined' ? navigator.userAgent : '',
      url: typeof window !== 'undefined' ? window.location.href : '',
    };

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Error Tracked:', errorInfo);
    }

    // In production, you would send this to your error tracking service
    // errorTracking.captureException(error, { extra: errorInfo });
  };

  return { trackError };
};

// Analytics tracking hook
export const useAnalytics = () => {
  const trackEvent = (eventName: string, properties?: any) => {
    const eventData = {
      event: eventName,
      properties: {
        ...properties,
        timestamp: new Date().toISOString(),
        page: typeof window !== 'undefined' ? window.location.pathname : '',
      },
    };

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.log('Event Tracked:', eventData);
    }

    // In production, you would send this to your analytics service
    // analytics.track(eventName, eventData);
  };

  const trackPageView = (page: string) => {
    trackEvent('page_view', { page });
  };

  const trackPurchase = (orderId: string, value: number, items: any[]) => {
    trackEvent('purchase', {
      order_id: orderId,
      value,
      currency: 'INR',
      items,
    });
  };

  const trackAddToCart = (productId: string, productName: string, price: number) => {
    trackEvent('add_to_cart', {
      product_id: productId,
      product_name: productName,
      price,
      currency: 'INR',
    });
  };

  return {
    trackEvent,
    trackPageView,
    trackPurchase,
    trackAddToCart,
  };
};

export default usePerformanceMonitoring;
