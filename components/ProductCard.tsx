'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ShoppingCart, MessageSquare, Eye, Star } from 'lucide-react';
import { useCart } from '../src/contexts/CartContext';
import { useAuth } from '../src/contexts/AuthContext';
import { getProductImageUrl } from '../src/utils/imageUtils';

export default function ProductCard({ product }: { product: any }) {
  const [loading, setLoading] = useState(false);
  const [added, setAdded] = useState(false);
  const [imgError, setImgError] = useState(false);
  const router = useRouter();
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();

  const productId = product._id || product.id;
  const productUrl = `/products/${productId}`;
  const imageUrl = !imgError
    ? (getProductImageUrl(product.images?.[0]?.url) || product.image || '/images/placeholder-product.svg')
    : '/images/placeholder-product.svg';

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      router.push(`/auth/login?returnUrl=${productUrl}`);
      return;
    }
    try {
      setLoading(true);
      await addToCart(productId, 1);
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    } catch (error) {
      console.error('Error adding to cart:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRequestQuote = () => {
    router.push(`/request-quote?product=${encodeURIComponent(product.name)}`);
  };

  return (
    <div className="product-glass-card group flex flex-col h-full">
      {/* Image */}
      <Link href={productUrl} className="card-image block relative overflow-hidden rounded-t-[18px]">
        <div className="bg-gradient-to-br from-[#f0f7ff] to-[#e8f4ff] aspect-[4/3] flex items-center justify-center">
          <img
            src={imageUrl}
            alt={product.images?.[0]?.alt || product.name}
            className="w-full h-full object-contain p-4 transition-transform duration-500 group-hover:scale-110"
            onError={() => setImgError(true)}
          />
        </div>
        {/* Hover overlay with quick-view */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0f1e3a]/60 to-transparent opacity-0 group-hover:opacity-100
                        transition-all duration-300 flex items-end justify-center pb-4">
          <span className="flex items-center gap-2 text-white text-xs font-semibold px-4 py-2 rounded-full
                           bg-white/20 backdrop-blur-sm border border-white/30">
            <Eye size={12} /> Quick View
          </span>
        </div>
        {/* Badge */}
        {product.stock === 0 && (
          <span className="absolute top-3 left-3 px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wide
                           bg-[#E63946] text-white">
            Out of Stock
          </span>
        )}
        {product.isFeatured && product.stock !== 0 && (
          <span className="absolute top-3 left-3 px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wide
                           bg-[#F4D35E] text-[#0f1e3a] flex items-center gap-1">
            <Star size={9} fill="currentColor" /> Featured
          </span>
        )}
      </Link>

      {/* Content */}
      <div className="flex flex-col flex-1 p-4 gap-3">
        {/* Category chip */}
        {product.category && (
          <span className="text-[10px] font-semibold uppercase tracking-widest text-[#457B9D]">
            {typeof product.category === 'object' ? product.category.name : product.category}
          </span>
        )}

        <Link href={productUrl}>
          <h3 className="font-bold text-[#0f1e3a] text-sm leading-snug line-clamp-2 hover:text-[#457B9D] transition-colors">
            {product.name}
          </h3>
        </Link>

        {product.description && (
          <p className="text-xs text-[#64748b] line-clamp-2 leading-relaxed">
            {product.description}
          </p>
        )}

        {/* Price */}
        <div className="flex items-baseline gap-2 mt-auto pt-1">
          <span className="text-xl font-extrabold text-[#1D3557]">
            {typeof product.price === 'number' ? `₹${product.price.toLocaleString('en-IN')}` : product.price}
          </span>
          {product.originalPrice && product.originalPrice > product.price && (
            <span className="text-xs text-[#94a3b8] line-through">
              ₹{product.originalPrice.toLocaleString('en-IN')}
            </span>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-2 mt-1">
          <button
            onClick={handleAddToCart}
            disabled={loading || product.stock === 0}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-bold
                        transition-all duration-250 ${
              added
                ? 'bg-green-500 text-white'
                : product.stock === 0
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-[#1D3557] text-white hover:bg-[#2d4b76] active:scale-95'
            }`}
          >
            <ShoppingCart size={13} />
            {loading ? '...' : added ? '✓ Added!' : product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
          </button>
          <button
            onClick={handleRequestQuote}
            className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-xs font-bold
                       border-2 border-[#457B9D]/30 text-[#457B9D] hover:border-[#457B9D] hover:bg-[#457B9D]/08
                       transition-all duration-200 active:scale-95 whitespace-nowrap"
          >
            <MessageSquare size={13} /> Quote
          </button>
        </div>
      </div>
    </div>
  );
}
