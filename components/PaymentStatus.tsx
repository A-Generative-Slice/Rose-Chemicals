'use client';

import { useState, useEffect } from 'react';
import { Check, AlertCircle, Clock, CreditCard, RefreshCw } from 'lucide-react';

interface PaymentStatusProps {
  orderId: string;
  onStatusChange?: (status: string) => void;
  className?: string;
}

type PaymentStatus = 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled' | 'refunded';

interface PaymentStatusInfo {
  status: PaymentStatus;
  message: string;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
  canRetry?: boolean;
}

export default function PaymentStatus({ orderId, onStatusChange, className = '' }: PaymentStatusProps) {
  const [currentStatus, setCurrentStatus] = useState<PaymentStatus>('pending');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  const statusConfig: Record<PaymentStatus, PaymentStatusInfo> = {
    pending: {
      status: 'pending',
      message: 'Payment is being processed',
      icon: <Clock size={20} className="animate-pulse" />,
      color: 'text-yellow-700',
      bgColor: 'bg-yellow-50 border-yellow-200',
    },
    processing: {
      status: 'processing',
      message: 'Processing your payment',
      icon: <RefreshCw size={20} className="animate-spin" />,
      color: 'text-blue-700',
      bgColor: 'bg-blue-50 border-blue-200',
    },
    completed: {
      status: 'completed',
      message: 'Payment completed successfully',
      icon: <Check size={20} />,
      color: 'text-green-700',
      bgColor: 'bg-green-50 border-green-200',
    },
    failed: {
      status: 'failed',
      message: 'Payment failed. Please try again',
      icon: <AlertCircle size={20} />,
      color: 'text-red-700',
      bgColor: 'bg-red-50 border-red-200',
      canRetry: true,
    },
    cancelled: {
      status: 'cancelled',
      message: 'Payment was cancelled',
      icon: <AlertCircle size={20} />,
      color: 'text-gray-700',
      bgColor: 'bg-gray-50 border-gray-200',
      canRetry: true,
    },
    refunded: {
      status: 'refunded',
      message: 'Payment has been refunded',
      icon: <RefreshCw size={20} />,
      color: 'text-purple-700',
      bgColor: 'bg-purple-50 border-purple-200',
    },
  };

  const fetchPaymentStatus = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/payment/status/${orderId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch payment status');
      }

      const data = await response.json();
      const newStatus = data.paymentStatus as PaymentStatus;
      
      setCurrentStatus(newStatus);
      setLastUpdated(new Date());
      
      if (onStatusChange) {
        onStatusChange(newStatus);
      }
    } catch (err) {
      console.error('Error fetching payment status:', err);
      setError('Failed to fetch payment status');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPaymentStatus();

    // Set up polling for pending/processing payments
    const interval = setInterval(() => {
      if (currentStatus === 'pending' || currentStatus === 'processing') {
        fetchPaymentStatus();
      }
    }, 5000); // Poll every 5 seconds

    return () => clearInterval(interval);
  }, [orderId, currentStatus]);

  const handleRetry = () => {
    // Trigger retry logic - this could open payment modal again
    window.location.reload();
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  if (loading && currentStatus === 'pending') {
    return (
      <div className={`animate-pulse bg-gray-100 rounded-lg p-4 ${className}`}>
        <div className="flex items-center gap-3">
          <div className="w-5 h-5 bg-gray-300 rounded-full"></div>
          <div className="h-4 bg-gray-300 rounded w-48"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`border-2 border-red-200 bg-red-50 rounded-lg p-4 ${className}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <AlertCircle size={20} className="text-red-600" />
            <span className="text-red-800 font-medium">{error}</span>
          </div>
          <button
            onClick={fetchPaymentStatus}
            className="text-red-600 hover:text-red-800 p-1 rounded transition-colors"
            title="Retry"
          >
            <RefreshCw size={16} />
          </button>
        </div>
      </div>
    );
  }

  const config = statusConfig[currentStatus];

  return (
    <div className={`border-2 rounded-lg p-4 transition-all duration-300 ${config.bgColor} ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={config.color}>
            {config.icon}
          </div>
          <div>
            <p className={`font-medium ${config.color}`}>
              {config.message}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Last updated: {formatTime(lastUpdated)}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Status Badge */}
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.color} ${config.bgColor}`}>
            {currentStatus.toUpperCase()}
          </span>

          {/* Retry Button */}
          {config.canRetry && (
            <button
              onClick={handleRetry}
              className={`px-3 py-1 rounded text-xs font-medium transition-colors ${config.color} hover:bg-opacity-20`}
            >
              Retry
            </button>
          )}

          {/* Refresh Button */}
          {(currentStatus === 'pending' || currentStatus === 'processing') && (
            <button
              onClick={fetchPaymentStatus}
              disabled={loading}
              className={`p-1 rounded transition-colors ${config.color} hover:bg-opacity-20 disabled:opacity-50`}
              title="Refresh status"
            >
              <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            </button>
          )}
        </div>
      </div>

      {/* Additional Info for Specific Statuses */}
      {currentStatus === 'completed' && (
        <div className="mt-3 pt-3 border-t border-green-200">
          <div className="flex items-center gap-2 text-sm text-green-700">
            <CreditCard size={14} />
            <span>Payment ID: {orderId.slice(-12)}</span>
          </div>
        </div>
      )}

      {currentStatus === 'failed' && (
        <div className="mt-3 pt-3 border-t border-red-200">
          <p className="text-sm text-red-600">
            If the amount was debited from your account, it will be refunded within 5-7 business days.
          </p>
        </div>
      )}

      {(currentStatus === 'pending' || currentStatus === 'processing') && (
        <div className="mt-3 pt-3 border-t border-current border-opacity-20">
          <div className="flex justify-between items-center text-sm">
            <span className={config.color}>
              Please do not refresh or close this page
            </span>
            <div className="flex items-center gap-1">
              <div className={`w-2 h-2 rounded-full ${config.color.replace('text-', 'bg-')} animate-pulse`}></div>
              <span className={`text-xs ${config.color}`}>Live</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}