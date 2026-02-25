'use client';

import { useState, useEffect, useMemo } from 'react';
import {
  Package,
  Plus,
  Edit2,
  Trash2,
  Search,
  Filter,
  Eye,
  AlertCircle,
  CheckCircle,
  XCircle,
  ArrowUpDown,
  Image as ImageIcon,
  DollarSign
} from 'lucide-react';
import { adminAPI, productsAPI } from '../../services/api';
import { getProductImageUrl } from '../../utils/imageUtils';
import ProductForm from './ProductForm';

// Helper component to handle image loading errors
const ProductImage = ({ src, alt }: { src?: string, alt: string }) => {
  const [error, setError] = useState(false);

  if (error || !src) {
    return (
      <div className="h-12 w-12 bg-gray-200 rounded-lg flex items-center justify-center flex-shrink-0">
        <ImageIcon size={16} className="text-gray-400" />
      </div>
    );
  }

  return (
    <img
      className="h-12 w-12 rounded-lg object-cover flex-shrink-0"
      src={src}
      alt={alt}
      onError={() => setError(true)}
    />
  );
};

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string | { _id: string; name: string };
  stock: number;
  images: Array<{ url: string }>;
  isActive: boolean;
  rating: number;
  reviewCount: number;
  createdAt: string;
  updatedAt: string;
}



export default function ProductsManagement() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [categories, setCategories] = useState<Array<{ _id: string; name: string }>>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  // Debounced search and fetch
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchProducts();
    }, 500);

    return () => clearTimeout(timer);
  }, [currentPage, categoryFilter, statusFilter, sortBy, searchTerm]);

  const fetchCategories = async () => {
    try {
      const response = await productsAPI.getCategories();
      if (response.success) {
        setCategories(response.categories || []);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const params = {
        page: currentPage.toString(),
        limit: '10',
        ...(categoryFilter !== 'all' && { category: categoryFilter }),
        ...(statusFilter !== 'all' && { status: statusFilter }),
        ...(searchTerm && { search: searchTerm }),
        sort: sortBy
      };

      const response = await adminAPI.getAllProducts(params);
      setProducts(response.products || []);
      setTotalPages(response.pages || Math.ceil((response.total || 0) / 10));
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleProductSave = async (product: any) => {
    await fetchProducts();
    setShowAddForm(false);
    setEditingProduct(null);
  };

  const handleProductCancel = () => {
    setShowAddForm(false);
    setEditingProduct(null);
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setShowAddForm(true);
  };

  const handleDelete = async (productId: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    try {
      await adminAPI.deleteProduct(productId);
      await fetchProducts();
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  const handleStockUpdate = async (productId: string, newStock: number) => {
    try {
      await adminAPI.updateProductStock(productId, newStock);
      await fetchProducts();
    } catch (error) {
      console.error('Error updating stock:', error);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const getStockStatus = (stock: number) => {
    if (stock === 0) return { color: 'text-red-600', label: 'Out of Stock' };
    if (stock < 10) return { color: 'text-orange-600', label: 'Low Stock' };
    return { color: 'text-green-600', label: 'In Stock' };
  };

  // Helper function to get category name
  const getCategoryName = (category: string | { _id: string; name: string }): string => {
    return typeof category === 'string' ? category : category.name;
  };

  // Removed local filtering logic as it's now handled server-side

  const sortOptions = [
    { value: 'newest', label: 'Newest First' },
    { value: 'oldest', label: 'Oldest First' },
    { value: 'name-asc', label: 'Name: A to Z' },
    { value: 'name-desc', label: 'Name: Z to A' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' },
    { value: 'stock-low', label: 'Stock: Low to High' },
    { value: 'stock-high', label: 'Stock: High to Low' }
  ];



  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h2 className="text-2xl font-bold text-gray-900">Products Management</h2>
          <span className="bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full">
            {products.length} products
          </span>
        </div>
        <button
          onClick={() => {
            setShowAddForm(true);
            setEditingProduct(null);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus size={16} />
          Add Product
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Category Filter */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All Categories</option>
            {categories.map(cat => (
              <option key={cat._id} value={cat._id}>
                {cat.name}
              </option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="low-stock">Low Stock</option>
            <option value="out-of-stock">Out of Stock</option>
          </select>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            {sortOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          {/* Clear Filters */}
          <button
            onClick={() => {
              setSearchTerm('');
              setCategoryFilter('all');
              setStatusFilter('all');
              setSortBy('newest');
            }}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Clear Filters
          </button>
        </div>
      </div>

      {/* Add/Edit Form Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 overflow-y-auto">
          <div className="min-h-screen px-4 py-6 flex items-center justify-center">
            <div className="bg-white rounded-lg max-w-5xl w-full shadow-xl">
              <ProductForm
                productId={editingProduct?._id}
                onSave={handleProductSave}
                onCancel={handleProductCancel}
              />
            </div>
          </div>
        </div>
      )}

      {/* Products Table */}
      {loading ? (
        <div className="animate-pulse space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
          <Package className="mx-auto h-16 w-16 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {searchTerm || categoryFilter !== 'all' || statusFilter !== 'all'
              ? 'No products match your filters'
              : 'No products yet'}
          </h3>
          <p className="text-gray-600 mb-6">
            {searchTerm || categoryFilter !== 'all' || statusFilter !== 'all'
              ? 'Try adjusting your search or filter criteria'
              : 'Start by adding your first product to the inventory'}
          </p>
          {!(searchTerm || categoryFilter !== 'all' || statusFilter !== 'all') && (
            <button
              onClick={() => {
                setShowAddForm(true);
                setEditingProduct(null);
              }}
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus size={16} className="mr-2" />
              Add First Product
            </button>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[280px]">
                    Product
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Stock
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {products.map((product) => (
                  <tr key={product._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-start">
                        <div className="flex-shrink-0 h-12 w-12">
                          <ProductImage
                            src={product.images && product.images.length > 0 ? getProductImageUrl(product.images[0].url) : undefined}
                            alt={product.name}
                          />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{product.name}</div>
                          <div className="text-sm text-gray-500">
                            {product.description}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 text-xs bg-gray-100 text-gray-800 rounded-full">
                        {getCategoryName(product.category)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatCurrency(product.price)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <span className={`text-sm font-medium ${getStockStatus(product.stock).color}`}>
                          {product.stock}
                        </span>
                        <span className={`text-xs ${getStockStatus(product.stock).color}`}>
                          {getStockStatus(product.stock).label}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${product.isActive
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                        }`}>
                        {product.isActive ? (
                          <>
                            <CheckCircle size={12} className="mr-1" />
                            Active
                          </>
                        ) : (
                          <>
                            <XCircle size={12} className="mr-1" />
                            Inactive
                          </>
                        )}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEdit(product)}
                          className="text-blue-600 hover:text-blue-900"
                          title="Edit product"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(product._id)}
                          className="text-red-600 hover:text-red-900"
                          title="Delete product"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                  >
                    Previous
                  </button>

                  <div className="flex gap-1">
                    {[...Array(Math.min(5, totalPages))].map((_, i) => {
                      const page = currentPage <= 3 ? i + 1 : currentPage - 2 + i;
                      if (page > totalPages) return null;

                      return (
                        <button
                          key={page}
                          onClick={() => setCurrentPage(page)}
                          className={`px-3 py-2 border rounded-lg ${currentPage === page
                            ? 'bg-blue-600 text-white border-blue-600'
                            : 'border-gray-300 hover:bg-gray-50'
                            }`}
                        >
                          {page}
                        </button>
                      );
                    })}
                  </div>

                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="px-3 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                  >
                    Next
                  </button>
                </div>
                <p className="text-sm text-gray-700">
                  Showing page {currentPage} of {totalPages}
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}