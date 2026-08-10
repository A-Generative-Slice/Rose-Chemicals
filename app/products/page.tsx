'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Header from '../../components/Header';
import ProductCard from '../../components/ProductCard';
import { Search, X, SlidersHorizontal, Grid3X3, LayoutList, ChevronDown } from 'lucide-react';

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  mrp?: number;
  images: any[];
  stock: number;
  category: { _id: string; name: string } | string;
  features?: string[];
  weight?: string;
  isActive: boolean;
  sku?: string;
  isFeatured?: boolean;
}

function ProductsContent() {
  const [products, setProducts]           = useState<Product[]>([]);
  const [categories, setCategories]       = useState<any[]>([]);
  const [loading, setLoading]             = useState(true);
  const [error, setError]                 = useState<string | null>(null);
  const [searchTerm, setSearchTerm]       = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy]               = useState('name');
  const [viewMode, setViewMode]           = useState<'grid' | 'list'>('grid');
  const [filtersOpen, setFiltersOpen]     = useState(false);

  const searchParams = useSearchParams();

  useEffect(() => {
    const q = searchParams.get('search');
    setSearchTerm(q || '');
  }, [searchParams]);

  useEffect(() => {
    loadProducts();
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const res = await fetch((process.env.NEXT_PUBLIC_API_URL || '/api') + '/products/categories');
      if (res.ok) {
        const data = await res.json();
        if (data.success) setCategories(data.categories);
      }
    } catch (e) { console.error('Categories error:', e); }
  };

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch((process.env.NEXT_PUBLIC_API_URL || '/api') + '/products');
      if (!res.ok) throw new Error(`Failed to fetch products (${res.status})`);
      const data = await res.json();
      setProducts(data.products || []);
    } catch (e: any) {
      setError(e.message || 'Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = products
    .filter(p => p.isActive)
    .filter(p => {
      const catName = typeof p.category === 'object' ? p.category?.name : p.category;
      const matchCat = selectedCategory === 'all' || catName === selectedCategory;
      const matchSearch = !searchTerm ||
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (p.description || '').toLowerCase().includes(searchTerm.toLowerCase());
      return matchCat && matchSearch;
    })
    .sort((a, b) => {
      if (sortBy === 'price_low')  return a.price - b.price;
      if (sortBy === 'price_high') return b.price - a.price;
      return a.name.localeCompare(b.name);
    });

  // Loading skeleton
  if (loading) {
    return (
      <div className="min-h-screen" style={{ background: 'linear-gradient(180deg, #0f1e3a 0%, #f0f7ff 300px)' }}>
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-20">
          {/* Header shimmer */}
          <div className="mb-10">
            <div className="h-8 w-48 bg-white/10 rounded-xl mb-3 animate-pulse" />
            <div className="h-5 w-72 bg-white/06 rounded-lg animate-pulse" />
          </div>
          {/* Card skeletons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="bg-white rounded-2xl overflow-hidden animate-pulse">
                <div className="bg-gray-200 aspect-[4/3]" />
                <div className="p-4 space-y-2">
                  <div className="h-3 bg-gray-200 rounded w-1/3" />
                  <div className="h-4 bg-gray-200 rounded w-3/4" />
                  <div className="h-3 bg-gray-200 rounded w-1/2" />
                  <div className="h-6 bg-gray-200 rounded w-1/4 mt-2" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen" style={{ background: 'linear-gradient(180deg, #0f1e3a 0%, #f0f7ff 300px)' }}>
        <Header />
        <div className="flex flex-col items-center justify-center py-32 px-4 text-center">
          <div className="text-6xl mb-6">⚠️</div>
          <h2 className="text-2xl font-bold text-white mb-2">Couldn&apos;t load products</h2>
          <p className="text-white/50 mb-8 max-w-sm">{error}</p>
          <button
            onClick={loadProducts}
            className="btn-primary"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(180deg, #0f1e3a 0%, #0f1e3a 180px, #f0f7ff 450px, #f0f7ff 100%)' }}>
      <Header />

      {/* ── PAGE HERO STRIP ── */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-14 sm:pt-14 sm:pb-20">
          <div className="flex flex-col sm:flex-row sm:items-end gap-4 justify-between">
            <div>
              <span className="inline-block text-[10px] font-bold tracking-widest uppercase text-[#A8DADC] mb-2">
                Our Catalog
              </span>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                All Products
              </h1>
              <p className="mt-2 text-white/50 text-sm max-w-md">
                Professional cleaning formulas for homes, offices & industries across India
              </p>
            </div>
            <div className="flex items-center gap-2 text-white/50 text-sm">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              {filteredProducts.length} products available
            </div>
          </div>
        </div>
        {/* mini wave */}
        <div className="absolute bottom-0 left-0 right-0 overflow-hidden" style={{ lineHeight: 0 }}>
          <svg viewBox="0 0 1440 40" preserveAspectRatio="none" className="w-full h-10">
            <path d="M0,20 C480,40 960,0 1440,20 L1440,40 L0,40 Z" fill="#f0f7ff" />
          </svg>
        </div>
      </div>

      {/* ── MAIN CONTENT ── */}
      <div className="bg-gradient-to-b from-[#f0f7ff] to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">

          {/* ── FILTER BAR ── */}
          <div className="bg-white rounded-2xl shadow-sm border border-[#A8DADC]/20 p-4 mb-8 -mt-1">
            <div className="flex flex-col lg:flex-row gap-3 items-stretch lg:items-center">

              {/* Search */}
              <div className="relative flex-1 min-w-0">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#94a3b8]" size={16} />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-[#f8fafc] border border-[#e2e8f0]
                             text-[#1D3557] text-sm placeholder:text-[#94a3b8]
                             focus:outline-none focus:ring-2 focus:ring-[#457B9D]/30 focus:border-[#457B9D]
                             transition-all"
                />
                {searchTerm && (
                  <button onClick={() => setSearchTerm('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94a3b8] hover:text-[#457B9D]">
                    <X size={14} />
                  </button>
                )}
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                {/* Category */}
                <div className="relative">
                  <select
                    value={selectedCategory}
                    onChange={e => setSelectedCategory(e.target.value)}
                    className="appearance-none pl-3 pr-8 py-2.5 rounded-xl bg-[#f8fafc] border border-[#e2e8f0]
                               text-[#1D3557] text-sm font-medium
                               focus:outline-none focus:ring-2 focus:ring-[#457B9D]/30 focus:border-[#457B9D]
                               transition-all cursor-pointer"
                  >
                    <option value="all">All Categories</option>
                    {categories.map(cat => {
                      const name = typeof cat === 'string' ? cat : cat.name;
                      return <option key={name} value={name}>{name}</option>;
                    })}
                  </select>
                  <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#94a3b8] pointer-events-none" />
                </div>

                {/* Sort */}
                <div className="relative">
                  <select
                    value={sortBy}
                    onChange={e => setSortBy(e.target.value)}
                    className="appearance-none pl-3 pr-8 py-2.5 rounded-xl bg-[#f8fafc] border border-[#e2e8f0]
                               text-[#1D3557] text-sm font-medium
                               focus:outline-none focus:ring-2 focus:ring-[#457B9D]/30 focus:border-[#457B9D]
                               transition-all cursor-pointer"
                  >
                    <option value="name">A → Z</option>
                    <option value="price_low">Price ↑</option>
                    <option value="price_high">Price ↓</option>
                  </select>
                  <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#94a3b8] pointer-events-none" />
                </div>

                {/* View toggle */}
                <div className="flex rounded-xl border border-[#e2e8f0] overflow-hidden bg-[#f8fafc]">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2.5 transition-colors ${viewMode === 'grid'
                      ? 'bg-[#1D3557] text-white'
                      : 'text-[#94a3b8] hover:text-[#457B9D]'}`}
                  >
                    <Grid3X3 size={16} />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2.5 transition-colors ${viewMode === 'list'
                      ? 'bg-[#1D3557] text-white'
                      : 'text-[#94a3b8] hover:text-[#457B9D]'}`}
                  >
                    <LayoutList size={16} />
                  </button>
                </div>
              </div>
            </div>

            {/* Active filter chips */}
            {(searchTerm || selectedCategory !== 'all') && (
              <div className="flex items-center gap-2 mt-3 pt-3 border-t border-[#e2e8f0]">
                <span className="text-xs text-[#64748b]">Active:</span>
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#1D3557]/08 text-[#1D3557]
                               text-xs font-medium hover:bg-[#E63946]/10 hover:text-[#E63946] transition-colors"
                  >
                    &quot;{searchTerm}&quot; <X size={11} />
                  </button>
                )}
                {selectedCategory !== 'all' && (
                  <button
                    onClick={() => setSelectedCategory('all')}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#457B9D]/10 text-[#457B9D]
                               text-xs font-medium hover:bg-[#E63946]/10 hover:text-[#E63946] transition-colors"
                  >
                    {selectedCategory} <X size={11} />
                  </button>
                )}
                <button
                  onClick={() => { setSearchTerm(''); setSelectedCategory('all'); }}
                  className="ml-auto text-xs text-[#94a3b8] hover:text-[#E63946] transition-colors"
                >
                  Clear all
                </button>
              </div>
            )}
          </div>

          {/* Category quick-filter pills (horizontal scroll on mobile) */}
          {categories.length > 0 && (
            <div className="flex gap-2 overflow-x-auto pb-3 mb-6 scrollbar-hide">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`category-chip flex-shrink-0 ${selectedCategory === 'all' ? 'active' : 'inactive'}`}
              >
                🏠 All
              </button>
              {categories.map(cat => {
                const name = typeof cat === 'string' ? cat : cat.name;
                return (
                  <button
                    key={name}
                    onClick={() => setSelectedCategory(name)}
                    className={`category-chip flex-shrink-0 ${selectedCategory === name ? 'active' : 'inactive'}`}
                  >
                    {name}
                  </button>
                );
              })}
            </div>
          )}

          {/* Results count */}
          <div className="flex justify-between items-center mb-5">
            <p className="text-sm text-[#64748b]">
              {filteredProducts.length === 0
                ? 'No products found'
                : `Showing ${filteredProducts.length} product${filteredProducts.length !== 1 ? 's' : ''}`
              }
              {selectedCategory !== 'all' && <span className="text-[#457B9D] font-medium"> in {selectedCategory}</span>}
            </p>
          </div>

          {/* Products grid or empty state */}
          {filteredProducts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <img src="/images/mascot.png" alt="No results" className="w-36 sm:w-48 object-contain mb-6 opacity-70" />
              <h3 className="text-xl font-bold text-[#1D3557] mb-2">No products found</h3>
              <p className="text-[#64748b] text-sm mb-6 max-w-sm">
                Try clearing your search or selecting a different category
              </p>
              <button
                onClick={() => { setSearchTerm(''); setSelectedCategory('all'); }}
                className="btn-primary !bg-[#1D3557] !from-[#1D3557] !to-[#2d4b76] !text-white"
                style={{ background: '#1D3557', color: 'white' }}
              >
                Show All Products
              </button>
            </div>
          ) : (
            <div className={
              viewMode === 'grid'
                ? 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5'
                : 'flex flex-col gap-4'
            }>
              {filteredProducts.map(product => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen" style={{ background: 'linear-gradient(180deg,#0f1e3a 0%,#f0f7ff 300px)' }}>
        <div className="flex items-center justify-center min-h-screen">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 rounded-full border-3 border-[#A8DADC] border-t-transparent animate-spin" />
            <p className="text-white/60 text-sm">Loading products...</p>
          </div>
        </div>
      </div>
    }>
      <ProductsContent />
    </Suspense>
  );
}
