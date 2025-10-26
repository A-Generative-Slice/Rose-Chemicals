"use client"
import { useState, useEffect } from 'react'
import { ChevronDown } from 'lucide-react'
import ProductCard from './ProductCard'

interface Product {
  _id: string;
  name: string;
  price: number;
  category: string | { _id: string; name: string; slug: string };
  description: string;
  images: string[];
  sku: string;
  specifications?: any;
}

interface ApiResponse {
  success: boolean;
  products: Product[];
  count: number;
}

type Category = string | 'all'

const CATEGORIES = [
  { key: 'all', name: 'All Products', icon: '🧹', description: 'View our complete range' },
  { key: 'Industrial Salts', name: 'Industrial Salts', icon: '🧂', description: 'Chemical salts for industrial use' },
  { key: 'Acids', name: 'Acids', icon: '🧪', description: 'Industrial and laboratory acids' },
  { key: 'Carbonates', name: 'Carbonates', icon: '⚪', description: 'Carbonate compounds' },
  { key: 'Solvents', name: 'Solvents', icon: '🌊', description: 'Industrial solvents' },
  { key: 'Bases', name: 'Bases', icon: '🔵', description: 'Basic compounds' },
  { key: 'Brooms', name: 'Brooms', icon: '🧹', description: 'Industrial & household brooms' },
  { key: 'Toilet Brushes', name: 'Toilet Brushes', icon: '🚽', description: 'Bathroom sanitation tools' },
  { key: 'Sink Brushes', name: 'Sink Brushes', icon: '🚿', description: 'Kitchen & bathroom cleaning' },
  { key: 'Carpet Brushes', name: 'Carpet Brushes', icon: '🏠', description: 'Specialized carpet cleaning' },
  { key: 'Long Brushes', name: 'Long Brushes', icon: '🖌️', description: 'Extended reach brushes' }
] as const

export default function ProductCategories() {
  const [activeCategory, setActiveCategory] = useState<Category>('all')
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true)
        const response = await fetch(process.env.NEXT_PUBLIC_API_URL + '/products')
        const data: ApiResponse = await response.json()
        
        if (data.success) {
          setProducts(data.products)
        } else {
          setError('Failed to fetch products')
        }
      } catch (err) {
        setError('Error connecting to server')
        console.error('Error fetching products:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  // Get all products or filtered by category
  const getDisplayProducts = () => {
    if (activeCategory === 'all') {
      return products
    }
    return products.filter(product => {
      const categoryName = typeof product.category === 'object' ? product.category.name : product.category;
      return categoryName === activeCategory;
    });
  }

  // Get product count for a category
  const getCategoryCount = (categoryKey: Category) => {
    if (categoryKey === 'all') {
      return products.length
    }
    return products.filter(product => {
      const categoryName = typeof product.category === 'object' ? product.category.name : product.category;
      return categoryName === categoryKey;
    }).length;
  }

  // Get available categories from products
  const getAvailableCategories = () => {
    const productCategories = Array.from(new Set(products.map(p => 
      typeof p.category === 'object' ? p.category.name : p.category
    )));
    return CATEGORIES.filter(cat => 
      cat.key === 'all' || productCategories.includes(cat.key)
    )
  }

  const availableCategories = getAvailableCategories()
  const activeCategoryData = availableCategories.find(cat => cat.key === activeCategory)
  const displayProducts = getDisplayProducts()

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="text-xl text-gray-600">Loading products...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center text-red-600 min-h-[400px] flex items-center justify-center">
        <div>
          <h3 className="text-xl font-semibold mb-2">Unable to load products</h3>
          <p>{error}</p>
          <p className="text-sm mt-2">Make sure the backend server is running on port 5000</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Category Selection - Tabs for Desktop */}
      <div className="hidden md:block">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 overflow-x-auto scrollbar-hide">
            {availableCategories.map((category) => (
              <button
                key={category.key}
                onClick={() => setActiveCategory(category.key as Category)}
                className={`flex items-center space-x-2 py-4 px-2 border-b-2 font-medium text-sm whitespace-nowrap transition-colors ${
                  activeCategory === category.key
                    ? 'border-hero-bg text-hero-bg'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <span className="text-lg">{category.icon}</span>
                <span>{category.name}</span>
                <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs">
                  {getCategoryCount(category.key as Category)}
                </span>
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Category Selection - Dropdown for Mobile */}
      <div className="md:hidden">
        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="w-full flex items-center justify-between bg-white border border-gray-300 rounded-lg px-4 py-3 text-left shadow-sm"
          >
            <div className="flex items-center space-x-2">
              <span className="text-lg">{activeCategoryData?.icon}</span>
              <span className="font-medium">{activeCategoryData?.name}</span>
              <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs">
                {getCategoryCount(activeCategory)}
              </span>
            </div>
            <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
          </button>

          {dropdownOpen && (
            <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg">
              {availableCategories.map((category) => (
                <button
                  key={category.key}
                  onClick={() => {
                    setActiveCategory(category.key as Category)
                    setDropdownOpen(false)
                  }}
                  className={`w-full flex items-center justify-between px-4 py-3 text-left hover:bg-gray-50 ${
                    activeCategory === category.key ? 'bg-hero-bg bg-opacity-10 text-hero-bg' : 'text-gray-700'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <span className="text-lg">{category.icon}</span>
                    <div>
                      <div className="font-medium">{category.name}</div>
                      <div className="text-sm text-gray-500">{category.description}</div>
                    </div>
                  </div>
                  <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs">
                    {getCategoryCount(category.key as Category)}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Active Category Info */}
      <div className="bg-gray-50 rounded-lg p-6">
        <div className="flex items-center space-x-3 mb-2">
          <span className="text-2xl">{activeCategoryData?.icon}</span>
          <h2 className="text-2xl font-bold text-gray-900">{activeCategoryData?.name}</h2>
        </div>
        <p className="text-gray-600 mb-4">{activeCategoryData?.description}</p>
        <div className="flex items-center space-x-4 text-sm text-gray-500">
          <span>Showing {displayProducts.length} products</span>
          {activeCategory !== 'all' && (
            <button
              onClick={() => setActiveCategory('all')}
              className="text-hero-bg hover:text-hero-bg font-medium"
            >
              View All Categories →
            </button>
          )}
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {displayProducts.map((product) => (
          <ProductCard key={product._id} product={{
            id: product._id,
            name: product.name,
            price: `₹${product.price}`,
            image: product.images[0] || '/images/placeholder-product.jpg',
            description: product.description,
            sku: product.sku,
            specifications: product.specifications,
            category: typeof product.category === 'object' ? product.category.name : product.category
          }} />
        ))}
      </div>

      {/* Empty State */}
      {displayProducts.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No products found</h3>
          <p className="text-gray-600">
            No products available in this category. Please select a different category.
          </p>
        </div>
      )}
    </div>
  )
}
