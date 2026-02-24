'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
  MessageSquare,
  Search,
  Filter,
  Star,
  Eye,
  Check,
  X,
  Trash2,
  Calendar,
  User,
  Package,
  Flag,
  TrendingUp,
  TrendingDown,
  Image as ImageIcon
} from 'lucide-react';
import { adminAPI } from '../../services/api';
import { getProductImageUrl } from '../../utils/imageUtils';

// Helper component to handle image loading errors
const ProductImage = ({ src, alt }: { src?: string, alt: string }) => {
  const [error, setError] = useState(false);

  if (error || !src) {
    return (
      <div className="h-10 w-10 bg-gray-200 rounded-lg flex items-center justify-center flex-shrink-0">
        <ImageIcon size={16} className="text-gray-400" />
      </div>
    );
  }

  const finalSrc = getProductImageUrl(src);

  return (
    <img
      className="h-10 w-10 rounded-lg object-cover flex-shrink-0"
      src={finalSrc}
      alt={alt}
      onError={() => setError(true)}
    />
  );
};

interface Review {
  _id: string;
  user: {
    _id: string;
    name: string;
    email: string;
  };
  product: {
    _id: string;
    name: string;
    imageUrl: string;
    images?: { url: string }[];
  };
  rating: number;
  comment: string;
  status: 'pending' | 'approved' | 'rejected';
  isReported: boolean;
  reportCount: number;
  createdAt: string;
  updatedAt: string;
}

interface ReviewStats {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
  reported: number;
  averageRating: number;
}

export default function ReviewsManagement() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [stats, setStats] = useState<ReviewStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [ratingFilter, setRatingFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [showReviewDetails, setShowReviewDetails] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);

  useEffect(() => {
    fetchReviews();
    fetchStats();
  }, [currentPage, statusFilter, ratingFilter, sortBy, searchTerm]);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const params = {
        page: currentPage.toString(),
        limit: '10',
        ...(statusFilter !== 'all' && { status: statusFilter }),
        ...(ratingFilter !== 'all' && { rating: ratingFilter }),
        ...(searchTerm && { search: searchTerm }),
        sort: sortBy
      };

      const response = await adminAPI.getAllReviews(params);
      setReviews(response.reviews || []);
      setTotalPages(response.pages || Math.ceil((response.total || 0) / 10));
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await adminAPI.getReviewStats();
      setStats(response.stats);
    } catch (error) {
      console.error('Error fetching review stats:', error);
    }
  };

  const handleStatusUpdate = async (reviewId: string, status: 'approved' | 'rejected') => {
    try {
      setUpdatingStatus(reviewId);
      await adminAPI.updateReviewStatus(reviewId, status);
      await fetchReviews();
      await fetchStats();
    } catch (error) {
      console.error('Error updating review status:', error);
    } finally {
      setUpdatingStatus(null);
    }
  };

  const handleDeleteReview = async (reviewId: string) => {
    if (!confirm('Are you sure you want to delete this review? This action cannot be undone.')) return;

    try {
      await adminAPI.deleteReview(reviewId);
      await fetchReviews();
      await fetchStats();
    } catch (error) {
      console.error('Error deleting review:', error);
    }
  };

  const handleViewDetails = (review: Review) => {
    setSelectedReview(review);
    setShowReviewDetails(true);
  };

  const renderStars = (rating: number, size = 16) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={size}
            className={`${star <= rating
              ? 'text-yellow-400 fill-current'
              : 'text-gray-300'
              }`}
          />
        ))}
      </div>
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getRatingColor = (rating: number) => {
    if (rating >= 4) return 'text-green-600';
    if (rating >= 3) return 'text-yellow-600';
    return 'text-red-600';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Removed local filtering logic as it's now handled server-side

  const statusOptions = [
    { value: 'all', label: 'All Reviews' },
    { value: 'pending', label: 'Pending Review' },
    { value: 'approved', label: 'Approved' },
    { value: 'rejected', label: 'Rejected' },
    { value: 'reported', label: 'Reported Reviews' }
  ];

  const ratingOptions = [
    { value: 'all', label: 'All Ratings' },
    { value: '5', label: '5 Stars' },
    { value: '4', label: '4 Stars' },
    { value: '3', label: '3 Stars' },
    { value: '2', label: '2 Stars' },
    { value: '1', label: '1 Star' }
  ];

  const sortOptions = [
    { value: 'newest', label: 'Newest First' },
    { value: 'oldest', label: 'Oldest First' },
    { value: 'rating-high', label: 'Highest Rating' },
    { value: 'rating-low', label: 'Lowest Rating' },
    { value: 'reported', label: 'Most Reported' }
  ];

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">Reviews Management</h2>
        </div>
        <div className="animate-pulse space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h2 className="text-2xl font-bold text-gray-900">Reviews Management</h2>
          <span className="bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full">
            {reviews.length} reviews
          </span>
        </div>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Reviews</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <MessageSquare className="h-8 w-8 text-blue-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
              </div>
              <Calendar className="h-8 w-8 text-yellow-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Approved</p>
                <p className="text-2xl font-bold text-green-600">{stats.approved}</p>
              </div>
              <Check className="h-8 w-8 text-green-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Rejected</p>
                <p className="text-2xl font-bold text-red-600">{stats.rejected}</p>
              </div>
              <X className="h-8 w-8 text-red-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Reported</p>
                <p className="text-2xl font-bold text-orange-600">{stats.reported}</p>
              </div>
              <Flag className="h-8 w-8 text-orange-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg Rating</p>
                <div className="flex items-center gap-2">
                  <p className="text-2xl font-bold text-gray-900">
                    {stats.averageRating.toFixed(1)}
                  </p>
                  <Star size={20} className="text-yellow-400 fill-current" />
                </div>
              </div>
              <TrendingUp className="h-8 w-8 text-blue-600" />
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text"
              placeholder="Search reviews..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            {statusOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          {/* Rating Filter */}
          <select
            value={ratingFilter}
            onChange={(e) => setRatingFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            {ratingOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
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
              setStatusFilter('all');
              setRatingFilter('all');
              setSortBy('newest');
            }}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Clear Filters
          </button>
        </div>
      </div>

      {/* Review Details Modal Overhaul */}
      {/* Review Details Modal Overhaul */}
      {showReviewDetails && selectedReview && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-xl w-full max-w-4xl max-h-[85vh] overflow-hidden flex flex-col shadow-2xl animate-in fade-in zoom-in-95 duration-200">

            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 bg-gray-50 border-b border-gray-100">
              <div>
                <h3 className="text-lg font-bold text-gray-900">Review Details</h3>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <span>{formatDate(selectedReview.createdAt)}</span>
                </div>
              </div>
              <button
                onClick={() => {
                  setShowReviewDetails(false);
                  setSelectedReview(null);
                }}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            {/* Modal Content */}
            <div className="flex-1 overflow-y-auto p-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Left Column: Review Info */}
                <div className="lg:col-span-2 space-y-6">

                  {/* Status Cards - Inspired by Orders */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-lg bg-gray-50 border border-gray-100">
                      <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1">Status</span>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(selectedReview.status)}`}>
                        {selectedReview.status.charAt(0).toUpperCase() + selectedReview.status.slice(1)}
                      </span>
                    </div>
                    <div className="p-4 rounded-lg bg-gray-50 border border-gray-100">
                      <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1">Rating</span>
                      <div className="flex items-center gap-2">
                        {renderStars(selectedReview.rating, 16)}
                        <span className={`text-xs font-bold ${getRatingColor(selectedReview.rating)}`}>
                          ({selectedReview.rating}.0)
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Product Details */}
                  <div className="border border-gray-200 rounded-lg overflow-hidden">
                    <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
                      <h4 className="text-sm font-semibold text-gray-900">Product</h4>
                    </div>
                    <div className="p-4 flex gap-4">
                      <ProductImage
                        src={selectedReview.product.images?.[0]?.url || selectedReview.product.imageUrl}
                        alt={selectedReview.product.name}
                      />
                      <div className="flex flex-1 flex-col justify-center">
                        <h5 className="text-sm font-medium text-gray-900 line-clamp-1">{selectedReview.product.name}</h5>
                        <p className="text-xs text-gray-500 mt-1">ID: {selectedReview.product._id}</p>
                      </div>
                    </div>
                  </div>

                  {/* Review Text */}
                  <div className="space-y-2">
                    <h4 className="text-sm font-semibold text-gray-900">Review Content</h4>
                    <div className="bg-blue-50/50 p-5 rounded-lg border border-blue-100 text-gray-800 leading-relaxed italic relative">
                      <MessageSquare size={16} className="text-blue-200 absolute top-4 left-4 opacity-50" />
                      <div className="pl-2">
                        &quot;{selectedReview.comment}&quot;
                      </div>
                    </div>
                  </div>

                  {/* Customer Details */}
                  <div className="border border-gray-200 rounded-lg overflow-hidden">
                    <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
                      <h4 className="text-sm font-semibold text-gray-900">Customer Details</h4>
                    </div>
                    <div className="p-4 grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs font-bold text-gray-500 uppercase">Name</p>
                        <p className="text-sm font-medium text-gray-900 mt-1">{selectedReview.user.name}</p>
                      </div>
                      <div>
                        <p className="text-xs font-bold text-gray-500 uppercase">Email</p>
                        <p className="text-sm font-medium text-gray-900 mt-1">{selectedReview.user.email}</p>
                      </div>
                    </div>
                  </div>

                </div>

                {/* Right Column: Manage Review */}
                <div className="space-y-6">
                  {/* Quick Actions */}
                  <div className="p-5 rounded-xl border border-gray-200 shadow-sm bg-white space-y-4">
                    <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wide">Manage Review</h4>

                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-gray-500 uppercase">Review Status</label>
                      <select
                        value={selectedReview.status}
                        onChange={(e) => handleStatusUpdate(selectedReview._id, e.target.value as any)}
                        disabled={updatingStatus === selectedReview._id}
                        className="block w-full rounded-lg border-gray-300 bg-gray-50 py-2.5 px-3 text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 transition-all font-medium"
                      >
                        <option value="pending">Pending</option>
                        <option value="approved">Approved</option>
                        <option value="rejected">Rejected</option>
                      </select>
                    </div>

                    {updatingStatus === selectedReview._id && (
                      <div className="flex items-center justify-center gap-2 text-xs font-medium text-blue-600 animate-pulse pt-2">
                        <div className="h-2 w-2 bg-blue-600 rounded-full animate-bounce"></div> Updating status...
                      </div>
                    )}
                  </div>

                  {/* Reports Section */}
                  {selectedReview.isReported && (
                    <div className="p-5 rounded-xl border border-red-200 bg-red-50 space-y-3">
                      <h4 className="text-xs font-bold text-red-800 uppercase tracking-wide flex items-center gap-2">
                        <Flag size={14} /> Reports
                      </h4>
                      <p className="text-sm text-red-700">
                        This review has been reported <strong>{selectedReview.reportCount}</strong> times.
                      </p>
                    </div>
                  )}

                  {/* Danger Zone */}
                  <div className="pt-4 border-t border-gray-100">
                    <button
                      onClick={() => handleDeleteReview(selectedReview._id)}
                      className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors border border-red-100"
                    >
                      <Trash2 size={16} />
                      <span className="font-medium">Delete Review</span>
                    </button>
                    <p className="text-xs text-gray-400 text-center mt-2">
                      This action cannot be undone.
                    </p>
                  </div>

                </div>
              </div>
            </div>

            {/* Footer removed - actions are now in the right sidebar */}
          </div>
        </div>
      )}

      {/* Reviews List */}
      {reviews.length === 0 ? (
        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
          <MessageSquare className="mx-auto h-16 w-16 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {reviews.length === 0 ? 'No reviews yet' : 'No reviews match your filters'}
          </h3>
          <p className="text-gray-600">
            {reviews.length === 0
              ? 'Reviews will appear here once customers start reviewing products'
              : 'Try adjusting your search or filter criteria'
            }
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Review
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Product
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rating
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {reviews.map((review) => (
                  <tr key={review._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="max-w-xs">
                        <p className="text-sm text-gray-900 line-clamp-2">
                          {review.comment}
                        </p>
                        {review.isReported && (
                          <div className="flex items-center gap-1 mt-1">
                            <Flag className="text-red-500" size={12} />
                            <span className="text-xs text-red-600">
                              {review.reportCount} report{review.reportCount !== 1 ? 's' : ''}
                            </span>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <ProductImage
                          src={review.product.images?.[0]?.url || review.product.imageUrl}
                          alt={review.product.name}
                        />
                        <div className="ml-3">
                          <p className="text-sm font-medium text-gray-900 line-clamp-1">
                            {review.product.name}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{review.user.name}</div>
                      <div className="text-sm text-gray-500">{review.user.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        {renderStars(review.rating)}
                        <span className={`text-sm font-medium ${getRatingColor(review.rating)}`}>
                          {review.rating}.0
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(review.status)}`}>
                        {review.status.charAt(0).toUpperCase() + review.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(review.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleViewDetails(review)}
                          className="text-blue-600 hover:text-blue-900"
                          title="View details"
                        >
                          <Eye size={16} />
                        </button>
                        {review.status === 'pending' && (
                          <>
                            <button
                              onClick={() => handleStatusUpdate(review._id, 'approved')}
                              disabled={updatingStatus === review._id}
                              className="text-green-600 hover:text-green-900 disabled:opacity-50"
                              title="Approve review"
                            >
                              <Check size={16} />
                            </button>
                            <button
                              onClick={() => handleStatusUpdate(review._id, 'rejected')}
                              disabled={updatingStatus === review._id}
                              className="text-red-600 hover:text-red-900 disabled:opacity-50"
                              title="Reject review"
                            >
                              <X size={16} />
                            </button>
                          </>
                        )}
                        <button
                          onClick={() => handleDeleteReview(review._id)}
                          className="text-red-600 hover:text-red-900"
                          title="Delete review"
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
