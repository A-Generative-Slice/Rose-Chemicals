'use client';

import { useState, useEffect } from 'react';
import { Star, ThumbsUp, Flag, MessageCircle, User, Edit2, Trash2, ChevronDown } from 'lucide-react';
import { reviewsAPI } from '../src/services/api';
import { useAuth } from '../src/contexts/AuthContext';

interface Review {
  _id: string;
  user: {
    _id: string;
    name: string;
  };
  rating: number;
  title: string;
  comment: string;
  verified: boolean;
  helpful: Array<{ user: string }>;
  createdAt: string;
}

interface ProductReviewsProps {
  productId: string;
  className?: string;
}

export default function ProductReviews({ productId, className = '' }: ProductReviewsProps) {
  const { user, isAuthenticated } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalReviews, setTotalReviews] = useState(0);
  const [ratingDistribution, setRatingDistribution] = useState<Record<number, number>>({});
  const [sortBy, setSortBy] = useState('createdAt');
  const [filterRating, setFilterRating] = useState('');
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [editingReview, setEditingReview] = useState<string | null>(null);

  // Review form state
  const [reviewForm, setReviewForm] = useState({
    rating: 5,
    title: '',
    comment: ''
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchReviews();
  }, [productId, currentPage, sortBy, filterRating]);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const params = {
        page: currentPage.toString(),
        limit: '10',
        sortBy,
        ...(filterRating && { rating: filterRating })
      };

      const response = await reviewsAPI.getProductReviews(productId, params);
      setReviews(response.reviews || []);
      setTotalPages(response.pagination?.totalPages || 1);
      setTotalReviews(response.pagination?.totalReviews || 0);
      setRatingDistribution(response.ratingDistribution || {});
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      alert('Please login to write a review');
      return;
    }

    try {
      setSubmitting(true);
      
      if (editingReview) {
        await reviewsAPI.updateReview(editingReview, reviewForm);
        setEditingReview(null);
      } else {
        await reviewsAPI.createReview(productId, reviewForm);
      }
      
      setReviewForm({ rating: 5, title: '', comment: '' });
      setShowReviewForm(false);
      await fetchReviews();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Error submitting review');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditReview = (review: Review) => {
    setReviewForm({
      rating: review.rating,
      title: review.title,
      comment: review.comment
    });
    setEditingReview(review._id);
    setShowReviewForm(true);
  };

  const handleDeleteReview = async (reviewId: string) => {
    if (!confirm('Are you sure you want to delete this review?')) return;
    
    try {
      await reviewsAPI.deleteReview(reviewId);
      await fetchReviews();
    } catch (error) {
      alert('Error deleting review');
    }
  };

  const handleMarkHelpful = async (reviewId: string) => {
    if (!isAuthenticated) {
      alert('Please login to mark reviews as helpful');
      return;
    }

    try {
      await reviewsAPI.markHelpful(reviewId);
      await fetchReviews();
    } catch (error) {
      console.error('Error marking review helpful:', error);
    }
  };

  const handleReportReview = async (reviewId: string, reason: string) => {
    if (!isAuthenticated) {
      alert('Please login to report reviews');
      return;
    }

    try {
      await reviewsAPI.reportReview(reviewId, reason);
      alert('Review reported successfully');
    } catch (error: any) {
      alert(error.response?.data?.message || 'Error reporting review');
    }
  };

  const renderStars = (rating: number, interactive = false, onRate?: (rating: number) => void) => {
    const stars = [];
    
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <button
          key={i}
          type={interactive ? 'button' : undefined}
          onClick={interactive && onRate ? () => onRate(i) : undefined}
          className={`${interactive ? 'hover:scale-110 transition-transform cursor-pointer' : 'cursor-default'}`}
        >
          <Star
            className={`w-5 h-5 ${
              i <= rating 
                ? 'text-yellow-400 fill-current' 
                : 'text-gray-300'
            }`}
          />
        </button>
      );
    }
    
    return <div className="flex gap-1">{stars}</div>;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const averageRating = totalReviews > 0 
    ? Object.entries(ratingDistribution).reduce((acc, [rating, count]) => 
        acc + (parseInt(rating) * count), 0) / totalReviews 
    : 0;

  const userHasReviewed = reviews.some(review => review.user._id === user?.id);

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Reviews Summary */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-gray-900">
            Customer Reviews ({totalReviews})
          </h3>
          
          {isAuthenticated && !userHasReviewed && (
            <button
              onClick={() => setShowReviewForm(true)}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
            >
              <MessageCircle size={16} />
              Write Review
            </button>
          )}
        </div>

        {totalReviews > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Average Rating */}
            <div className="flex items-center gap-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900">
                  {averageRating.toFixed(1)}
                </div>
                <div className="flex justify-center mb-1">
                  {renderStars(Math.round(averageRating))}
                </div>
                <div className="text-sm text-gray-600">
                  Based on {totalReviews} reviews
                </div>
              </div>
            </div>

            {/* Rating Distribution */}
            <div className="space-y-2">
              {[5, 4, 3, 2, 1].map(rating => {
                const count = ratingDistribution[rating] || 0;
                const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0;
                
                return (
                  <div key={rating} className="flex items-center gap-2 text-sm">
                    <span className="w-8">{rating}★</span>
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-yellow-400 h-2 rounded-full transition-all"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className="w-12 text-gray-600">{count}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Filters and Sort */}
        <div className="flex flex-wrap items-center gap-4 mb-6">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="createdAt">Most Recent</option>
            <option value="rating">Highest Rating</option>
            <option value="helpful">Most Helpful</option>
          </select>

          <select
            value={filterRating}
            onChange={(e) => setFilterRating(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="">All Ratings</option>
            <option value="5">5 Stars</option>
            <option value="4">4 Stars</option>
            <option value="3">3 Stars</option>
            <option value="2">2 Stars</option>
            <option value="1">1 Star</option>
          </select>
        </div>
      </div>

      {/* Review Form */}
      {showReviewForm && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">
            {editingReview ? 'Edit Review' : 'Write a Review'}
          </h4>
          
          <form onSubmit={handleSubmitReview} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rating
              </label>
              {renderStars(reviewForm.rating, true, (rating) => 
                setReviewForm(prev => ({ ...prev, rating }))
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title
              </label>
              <input
                type="text"
                value={reviewForm.title}
                onChange={(e) => setReviewForm(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Summarize your review"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Review
              </label>
              <textarea
                value={reviewForm.comment}
                onChange={(e) => setReviewForm(prev => ({ ...prev, comment: e.target.value }))}
                placeholder="Share your experience with this product"
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                required
              />
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={submitting}
                className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {submitting ? 'Submitting...' : (editingReview ? 'Update Review' : 'Submit Review')}
              </button>
              
              <button
                type="button"
                onClick={() => {
                  setShowReviewForm(false);
                  setEditingReview(null);
                  setReviewForm({ rating: 5, title: '', comment: '' });
                }}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Reviews List */}
      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="text-gray-600 mt-2">Loading reviews...</p>
          </div>
        ) : reviews.length === 0 ? (
          <div className="text-center py-8">
            <MessageCircle className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <p className="text-gray-600 mb-2">No reviews yet</p>
            <p className="text-sm text-gray-500">Be the first to review this product!</p>
          </div>
        ) : (
          reviews.map((review) => (
            <div key={review._id} className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                    <User size={20} className="text-gray-600" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-900">{review.user.name}</span>
                      {review.verified && (
                        <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                          Verified Purchase
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      {renderStars(review.rating)}
                      <span className="text-sm text-gray-600">
                        {formatDate(review.createdAt)}
                      </span>
                    </div>
                  </div>
                </div>

                {user?.id === review.user._id && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEditReview(review)}
                      className="p-2 text-gray-600 hover:text-primary transition-colors"
                      title="Edit Review"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={() => handleDeleteReview(review._id)}
                      className="p-2 text-gray-600 hover:text-red-600 transition-colors"
                      title="Delete Review"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                )}
              </div>

              <h5 className="font-medium text-gray-900 mb-2">{review.title}</h5>
              <p className="text-gray-700 mb-4">{review.comment}</p>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => handleMarkHelpful(review._id)}
                    className="flex items-center gap-2 text-sm text-gray-600 hover:text-primary transition-colors"
                  >
                    <ThumbsUp size={16} />
                    Helpful ({review.helpful.length})
                  </button>
                </div>

                <button
                  onClick={() => handleReportReview(review._id, 'inappropriate')}
                  className="flex items-center gap-2 text-sm text-gray-600 hover:text-red-600 transition-colors"
                >
                  <Flag size={16} />
                  Report
                </button>
              </div>
            </div>
          ))
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-6">
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            
            <span className="px-4 py-2 text-gray-600">
              Page {currentPage} of {totalPages}
            </span>
            
            <button
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}