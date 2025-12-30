'use client';

import React, { useState, useEffect } from 'react';
import { productsAPI } from '../../services/api';

interface ProductImage {
  url: string;
  key: string;
  alt: string;
  isPrimary: boolean;
}

interface ProductFormData {
  name: string;
  description: string;
  detailedDescription?: string;
  price: number;
  mrp?: number;
  category: string;
  stock: number;
  sku: string;
  images: ProductImage[];
  isActive: boolean;
  specifications?: Array<{ name: string, value: string }>;
  features?: string[];
  usage?: string;
  weight?: string;
  gstPercentage?: number;
}

interface ProductFormProps {
  productId?: string;
  onSave: (product: any) => void;
  onCancel: () => void;
}

const ProductForm: React.FC<ProductFormProps> = ({ productId, onSave, onCancel }) => {
  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    description: '',
    detailedDescription: '',
    price: 0,
    mrp: 0,
    category: '',
    stock: 0,
    sku: '',
    images: [],
    isActive: true,
    specifications: [],
    features: [],
    usage: '',
    weight: '',
    gstPercentage: 0
  });

  const [categories, setCategories] = useState<Array<{ _id: string, name: string, slug: string }>>([]);

  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [newFeature, setNewFeature] = useState('');
  const [specKey, setSpecKey] = useState('');
  const [specValue, setSpecValue] = useState('');

  useEffect(() => {
    loadCategories();
    if (productId) {
      loadProduct();
    }
  }, [productId]);

  const loadCategories = async () => {
    try {
      const response = await productsAPI.getCategories();
      if (response.success && response.categories.length > 0) {
        setCategories(response.categories);
      } else {
        // Fallback to hardcoded categories if API fails or returns empty
        setCategories([
          { _id: 'brooms', name: 'Brooms', slug: 'brooms' },
          { _id: 'brushes', name: 'Brushes', slug: 'brushes' },
          { _id: 'dusters', name: 'Dusters', slug: 'dusters' },
          { _id: 'cleaning_agents', name: 'Cleaning Agents', slug: 'cleaning_agents' },
          { _id: 'floor_cleaners', name: 'Floor Cleaners', slug: 'floor_cleaners' },
          { _id: 'disinfectants', name: 'Disinfectants', slug: 'disinfectants' },
          { _id: 'detergents', name: 'Detergents', slug: 'detergents' },
          { _id: 'sanitizers', name: 'Sanitizers', slug: 'sanitizers' },
          { _id: 'mops', name: 'Mops', slug: 'mops' },
          { _id: 'scrubbers', name: 'Scrubbers', slug: 'scrubbers' },
          { _id: 'wipes', name: 'Wipes', slug: 'wipes' },
          { _id: 'other', name: 'Other', slug: 'other' }
        ]);
      }
    } catch (error) {
      console.error('Error loading categories:', error);
      // Fallback
    }
  };

  const loadProduct = async () => {
    try {
      setLoading(true);
      const response = await productsAPI.getProduct(productId!);
      // Handle both direct product and wrapped response
      const product = response.product || response;

      setFormData({
        name: product.name || '',
        description: product.description || '',
        detailedDescription: product.detailedDescription || '',
        price: product.price || 0,
        mrp: product.mrp || product.price || 0,
        category: product.category?._id || product.category || '',
        stock: product.stock || 0,
        sku: product.sku || '',
        images: Array.isArray(product.images) ? product.images : [],
        isActive: product.isActive !== false,
        specifications: Array.isArray(product.specifications) ? product.specifications : [],
        features: Array.isArray(product.features) ? product.features : [],
        usage: product.usage || '',
        weight: product.weight || '',
        gstPercentage: product.gstPercentage || 0
      });
    } catch (error) {
      console.error('Error loading product:', error);
      alert('Failed to load product details');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.category || formData.price <= 0) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      setLoading(true);

      const productData = {

        ...formData,
        price: Number(formData.price),
        stock: Number(formData.stock),
        gstPercentage: Number(formData.gstPercentage)
      };

      let response;
      if (productId) {
        response = await productsAPI.updateProduct(productId, productData);
      } else {
        response = await productsAPI.createProduct(productData);
      }

      // Handle response properly - get the product from the response
      const savedProduct = response.product || response;
      onSave(savedProduct);
      alert(productId ? 'Product updated successfully!' : 'Product created successfully!');
    } catch (error) {
      console.error('Error saving product:', error);
      alert('Failed to save product. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedFiles(e.target.files);
  };

  const uploadImages = async () => {
    if (!selectedFiles || selectedFiles.length === 0) {
      alert('Please select images to upload');
      return;
    }

    try {
      setUploadingImages(true);
      const formDataUpload = new FormData();

      for (let i = 0; i < selectedFiles.length; i++) {
        formDataUpload.append('images', selectedFiles[i]);
      }

      const apiUrl = (process.env.NEXT_PUBLIC_API_URL || '') + '/api';
      let response = await fetch(`${apiUrl}/upload/multiple`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: formDataUpload
      });

      // If S3 upload fails, try local upload
      if (!response.ok) {
        console.log('S3 upload failed, trying local upload...');
        response = await fetch(`${apiUrl}/upload/local/multiple`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: formDataUpload
        });
      }

      const result = await response.json();

      if (result.success) {
        const newImages = result.images.map((img: any, index: number) => ({
          url: img.url,
          key: img.key,
          alt: '',
          isPrimary: formData.images.length === 0 && index === 0 // Only first image is primary if no existing images
        }));

        setFormData(prev => ({
          ...prev,
          images: [...prev.images, ...newImages]
        }));

        // Clear file input
        const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
        if (fileInput) fileInput.value = '';
        setSelectedFiles(null);

        alert(`${result.images.length} images uploaded successfully!`);
      } else {
        alert('Failed to upload images: ' + result.message);
      }
    } catch (error) {
      console.error('Error uploading images:', error);
      alert('Failed to upload images. Please try again.');
    } finally {
      setUploadingImages(false);
    }
  };

  const addImage = () => {
    if (imageUrl.trim()) {
      const newImage = {
        url: imageUrl.trim(),
        key: `manual-${Date.now()}`,
        alt: '',
        isPrimary: formData.images.length === 0
      };

      setFormData(prev => ({
        ...prev,
        images: [...prev.images, newImage]
      }));
      setImageUrl('');
    }
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const setPrimaryImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.map((img, i) => ({
        ...img,
        isPrimary: i === index
      }))
    }));
  };

  const addFeature = () => {
    if (newFeature.trim()) {
      setFormData(prev => ({
        ...prev,
        features: [...(prev.features || []), newFeature.trim()]
      }));
      setNewFeature('');
    }
  };

  const removeFeature = (index: number) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features?.filter((_, i) => i !== index) || []
    }));
  };

  const addSpecification = () => {
    if (specKey.trim() && specValue.trim()) {
      setFormData(prev => ({
        ...prev,
        specifications: [
          ...(prev.specifications || []),
          { name: specKey.trim(), value: specValue.trim() }
        ]
      }));
      setSpecKey('');
      setSpecValue('');
    }
  };

  const removeSpecification = (index: number) => {
    setFormData(prev => ({
      ...prev,
      specifications: (prev.specifications || []).filter((_, i) => i !== index)
    }));
  };

  return (
    <div className="w-full">
      <div className="bg-white rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">
            {productId ? 'Edit Product' : 'Add New Product'}
          </h2>
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600 text-2xl font-light"
          >
            ×
          </button>
        </div>

        <div className="max-h-[75vh] overflow-y-auto">
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Product Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                  placeholder="Enter product name"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  SKU
                </label>
                <input
                  type="text"
                  value={formData.sku}
                  onChange={(e) => setFormData(prev => ({ ...prev, sku: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                  placeholder="Product SKU"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                placeholder="Enter product description"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category *
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                  required
                >
                  <option value="">Select Category</option>
                  {categories.map(category => (
                    <option key={category._id} value={category._id}>{category.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price (₹) *
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData(prev => ({ ...prev, price: parseFloat(e.target.value) || 0 }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                  placeholder="0.00"
                  required
                />
              </div>



              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Stock Quantity
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.stock}
                  onChange={(e) => setFormData(prev => ({ ...prev, stock: parseInt(e.target.value) || 0 }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                  placeholder="0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  GST Percentage (%)
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  step="0.01"
                  value={formData.gstPercentage}
                  onChange={(e) => setFormData(prev => ({ ...prev, gstPercentage: parseFloat(e.target.value) || 0 }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                  placeholder="0"
                />
              </div>
            </div>

            {/* Product Images */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Product Images
              </label>
              <div className="space-y-3">
                {/* File Upload */}
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-3">
                  <div className="text-center">
                    <svg className="mx-auto h-8 w-8 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                      <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <div className="mt-2">
                      <label htmlFor="file-upload" className="cursor-pointer">
                        <span className="block text-sm font-medium text-gray-900">
                          Upload product images
                        </span>
                        <input
                          id="file-upload"
                          name="file-upload"
                          type="file"
                          className="sr-only"
                          multiple
                          accept="image/*"
                          onChange={handleFileSelect}
                        />
                      </label>
                      <p className="text-xs text-gray-500">PNG, JPG, WEBP up to 5MB each</p>
                    </div>
                    {selectedFiles && (
                      <div className="mt-2">
                        <p className="text-sm text-gray-600">{selectedFiles.length} file(s) selected</p>
                        <button
                          type="button"
                          onClick={uploadImages}
                          disabled={uploadingImages}
                          className="mt-1 px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 disabled:opacity-50"
                        >
                          {uploadingImages ? 'Uploading...' : `Upload ${selectedFiles.length} Images`}
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* URL Input (alternative) */}
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                    placeholder="Or enter image URL"
                  />
                  <button
                    type="button"
                    onClick={addImage}
                    className="px-4 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700"
                  >
                    Add URL
                  </button>
                </div>

                {formData.images.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {formData.images.map((img, index) => (
                      <div key={index} className="relative">
                        <img
                          src={img.url}
                          alt={img.alt || `Product ${index + 1}`}
                          className="w-full h-24 object-cover rounded-lg border"
                          onError={(e) => {
                            e.currentTarget.src = '/images/placeholder-product.svg';
                          }}
                        />
                        {img.isPrimary && (
                          <span className="absolute top-1 left-1 bg-blue-500 text-white text-xs px-1 rounded">
                            Primary
                          </span>
                        )}
                        <button
                          type="button"
                          onClick={() => setPrimaryImage(index)}
                          className="absolute bottom-1 left-1 bg-blue-500 text-white text-xs px-1 rounded hover:bg-blue-600"
                        >
                          Set Primary
                        </button>
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Product Features */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Product Features
              </label>
              <div className="space-y-3">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newFeature}
                    onChange={(e) => setNewFeature(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                    placeholder="Enter product feature"
                  />
                  <button
                    type="button"
                    onClick={addFeature}
                    className="px-4 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700"
                  >
                    Add
                  </button>
                </div>

                {formData.features && formData.features.length > 0 && (
                  <div className="space-y-2">
                    {formData.features.map((feature, index) => (
                      <div key={index} className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded-lg">
                        <span className="text-sm">{feature}</span>
                        <button
                          type="button"
                          onClick={() => removeFeature(index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Specifications */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Specifications
              </label>
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={specKey}
                    onChange={(e) => setSpecKey(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                    placeholder="Specification name"
                  />
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={specValue}
                      onChange={(e) => setSpecValue(e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                      placeholder="Specification value"
                    />
                    <button
                      type="button"
                      onClick={addSpecification}
                      className="px-4 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700"
                    >
                      Add
                    </button>
                  </div>
                </div>

                {formData.specifications && formData.specifications.length > 0 && (
                  <div className="space-y-2">
                    {formData.specifications.map((spec, index) => (
                      <div key={index} className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded-lg">
                        <span className="text-sm"><strong>{spec.name}:</strong> {spec.value}</span>
                        <button
                          type="button"
                          onClick={() => removeSpecification(index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Status */}
            <div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                  className="mr-2"
                />
                <span className="text-sm font-medium text-gray-700">Product is active</span>
              </label>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={onCancel}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700 disabled:opacity-50"
              >
                {loading ? 'Saving...' : (productId ? 'Update Product' : 'Create Product')}
              </button>
            </div>
          </form>
        </div>
      </div >
    </div >
  );
};

export default ProductForm;
