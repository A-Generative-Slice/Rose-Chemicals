'use client';

import { useState, useEffect } from 'react';
import { Metadata } from 'next'
import Link from 'next/link';
import { Search, Filter, Grid, List, ArrowLeft } from 'lucide-react';
import Header from '../../components/Header'
import ProductCard from '../../components/ProductCard'
import RequestQuoteFab from '../../components/RequestQuoteFab'

// Sample products data - in real app this would come from API
const ALL_PRODUCTS = [
  { id: 1, name: 'Delux Nice Broom', price: '₹115', image: '/images/BROOMS/164. DELUX NICE BROOM 115.png', category: 'Brooms' },
  { id: 2, name: 'Sitara Broom', price: '₹84', image: '/images/BROOMS/166. SITARA BROOM- 84.png', category: 'Brooms' },
  { id: 3, name: 'Supriya Nice Broom', price: '₹115', image: '/images/BROOMS/167. SUPRIYA NICE BROOM 115.png', category: 'Brooms' },
  { id: 4, name: 'Camel Red Broom', price: '₹65', image: '/images/BROOMS/168. CAMEL RED - 65.png', category: 'Brooms' },
  { id: 5, name: 'Shine Red Broom', price: '₹74', image: '/images/BROOMS/169. SHINE RED- 74.png', category: 'Brooms' },
  { id: 101, name: 'Avon Carpet Brush', price: '₹127', image: '/images/CARPET_BRUSHES/83. AVON CARPER BRUSH (307)-Rs 127.png', category: 'Carpet Brushes' },
  { id: 102, name: 'New Carpet Brush 1511', price: '₹68', image: '/images/CARPET_BRUSHES/113. NEW CARPET BRUSH 1511-Rs 68.png', category: 'Carpet Brushes' },
  { id: 201, name: 'Cobweb Sunflower Outer Lock', price: '₹98', image: '/images/COBWEB_CLEANERS/219. cobweb sunflower-outer-lock.png', category: 'Cobweb Cleaners' },
  { id: 202, name: 'Cobweb Cleaner Flat', price: '₹85', image: '/images/COBWEB_CLEANERS/cob web cleaner - flat-Photoroom.png', category: 'Cobweb Cleaners' },
  { id: 301, name: 'THK 140', price: '₹111', image: '/images/LONG_BRUSHES/123. THK 140-Rs 111.png', category: 'Long Brushes' },
  { id: 401, name: 'Supreme Sink Square', price: '₹57', image: '/images/SINK_BRUSHES/100. SUPREME SINK SQUIRE Rs 57.JPG', category: 'Sink Brushes' },
  { id: 801, name: 'Keetal Brush', price: '₹30', image: '/images/TOILET_BRUSHES/107. 5500 KEETAL BRUSH-Rs 30.png', category: 'Toilet Brushes' },
];

export default function ProductsPage() {
  const [filteredProducts, setFilteredProducts] = useState(ALL_PRODUCTS);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [viewMode, setViewMode] = useState('grid');
  const [showFilters, setShowFilters] = useState(false);

  const categories = [
    'all',
    ...Array.from(new Set(ALL_PRODUCTS.map(product => product.category)))
  ];

  useEffect(() => {
    let filtered = ALL_PRODUCTS;

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Sort products
    filtered = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'price-low':
          return parseFloat(a.price.replace('₹', '')) - parseFloat(b.price.replace('₹', ''));
        case 'price-high':
          return parseFloat(b.price.replace('₹', '')) - parseFloat(a.price.replace('₹', ''));
        default:
          return 0;
      }
    });

    setFilteredProducts(filtered);
  }, [selectedCategory, searchTerm, sortBy]);

  return (
    <main>
      <Header />
      
      {/* Hero Section for Products Page */}
      <section className="bg-hero-bg py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center gap-4 mb-6">
            <Link
              href="/"
              className="flex items-center gap-2 text-hero-subtext hover:text-white transition-colors"
            >
              <ArrowLeft size={20} />
              Back to Home
            </Link>
          </div>
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Our Products
            </h1>
            <p className="text-xl text-hero-subtext max-w-3xl mx-auto leading-relaxed">
              Discover our comprehensive range of premium cleaning tools and equipment. 
              From industrial-grade brooms to specialized brushes, we have everything you need 
              for professional cleaning solutions.
            </p>
          </div>
        </div>
      </section>

      {/* Search and Filters */}
      <section className="max-w-7xl mx-auto px-6 py-8">
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
              />
            </div>

            {/* Filters and Controls */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors lg:hidden"
              >
                <Filter size={16} />
                Filters
              </button>

              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category === 'all' ? 'All Categories' : category}
                  </option>
                ))}
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
              >
                <option value="name">Sort by Name</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>

              <div className="flex items-center border border-gray-300 rounded-md">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 ${viewMode === 'grid' ? 'bg-primary text-white' : 'text-gray-600 hover:bg-gray-50'} transition-colors`}
                >
                  <Grid size={16} />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 ${viewMode === 'list' ? 'bg-primary text-white' : 'text-gray-600 hover:bg-gray-50'} transition-colors`}
                >
                  <List size={16} />
                </button>
              </div>
            </div>
          </div>

          {/* Mobile Filters */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t lg:hidden">
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                  >
                    {categories.map(category => (
                      <option key={category} value={category}>
                        {category === 'all' ? 'All Categories' : category}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                  >
                    <option value="name">Sort by Name</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Results */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-gray-600">
            Showing {filteredProducts.length} of {ALL_PRODUCTS.length} products
          </p>
        </div>

        {/* Products Grid/List */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-gray-400 mb-4">
              <Search className="mx-auto h-24 w-24" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
            <p className="text-gray-600 mb-8">Try adjusting your search or filter criteria</p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('all');
              }}
              className="px-6 py-3 bg-primary text-white font-medium rounded-lg hover:bg-primary-dark transition-colors"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className={
            viewMode === 'grid'
              ? 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'
              : 'space-y-4'
          }>
            {filteredProducts.map(product => (
              viewMode === 'grid' ? (
                <ProductCard key={product.id} product={product} />
              ) : (
                <div key={product.id} className="bg-white rounded-lg shadow-sm p-4 flex items-center gap-4 hover:shadow-md transition-shadow">
                  <Link href={`/products/${product.id}`}>
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-24 h-24 object-contain bg-gray-50 rounded cursor-pointer"
                      onError={(e) => {
                        e.currentTarget.src = '/images/placeholder-product.png';
                      }}
                    />
                  </Link>
                  <div className="flex-1">
                    <Link href={`/products/${product.id}`}>
                      <h3 className="font-medium text-gray-900 hover:text-primary cursor-pointer transition-colors">
                        {product.name}
                      </h3>
                    </Link>
                    <p className="text-sm text-gray-600">{product.category}</p>
                    <p className="text-lg font-semibold text-gray-900 mt-1">{product.price}</p>
                  </div>
                  <div className="flex flex-col gap-2">
                    <button className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors text-sm">
                      Add to Cart
                    </button>
                    <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm">
                      Quote
                    </button>
                  </div>
                </div>
              )
            ))}
          </div>
        )}

        {/* Load More Button (for pagination) */}
        {filteredProducts.length > 0 && (
          <div className="text-center mt-12">
            <button className="px-8 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
              Load More Products
            </button>
          </div>
        )}
      </section>

      <RequestQuoteFab />
    </main>
  )
}
