'use client';

import { useState, useEffect } from 'react';
import { Star, ThumbsUp, Flag, User, AlertCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { reviewsAPI } from '../services/api';

interface Review {
    _id: string;
    user: {
        _id: string;
        name: string;
    };
    rating: number;
    title: string;
    comment: string;
    createdAt: string;
    helpfulCount: number;
}

interface ProductReviewsProps {
    productId: string;
}

export default function ProductReviews({ productId }: ProductReviewsProps) {
    const { user, isAuthenticated } = useAuth();
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        averageRating: 0,
        totalReviews: 0,
        ratingDistribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
    });

    const [showForm, setShowForm] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [newReview, setNewReview] = useState({
        rating: 5,
        title: '',
        comment: ''
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        fetchReviews();
    }, [productId]);

    const fetchReviews = async () => {
        try {
            setLoading(true);
            const response = await reviewsAPI.getProductReviews(productId);
            if (response.success) {
                setReviews(response.reviews);
                setStats(response.stats || {
                    averageRating: 0,
                    totalReviews: 0,
                    ratingDistribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
                });
            }
        } catch (err) {
            console.error('Error fetching reviews:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!isAuthenticated) {
            setError('You must be logged in to leave a review.');
            return;
        }

        try {
            setSubmitting(true);
            setError('');

            const response = await reviewsAPI.createReview(productId, newReview);

            if (response.success) {
                setSuccess('Review submitted successfully!');
                setNewReview({ rating: 5, title: '', comment: '' });
                setShowForm(false);
                fetchReviews(); // Refresh list
                setTimeout(() => setSuccess(''), 3000);
            }
        } catch (err: any) {
            console.error('Review submission error:', err);
            setError(err.message || err.response?.data?.message || 'Failed to submit review');
        } finally {
            setSubmitting(false);
        }
    };

    const handleHelpful = async (reviewId: string) => {
        if (!isAuthenticated) return;
        try {
            await reviewsAPI.markReviewHelpful(reviewId);
            // Optimistic update or refetch
            setReviews(prev => prev.map(r =>
                r._id === reviewId ? { ...r, helpfulCount: r.helpfulCount + 1 } : r
            ));
        } catch (error) {
            console.error('Error marking helpful:', error);
        }
    };

    const renderStars = (rating: number) => {
        return [...Array(5)].map((_, i) => (
            <Star
                key={i}
                size={16}
                className={`${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'} inline-block`}
            />
        ));
    };

    if (loading) return <div className="py-8 text-center">Loading reviews...</div>;

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 md:p-8 mt-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Customer Reviews</h2>

            {/* Summary Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10 border-b border-gray-100 pb-10">
                <div className="text-center md:text-left">
                    <div className="text-5xl font-bold text-gray-900 mb-2">
                        {stats.averageRating ? stats.averageRating.toFixed(1) : '0.0'}
                    </div>
                    <div className="flex justify-center md:justify-start gap-1 mb-2">
                        {[...Array(5)].map((_, i) => (
                            <Star
                                key={i}
                                size={20}
                                className={`${i < Math.round(stats.averageRating || 0) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                            />
                        ))}
                    </div>
                    <p className="text-gray-500">{stats.totalReviews} Reviews</p>
                </div>

                {/* Distribution Bars */}
                <div className="col-span-2">
                    {[5, 4, 3, 2, 1].map((star) => {
                        const count = stats.ratingDistribution?.[star as keyof typeof stats.ratingDistribution] || 0;
                        const percentage = stats.totalReviews > 0 ? (count / stats.totalReviews) * 100 : 0;
                        return (
                            <div key={star} className="flex items-center gap-3 mb-2">
                                <span className="text-sm text-gray-600 w-8">{star} star</span>
                                <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-yellow-400 rounded-full"
                                        style={{ width: `${percentage}%` }}
                                    />
                                </div>
                                <span className="text-sm text-gray-400 w-8">{percentage.toFixed(0)}%</span>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Write Review Button / Form */}
            <div className="mb-10">
                {!showForm ? (
                    <button
                        onClick={() => isAuthenticated ? setShowForm(true) : alert('Please login to write a review')}
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                    >
                        Write a Review
                    </button>
                ) : (
                    <form onSubmit={handleSubmit} className="bg-gray-50 p-6 rounded-lg animate-in fade-in slide-in-from-top-4 duration-300">
                        <h3 className="text-lg font-semibold mb-4">Write your review</h3>

                        {error && (
                            <div className="bg-red-50 text-red-600 p-3 rounded mb-4 flex items-center gap-2">
                                <AlertCircle size={18} /> {error}
                            </div>
                        )}

                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
                            <div className="flex gap-2">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                        key={star}
                                        type="button"
                                        onClick={() => setNewReview({ ...newReview, rating: star })}
                                        className="focus:outline-none"
                                    >
                                        <Star
                                            size={24}
                                            className={`${star <= newReview.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'} transition-colors hover:scale-110`}
                                        />
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                            <input
                                type="text"
                                value={newReview.title}
                                onChange={(e) => setNewReview({ ...newReview, title: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                placeholder="Summarize your experience"
                                required
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Review</label>
                            <textarea
                                value={newReview.comment}
                                onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                                rows={4}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                placeholder="What did you like or dislike?"
                                required
                            />
                        </div>

                        <div className="flex gap-3">
                            <button
                                type="submit"
                                disabled={submitting}
                                className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50"
                            >
                                {submitting ? 'Submitting...' : 'Submit Review'}
                            </button>
                            <button
                                type="button"
                                onClick={() => setShowForm(false)}
                                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-100 transition-colors"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                )}

                {success && (
                    <div className="mt-4 bg-green-50 text-green-800 p-4 rounded-lg flex items-center gap-2">
                        <ThumbsUp size={18} /> {success}
                    </div>
                )}
            </div>

            {/* Reviews List */}
            <div className="space-y-6">
                {reviews.length === 0 ? (
                    <div className="text-center py-10 bg-gray-50 rounded-lg">
                        <p className="text-gray-500">No reviews yet. Be the first to review this product!</p>
                    </div>
                ) : (
                    reviews.map((review) => (
                        <div key={review._id} className="border-b border-gray-100 last:border-0 pb-6 last:pb-0">
                            <div className="flex justify-between items-start mb-2">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-gray-500">
                                        <User size={20} />
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-gray-900">{review.user?.name || 'Anonymous'}</h4>
                                        <div className="flex items-center gap-2">
                                            <div className="flex">{renderStars(review.rating)}</div>
                                            <span className="text-sm font-bold text-gray-900">{review.title}</span>
                                        </div>
                                    </div>
                                </div>
                                <span className="text-sm text-gray-500">
                                    {new Date(review.createdAt).toLocaleDateString()}
                                </span>
                            </div>

                            <p className="text-gray-600 mt-2 mb-4 leading-relaxed pl-14">
                                {review.comment}
                            </p>

                            <div className="flex items-center gap-6 pl-14 text-sm text-gray-500">
                                <button
                                    onClick={() => handleHelpful(review._id)}
                                    className="flex items-center gap-1 hover:text-blue-600 transition-colors"
                                >
                                    <ThumbsUp size={14} />
                                    Helpful ({review.helpfulCount || 0})
                                </button>
                                <button className="flex items-center gap-1 hover:text-red-600 transition-colors">
                                    <Flag size={14} />
                                    Report
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
