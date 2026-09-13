const axios = require('axios');

class WebsiteAPI {
    constructor() {
        this.baseURL = process.env.WEBSITE_API_URL || 'https://www.rosechemicals.in';
        this.timeout = 10000; // 10 seconds
        this.cache = new Map();
        this.cacheExpiry = 30 * 60 * 1000; // 30 minutes
    }

    async getFeaturedProducts() {
        return this.makeRequest('/api/products/featured', 'featured_products');
    }

    async searchProducts(query, page = 1) {
        const q = (query || '').trim();
        const endpoint = page > 1
            ? `/api/products?query=${encodeURIComponent(q)}&page=${page}`
            : `/api/products?query=${encodeURIComponent(q)}`;
        return this.makeRequest(endpoint, `search_${q.toLowerCase()}_p${page}`);
    }

    async getCategories() {
        return this.makeRequest('/api/products/categories', 'categories');
    }

    async getProductsByCategory(categoryName, page = 1) {
        const endpoint = page > 1
            ? `/api/products/category/${encodeURIComponent(categoryName)}?page=${page}`
            : `/api/products/category/${encodeURIComponent(categoryName)}`;
        return this.makeRequest(endpoint, `category_${categoryName}_p${page}`);
    }

    async getProductDetails(slug) {
        return this.makeRequest(`/api/products/${encodeURIComponent(slug)}`, `product_${slug}`);
    }

    async makeRequest(endpoint, cacheKey) {
        const cached = this.getCachedData(cacheKey);
        if (cached) return cached;

        try {
            const response = await axios.get(`${this.baseURL}${endpoint}`, {
                timeout: this.timeout,
                headers: {
                    'User-Agent': 'Rose-Chemicals-WhatsApp-Bot/1.0',
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            });

            const data = response.data;
            this.setCachedData(cacheKey, data);
            return data;
        } catch (error) {
            console.error(`API request failed for ${endpoint}:`, error.message);
            return this.getEmptyResponse();
        }
    }

    getCachedData(key) {
        const cached = this.cache.get(key);
        if (cached && Date.now() - cached.timestamp < this.cacheExpiry) {
            console.log(`Cache hit for: ${key}`);
            return cached.data;
        }
        return null;
    }

    setCachedData(key, data) {
        this.cache.set(key, {
            data: data,
            timestamp: Date.now()
        });
        console.log(`Cached data for: ${key}`);
    }

    getEmptyResponse() {
        return { products: [], categories: [], product: null };
    }

    clearCache() {
        this.cache.clear();
        console.log('Website API cache cleared');
    }

    // Health check method
    async healthCheck() {
        try {
            const response = await axios.get(`${this.baseURL}/api/whatsapp/categories`, {
                timeout: 5000,
                headers: {
                    'User-Agent': 'Rose-Chemicals-WhatsApp-Bot/1.0'
                }
            });
            return response.status === 200;
        } catch (error) {
            console.error('Website API health check failed:', error.message);
            return false;
        }
    }
}

module.exports = new WebsiteAPI();