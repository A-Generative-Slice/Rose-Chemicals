'use client';

import { useState, useEffect, useRef } from 'react';
import { Search, X, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { productsAPI } from '../src/services/api';

interface ProductSuggestion {
  _id: string;
  name: string;
  price: number;
  images: Array<{ url: string; alt?: string }>;
  averageRating: number;
}

interface ProductSearchProps {
  placeholder?: string;
  className?: string;
  onSelect?: (product: ProductSuggestion) => void;
  showSuggestions?: boolean;
}

export default function ProductSearch({
  placeholder = 'Search products...',
  className = '',
  onSelect,
  showSuggestions = true
}: ProductSearchProps) {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<ProductSuggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);

  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
        setSelectedIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchSuggestions = async (searchQuery: string) => {
    if (!searchQuery.trim() || searchQuery.length < 2) {
      setSuggestions([]);
      setShowDropdown(false);
      return;
    }

    try {
      setLoading(true);
      const response = await productsAPI.getProductSuggestions(searchQuery, 6);
      setSuggestions(response.suggestions || []);
      setShowDropdown(true);
      setSelectedIndex(-1);
    } catch (error) {
      console.error('Error fetching suggestions:', error);
      setSuggestions([]);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);

    if (!showSuggestions) return;

    // Debounce API calls
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      fetchSuggestions(value);
    }, 300);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showDropdown || suggestions.length === 0) {
      if (e.key === 'Enter') {
        handleSearch();
      }
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev =>
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0) {
          handleSelectProduct(suggestions[selectedIndex]);
        } else {
          handleSearch();
        }
        break;
      case 'Escape':
        setShowDropdown(false);
        setSelectedIndex(-1);
        inputRef.current?.blur();
        break;
    }
  };

  const handleSelectProduct = (product: ProductSuggestion) => {
    setQuery(product.name);
    setShowDropdown(false);
    setSelectedIndex(-1);

    if (onSelect) {
      onSelect(product);
    } else {
      // Navigate to product page
      window.location.href = `/products/${product._id}`;
    }
  };

  const handleSearch = () => {
    if (query.trim()) {
      window.location.href = `/products?search=${encodeURIComponent(query.trim())}`;
    }
  };

  const clearSearch = () => {
    setQuery('');
    setSuggestions([]);
    setShowDropdown(false);
    setSelectedIndex(-1);
    inputRef.current?.focus();
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
  };

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(<span key={i} className="text-yellow-400">★</span>);
      } else if (i === fullStars && hasHalfStar) {
        stars.push(<span key={i} className="text-yellow-400">☆</span>);
      } else {
        stars.push(<span key={i} className="text-gray-300">☆</span>);
      }
    }

    return stars;
  };

  return (
    <div ref={searchRef} className={`relative ${className}`}>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>

        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            if (suggestions.length > 0) {
              setShowDropdown(true);
            }
          }}
          placeholder={placeholder}
          className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent placeholder-gray-500"
        />

        <div className="absolute inset-y-0 right-0 flex items-center">
          {loading && (
            <Loader2 className="h-4 w-4 text-gray-400 animate-spin mr-3" />
          )}

          {query && !loading && (
            <button
              onClick={clearSearch}
              className="p-1 hover:bg-gray-100 rounded mr-2 transition-colors"
            >
              <X className="h-4 w-4 text-gray-400" />
            </button>
          )}
        </div>
      </div>

      {/* Suggestions Dropdown */}
      {showDropdown && showSuggestions && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
          {loading ? (
            <div className="p-4 text-center">
              <Loader2 className="h-5 w-5 animate-spin mx-auto mb-2 text-gray-400" />
              <p className="text-sm text-gray-500">Searching...</p>
            </div>
          ) : suggestions.length > 0 ? (
            <>
              {suggestions.map((product, index) => (
                <button
                  key={product._id}
                  onClick={() => handleSelectProduct(product)}
                  className={`w-full text-left p-3 hover:bg-gray-50 flex items-center gap-3 transition-colors ${index === selectedIndex ? 'bg-blue-50' : ''
                    }`}
                >
                  <div className="w-12 h-12 bg-gray-100 rounded-lg flex-shrink-0 overflow-hidden">
                    {product.images?.[0]?.url ? (
                      <img
                        src={product.images[0].url}
                        alt={product.images[0].alt || product.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Search className="h-6 w-6 text-gray-400" />
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-gray-900 truncate">
                      {product.name}
                    </h4>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="font-semibold text-primary">
                        {formatPrice(product.price)}
                      </span>
                      {product.averageRating > 0 && (
                        <div className="flex items-center gap-1">
                          <div className="flex text-xs">
                            {renderStars(product.averageRating)}
                          </div>
                          <span className="text-xs text-gray-500">
                            ({product.averageRating.toFixed(1)})
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </button>
              ))}

              {query.length >= 2 && (
                <div className="border-t border-gray-100">
                  <Link
                    href={`/products?search=${encodeURIComponent(query)}`}
                    className="block p-3 text-center text-primary hover:bg-gray-50 transition-colors"
                    onClick={() => setShowDropdown(false)}
                  >
                    View all results for &quot;{query}&quot;
                  </Link>
                </div>
              )}
            </>
          ) : query.length >= 2 ? (
            <div className="p-4 text-center">
              <p className="text-gray-500">No products found for &quot;{query}&quot;</p>
              <Link
                href="/products"
                className="text-primary hover:underline text-sm mt-2 inline-block"
              >
                Browse all products
              </Link>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}