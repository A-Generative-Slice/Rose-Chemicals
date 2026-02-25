'use client';

import React, { useState, useEffect } from 'react';
import { productsAPI } from '../../src/services/api';
import { useCart } from '../../src/contexts/CartContext';
import { useAnalytics } from '../../src/hooks/useMonitoring';
import LoadingSpinner from '../../src/components/ui/LoadingSpinner';
import LoadingSkeleton from '../../src/components/ui/LoadingSkeleton';
import ErrorBoundary from '../../src/components/ui/ErrorBoundary';
import OptimizedImage from '../../src/components/ui/OptimizedImage';
import Header from '../../components/Header';
import { Search, Filter, Grid, List, ShoppingCart, Star } from 'lucide-react';

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  mrp?: number;
  images: string[];
  stock: number;
  category: {
    _id: string;
    name: string;
  };
  features: string[];
  weight: string;
  isActive: boolean;
  sku: string;
}

interface Category {
  _id: string;
  name: string;
  description?: string;
}

const ProductsPageEnhanced: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [addingToCart, setAddingToCart] = useState<string | null>(null);

  const { addToCart } = useCart();
  const { trackEvent, trackAddToCart } = useAnalytics();

  useEffect(() => {
    loadProducts();
    loadCategories();
  }, [currentPage, selectedCategory, sortBy, searchTerm]);

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError(null);

      const params: any = {
        page: currentPage,
        limit: 12,
        sort: sortBy,
      };

      if (selectedCategory !== 'all') {
        params.category = selectedCategory;
      }

      if (searchTerm) {
        params.search = searchTerm;
      }

      const response = await productsAPI.getAll(params);
      setProducts(response.products || []);
      setTotalPages(response.totalPages || 1);

      trackEvent('products_viewed', {
        category: selectedCategory,
        search_term: searchTerm,
        total_products: response.products?.length || 0
      });
    } catch (err: any) {
      setError(err.message || 'Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      const apiUrl = (process.env.NEXT_PUBLIC_API_URL || '/api') + '/products/categories';
      const response = await fetch(apiUrl);
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setCategories(data.categories);
        }
      }
    } catch (err) {
      console.error('Failed to load categories:', err);
    }
  };

  const handleAddToCart = async (product: Product) => {
    try {
      setAddingToCart(product._id);
      await addToCart({
        productId: product._id,
        name: product.name,
        price: product.price,
        image: product.images[0] || '/images/placeholder.jpg',
        quantity: 1
      });

      trackAddToCart(product._id, product.name, product.price);

      // Show success message (you could use a toast library here)
      alert('Product added to cart successfully!');
    } catch (err: any) {
      alert('Failed to add product to cart: ' + err.message);
    } finally {
      setAddingToCart(null);
    }
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = !searchTerm ||
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = selectedCategory === 'all' ||
      product.category?.name === selectedCategory;

    return matchesSearch && matchesCategory && product.isActive;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price_low':
        return a.price - b.price;
      case 'price_high':
        return b.price - a.price;
      case 'name':
        return a.name.localeCompare(b.name);
      default:
        return 0;
    }
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    loadProducts();
  };

  if (loading && products.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <LoadingSkeleton type="text" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <LoadingSkeleton type="product" count={8} />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <ErrorBoundary
          title="Failed to Load Products"
          message={error}
          onRetry={() => {
            setError(null);
            loadProducts();
          }}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Our Products</h1>
          <p className="text-gray-600">Discover our premium cleaning solutions for every need</p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4 items-center">
            {/* Search */}
            <form onSubmit={handleSearch} className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>
            </form>

            {/* Category Filter */}
            <div className="flex items-center gap-4">
              <select
                value={selectedCategory}
                onChange={(e) => {
                  setSelectedCategory(e.target.value);
                  setCurrentPage(1);
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
              >
                <option value="all">All Categories</option>
                {categories.map((category) => (
                  <option key={category._id} value={category.name}>
                    {category.name}
                  </option>
                ))}
              </select>

              {/* Sort */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
              >
                <option value="name">Sort by Name</option>
                <option value="price_low">Price: Low to High</option>
                <option value="price_high">Price: High to Low</option>
              </select>

              {/* View Mode */}
              <div className="flex border border-gray-300 rounded-lg">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 ${viewMode === 'grid' ? 'bg-rose-500 text-white' : 'text-gray-600'}`}
                >
                  <Grid className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 ${viewMode === 'list' ? 'bg-rose-500 text-white' : 'text-gray-600'}`}
                >
                  <List className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Results Summary */}
        <div className="flex justify-between items-center mb-6">
          <p className="text-gray-600">
            Showing {sortedProducts.length} products
            {selectedCategory !== 'all' && ` in ${selectedCategory}`}
            {searchTerm && ` for "${searchTerm}"`}
          </p>
          {loading && <LoadingSpinner size="sm" />}
        </div>

        {/* Products Grid/List */}
        {sortedProducts.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl text-gray-300 mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No products found</h3>
            <p className="text-gray-500">Try adjusting your search or filter criteria</p>
          </div>
        ) : (
          <div className={
            viewMode === 'grid'
              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
              : 'space-y-4'
          }>
            {sortedProducts.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
                viewMode={viewMode}
                onAddToCart={handleAddToCart}
                addingToCart={addingToCart === product._id}
              />
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-8">
            <div className="flex space-x-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-4 py-2 rounded-lg ${currentPage === page
                      ? 'bg-rose-500 text-white'
                      : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                    }`}
                >
                  {page}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Product Card Component
interface ProductCardProps {
  product: Product;
  viewMode: 'grid' | 'list';
  onAddToCart: (product: Product) => void;
  addingToCart: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, viewMode, onAddToCart, addingToCart }) => {
  const discount = product.mrp ? Math.round(((product.mrp - product.price) / product.mrp) * 100) : 0;

  if (viewMode === 'list') {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6 flex items-center space-x-6">
        <OptimizedImage
          src={product.images[0] || '/images/placeholder.jpg'}
          alt={product.name}
          width={120}
          height={120}
          className="rounded-lg"
        />

        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">{product.name}</h3>
          <p className="text-gray-600 mb-2 line-clamp-2">{product.description}</p>

          <div className="flex items-center space-x-2 mb-2">
            <span className="text-xl font-bold text-rose-600">₹{product.price}</span>
            {product.mrp && product.mrp > product.price && (
              <>
                <span className="text-gray-500 line-through">₹{product.mrp}</span>
                <span className="bg-green-100 text-green-800 text-sm px-2 py-1 rounded">
                  {discount}% OFF
                </span>
              </>
            )}
          </div>

          <div className="flex items-center space-x-4">
            <span className={`text-sm ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
              {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
            </span>
            <span className="text-sm text-gray-500">{product.weight}</span>
          </div>
        </div>

        <div className="flex flex-col space-y-2">
          <button
            onClick={() => onAddToCart(product)}
            disabled={product.stock === 0 || addingToCart}
            className="bg-rose-600 text-white px-6 py-2 rounded-lg hover:bg-rose-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center space-x-2"
          >
            {addingToCart ? (
              <LoadingSpinner size="sm" color="white" />
            ) : (
              <>
                <ShoppingCart className="h-4 w-4" />
                <span>Add to Cart</span>
              </>
            )}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
      <div className="relative">
        <OptimizedImage
          src={product.images[0] || '/images/placeholder.jpg'}
          alt={product.name}
          width={300}
          height={200}
          className="w-full h-48"
        />

        {discount > 0 && (
          <span className="absolute top-2 left-2 bg-red-500 text-white text-sm px-2 py-1 rounded">
            {discount}% OFF
          </span>
        )}

        {product.stock === 0 && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <span className="bg-red-500 text-white px-3 py-1 rounded">Out of Stock</span>
          </div>
        )}
      </div>

      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">{product.name}</h3>
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{product.description}</p>

        <div className="flex items-center space-x-2 mb-3">
          <span className="text-xl font-bold text-rose-600">₹{product.price}</span>
          {product.mrp && product.mrp > product.price && (
            <span className="text-gray-500 line-through text-sm">₹{product.mrp}</span>
          )}
        </div>

        <div className="flex items-center justify-between mb-3">
          <span className="text-sm text-gray-500">{product.weight}</span>
          <span className="text-sm text-gray-500">SKU: {product.sku}</span>
        </div>

        <button
          onClick={() => onAddToCart(product)}
          disabled={product.stock === 0 || addingToCart}
          className="w-full bg-rose-600 text-white py-2 px-4 rounded-lg hover:bg-rose-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
        >
          {addingToCart ? (
            <LoadingSpinner size="sm" color="white" />
          ) : (
            <>
              <ShoppingCart className="h-4 w-4" />
              <span>Add to Cart</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default ProductsPageEnhanced;
