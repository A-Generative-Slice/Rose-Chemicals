'use client'

import { useState, useEffect } from 'react'
import ProductCard from './ProductCard'

interface Product {
  _id: string
  name: string
  price: number
  image: string
  category: {
    _id: string
    name: string
    slug: string
  } | string
  description?: string
}

export default function Featured() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    loadProducts()
  }, [])

  const loadProducts = async () => {
    try {
      setLoading(true)
      // Use relative path /api for Nginx proxy, or fallback to env var
      const apiUrl = (process.env.NEXT_PUBLIC_API_URL || '/api') + '/products'
      
      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      setProducts(data.products || data)
    } catch (error) {
      console.error('Error loading products:', error)
      setError(error instanceof Error ? error.message : 'Failed to load products')
    } finally {
      setLoading(false)
    }
  }

  const mainHeadingStyle = "text-xl font-bold mb-6 text-[#1D3557] flex items-center gap-3 after:content-[''] after:flex-1 after:h-px after:bg-gradient-to-r after:from-[#457B9D]/40 after:to-transparent"

  // Group products by category
  const groupedProducts = products.reduce((acc, product) => {
    const category = typeof product.category === 'object' && product.category?.name
      ? product.category.name 
      : typeof product.category === 'string' 
        ? product.category 
        : 'other'
    if (!acc[category]) {
      acc[category] = []
    }
    acc[category].push(product)
    return acc
  }, {} as Record<string, Product[]>)

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-500"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500 mb-4">Error loading products: {error}</p>
        <button 
          onClick={loadProducts}
          className="bg-rose-500 text-white px-4 py-2 rounded hover:bg-rose-600"
        >
          Try Again
        </button>
      </div>
    )
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No products available at the moment.</p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {Object.entries(groupedProducts).map(([category, categoryProducts]) => (
        <section key={category}>
          <h2 className={mainHeadingStyle}>
            {category.charAt(0).toUpperCase() + category.slice(1).replace(/_/g, ' ')}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {categoryProducts.map(product => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        </section>
      ))}
    </div>
  )
}
